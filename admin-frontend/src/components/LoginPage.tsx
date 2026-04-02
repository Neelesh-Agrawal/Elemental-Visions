import React, { useState } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = await onLogin(email, password);
    if (!success) {
      setError('Invalid email or password. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Shield className="h-8 w-8 text-amber-700" />
          </div>
          <h2 className="text-3xl font-bold text-amber-100 font-serif">Elemental Admin</h2>
          <p className="mt-2 text-amber-200">Access your mystical dashboard</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl p-8 border border-amber-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-2 font-serif">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="h-5 w-5 text-amber-600" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200 bg-white/80 backdrop-blur-sm"
                  placeholder="Enter admin email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-amber-800 mb-2 font-serif">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-amber-600" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200 bg-white/80 backdrop-blur-sm"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-amber-600 hover:text-amber-800" />
                  ) : (
                    <Eye className="h-5 w-5 text-amber-600 hover:text-amber-800" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-serif"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/80"></div>
              ) : (
                'Enter Dashboard'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-amber-700 font-serif">
            Secure admin access only
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
