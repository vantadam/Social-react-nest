import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import "./rightbar.css";
import userdefault from "../../res/img/user.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";


const Rightbar = () => {
    const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
    const [user, setUser] = useState({});
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:3500/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserInfo();
  }, [userId, token]);
  return (
    <div className='rightbar'>
        <div className="topsection">
        <div className="profile" >
        <img src={user.image ? `http://localhost:3500/uploads/profilepics/${user.image}` : userdefault} alt="Profile" /> {user.username}
        </div>
        <div className="icon">
        <FontAwesomeIcon icon={faCog} />
        </div>
        </div>
       
    </div>
  );

}
export default Rightbar;