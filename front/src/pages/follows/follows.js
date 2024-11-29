import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './follows.css';

const Follows = () => {
  const [activeTab, setActiveTab] = useState('followers'); 
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

   const fetchFollowers = async () => {
    try {
      const response = await axios.get(`http://localhost:3500/follow/followers/${userId}`);
      setFollowers(response.data);
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };


  const fetchFollowing = async () => {
    try {
      const response = await axios.get(`http://localhost:3500/follow/following/${userId}`);
      setFollowing(response.data);
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'followers') {
      fetchFollowers();
    } else {
      fetchFollowing();
    }
    setLoading(false);
  }, [activeTab]);

  const handleUnfollow = async (followerId, followingId) => {
    try {
      await axios.delete(`http://localhost:3500/follow/${followerId}/${followingId}`);
      if (activeTab === 'followers') {
        fetchFollowers();
      } else {
        fetchFollowing();
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const renderList = (list, isFollowers) => {
    return (
      <ul>
        { 
        list
          .filter((user) => user.id != userId)
          .map((user) => (
            <li key={user.id} className="follow-item">
              <img
                src={`http://localhost:3500/uploads/profilepics/${user.image}`}
                alt={`${user.username}'s avatar`}
                className="user-avatar"
              />
              <span>{user.username}</span>
              <button
                onClick={() =>
                  handleUnfollow(isFollowers ? user.id : userId, isFollowers ? userId : user.id)
                }
                className="unfollow-btn"
              >
                Unfollow
              </button>
            </li>
          ))}
      </ul>
    );
  };

  return (
    <div className="follow-page">
      <div className="tab-switcher">
        <button
          className={activeTab === 'followers' ? 'active' : ''}
          onClick={() => setActiveTab('followers')}
        >
          Followers
        </button>
        <button
          className={activeTab === 'following' ? 'active' : ''}
          onClick={() => setActiveTab('following')}
        >
          Following
        </button>
      </div>

      <div className="tab-content">
        {loading ? (
          <p>Loading...</p>
        ) : activeTab === 'followers' ? (
          renderList(followers, true)
        ) : (
          renderList(following, false)
        )}
      </div>
    </div>
  );
};

export default Follows;
