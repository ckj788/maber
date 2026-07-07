import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { PostHogProvider } from '@posthog/react';

const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const options = {
  api_host: isLocalhost ? 'https://us.i.posthog.com' : '/sky',
  person_profiles: 'identified_only',
  defaults: '2026-05-30',
} as const;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider 
      apiKey="phc_DoAuw4v3tapM96hL7U46zRwHiY2aa9jPbAAGWgBxa6AP" 
      options={options}
    >
      <App />
    </PostHogProvider>
  </StrictMode>,
);
