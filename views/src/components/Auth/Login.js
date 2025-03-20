import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../static/login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useAuth } from '../../authContext/AuthContext';

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, checkAuth, isAuthenticated } = useAuth();  

    useEffect(() => {
        checkAuth();
        if (isAuthenticated) {
            navigate('/note', { replace: true });
        }
    }, [isAuthenticated, checkAuth, navigate]);
    
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Please enter email and password!');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(username)) {
            setError("Invalid email format!");
            return;
        }

        try {
            const payload = {
                username: username,
                password: password,
            };

            const response = await axios.post("/api/v1/auth/login", payload, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            if (response.status === 200) {
                login(response.data.access_token);
                navigate('/note', { replace: true }); 
            }
        } catch (err) {
            if (err.status == 401){
                setError("Incorrect email or password!!!");
            }
            else{
                setError('Something went wrong! Please try again.');
            }
        }
    };

    return (
        <main>
            <div className="container-login">
                <div className="form-container-login">
                    <h2>Login</h2>
                    <div className="err">
                        {error && <div className="error-message"><b>{error}</b></div>}
                    </div>
                    <div className="input-group">
                        <input
                            type="email"
                            id="username"
                            placeholder="Email"
                            required
                            autoComplete="off"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            placeholder="Password"
                            required
                            autoComplete="off"
                            maxLength="20"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span className="toggle-password" onClick={togglePasswordVisibility}>
                            <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                        </span>
                    </div>
                    <div className="options">
                        <a href="/forgot-password">Forgot password?</a>
                    </div>
                    <button className="button-login" onClick={handleLogin}>OK</button>
                    <div className="register-link">
                        <p>
                            Don't have an account? <a href="/register">Sign Up</a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Login;
