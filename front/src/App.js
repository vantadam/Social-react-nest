import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/auth/auth';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import './App.css';
import ProtectedRoutes from './ProtectedRoutes';
import Home from './pages/home/home';
import Profile from './pages/profile/profile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          
          <Route path="/auth" element={<Auth />}>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route element={<ProtectedRoutes/>}>
            <Route path="/" element={<Home/>} />
            <Route path="/profile" element={<Profile/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
