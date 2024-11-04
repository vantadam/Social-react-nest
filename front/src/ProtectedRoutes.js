
import React from 'react';
import { Outlet, Navigate,useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import './App.css';
import Leftbar from './components/leftbar/leftbar';
import Rightbar from './components/rightbar/rightbar';

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
    <div className='protected-routes'>
      <div className='leftbar'>
      <Leftbar />
      </div>
      
     
      
      <div className='main'>
      <Outlet />
      </div>
      <div className='rightbar'>
        </div>
      <Rightbar />
    </div>
  );
};

export default ProtectedRoutes;
