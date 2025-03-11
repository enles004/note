import React, { useEffect, useState } from 'react';
import '../static/search.css';

const Search = ({ onSearch, placeholder }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        if (onSearch) {
            onSearch(term);
        }
    };
    

    return (
        <div className="search-container">
            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleInputChange}
            />
            <img src='../../../static/images/search.png' />
        </div>
    );
};

export default Search;
