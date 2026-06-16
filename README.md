# OMNIORA Payments Starter (HTML + Node + PayPal)
一键启动：前端含支付弹窗（8.90 USD 解锁），后端完成 PayPal 下单与扣款。

## 目录
- public/index.html：你的整页站点（已集成支付弹窗与流程）
- server/server.js：Node 后端（/create-order、/capture-order）
- package.json、.env.sample

## 本地运行
1) 安装依赖
   npm i
2) 复制 .env.sample 为 .env，填入沙盒凭证（或正式凭证）
3) 启动后端
   npm start
4) 打开 http://localhost:8787

## 上线
- 把 PAYPAL_ENV 改为 live，并换正式 Client ID/Secret
- 将 index.html 中 SDK 脚本的 client-id=YOUR_PAYPAL_CLIENT_ID 替换为你的 ID
- 部署后端到你的域名（HTTPS），把接口地址替换到生产域名
