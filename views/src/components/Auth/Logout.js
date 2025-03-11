import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext/AuthContext';
import Swal from 'sweetalert2';

const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will log out of the system and go to the login page!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                logout();  
                navigate('/', { replace: true });
            }
        }); 
    };

    return (
        <a onClick={handleLogout}>
            <i className="fas fa-sign-out-alt" style={{ fontSize: '30px', color: '#ff4d4d', cursor: 'pointer' }} title="Logout"></i>
        </a>
    );
};

export default Logout;
