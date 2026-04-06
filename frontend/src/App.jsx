import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Navbar from './components/layout/Navbar';
import './App.css';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div className="text-white">Loading...</div>;

    return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    
    // Do not show the navbar on authentication routes regardless of auth state
    const hideNavbar = ['/login', '/register'].includes(location.pathname);

    return (
        <div className="h-screen overflow-hidden flex text-white bg-[#0F172A]">
            {isAuthenticated && !hideNavbar && <Navbar />}
            
            <div className="flex-1 bg-[#0F172A] flex flex-col overflow-y-auto">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={<Navigate to="/dashboard/overview" replace />}
                    />
                    <Route
                        path="/dashboard/:tab"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/dashboard/overview" />} />
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;
