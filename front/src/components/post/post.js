import React from 'react';
import './post.css';
import userdefault from '../../res/img/user.png';

const Post = ({ username, content, createdAt, profilePic }) => {
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
                <div className="post-author-info">
                    <img 
                        className='profile-pic' 
                        src={profilePic ? `http://localhost:3500/uploads/profilepics/${profilePic}` : userdefault} 
                        alt="Profile" 
                    />
                    <div className="post-author-details">
                        <h3 className="post-author">{username}</h3>
                        <span className="post-date">{timeAgo(createdAt)}</span>
                    </div>
                </div>
            </div>
            <p className="post-content">{content}</p>
        </div>
    );
};

export default Post;
