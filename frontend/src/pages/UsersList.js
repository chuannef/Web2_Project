import React, { useState, useEffect } from 'react';
import { userService } from '../services/authService';
import './DataList.css';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser({ ...user });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await userService.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        alert('Xóa người dùng thành công!');
      } catch (err) {
        alert('Không thể xóa người dùng. Vui lòng thử lại.');
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser.id) {
        // Update existing user
        await userService.updateUser(selectedUser.id, selectedUser);
        setUsers(users.map(user => 
          user.id === selectedUser.id ? selectedUser : user
        ));
        alert('Cập nhật người dùng thành công!');
      } else {
        // Create new user
        const response = await userService.createUser(selectedUser);
        setUsers([...users, response.data]);
        alert('Thêm người dùng thành công!');
      }
      setShowModal(false);
      setSelectedUser(null);
    } catch (err) {
      alert('Không thể lưu thông tin người dùng. Vui lòng thử lại.');
      console.error('Error saving user:', err);
    }
  };

  const handleAddNewUser = () => {
    setSelectedUser({
      username: '',
      email: '',
      fullName: '',
      phone: '',
      password: ''
    });
    setIsEditing(true);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải danh sách người dùng...</p>
      </div>
    );
  }

  return (
    <div className="data-list-container">
      <div className="data-list-header">
        <h1>Danh sách Người dùng</h1>
        <button onClick={handleAddNewUser} className="add-button">
          + Thêm người dùng mới
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchUsers} className="retry-button">
            Thử lại
          </button>
        </div>
      )}

      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email hoặc username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="no-data">
          <p>Không có người dùng nào được tìm thấy.</p>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Họ tên</th>
                <th>Số điện thoại</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.fullName}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="view-button"
                        title="Xem chi tiết"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="edit-button"
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="delete-button"
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for viewing/editing user */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {isEditing 
                  ? (selectedUser.id ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới')
                  : 'Chi tiết người dùng'
                }
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Username:</label>
                  <input
                    type="text"
                    value={selectedUser.username}
                    onChange={(e) => setSelectedUser({
                      ...selectedUser,
                      username: e.target.value
                    })}
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({
                      ...selectedUser,
                      email: e.target.value
                    })}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Họ và tên:</label>
                <input
                  type="text"
                  value={selectedUser.fullName}
                  onChange={(e) => setSelectedUser({
                    ...selectedUser,
                    fullName: e.target.value
                  })}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại:</label>
                <input
                  type="tel"
                  value={selectedUser.phone || ''}
                  onChange={(e) => setSelectedUser({
                    ...selectedUser,
                    phone: e.target.value
                  })}
                  disabled={!isEditing}
                />
              </div>

              {isEditing && !selectedUser.id && (
                <div className="form-group">
                  <label>Mật khẩu:</label>
                  <input
                    type="password"
                    value={selectedUser.password || ''}
                    onChange={(e) => setSelectedUser({
                      ...selectedUser,
                      password: e.target.value
                    })}
                    required={!selectedUser.id}
                    placeholder="Nhập mật khẩu cho người dùng mới"
                  />
                </div>
              )}

              <div className="modal-actions">
                {isEditing ? (
                  <>
                    <button type="submit" className="save-button">
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="cancel-button"
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="close-button"
                  >
                    Đóng
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;