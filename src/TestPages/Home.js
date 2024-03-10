import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <div className="header">
        <div className="logo">Welcome Home</div>
      </div>
      <div className="content">
        <div className="welcome-message">Welcome to Matthew's Page!</div>
        <div className="description">
          <p>This is a simple welcome page with CSS styles inspired by Google's design.</p>
          <p><Link to='/About'>Try Clicking on This</Link></p>
          <p>Feel free to explore and enjoy your stay!</p>
        </div>
      </div>
      <div className="footer">
        <p>&copy; 2024 Welcome Home Page. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Home;