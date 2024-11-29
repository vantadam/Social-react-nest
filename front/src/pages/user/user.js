import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from '../../components/post/post';
import { useParams } from 'react-router-dom';
import userdefault from '../../res/img/user.png';
import './user.css';

const User = () => {
    const { id: authorId } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const [follows, setFollows] = useState(false);
    const userId = localStorage.getItem('userId');
    const [isLoadingFollow, setIsLoadingFollow] = useState(false); 
    const [user, setUser] = useState({});



    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3500/user/${authorId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
                const checkFollowResponse = await axios.get(`http://localhost:3500/follow/check/${userId}/${authorId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFollows(checkFollowResponse.data); 
            } catch (error) {
                console.error('Error fetching user:', error);
            }

        };

        const fetchUserPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:3500/posts/author/${authorId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });


                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
        fetchUserPosts();

    }, [authorId, token, userId]);

    const handleFollowToggle = async () => {
        try {
            setIsLoadingFollow(true); 
            if (follows) {
                
                await axios.delete(`http://localhost:3500/follow/${userId}/${authorId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFollows(false);
            } else {
               
                await axios.post(`http://localhost:3500/follow/${userId}/${authorId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFollows(true);
            }
        } catch (error) {
            console.error('Error toggling follow status:', error);
        } finally {
            setIsLoadingFollow(false); 
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="user-page-container">
            <div className='userinfo'>
                <img 
                    src={user?.image ? `http://localhost:3500/uploads/profilepics/${user.image}` : userdefault} 
                    alt="Profile" 
                    className='profile-pic' 
                />
                <h2>{user.username}</h2>
               {userId!=authorId ?  <button 
                    className={`follow-button ${follows ? 'unfollow' : 'follow'}`} 
                    onClick={handleFollowToggle} 
                    disabled={isLoadingFollow} 
                >
                    {isLoadingFollow ? (follows ? 'Unfollowing...' : 'Following...') : (follows ? 'Unfollow' : 'Follow')}
                </button> : null}
                
            </div>
            <div className="posts-list">
                {posts.map((post) => (
                    <Post
                        key={post.id}
                        username={user.username}
                        content={post.content}
                        createdAt={post.createdAt}
                        profilePic={user.image}
                        authorId={post.authorId}
                        postId={post.id}
                        
                    />
                ))}
            </div>
        </div>
    );
};

export default User;
