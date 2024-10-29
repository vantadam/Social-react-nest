
import React from 'react';
import { Outlet, Navigate,useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import './App.css';

const ProtectedRoutes = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/auth/login" />;
  }

  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  if (decodedToken.exp < currentTime) {
    localStorage.removeItem('token'); 
    return <Navigate to="/auth/login" />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth/login'); 
  };

  return (
    <div>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <button onClick={() => navigate('/profile')} className="profile-button">Profile</button>
      
      <Outlet />
    </div>
  );
};

export default ProtectedRoutes;
