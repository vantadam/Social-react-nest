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

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:3500/posts/author/${authorId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const postsWithAuthors = await Promise.all(
                    response.data.map(async (post) => {
                        const authorResponse = await axios.get(`http://localhost:3500/user/${post.authorId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        return {
                            ...post,
                            authorUsername: authorResponse.data.username,
                            profilePic: authorResponse.data.image,
                        };
                    })
                );

      
                const checkFollowResponse = await axios.get(`http://localhost:3500/follow/check/${userId}/${authorId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFollows(checkFollowResponse.data); 

                setPosts(postsWithAuthors);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

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
                    src={posts[0]?.profilePic ? `http://localhost:3500/uploads/profilepics/${posts[0].profilePic}` : userdefault} 
                    alt="Profile" 
                    className='profile-pic' 
                />
                <h2>{posts[0]?.authorUsername}</h2>
                <button 
                    className={`follow-button ${follows ? 'unfollow' : 'follow'}`} 
                    onClick={handleFollowToggle} 
                    disabled={isLoadingFollow} // Disable the button while loading
                >
                    {isLoadingFollow ? (follows ? 'Unfollowing...' : 'Following...') : (follows ? 'Unfollow' : 'Follow')}
                </button>
            </div>
            <div className="posts-list">
                {posts.map((post) => (
                    <Post
                        key={post.id}
                        username={post.authorUsername}
                        content={post.content}
                        createdAt={post.createdAt}
                        profilePic={post.profilePic}
                        authorId={post.authorId}
                    />
                ))}
            </div>
        </div>
    );
};

export default User;
