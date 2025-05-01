import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import SignInPage from './pages/signin';
import ScanPage from './pages/scan';
import { GlobalProvider } from './functions/global-context';

// Define the router with the base path '/attendance/'
const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/attendance',
        Component: Layout,
        children: [
          {
            path: '',
            Component: DashboardPage,
          },
          {
            path: 'scan',
            Component: ScanPage,
          },
        ],
      },
      {
        path: '/attendance/sign-in',
        Component: SignInPage,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  </React.StrictMode>,
);
