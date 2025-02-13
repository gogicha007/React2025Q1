import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { setupStore } from './state/store.ts';
const store = setupStore();

console.log(process.env.NODE_ENV);
const rootElement = document.getElementById('root');
const root = createRoot(rootElement as HTMLElement);
const render = () => {
  root.render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
};

if (process.env.NODE_ENV === 'development') {
  import('./utils/test-utils/mocks/browser').then(({ worker }) => {
    worker.start({ onUnhandledRequest: 'bypass' });
    render();
  });
} else {
  render();
}
// createRoot(document.getElementById('root') as HTMLElement).render(
//   <StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </StrictMode>
// );
