import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './pages/Index/Index';
import Home from './pages/Home/Home';
import { AuthProvider } from './contexts/AuthContext'; // Certifique-se do caminho correto
import ProtectedRoute from './components/ProtectedRoute'; // Certifique-se do caminho correto

function App() {

    return (

        <AuthProvider>

            <Router>

                <Routes>

                    <Route path="/" element={<Index />} />

                    <Route path="/home" element={<ProtectedRoute element={<Home />} />} />

                </Routes>

            </Router>

        </AuthProvider>

    );

}

export default App;