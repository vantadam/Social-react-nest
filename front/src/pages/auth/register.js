import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "./auth.css"; 

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        
        await axios.post("http://localhost:3500/auth/register", values);
        
       
        const loginResponse = await axios.post("http://localhost:3500/auth/login", {
          username: values.username,
          password: values.password,
        });
        
        if (!loginResponse.data.access_token) {
          navigate("/auth/login");
        }
        localStorage.setItem("token", loginResponse.data.access_token);
        localStorage.setItem("userId", loginResponse.data.id);

        
        navigate("/");
      } catch (error) {
        console.error(error);
        alert("Error occurred during registration/login.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="form-box">
      <h2>Sign Up</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            name="username"
            onChange={formik.handleChange}
            value={formik.values.username}
            required
          />
          <label>Full Name</label>
          {formik.errors.username && <div className="error">{formik.errors.username}</div>}
        </div>

        <div className="input-group">
          <input
            type="email"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            required
          />
          <label>Email</label>
          {formik.errors.email && <div className="error">{formik.errors.email}</div>}
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

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Register;
