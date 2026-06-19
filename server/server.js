import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { Resend } from 'resend';
import { readFile } from 'fs/promises';

/********************* 新增代码 start ************************/
import { getReportByOrderId, saveOrUpdateReport, getDbStatus, pool } from './models/reportStore.js';
/********************* 新增代码 end ************************/

// ★★★ 新增：Stripe
import Stripe from 'stripe';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// ========== ★★★ Stripe Webhook（必须在 express.json 之前，使用 raw body） ==========
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_startup', { apiVersion: '2024-06-20' });

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('❌ Stripe Webhook 验签失败:', err?.message || err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        console.log('✅ Stripe 支付成功（服务器端确认）', pi.id);
        // 若改为以 Webhook 发货，可在此触发 sendReportEmailFromPayload(...)
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        console.warn('⚠️ Stripe 支付失败：', pi.last_payment_error?.message);
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error('⚠️ Stripe Webhook 业务处理异常：', e);
  }

  res.json({ received: true });
});

// （保持原有 json 解析）—— 注意：Webhook 已经在此之前注册
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 8787;

// 静态资源：public 目录
app.use(express.static(path.join(__dirname, '..', 'public')));

/* =========================
 * Resend 邮件发送配置（保持不变）
 * ========================= */
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key_for_startup');
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || 'OMNIORA';
const MAIL_FROM_EMAIL = process.env.MAIL_FROM_EMAIL || 'onboarding@resend.dev'; // 测试期
const MAIL_FROM = `${MAIL_FROM_NAME} <${MAIL_FROM_EMAIL}>`;
const MAIL_TO_OWNER = process.env.MAIL_TO_OWNER || 'zyc729@outlook.com';

const TPL = (p) => path.join(__dirname, 'templates', p);

// 模板渲染 + 转义
function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
async function renderTemplate(filename, vars = {}) {
  const raw = await readFile(TPL(filename), 'utf8');
  return raw.replace(/{{(\w+)}}/g, (_, k) => escapeHtml(vars[k] ?? ''));
}

/* =========================
 * 占位 PDF（兜底）
 * ========================= */
function buildPdfPlaceholderBuffer({ title = 'Report', body = 'Thanks for your purchase.' }) {
  const text = `%PDF-1.3
1 0 obj<</Type /Catalog /Pages 2 0 R>>endobj
2 0 obj<</Type /Pages /Kids [3 0 R] /Count 1>>endobj
3 0 obj<</Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 200>>stream
BT /F1 24 Tf 50 780 Td (${title}) Tj
/F1 12 Tf 50 740 Td (${body}) Tj ET
endstream endobj
5 0 obj<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000065 00000 n 
0000000124 00000 n 
0000000537 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
628
%%EOF`;
  return Buffer.from(text, 'utf8');
}

/* =========================
 * 报告内存缓存
 * ========================= */
const REPORTS = new Map(); // orderId -> { ...payload..., ts, emailed?, firstSentAt?, lastSentAt? }

function dataUrlToBuffer(dataUrl = '') {
  const i = dataUrl.indexOf(',');
  if (i === -1) return Buffer.alloc(0);
  return Buffer.from(dataUrl.slice(i + 1), 'base64');
}

/* =========================
 * 小工具：解析 URL 里的 tri/early/mid/late/codes
 * ========================= */
function safeJson(val) {
  if (val == null) return null;
  try { return JSON.parse(val); } catch { return null; }
}
function extractFromUrlQuery(u) {
  try {
    const url = new URL(u, 'http://localhost');
    const q = url.searchParams;
    const out = {};
    const set = (k, v) => { if (v != null && v !== '' && !(Array.isArray(v) && v.length === 0)) out[k] = v; };

    set('orderId', q.get('orderID') || q.get('orderId') || q.get('oid'));
    set('email', q.get('email'));
    set('name', q.get('name'));
    set('gender', q.get('gender'));
    set('dob', q.get('dob'));
    set('tob', q.get('tob'));
    set('persona', q.get('persona'));

    const tri = safeJson(q.get('tri'));
    if (tri && typeof tri === 'object') set('tri', tri);

    const early = safeJson(q.get('early'));
    const mid = safeJson(q.get('mid'));
    const late = safeJson(q.get('late'));
    const codes = safeJson(q.get('codes'));
    if (Array.isArray(early)) set('early', early);
    if (Array.isArray(mid)) set('mid', mid);
    if (Array.isArray(late)) set('late', late);
    if (Array.isArray(codes)) set('codes', codes);

    const mode = q.get('mode');
    if (mode) set('mode', mode);

    return out;
  } catch {
    return {};
  }
}

