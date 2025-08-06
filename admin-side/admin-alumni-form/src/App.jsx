import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminPage from '../src/pages/AdminPage';
import CompanyPage from '../src/pages/CompanyPage';
import UserPage from '../src/pages/UserPage';

// Auth Context
const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email, password) => {
    if (email === 'necaaa@nec.edu.in' && password === 'Necalumni4962') {
      console.log('Login successful, setting isAuthenticated to true');
      setIsAuthenticated(true);
      return true;
    }
    console.log('Login failed');
    return false;
  };

  const logout = () => {
    console.log('Logging out, setting isAuthenticated to false');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log(`ProtectedRoute: isAuthenticated: ${isAuthenticated}`);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Login Page Component
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate(); // Use react-router-dom's useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = login(email, password);

    if (success) {
      console.log('Login successful, navigating to /');
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
    setIsLoading(false);
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #be185d 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  };

  const backgroundStyle1 = {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  };

  const backgroundStyle2 = {
    position: 'absolute',
    bottom: '-50%',
    right: '-50%',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
    animationDelay: '1s',
  };

  const formStyle = {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(16px)',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    zIndex: 1,
  };

  const iconContainerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
    borderRadius: '16px',
    marginBottom: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle = {
    fontSize: '30px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '8px',
    textAlign: 'center',
  };

  const subtitleStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: '32px',
  };

  const errorStyle = {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '12px',
    padding: '12px',
    color: '#fca5a5',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '24px',
  };

  const inputGroupStyle = {
    marginBottom: '24px',
  };

  const labelStyle = {
    display: 'block',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
  };

  const inputWrapperStyle = {
    position: 'relative',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    paddingRight: '40px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  };

  const inputIconStyle = {
    position: 'absolute',
    right: '12px',
    top: '12px',
    width: '20px',
    height: '20px',
    color: 'rgba(255, 255, 255, 0.5)',
  };

  const buttonStyle = {
    width: '100%',
    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
    color: 'white',
    fontWeight: '600',
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transform: isLoading ? 'scale(1)' : 'scale(1)',
    opacity: isLoading ? 0.5 : 1,
  };

  const loadingContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const spinnerStyle = {
    width: '20px',
    height: '20px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    marginRight: '8px',
    animation: 'spin 1s linear infinite',
  };

  const footerStyle = {
    marginTop: '24px',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        input:focus {
          outline: none;
          box-shadow: 0 0 0 2px #60a5fa;
          border-color: transparent;
        }
        button:hover:not(:disabled) {
          background: linear-gradient(to right, #2563eb, #7c3aed);
          transform: scale(1.05);
        }
      `}</style>
      <div style={containerStyle}>
        <div style={backgroundStyle1}></div>
        <div style={backgroundStyle2}></div>

        <div style={formStyle}>
          <div style={{ textAlign: 'center' }}>
            <div style={iconContainerStyle}>
              <svg
                style={{ width: '32px', height: '32px', color: 'white' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-9a3 3 0 100 6 3 3 0 000-6z"
                />
              </svg>
            </div>
            <h1 style={titleStyle}>Welcome Back</h1>
            <p style={subtitleStyle}>Sign in to your account</p>
          </div>

          <div>
            {error && <div style={errorStyle}>{error}</div>}

            <div style={inputGroupStyle}>
              <label htmlFor="email" style={labelStyle}>
                Email Address
              </label>
              <div style={inputWrapperStyle}>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  placeholder="Enter your email"
                  required
                />
                <svg style={inputIconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
            </div>

            <div style={inputGroupStyle}>
              <label htmlFor="password" style={labelStyle}>
                Password
              </label>
              <div style={inputWrapperStyle}>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                  placeholder="Enter your password"
                  required
                />
                <svg style={inputIconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 0h12a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <button type="button" onClick={handleSubmit} disabled={isLoading} style={buttonStyle}>
              {isLoading ? (
                <div style={loadingContainerStyle}>
                  <div style={spinnerStyle}></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
            <button
              onClick={() => {
                console.log('LoginPage: Navigating to /user/test@example.com');
                navigate('/user/test@example.com');
              }}
              style={{ ...buttonStyle, marginTop: '10px' }}
            >
              Go to User Page (Test)
            </button>
          </div>

          <div style={footerStyle}>
            <p>Please enter your credentials to continue</p>
          </div>
        </div>
      </div>
    </>
  );
};

// Main App Component
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies"
            element={
              <ProtectedRoute>
                <CompanyPage />
              </ProtectedRoute>
            }
          />
          <Route path="/user/:token" element={<UserPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}