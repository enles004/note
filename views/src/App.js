import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Note from './components/Note/Note';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { AuthProvider } from './authContext/AuthContext';
import ProtectedRoute from './components/protectedRoute';
import ForgotPassword from './components/ForgotPassword/ForgotPasswordForm';
import NotFound from './components/NotFound/notFound';
import BuyMeACoffee from './components/BuyMeACoffee';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path='/' element={<Dashboard />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/not-found" element={<NotFound />} /> 
                    <Route path='/note' element={
                        <ProtectedRoute>
                            <Note />
                        </ProtectedRoute>
                    } 
                    />
                    <Route path='/coffee' element={<BuyMeACoffee />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
