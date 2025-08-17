import React, { useContext } from 'react';

import { Navigate } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ element: Component }) => {

    const { isLoggedIn, loading } = useContext(AuthContext);

    if (loading) {

        return <div>Carregando...</div>;

    }

    if (!isLoggedIn) {

        return <Navigate to="/" replace />;

    }

    return Component;

};

export default ProtectedRoute;