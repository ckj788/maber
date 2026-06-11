// node scripts/smoke.js
import fs from 'fs';
import fetch from 'node-fetch';

const base = process.env.BASE_URL || 'http://localhost:8787';
const orderId = 'SMOKE_' + Date.now();
const email = process.env.TEST_EMAIL || 'zyc729@outlook.com';

// 用你线上/本地同模板，确保和实际一致
const html = fs.readFileSync('./public/report.html', 'utf8');

async function main() {
  console.log('[smoke] base:', base);
  // 1) 触发“保存并发邮件”
  const save = await fetch(`${base}/api/report/save`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({ orderId, email, html })
  });
  if (!save.ok) throw new Error('save failed ' + save.status);

  // 2) 下载同一份 PDF（应与邮件附件一致）
  const pdf = await fetch(`${base}/api/report/${orderId}.pdf`);
  if (!pdf.ok) throw new Error('pdf failed ' + pdf.status);
  const buf = Buffer.from(await pdf.arrayBuffer());
  console.log('[smoke] pdf bytes:', buf.length);

  // 保存到本地方便你肉眼看
  fs.mkdirSync('./tmp', { recursive: true });
  fs.writeFileSync(`./tmp/${orderId}.pdf`, buf);
  console.log('[smoke] saved -> tmp/' + orderId + '.pdf');
}
main().catch(e => { console.error(e); process.exit(1); });
