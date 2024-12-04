import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSave, FaTimes, FaHeart, FaRegHeart } from 'react-icons/fa';
import './post.css';
import userdefault from '../../res/img/user.png';

const Post = ({ postId, username, content, createdAt, profilePic, authorId, onPostUpdated }) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const [isLiked, setIsLiked] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        checkIfLiked();
    }, [postId, userId]);

    const checkIfLiked = async () => {
        try {
            const response = await fetch(`http://localhost:3500/likes/${postId}/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setIsLiked(data);
            }
        } catch (error) {
            console.error("Error checking if post is liked:", error);
        }
    };

    const handleUserClick = () => {
        navigate(`/user/${authorId}`);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedContent(content);
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`http://localhost:3500/posts/${postId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content: editedContent }),
            });

            if (response.ok) {
                setIsEditing(false);
                onPostUpdated();
            } else {
                console.error("Failed to update the post");
            }
        } catch (error) {
            console.error("Error updating the post:", error);
        }
    };

    const handleDeleteClick = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                const response = await fetch(`http://localhost:3500/posts/${postId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    onPostUpdated();
                } else {
                    console.error("Failed to delete the post");
                }
            } catch (error) {
                console.error("Error deleting the post:", error);
            }
        }
    };

    const handleLikeClick = async () => {
        setIsAnimating(true);
        if (!isLiked) {
            try {
                const response = await fetch(`http://localhost:3500/likes/${postId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userId }),
                });

                if (response.ok) {
                    setIsLiked(!isLiked);
                } else {
                    console.error("Failed to like the post");
                }
            } catch (error) {
                console.error("Error liking/unliking the post:", error);
            }
        } else {
            try {
                const response = await fetch(`http://localhost:3500/likes/${postId}?userId=${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setIsLiked(!isLiked);
                } else {
                    console.error("Failed to unlike the post");
                }
            } catch (error) {
                console.error("Error liking/unliking the post:", error);
            }
        }
        setTimeout(() => setIsAnimating(false), 500);
    };

    const timeAgo = (createdDate) => {
        const now = Date.now();
        const postDate = new Date(createdDate).getTime();

        if (isNaN(postDate) || postDate > now) return "just now";

        const difference = now - postDate;
        const minutes = Math.floor(difference / (1000 * 60));
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));

        if (minutes < 1) return "just now";
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return `${days} day${days > 1 ? 's' : ''} ago`;
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:3500/comments/${postId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setComments(data);
                console.log(data);
            } else {
                console.error("Failed to fetch comments");
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleAddComment = async () => {
        if (newComment.trim() === '') return;

        try {
            const response = await fetch(`http://localhost:3500/comments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    postId: postId,
                    userId: userId,
                    text: newComment
                }),
            });

            if (response.ok) {
                setNewComment('');
                fetchComments();
            } else {
                console.error("Failed to add comment");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                const response = await fetch(`http://localhost:3500/comments/${commentId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    fetchComments();
                } else {
                    console.error("Failed to delete comment");
                }
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        }
    };

    const toggleComments = () => {
        setShowComments(!showComments);
        if (!showComments) fetchComments();
    };

    return (
        <div className="post">
            <div className="post-header">
                <div className="post-author-info" onClick={() => navigate(`/user/${authorId}`)} style={{ cursor: 'pointer' }}>
                    <img
                        className="post-profile-pic"
                        src={profilePic ? `http://localhost:3500/uploads/profilepics/${profilePic}` : userdefault}
                        alt="Profile"
                    />
                    <div className="post-author-details">
                        <h3 className="post-author">{username}</h3>
                        <span className="post-date">{timeAgo(createdAt)}</span>
                    </div>
                </div>
            {userId == authorId ? (
                <div className="post-actions">
                    {isEditing ? (
                        <>
                            <button className="save-button" onClick={handleSaveEdit}>
                                <FaSave /> 
                            </button>
                            <button className="cancel-button" onClick={handleCancelEdit}>
                                <FaTimes /> 
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="edit-button" onClick={handleEditClick}>
                                <FaEdit /> 
                            </button>
                            <button className="delete-button" onClick={handleDeleteClick}>
                                <FaTrash /> 
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="post-actions">
                    <button className={`like-button ${isAnimating ? 'animating' : ''}`} onClick={handleLikeClick}>
                        {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
                    </button>
                </div>
            )}

                
               
            </div>

            <div className="post-content">{isEditing ? <textarea className='editing-content' value={editedContent} onChange={(e) => setEditedContent(e.target.value)} /> : content}</div>

            <button className="toggle-comments" onClick={toggleComments}>
                {showComments ? 'Hide Comments' : 'View Comments'}
            </button>

            {showComments && (
                <div className="comments-section">
                    <ul className="comments-list">
                    {comments.map((comment) => (
    <li key={comment.id} className="comment-item">
        <div className="comment-content">
            <img
                src={`http://localhost:3500/uploads/profilepics/${comment.user.image}`}
                alt={`${comment.user.username}'s avatar`}
                className="comment-avatar"
            />
            <div className="comment-details">

                <div style={{display:'flex',direction:'row'}}>
                <strong>{comment.user.username}</strong> 
                    <div className="comment-meta">
                    <span>{timeAgo(comment.createdAt)}</span>
                </div></div>{comment.text}
                
            </div>
            
        </div>
        {(comment.user.id === Number(userId) || Number(userId) === authorId) && (
            <div className='post-actions'><button
            className="delete-comment delete-button"
            onClick={() => handleDeleteComment(comment.id)}
        >
            <FaTrash />
        </button></div>
            
        )}
    </li>
))}

                    </ul>
                    <div className="add-comment">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                        />
                        <button onClick={handleAddComment}>Post</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;