/* =========================
 * 合并/择优工具
 * ========================= */
function pick(valNew, valOld) {
  if (valNew == null) return valOld;
  if (typeof valNew === 'string' && valNew.trim() === '') return valOld;
  if (Array.isArray(valNew) && valNew.length === 0) return valOld;
  if (typeof valNew === 'object' && !Array.isArray(valNew) && Object.keys(valNew).length === 0) return valOld;
  return valNew;
}
function mergePayload(oldP = {}, newP = {}) {
  const r = { ...oldP };

  if (newP.url && (!oldP.url || String(newP.url).length > String(oldP.url).length)) {
    r.url = newP.url;
  } else if (!r.url && newP.url) {
    r.url = newP.url;
  }

  r.orderId = pick(newP.orderId, oldP.orderId);
  r.email = pick(newP.email, oldP.email);
  r.name = pick(newP.name, oldP.name);
  r.gender = pick(newP.gender, oldP.gender);
  r.dob = pick(newP.dob, oldP.dob);
  r.tob = pick(newP.tob, oldP.tob);
  r.persona = pick(newP.persona, oldP.persona);

  r.html = pick(newP.html, oldP.html);
  r.triangle = pick(newP.triangle, oldP.triangle);
  r.trianglePng = pick(newP.trianglePng, oldP.trianglePng);

  r.tri = (newP.tri && typeof newP.tri === 'object') ? newP.tri : (oldP.tri || undefined);
  r.early = Array.isArray(newP.early) ? newP.early : (oldP.early || undefined);
  r.mid = Array.isArray(newP.mid) ? newP.mid : (oldP.mid || undefined);
  r.late = Array.isArray(newP.late) ? newP.late : (oldP.late || undefined);
  r.codes = Array.isArray(newP.codes) ? newP.codes : (oldP.codes || undefined);

  r.mode = pick(newP.mode, oldP.mode);

  return r;
}

