import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from '../../components/post/post';
import { useParams } from 'react-router-dom';
import './user.css';

const User = () => {
    const { id: authorId } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

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
          
                  setPosts(postsWithAuthors);
                } catch (error) {
                  console.error('Error fetching posts:', error);
                } finally {
                  setLoading(false);
                }
              };
          
             
        

        fetchUserPosts();
    }, [authorId, token]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="user-page-container">
            <h2>{posts[0].authorUsername}</h2>
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
