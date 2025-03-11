import React from 'react';
import '../static/coffe.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../authContext/AuthContext';
import { useEffect } from 'react';
import Header from './Header';

const BuyMeACoffee = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { checkAuth, isAuthenticated } = useAuth();  


    useEffect(() => {
        checkAuth();
        if (isAuthenticated) {
            navigate(location.pathname, { replace: true });
        }
    }, [isAuthenticated, checkAuth, navigate, location.pathname]);

    return (
        <>
            <Header />
            <div className="buy-me-coffee">
            <div className="left-section">
                <img src="../../../static/images/qr.jpeg" alt="QR Code" className="qr-code" />
                <div className="right-section">
                <h1>☕ Buy Me a Coffee!</h1>
                <p>
                    Thanks for visiting! If you like my system, please support me with a cup of coffee. Scan the QR code!
                </p>
                <button className="donate-button">:33333</button>
            </div>
            </div>            
            </div>
        </>
        
    );
};

export default BuyMeACoffee;