/* =========================
 * URL 规范化：相对→绝对
 * ========================= */
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`;
function toAbs(urlLike) {
  try { return new URL(urlLike, PUBLIC_BASE_URL).toString(); }
  catch { return urlLike; }
}

/* =========================
 * Puppeteer 启动参数（更稳）
 * ========================= */
function buildLaunchOpts() {
  const base = { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] };

  const envExe =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    process.env.CHROME_PATH ||
    process.env.GOOGLE_CHROME_BIN;
  if (envExe && fs.existsSync(envExe)) {
    return { ...base, executablePath: envExe };
  }

  try {
    const exe = typeof puppeteer.executablePath === 'function' ? puppeteer.executablePath() : '';
    if (exe && fs.existsSync(exe)) return { ...base, executablePath: exe };
  } catch { }

  return { ...base, channel: 'chrome' };
}

/* =========================
 * 等待页面完全渲染的助手
 * ========================= */
async function waitPageStable(page) {
  try {
    await page.waitForFunction(`
      (async () => {
        try { if (document.fonts && document.fonts.ready) { await document.fonts.ready; } } catch(e) {}
        const imgs = Array.from(document.images || []);
        await Promise.all(imgs.map(img => (img.complete && img.naturalWidth) ? Promise.resolve() :
          new Promise(r => { img.addEventListener('load', r, {once:true}); img.addEventListener('error', r, {once:true}); })));
        return true;
      })()
    `, { timeout: 15000 });
  } catch { }

  try { await page.waitForFunction('window.__REPORT_READY__ === true || window.__REPORT_READY === true', { timeout: 8000 }); } catch { }

  try {
    await page.evaluate(() => new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res))));
  } catch { }
}

async function sendReportEmailFromPayload(payload) {
  console.log('发送邮件', payload);
  const recipient = (payload?.email || '').trim();
  if (recipient === 'buyer@omniora13.com' || recipient === '') {
    console.log('[email] dummy or empty recipient, skipping email sending.');
    return;
  }
  const reportLink = `${PUBLIC_BASE_URL}/report-print.html?orderID=${encodeURIComponent(payload.orderId)}&email=${encodeURIComponent(recipient)}`;
  const htmlBody = await renderTemplate('report-email.html', {
    title: 'Your Personal Blueprint',
    intro: 'We appreciate you beginning your journey with us.',
    link: reportLink,
  });

  try {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient);
    if (!ok) {
      console.warn(`[email] invalid recipient "${recipient}", fallback to owner: ${MAIL_TO_OWNER}`);
    }

    const result = await resend.emails.send({
      from: MAIL_FROM,
      to: ok ? recipient : MAIL_TO_OWNER,
      subject: `[OMNIORA] Your Personal Blueprint：${payload.name || ''}`,
      html: htmlBody,
    });
    console.log('[report] result =', result);
  } catch (e) {
    console.error('[report] email failed (继续流程):', e?.statusCode, e?.code, e?.message);
    try {
      console.error('details:', JSON.stringify(e, null, 2));
    } catch {}
  }
}


/* =========================
 * 健康检查 + 邮件测试（保持不变）
 * ========================= */
app.get('/health', async (req, res) => {
  try {
    console.log('[health] sending test email ->', MAIL_TO_OWNER, 'from:', MAIL_FROM);
    const result = await resend.emails.send({
      from: MAIL_FROM,
      to: req.body.email,
      subject: 'OMNIORA Health Check',
      html: '<p>✅ Resend 邮件功能正常！这是来自 /health 的测试。</p>',
    });
    console.log('[health] email result =', result);
    res.json({ ok: true, email: 'sent' });
  } catch (error) {
    console.error('[health] ERROR:', error);
    res.status(500).json({ ok: false, error: error?.message || 'send failed' });
  }
});

/* =========================
 * 任意邮箱测试（保持不变）
 * ========================= */
app.get('/send-test-email', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ ok: false, error: '缺少 email 参数，例如 /send-test-email?email=abc@163.com' });
    }
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    if (!okEmail) {
      return res.status(400).json({ ok: false, error: 'email 格式不正确' });
    }

    console.log('[send-test-email] sending ->', email, 'from:', MAIL_FROM);
    const result = await resend.emails.send({
      from: MAIL_FROM,
      to: email,
      subject: '我们已收到你的留言 | OMNIORA',
      html: `<p>这是发给 <b>${escapeHtml(email)}</b> 的测试邮件。</p><p>如未在收件箱，请检查垃圾箱。</p>`
    });
    console.log('[send-test-email] result =', result);
    res.json({ ok: true, email, result });
  } catch (err) {
    console.error('[send-test-email] ERROR:', err);
    res.status(500).json({ ok: false, error: err?.message || 'send failed' });
  }
});

/* =========================
 * Contact（保持不变）
 * ========================= */
app.post('/api/contact', async (req, res) => {
  const t0 = Date.now();
  try {
    console.log('[contact] incoming body =', req.body);
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      console.warn('[contact] missing fields');
      return res.status(400).json({ ok: false, error: '缺少必填字段' });
    }
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    if (!okEmail) {
      console.warn('[contact] bad email format:', email);
      return res.status(400).json({ ok: false, error: '邮箱格式不正确' });
    }

    const htmlOwner = await renderTemplate('contact-to-owner.html', { name, email, message });
    console.log('[contact] sending owner email ->', MAIL_TO_OWNER, 'from:', MAIL_FROM);
    const ownerResp = await resend.emails.send({
      from: MAIL_FROM,
      to: MAIL_TO_OWNER,
      subject: `【Contact】来自 ${name} 的新留言`,
      html: htmlOwner,
      replyTo: email,
    });
    console.log('[contact] owner email result =', ownerResp);

    const htmlUser = await renderTemplate('contact-receipt.html', { name });
    console.log('[contact] sending receipt ->', email, 'from:', MAIL_FROM);
    const userResp = await resend.emails.send({
      from: MAIL_FROM,
      to: email,
      subject: '我们已收到你的留言 | OMNIORA',
      html: htmlUser,
    });
    console.log('[contact] user email result =', userResp);

    console.log(`[contact] done in ${Date.now() - t0}ms`);
    res.json({ ok: true, message: '已发送' });
  } catch (err) {
    console.error('[contact] ERROR:', err);
    const msg =
      err?.message ||
      err?.error?.message ||
      err?.response?.data?.message ||
      '服务器发送失败';
    res.status(500).json({ ok: false, error: msg });
  }
});

/* =========================
 * PayPal（整段禁用，仅注释，不删）
 * ========================= */
/*
... 原 PayPal 代码保持注释，不变 ...
*/

 /********************* 修改代码 start ************************/
 /* =========================
  * 保存 payload（合并/去重）+ 触发一次邮件
  * 支持：url（推荐）| html | trianglePng
  * ========================= */
app.post('/api/report/save', async (req, res) => {
  try {
    const {
      orderId,
      email,
      url,
      html, // 注: 测试发现前端没有携带html参数
      trianglePng,
      tri,
      codes,
      ...rest
    } = req.body || {};

    // 基础参数检查
    if (!orderId || !email || !(url || html || trianglePng || tri || codes)) {
      return res.status(400).json({
        ok: false,
        error: 'missing orderId/email/(url|html|trianglePng|tri|codes)'
      });
    }

    // 解析 URL 附加字段
    const fromUrl = url ? extractFromUrlQuery(url) : {};

    // 构造完整 payload
    const incoming = {
      orderId,
      email,
      url,
      html,
      trianglePng,
      tri,
      codes,
      ...rest,
      ...fromUrl
    };

    const existing = await getReportByOrderId(orderId) || {};
    const merged = mergePayload(existing, incoming);

    merged.ts = Date.now();
    if (existing.emailed) merged.emailed = true;
    if (existing.firstSentAt) merged.firstSentAt = existing.firstSentAt;
    if (existing.lastSentAt) merged.lastSentAt = existing.lastSentAt;

    console.log('合并数据', merged)
    await saveOrUpdateReport(orderId, merged, merged.emailed, merged.firstSentAt, merged.lastSentAt);

    console.log(
      '[report/save]',
      `order=${merged.orderId}`,
      `url=${!!merged.url}`,
      `html=${!!merged.html}`,
      `tri=${!!merged.tri}`,
      `mode=${merged.mode || 'print'}`,
      merged.emailed ? '(already emailed)' : ''
    );

    if (!merged.emailed) {
      console.log('开始发送邮件')
      await sendReportEmailFromPayload(merged);
      merged.emailed = true;
      merged.firstSentAt = merged.lastSentAt = Date.now();
      await saveOrUpdateReport(orderId, merged);
    }

    return res.json({ ok: true });

  } catch (e) {
    console.error('[report/save] ERROR:', e);
    return res.status(500).json({ ok: false, error: e.message });
  }
});
/********************* 修改代码 end ************************/

/* =========================
 * 报告下载：直接重定向到网页报告页
 * ========================= */
app.get('/api/report/:orderId.pdf', async (req, res) => {
  const orderId = req.params.orderId || 'unknown';
  try {
    const stored = await getReportByOrderId(orderId) || {};
    const email = stored.email || '';
    return res.redirect(`/report-print.html?orderID=${encodeURIComponent(orderId)}&email=${encodeURIComponent(email)}`);
  } catch (e) {
    console.error('[report redirect] error:', e);
    return res.status(404).send('Report not found');
  }
});

/* =========================
 * 报告 JSON 查询端点 (前端拉取报告数据用)
 * ========================= */
app.get('/api/report/:orderId', async (req, res) => {
  const orderId = req.params.orderId || 'unknown';
  try {
    const stored = await getReportByOrderId(orderId);
    if (!stored || Object.keys(stored).length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(stored);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


/* =========================
 * 额外：环境自检（保持）
 * ========================= */
app.get('/debug/mail', (req, res) => {
  res.json({
    RESEND_API_KEY_loaded: Boolean(process.env.RESEND_API_KEY),
    MAIL_FROM,
    MAIL_TO_OWNER,
    NODE_ENV: process.env.NODE_ENV || 'undefined'
  });
});

/* =========================
 * （已禁用）PayPal 自检
 * ========================= */
/*
app.get('/debug/paypal', async (req, res) => {
  try {
    const { token, debugId } = await getAccessToken();
    res.json({
      env: PAYPAL_ENV,
      base: PAYPAL_BASE,
      client_set: Boolean(CLIENT_ID),
      secret_set: Boolean(CLIENT_SECRET),
      token_preview: token ? token.slice(0, 8) + '...' : null,
      debugId
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});
*/

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`OMNIORA server on http://localhost:${PORT}`);
  });
}

