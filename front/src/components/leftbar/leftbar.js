import React from 'react';
import axios from 'axios';
import { Link, NavLink ,useNavigate  } from 'react-router-dom';
import './leftbar.css';
import logoicon from '../../res/img/logoicon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faEnvelope, faUsers, faBell, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

const Leftbar = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const [user, setUser] = React.useState({});

  React.useEffect(() => {
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
 

  const pages = [
    { name: "Home", path: "/" , icon: faHome},
    { name: "Messages", path: "/messages", icon: faEnvelope},
    { name: "Follows", path: "/follows", icon: faUsers },
    { name: "Notifications", path: "/notifications" , icon: faBell},
    { name: "Profile", path: "/profile", icon: faUser },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth/login'); 
  };

  return (
    <div className="sidebar">
      
       <img className='logo' src={logoicon} alt="logo" />
      
      <ul className="pages">
        {pages.map((page, index) => (
          <li key={index}>
            <Link to={page.path}> <div className='link'><FontAwesomeIcon  icon={page.icon} /> <p className='linktext'> {page.name}</p></div></Link>
          </li>
        ))}
        
      </ul>

      <div className='logout' onClick={handleLogout}> <FontAwesomeIcon icon={faSignOutAlt}/> <p className='linktext'>Logout</p></div>
    </div>
  );
};

export default Leftbar;
