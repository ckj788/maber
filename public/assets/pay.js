// public/assets/pay.js
(function () {
  const $ = (id) => document.getElementById(id);
  const form = $('checkout-form');
  const alertBox = $('alert');

  function show(msg, ok = true) {
    if (!alertBox) {
      console[ok ? 'log' : 'warn']('[pay] ' + msg);
      return;
    }
    alertBox.style.color = ok ? '#6adf8f' : '#ff6b6b';
    alertBox.textContent = msg || '';
  }

  // 收集表单数据（来自 pay.html 的收件信息）
  function getFormData() {
    return {
      email:  $('email')?.value.trim()  || '',
      first:  $('first')?.value.trim()  || '',
      last:   $('last')?.value.trim()   || '',
      line1:  $('line1')?.value.trim()  || '',
      city:   $('city')?.value.trim()   || '',
      state:  $('state')?.value.trim()  || '',
      postal: $('postal')?.value.trim() || '',
      country:$('country')?.value       || ''
    };
  }

  function validate() {
    const d = getFormData();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return 'Email 格式不正确';
    if (!d.first || !d.last) return '请填写姓名';
    if (!d.line1 || !d.city || !d.postal || !d.country) return '请完整填写地址';
    return '';
  }

  // 把任意 SVG（文本 / dataURL / URL）转为 PNG dataURL（兜底）
  async function svgAnyToPngDataURL(svgMaybe, outW = 800) {
    try {
      if (!svgMaybe) return '';
      if (typeof svgMaybe === 'string' && svgMaybe.startsWith('data:image/png')) return svgMaybe;

      let svgUrl = '';
      if (typeof svgMaybe === 'string' && svgMaybe.trim().startsWith('<svg')) {
        const blob = new Blob([svgMaybe], { type: 'image/svg+xml' });
        svgUrl = URL.createObjectURL(blob);
      } else if (typeof svgMaybe === 'string' && svgMaybe.startsWith('data:image/svg+xml')) {
        svgUrl = svgMaybe;
      } else if (typeof svgMaybe === 'string' && svgMaybe.startsWith('http')) {
        svgUrl = svgMaybe;
      } else {
        return '';
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      const loaded = new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (e) => reject(e);
      });
      img.src = svgUrl;
      await loaded;

      const ratio = img.height / Math.max(1, img.width);
      const w = outW;
      const h = Math.max(1, Math.round(w * ratio));

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const png = canvas.toDataURL('image/png');

      try { if (svgUrl.startsWith('blob:')) URL.revokeObjectURL(svgUrl); } catch {}
      return png;
    } catch (e) {
      console.warn('[svgAnyToPngDataURL] failed:', e);
      return '';
    }
  }

  // ============== 这里开始：改为 Stripe 方案（不改 HTML） ==============

  // 动态加载 Stripe.js
  function loadStripeJs() {
    return new Promise((resolve, reject) => {
      if (window.Stripe) return resolve();
      const s = document.createElement('script');
      s.src = 'https://js.stripe.com/v3';
      s.onload = () => resolve();
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  }

  // 在原来的 PayPal 容器里挂载 Payment Element，并添加按钮
  async function mountStripeUI() {
    const host = document.querySelector('#paypal-button-container');
    if (!host) {
      show('未找到支付容器 #paypal-button-container，请检查页面结构', false);
      return null;
    }

    // 清空并放置 Payment Element 容器与按钮
    host.innerHTML = '';
    const el = document.createElement('div');
    el.id = 'payment-element';
    el.style.margin = '12px 0 16px';
    host.appendChild(el);

    const btn = document.createElement('button');
    btn.id = 'stripe-pay-btn';
    btn.type = 'button';
    btn.textContent = '立即支付';
    btn.style.cssText = 'width:100%;padding:12px 14px;border-radius:12px;border:1px solid #1b1b1b;background:#111;color:#f3f3f1;cursor:pointer';
    host.appendChild(btn);

    return { el, btn };
  }

  // Stripe 主流程
  async function initStripeFlow() {
    try {
      const err = validate();
      if (err) { show(err, false); return; }

      // 1) 准备 UI 与 Stripe.js
      const ui = await mountStripeUI();
      if (!ui) return;
      await loadStripeJs();

      // 2) 取 publishable key
      show('初始化支付中…');
      const cfgResp = await fetch('/api/stripe/config');
      const cfg = await cfgResp.json();
      if (!cfg.publishableKey) {
        show('Stripe 配置缺失（publishable key）', false);
        return;
      }
      const stripe = Stripe(cfg.publishableKey);

      // 3) 创建 PaymentIntent（把业务字段放 metadata 里）
      const formData = getFormData();
      const name   = (window.__maberForm?.name)   || (localStorage.getItem('maber:name')   || `${formData.first} ${formData.last}`.trim());
      const gender = (window.__maberForm?.gender) || (localStorage.getItem('maber:gender') || 'male');
      const dob    = (window.__maberForm?.dob)    || (localStorage.getItem('maber:dob')    || '');
      const tob    = (window.__maberForm?.tob)    || (localStorage.getItem('maber:tob')    || '');

      const intentResp = await fetch('/api/stripe/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          metadata: {
            name, gender, dob, tob,
            first: formData.first, last: formData.last,
            line1: formData.line1, city: formData.city, state: formData.state,
            postal: formData.postal, country: formData.country
          }
        })
      });
      const intentData = await intentResp.json();
      if (!intentResp.ok || !intentData.clientSecret) {
        show(intentData.error || '创建支付意图失败', false);
        return;
      }
      const paymentIntentId = intentData.id; // 用作 orderId

      // 4) 初始化 Elements + Payment Element
      const elements = stripe.elements({ clientSecret: intentData.clientSecret });
      const paymentElement = elements.create('payment');
      paymentElement.mount('#payment-element');

      // 5) 点击支付：本页完成（不整页跳转）
      ui.btn.addEventListener('click', async () => {
        const errMsg = validate();
        if (errMsg) { show(errMsg, false); return; }

        show('正在处理支付…');
        const result = await stripe.confirmPayment({
          elements,
          redirect: 'if_required'
        });

        if (result.error) {
          show(result.error.message || '支付失败，请重试', false);
          return;
        }

        // 支付成功或已提交（多数情况下本页完成 3DS）
        show('支付成功，正在生成报告…');

        // 6) 上报报告生成信息（与原先 PayPal 版一致）
        try {
          const tri = JSON.parse(localStorage.getItem('maber:tri') || '{}');

          // PNG 优先；若没有，则尝试从 SVG 文本/URL 生成 PNG
          let trianglePng = localStorage.getItem('maber:trianglePng') || '';
          if (!trianglePng || !trianglePng.startsWith('data:image/png')) {
            const triSvg = localStorage.getItem('maber:triangle') || '';
            trianglePng = await svgAnyToPngDataURL(triSvg);
            if (trianglePng) localStorage.setItem('maber:trianglePng', trianglePng);
          }

          await fetch('/api/report/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: paymentIntentId,          // ← 用 PI id 作为订单号
              email: formData.email,
              name, gender, dob, tob,
              tri,
              trianglePng
            })
          });
        } catch (e) {
          console.warn('[report/save] 失败（继续跳转）:', e);
        }

        // 7) 跳到报告页（与原逻辑一致：仍然用 orderID 参数名）
        const next = `/report.html?orderID=${encodeURIComponent(paymentIntentId)}&email=${encodeURIComponent(formData.email)}`;
        window.location.href = next;
      });

      show('请输入卡信息并点击“立即支付”');
    } catch (e) {
      console.error(e);
      show('支付初始化失败，请刷新页面重试', false);
    }
  }

  // 自动初始化：如果页面上原本是 PayPal 流程，这里直接改为 Stripe 流程
  initStripeFlow();
})();
