import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

function App() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        let response = await fetch(`${apiUrl}/auth/admin/me`, {
          credentials: 'include',
        });

        if (response.status === 401) {
          const refreshResponse = await fetch(`${apiUrl}/auth/admin/refresh`, {
            method: 'POST',
            credentials: 'include',
          });

          if (refreshResponse.ok) {
            response = await fetch(`${apiUrl}/auth/admin/me`, {
              credentials: 'include',
            });
          }
        }

        setIsAuthenticated(response.ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkSession();
  }, [apiUrl]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch(`${apiUrl}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setIsAuthenticated(false);
        return false;
      }

      setIsAuthenticated(true);
      return true;
    } catch {
      setIsAuthenticated(false);
      return false;
    }
  };

  const handleLogout = async () => {
    await fetch(`${apiUrl}/auth/admin/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});
    setIsAuthenticated(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-amber-800 text-lg">Loading admin session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/orders" replace /> : <LoginPage onLogin={handleLogin} />
            }
          />
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <Dashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? '/orders' : '/login'} replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
