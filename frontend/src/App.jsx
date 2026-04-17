import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';

import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import VendorList from './pages/VendorList';
import Transactions from './pages/Transactions';
import Purchases from './pages/Purchases';
import Supplies from './pages/Supplies';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="vendors" element={<VendorList />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="purchases" element={<Purchases />} />
              <Route path="supplies" element={<Supplies />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
