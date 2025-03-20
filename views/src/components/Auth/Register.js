import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../static/login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useAuth } from '../../authContext/AuthContext';
import Swal from 'sweetalert2';

const Register = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { checkAuth, isAuthenticated } = useAuth();  


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

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword || !username) {
            setError('Please enter complete information!');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Invalid email format!");
            return;
        }

        else if(username.length < 6){
            setError("Username length in the range of 6 to 20!");
            return;
        }

        else if(password.length < 6){
            setError("Password length in the range of 6 to 20!");
            return;
        }

        else if(confirmPassword !== password){
            setError("Confirm password does not match password!");
            return;
        }

        try {
            const payload = {
                email: email,
                password: password,
                confirm_password: confirmPassword,
                username: username
            };

            await axios.post('/api/v1/auth/register', payload).then(response => {
                if (response.data.status === 201) {
                    if (response.data.status === 201) {
                        Swal.fire({
                            title: 'Success!',
                            text: 'Registration successful!',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            navigate('/login', { replace: true });
                        });
                    }
                }    
            })
        } catch (err) {
            setError("Something went wrong, try again!");
            return;
        }
    };

    return (
        <main>
            <div className="container-login">
                <div className="form-container-login">
                    <h2>Sign Up</h2>
                    <div className="err">
                        {error && <div className="error-message"><b>{error}</b></div>}
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            id="email"
                            placeholder="Email"
                            required
                            autoComplete="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            id="username"
                            placeholder="Username"
                            required
                            autoComplete="off"
                            value={username}
                            maxLength="20"
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
                    <div className="input-group">
                        <input
                            type={confirmPasswordVisible ? "text" : "password"}
                            id="confirmPassword"
                            placeholder="Confirm password"
                            required
                            autoComplete="off"
                            maxLength="20"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                            <FontAwesomeIcon icon={confirmPasswordVisible ? faEyeSlash : faEye} />
                        </span>
                    </div>

                    <button className="button-login" onClick={handleRegister}>OK</button>
                    <div className="register-link">
                        <p>
                            You already have an account? <a href="/login">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Register;
