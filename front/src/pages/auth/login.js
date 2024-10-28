import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage(""); 
      try {
        const response = await axios.post("http://localhost:3500/auth/login", values);

        if (response.data.access_token) {
          
       
          localStorage.setItem("token", response.data.access_token);
          localStorage.setItem("userId", response.data.id);
          navigate("/");
        } else {
         
          
          setErrorMessage("Login failed. Please try again.");
        }
      } catch (error) {
       
        setErrorMessage(error.response?.data?.message || "Login failed. Please check your credentials.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="form-box">
      <h2>Login</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            name="username"
            onChange={formik.handleChange}
            value={formik.values.username}
            required
          />
          <label>Username</label>
          {formik.errors.username && <div className="error">{formik.errors.username}</div>}
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            required
          />
          <label>Password</label>
          {formik.errors.password && <div className="error">{formik.errors.password}</div>}
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>} 

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
