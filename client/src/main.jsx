import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {clerkPublishableKey ? (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    ) : (
      <div className="flex min-h-screen items-center justify-center bg-[#050a07] px-6 text-center">
        <div className="max-w-xl rounded-2xl border border-emerald-800/50 bg-emerald-950/20 p-6 text-emerald-100">
          <h1 className="text-2xl font-bold">Missing Clerk publishable key</h1>
          <p className="mt-3 text-sm text-emerald-200/85">
            Add <code>VITE_CLERK_PUBLISHABLE_KEY</code> in <code>client/.env</code> to enable authentication.
          </p>
        </div>
      </div>
    )}
  </React.StrictMode>
);
