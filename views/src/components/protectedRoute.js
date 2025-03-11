import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../authContext/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, checkAuth } = useAuth();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    console.log(isAuthenticated);
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
