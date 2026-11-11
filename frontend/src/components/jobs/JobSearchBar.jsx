import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';

const JobSearchBar = ({ initialKeyword = '', initialLocation = '', onSearch }) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ q: keyword, location });
    } else {
      const params = new URLSearchParams();
      if (keyword.trim()) params.append('q', keyword.trim());
      if (location.trim()) params.append('location', location.trim());
      navigate(`/jobs${params.toString() ? `?${params.toString()}` : ''}`);
    }
  };

  return (
    <form className="job-search-box" onSubmit={handleSubmit}>
      <div className="search-input-field">
        <Search size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Job title, keywords, or skills"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          aria-label="Search job title or keywords"
        />
      </div>

      <div className="search-input-field search-location">
        <MapPin size={18} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Location (e.g. Remote, Mumbai)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          aria-label="Location"
        />
      </div>

      <button type="submit" className="btn btn-primary btn-search-submit">
        Search Jobs
      </button>
    </form>
  );
};

export default JobSearchBar;
