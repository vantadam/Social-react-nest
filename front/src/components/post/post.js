import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import './post.css';
import userdefault from '../../res/img/user.png';

const Post = ({ postId, username, content, createdAt, profilePic, authorId, onPostUpdated }) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

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
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: editedContent })
            });

            if (response.ok) {
                setIsEditing(false);
                onPostUpdated(); // Refresh the posts after editing
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
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    onPostUpdated(); // Refresh the posts after deletion
                } else {
                    console.error("Failed to delete the post");
                }
            } catch (error) {
                console.error("Error deleting the post:", error);
            }
        }
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

    return (
        <div className="post">
            <div className="post-header">
                <div className="post-author-info" onClick={handleUserClick} style={{ cursor: 'pointer' }}>
                    <img 
                        className='post-profile-pic' 
                        src={profilePic ? `http://localhost:3500/uploads/profilepics/${profilePic}` : userdefault} 
                        alt="Profile" 
                    />
                    <div className="post-author-details">
                        <h3 className="post-author">{username}</h3>
                        <span className="post-date">{timeAgo(createdAt)}</span>
                    </div>
                </div>
                
                {userId == authorId && (
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
                )}
            </div>
            {isEditing ? (
                <textarea
                    className="post-content-edit"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                />
            ) : (
                <p className="post-content">{content}</p>
            )}
        </div>
    );
};

export default Post;
