import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userdefault from '../../res/img/user.png';
import './searchbar.css';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (searchTerm === '') {
            setResults([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3500/user/search/${searchTerm}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const data = await response.json();
                console.log(data);
                setResults(data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
            setLoading(false);
        }, 300); 

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setShowResults(false);
        }, 200);
      

    };

    const handleFocus = () => {
        setShowResults(true);
    };

    return (
        <div className="search-bar-container" onBlur={handleBlur}>
            <input
                type="text"
                placeholder="Search for users..."
                value={searchTerm}
                onChange={handleInputChange}
                
                onFocus={handleFocus}
                className="search-input"
            />
            {loading && <div className="loading-text">Searching...</div>}
            {showResults && results.length > 0 && (
                <div className="results-container">
                    {results.map((user) => (
                        <Link to={`/user/${user.id}`} className="result-item" key={user.id}>
                            <img src={user.image ? `http://localhost:3500/uploads/profilepics/${user.image}` : userdefault} alt={user.username} className="user-image" />
                            <span>{user.username}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
