import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    // Redirect based on user role
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'kitchen') {
      return <Navigate to="/kitchen" replace />;
    } else if (user.role === 'server') {
      return <Navigate to="/server" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      // Redirect will happen automatically due to the conditional above
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen wood-fired-texture flex flex-col justify-center overflow-hidden relative">
      {/* Pizza decoration */}
      <div className="absolute -top-16 -left-16 opacity-10">
        <svg viewBox="0 0 100 100" width="200" height="200" fill="#c53030">
          <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z"/>
          <path d="M27.5 65l37.5-17.5L82.5 10 27.5 65z"/>
          <circle cx="50" cy="50" r="7.5"/>
          <circle cx="35" cy="35" r="5"/>
          <circle cx="65" cy="35" r="5"/>
          <circle cx="35" cy="65" r="5"/>
          <circle cx="65" cy="65" r="5"/>
        </svg>
      </div>

      <div className="absolute -bottom-16 -right-16 opacity-10 rotate-45">
        <svg viewBox="0 0 100 100" width="180" height="180" fill="#c53030">
          <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z"/>
          <path d="M27.5 65l37.5-17.5L82.5 10 27.5 65z"/>
          <circle cx="50" cy="50" r="7.5"/>
          <circle cx="35" cy="35" r="5"/>
          <circle cx="65" cy="35" r="5"/>
          <circle cx="35" cy="65" r="5"/>
          <circle cx="65" cy="65" r="5"/>
        </svg>
      </div>

      <div className="max-w-md w-full mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="pizza-badge mb-5 mx-auto">Pizza Paradise</div>
          <h1 className="heading-2 tomato-sauce-accent mx-auto w-fit mb-6">Welcome Back</h1>
          <p className="text-body-md text-gray-700">Log in to your account to continue</p>
        </div>

        <div className="pizza-card bg-white p-8">
          {error && (
            <div className="bg-red-100 p-4 rounded-md border border-red-300 mb-5">
              <p className="text-ui-bold text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="pepperoni-pattern">
            <div className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="relative z-10"
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="relative z-10"
              />

              <div className="pt-3">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading}
                  className="shadow-lg text-ui-bold"
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </Button>
              </div>
            </div>
          </form>

          <div className="pizza-slice-divider mt-8 mb-6">
            <div className="slice-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49 3.49-7.51-7.51 3.49-3.49 7.51zm5.5-6c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/>
              </svg>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="text-body-sm text-red-600 hover:text-red-800 hover:underline transition-colors duration-200"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;