import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Hệ thống OAuth 2.0</h1>
          <p className="hero-description">
            Hệ thống quản lý người dùng và công ty với cơ chế xác thực OAuth 2.0 an toàn và hiện đại
          </p>
          
          {isAuthenticated ? (
            <div className="welcome-section">
              <h2>Chào mừng, {user?.fullName || user?.username}!</h2>
              <p>Bạn có thể truy cập các chức năng sau:</p>
              
              <div className="quick-links">
                <Link to="/users" className="quick-link">
                  👥 Quản lý Người dùng
                </Link>
                <Link to="/companies" className="quick-link">
                  🏢 Quản lý Công ty
                </Link>
              </div>
            </div>
          ) : (
            <div className="auth-section">
              <p>Vui lòng đăng nhập để sử dụng hệ thống</p>
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-primary">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Đăng ký
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;