
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Layout from './components/Layout';
import { AuthState, User } from './types';
import * as db from './services/db';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = db.getCurrentUser();
      if (savedUser) {
        setAuth({ user: savedUser, isAuthenticated: true });
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = (user: User) => {
    setAuth({ user, isAuthenticated: true });
    db.setCurrentUser(user);
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
    db.logout();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!auth.isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!auth.isAuthenticated ? <Register onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        
        <Route path="/" element={auth.isAuthenticated ? <Layout user={auth.user!} onLogout={handleLogout} /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard user={auth.user!} />} />
          <Route path="transactions" element={<Transactions user={auth.user!} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
