
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from '../../components/post/post';
import { Helmet } from 'react-helmet';
import './home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState(''); 
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3500/posts', {
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

    fetchPosts();
  }, [token]);

  const handlePostSubmit = async () => {
    if (!newPostContent.trim()) return;

    try {
      const response = await axios.post(
        'http://localhost:3500/posts',
        {
          authorId: userId,
          content: newPostContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const authorResponse = await axios.get(`http://localhost:3500/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      const newPost = {
        ...response.data,
        authorUsername: authorResponse.data.username,
        profilePic: authorResponse.data.image,
        createdAt: new Date().toISOString(),
      };

      setPosts([newPost, ...posts]);
      setNewPostContent(''); 
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (loading) {
    return <div className="loading">
      <Helmet>
      <title>Loading</title>
    </Helmet>
      Loading...</div>;
  }

  return (
    <div className="home-container">
     <Helmet>
      <title>Home</title>
    </Helmet>
      <div className="new-post">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
          rows="4"
        ></textarea>
        <button onClick={handlePostSubmit} className="submit-post-btn">
          Post
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

export default Home;
