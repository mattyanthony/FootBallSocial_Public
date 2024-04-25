import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-title">Football Social</div>
        <nav className="header-nav">
          <Link to="/">Home</Link>
          <Link to="/create-post">Create Post</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
