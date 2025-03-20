import React, { useState, useEffect } from 'react';
import '../../static/forgotpassword.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../authContext/AuthContext';

const ForgotPassword = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); 
    const [step, setStep] = useState(1); 
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [timer, setTimer] = useState(120); 
    const [isOtpValid, setIsOtpValid] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const { checkAuth, isAuthenticated } = useAuth();  
    
    
    useEffect(() => {
        checkAuth();
        if (isAuthenticated) {
            navigate(location.pathname, { replace: true });
        }
    }, [isAuthenticated, checkAuth, navigate, location.pathname]);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    useEffect(() => {
            if (message) {
                const timer = setTimeout(() => setMessage(''), 3000);
                return () => clearTimeout(timer);
            }
        }, [message]);

    useEffect(() => {
        let interval;
        if (isOtpSent && timer > 0) {
        interval = setInterval(() => setTimer((prevTime) => prevTime - 1), 1000);
        } else if (timer === 0) {
        setIsOtpValid(false);
        clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer, isOtpSent]);

    const handleResendOtp = async () => {
        setTimer(120);
        setOtp(["", "", "", "", "", ""]);
        setIsOtpValid(true);
        setIsOtpSent(true);
        await axios.post('/api/v1/auth/forgot_password', {email: email});
    };

    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (value === '' || /^[0-9]$/.test(value)) {
        const otpCopy = [...otp];
        otpCopy[index] = value;
        setOtp(otpCopy);

        if (value !== '' && index < otp.length - 1) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
        const otpInt = parseInt(enteredOtp, 10);
        console.error = () => {};
        try {
            const response = await axios.post('/api/v1/auth/verify_otp', { email, otp: otpInt });
            if (response.status === 201) {
                setMessage('OTP authentication successful!');
                setStep(3);
            }
        } catch (error) {
            setMessage(error.response.data.detail.message);
            return;
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsOtpSent(true);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage("Invalid email format!");
            return;
        }
        await axios.post('/api/v1/auth/forgot_password', {email: email}).then(response => {
            if (response.status === 201){
                setStep(2); 
            }
        }).catch(error => {
            navigate("/login");
        });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6 || confirmPassword.length < 6){
            setMessage("Password must be at least 6 characters long.");
            return;
        }
        await axios.post('/api/v1/auth/reset_password', {email: email, new_password: password, confirm_new_password: confirmPassword}).then(response => {
            if (response.status === 200){
                setMessage('Your password has been changed successfully!');
                setTimeout(() => {
                    navigate("/login", {replace: true});
                }, 1000);
            }
        }).catch(error => {
            if (error.status === 404){
                navigate('/not-found');
                return;
            }
        })
        
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
        if (otp[index] === '') {
            if (index > 0) {
            document.getElementById(`otp-${index - 1}`).focus(); // Chuyển đến ô trước đó nếu ô hiện tại trống
            }
        } else {
            const otpCopy = [...otp];
            otpCopy[index] = ''; // Xóa số trong ô hiện tại
            setOtp(otpCopy);
        }
        }
    };

    const handleOtpClear = () => {
        const otpCopy = ['', '', '', '', '', ''];
        setOtp(otpCopy);
        document.getElementById('otp-0').focus(); // Focus vào ô đầu tiên
    };

    const isOtpComplete = otp.every((digit) => digit !== ''); // Kiểm tra xem OTP đã được nhập đầy đủ chưa

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2 className="forgot-password-header">Forgot Password</h2>

        {step === 1 && (
        <form className="forgot-password-formm" onSubmit={handleEmailSubmit}>
            <p>Enter your email to receive OTP code to recover password.</p>

            <div className="input-group">
            <i className="fas fa-envelope"></i>
            <input
                type="email"
                className="forgot-password-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            </div>

            <button type="submit" className="forgot-password-button">
            Send OTP
            </button>

            <p className="info-text">
            * OTP code is valid for 2 minutes. Please do not share the verification code with anyone.
            </p>
            <a href='/login'>Back</a>
        </form>
        )}

        {step === 2 && (
            <form className="forgot-password-form" onSubmit={handleOtpSubmit}>
                <p className="otp-email-info" style={{fontSize: '18px'}}>
                    Your code was sent to you via email!
                </p>
                <div className="otp-field">
                {otp.map((digit, index) => (
                    <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    maxLength="1"
                    autoFocus={index === 0}
                    disabled={!isOtpValid}
                    autoComplete="new-password" 
                    inputMode="numeric"
                    />
                ))}
                </div>

                <input type="text" name="fakeusernameremembered" style={{ display: 'none' }} autoComplete="off" />
                <input type="password" name="fakepasswordremembered" style={{ display: 'none' }} autoComplete="new-password" />

                <div className="otp-footer">
                    {timer > 0 ? (
                        <p className="otp-timer">{`Time remaining: ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`}</p>
                    ) : (
                        <p className="otp-timer expired">OTP code has expired!</p>
                    )}
                    <p className="resend-otp">
                    Didn't receive OTP?{' '}
                    <span className="resend-link" onClick={handleResendOtp}>
                        Try again
                    </span>
                    </p>
                </div>                

                <button
                type="submit"
                className="forgot-password-button"
                disabled={!isOtpComplete || !isOtpValid}
                >
                Submit OTP
                </button>
            </form>
            )}


        {step === 3 && (
          <form className="forgot-password-form" onSubmit={handlePasswordSubmit}>
            <p className="otp-email-info" style={{fontSize: '18px'}}>
                Create a new password for yourself!
            </p>
            <div className='input-group'>
                <input
                    type={passwordVisible ? "text" : "password"}
                    className="forgot-password-input"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <span className="toggle-password" onClick={togglePasswordVisibility}>
                    <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                </span>
            </div>
            <div className='input-group'>
                <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    className="forgot-password-input"
                    placeholder="Re-enter password to confirm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <span className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                    <FontAwesomeIcon icon={confirmPasswordVisible ? faEyeSlash : faEye} />
                </span>
            </div>
            
            <button type="submit" className="forgot-password-button">Change Password</button>
          </form>
        )}

        {message && <p className="forgot-password-message">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
