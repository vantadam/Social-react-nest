import React from "react";
import { Helmet } from "react-helmet";
import { NavLink, Outlet } from "react-router-dom";
import "./auth.css";
import logo from "./../../res/img/logo.png";

const Auth = () => {

  
  return (
    <div className="authpage">
      <Helmet>
      <title>Auth</title>
    </Helmet>
    <div className="auth-container">
      <nav>
        <ul className="nav-list">
          <li>
            <NavLink
              to="/auth/login"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Login
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/auth/register"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Register
            </NavLink>
          </li>
        </ul>
      </nav>

      
      <div className="form-container">
        <Outlet />
      </div>
      
      </div>
    <div className="logo"><img src={logo} alt="Logo"/></div>
   
    </div>
  );
};

export default Auth;
