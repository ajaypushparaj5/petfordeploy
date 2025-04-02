
import { useEffect, useState } from 'react';
import App from './App';
import { useAuth } from './context/AuthContext';
import AuthModal from './components/AuthModal';

export const AppWrapper = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'signup'>('login');
  const [appLoaded, setAppLoaded] = useState(false);
  const { currentUser, isAuthenticated, login, signup, logout } = useAuth();
  
  // We need this wrapper to properly handle auth since the AuthProvider is inside App
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setAppLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  const openLoginModal = () => {
    setAuthModalType('login');
    setAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthModalType('signup');
    setAuthModalOpen(true);
  };
  
  if (!appLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse">
          <div className="bg-yellow-900 rounded-full p-3">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.5 11C5.88071 11 7 9.88071 7 8.5C7 7.11929 5.88071 6 4.5 6C3.11929 6 2 7.11929 2 8.5C2 9.88071 3.11929 11 4.5 11Z"
                fill="black"
              />
              <path
                d="M19.5 11C20.8807 11 22 9.88071 22 8.5C22 7.11929 20.8807 6 19.5 6C18.1193 6 17 7.11929 17 8.5C17 9.88071 18.1193 11 19.5 11Z"
                fill="black"
              />
              <path
                d="M8.5 6C9.88071 6 11 4.88071 11 3.5C11 2.11929 9.88071 1 8.5 1C7.11929 1 6 2.11929 6 3.5C6 4.88071 7.11929 6 8.5 6Z"
                fill="black"
              />
              <path
                d="M15.5 6C16.8807 6 18 4.88071 18 3.5C18 2.11929 16.8807 1 15.5 1C14.1193 1 13 2.11929 13 3.5C13 4.88071 14.1193 6 15.5 6Z"
                fill="black"
              />
              <path
                d="M12 13.5C14.2091 13.5 16 11.7091 16 9.5C16 7.29086 14.2091 5.5 12 5.5C9.79086 5.5 8 7.29086 8 9.5C8 11.7091 9.79086 13.5 12 13.5Z"
                fill="black"
              />
              <path
                d="M6 15.5V18C6 18.5523 6.44772 19 7 19H17C17.5523 19 18 18.5523 18 18V15.5C18 14.1193 19.1193 13 20.5 13C21.8807 13 23 14.1193 23 15.5V18C23 21.3137 20.3137 24 17 24H7C3.68629 24 1 21.3137 1 18V15.5C1 14.1193 2.11929 13 3.5 13C4.88071 13 6 14.1193 6 15.5Z"
                fill="black"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <App 
        openLoginModal={openLoginModal} 
        openSignupModal={openSignupModal} 
      />
      
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={login}
        onSignup={signup}
        initialTab={authModalType}
      />
    </>
  );
};
