import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/auth/auth';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import './App.css';
import ProtectedRoutes from './ProtectedRoutes';
import Home from './pages/home/home';
import Profile from './pages/profile/profile';
import User from './pages/user/user';
import Follows from './pages/follows/follows';
import Notifications from './pages/notifications/notifications';

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
            <Route path="/user/:id" element={<User/>}/>
            <Route path="/follows" element={<Follows/>}/>
            <Route path="/notifications" element={<Notifications/>}/>

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
