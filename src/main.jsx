import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { MembersProvider } from './context/MembersContext.jsx';
import { PaymentsProvider } from './context/PaymentsContext.jsx';
import { MembershipsProvider } from './context/MembershipsContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <MembersProvider>
        <PaymentsProvider>
          <MembershipsProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </MembershipsProvider>
        </PaymentsProvider>
      </MembersProvider>
    </ThemeProvider>
  </StrictMode>,
);
