import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './pages/Index/Index';
import Home from './pages/Home/Home';
import { AuthProvider } from './contexts/AuthContext'; // Certifique-se do caminho correto
import { ThemeContext } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute'; // Certifique-se do caminho correto
import { ToastContainer } from 'react-toastify';

function AppContent() {
    const { theme } = useContext(ThemeContext);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme === 'dark' ? 'dark' : 'light'}
                style={{
                    fontSize: '14px',
                    fontFamily: 'Poppins, sans-serif',
                    zIndex: 9999
                }}
            />
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;