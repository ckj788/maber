import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { PostHogProvider } from '@posthog/react';

const options = {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only',
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
