
import { createRoot } from 'react-dom/client';
import { AppWrapper } from './AppWrapper';
import './index.css';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <AppWrapper />
  </AuthProvider>
);
