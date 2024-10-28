import React from 'react';
import './post.css';

const Post = ({ username, content, createdAt }) => {
    const timeAgo = (createdDate) => {
        const now = Date.now();
        const postDate = new Date(createdDate);
        const postDateLocal = postDate.getTime();

        if (isNaN(postDateLocal) || postDateLocal > now) {
            return "just now";
        }

        const difference = now - postDateLocal - 3600000;

        const minutes = Math.floor(difference / (1000 * 60));
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));

        if (minutes < 1) {
            return "just now";
        } else if (minutes < 60) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (hours < 24) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
    };

    return (
        <div className="post">
            <div className="post-header">
                <h3 className="post-author">{username}</h3>
                <span className="post-date">{timeAgo(createdAt)}</span>
            </div>
            <p className="post-content">{content}</p>
        </div>
    );
};

export default Post;
