import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';
import userdefault from '../../res/img/user.png';

const Profile = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:3500/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserInfo();
  }, [userId, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
  
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
       
          const maxWidth = 1024;
          const maxHeight = 1024;
          let width = img.width;
          let height = img.height;
  
         
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
  
          canvas.width = width;
          canvas.height = height;
  
       
          ctx.drawImage(img, 0, 0, width, height);
  
       
          canvas.toBlob((blob) => {
            setProfilePic(blob);
          }, 'image/jpeg', 0.7); 
        };
      };
  
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file.');
      setProfilePic(null);
    }
  };
  

  const handleSave = async () => {
    setIsLoading(true); 
    try {
     
      await axios.put(`http://localhost:3500/user/${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

     
      if (profilePic) {
        await handleUploadProfilePic();
      } else {
        
        setUser((prevUser) => ({ ...prevUser, ...formData }));
      }

    
      setTimeout(() => {
        window.location.reload(); 
      }, 3000); 
    } catch (error) {
      console.error('Error updating user data:', error);
      setIsLoading(false); 
    }
  };

  const handleUploadProfilePic = async () => {
    const formData = new FormData();
    formData.append('file', profilePic);

    try {
      const response = await axios.post(`http://localhost:3500/user/${userId}/upload-profile-pic`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      
     
      const newImage = response.data.image; 
      setUser((prevUser) => ({ ...prevUser, image: newImage })); 
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  return (
    <div className="profile-container">
      <h2>{user.username}</h2>
      <div className="profile-content">
        {isLoading ? ( 
          <div className="loading-indicator">Loading...</div>
        ) : isEditing ? (
          <div className="profile-edit">
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={formData.username || ''}
                onChange={handleChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
              />
            </label>
            <label>
              Bio:
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
              />
            </label>
            <label>
              Profile Picture:
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
            <button className="save-button" onClick={handleSave}>
              Save Changes
            </button>
            <button className="cancel-button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="profile-view">
            <div className="profile-avatar">
              <img src={user.image ? `http://localhost:3500/uploads/profilepics/${user.image}` : userdefault} alt="Profile" />
            </div>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Bio:</strong> {user.bio || 'No bio available'}</p>
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