// ========== ★★★ Stripe 其余端点（前端用） ==========

// 前端拉取 publishable key
app.get('/api/stripe/config', (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

// 小工具：仅用于本文件，校验 email 格式（避免把 '' 传给 Stripe）
function isValidEmail(s) {
  return typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

// 创建 PaymentIntent（仅卡，保证“本页小窗”）
app.post('/api/stripe/create-intent', async (req, res) => {
  try {
    const { email, metadata = {} } = req.body || {};

    // 计算金额：优先 PRICE_CENTS（整数，单位分），否则默认为 $19.00
    const centsFromEnv = Number(process.env.PRICE_CENTS || 0);
    const amountCents = Number.isInteger(centsFromEnv) && centsFromEnv > 0 ? centsFromEnv : 1990;

    // 基础参数
    const params = {
      amount: amountCents,
      currency: (process.env.CURRENCY || 'usd').toLowerCase(),
      payment_method_types: ['card'],
      metadata
    };

    // 只有 email 合法时才附加到 receipt_email；否则完全不传，避免 email_invalid
    if (isValidEmail(email)) {
      params.receipt_email = email.trim();
    }

    const intent = await stripe.paymentIntents.create(params);
    res.json({ clientSecret: intent.client_secret, id: intent.id });
  } catch (e) {
    console.error('create-intent error:', e);
    res.status(400).json({ error: e.message });
  }
});

// 数据库探针接口（用于诊断连接状态和表结构）
app.get('/api/db-debug', async (req, res) => {
  try {
    const status = getDbStatus();
    const connStr = process.env.DATABASE_URL || '';
    const maskedConn = connStr.replace(/:([^:@]+)@/, ':****@'); // 隐藏敏感密码

    if (!connStr) {
      return res.json({
        ok: false,
        error: 'DATABASE_URL is missing or empty in environment variables',
        ...status
      });
    }

    if (!pool) {
      return res.json({
        ok: false,
        error: 'Database pool is not initialized (null)',
        maskedConnectionString: maskedConn,
        ...status
      });
    }

    // 运行测试查询
    let timeResult = null;
    let timeError = null;
    try {
      const tRes = await pool.query('SELECT NOW()');
      timeResult = tRes.rows[0].now;
    } catch (e) {
      timeError = e.message;
    }

    let tableExists = null;
    let tableExistsError = null;
    try {
      const existsRes = await pool.query(
        "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'omniora_reports')"
      );
      tableExists = existsRes.rows[0].exists;
    } catch (e) {
      tableExistsError = e.message;
    }

    let tableRowsCount = null;
    let tableRowsError = null;
    if (tableExists) {
      try {
        const countRes = await pool.query('SELECT COUNT(*) FROM omniora_reports');
        tableRowsCount = countRes.rows[0].count;
      } catch (e) {
        tableRowsError = e.message;
      }
    }

    res.json({
      ok: !timeError && !tableExistsError,
      databaseUrlConfigured: true,
      maskedConnectionString: maskedConn,
      ...status,
      time: timeResult,
      timeQueryError: timeError,
      tableExists: tableExists,
      tableExistsQueryError: tableExistsError,
      tableRowsCount: tableRowsCount,
      tableRowsQueryError: tableRowsError
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: e.message,
      stack: e.stack
    });
  }
});

export default app;
