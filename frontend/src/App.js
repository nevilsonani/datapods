import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';

// Pages
import Home from './pages/Home';
import Vaults from './pages/Vaults';
import VaultDetail from './pages/VaultDetail';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';

// Web3 Provider
function getLibrary(provider) {
  return new Web3Provider(provider);
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <AuthProvider>
        <WalletProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/vaults"
                element={
                  <ProtectedRoute>
                    <Vaults />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/vaults/:id"
                element={
                  <ProtectedRoute>
                    <VaultDetail />
                  </ProtectedRoute>
                }
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </WalletProvider>
      </AuthProvider>
    </Web3ReactProvider>
  );
};


export default App;
