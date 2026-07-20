import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const scheduledTime = new Date(Date.now() + 20 * 60 * 1000).toISOString();

console.log('Sending scheduled email for time:', scheduledTime);

resend.emails.send({
  from: 'OMNIORA <contact@omniora13.com>',
  to: ['zyc729@outlook.com'],
  subject: 'Test Scheduled Email',
  html: '<p>Test</p>',
  scheduledAt: scheduledTime
}).then(r => {
  console.log('RESPONSE:', JSON.stringify(r, null, 2));
}).catch(e => {
  console.error('ERROR:', e);
});
