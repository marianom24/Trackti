import Timer from './components/Timer.jsx'
import './index.css'
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import { LoginForm } from './pages/LoginForm.jsx'
import { RegisterForm } from './pages/RegisterForm.jsx'
import ProtectedRoute from './ProtectedRoute';

function App() {
  useEffect(() => {    
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = 'frontend\public\logo.svg'; // Cambia esta ruta por la de tu ícono
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
