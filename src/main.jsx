import React from 'react';
import ReactDOM from 'react-dom/client';
import '../style.css';
import AzkarApp from './components/AzkarApp';

console.log('Main.jsx loaded, attempting to mount React app...');

const rootElement = document.getElementById('root');
console.log('Root element found:', rootElement);

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  console.log('React root created, rendering app...');

  root.render(
    <React.StrictMode>
      <AzkarApp />
    </React.StrictMode>
  );

  console.log('App rendered successfully');
} else {
  console.error('Root element not found!');
}

// Register service worker for PWA support
if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) {
  window.addEventListener('load', async () => {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    }
  });
}
