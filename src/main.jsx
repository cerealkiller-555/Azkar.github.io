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
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker.register(swUrl)
      .then((reg) => console.log('Service Worker registered:', reg.scope))
      .catch((err) => console.log('Service Worker registration failed:', err));
  });
}
