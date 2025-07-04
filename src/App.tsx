import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Staking from '@/pages/Staking';
import Affiliates from '@/pages/Affiliates';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import Home from './pages/home/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WalletProvider } from './hooks/WalletContext';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  return (
      <WalletProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="flex-1 mt-[70px]">
              <Routes>
                {/* Public Routes */}
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/staking" element={
                  <ProtectedRoute>
                    <Staking />
                  </ProtectedRoute>
                } />
                
                <Route path="/affiliates" element={
                  <ProtectedRoute>
                    <Affiliates />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                } />
                
                {/* Fallback */}
                {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
              </Routes>
            </main>
            <Footer />
            <ToastContainer />
          </div>
        </Router>
      </WalletProvider>
  );
}

export default App;
