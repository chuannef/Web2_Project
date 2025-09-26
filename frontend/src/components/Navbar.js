import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          OAuth2.0 System
        </Link>
        
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/users" className="navbar-item">
                Danh sách Users
              </Link>
              <Link to="/companies" className="navbar-item">
                Danh sách Companies
              </Link>
              <div className="navbar-user">
                <span>Xin chào, {user?.username || user?.email}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Đăng xuất
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-item">
                Đăng nhập
              </Link>
              <Link to="/register" className="navbar-item">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;