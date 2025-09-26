import React, { useState, useEffect } from 'react';
import { companyService } from '../services/authService';
import './DataList.css';

const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyService.getAllCompanies();
      setCompanies(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách công ty. Vui lòng thử lại.');
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewCompany = (company) => {
    setSelectedCompany(company);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditCompany = (company) => {
    setSelectedCompany({ ...company });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công ty này?')) {
      try {
        await companyService.deleteCompany(companyId);
        setCompanies(companies.filter(company => company.id !== companyId));
        alert('Xóa công ty thành công!');
      } catch (err) {
        alert('Không thể xóa công ty. Vui lòng thử lại.');
        console.error('Error deleting company:', err);
      }
    }
  };

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    try {
      if (selectedCompany.id) {
        // Update existing company
        await companyService.updateCompany(selectedCompany.id, selectedCompany);
        setCompanies(companies.map(company => 
          company.id === selectedCompany.id ? selectedCompany : company
        ));
        alert('Cập nhật công ty thành công!');
      } else {
        // Create new company
        const response = await companyService.createCompany(selectedCompany);
        setCompanies([...companies, response.data]);
        alert('Thêm công ty thành công!');
      }
      setShowModal(false);
      setSelectedCompany(null);
    } catch (err) {
      alert('Không thể lưu thông tin công ty. Vui lòng thử lại.');
      console.error('Error saving company:', err);
    }
  };

  const handleAddNewCompany = () => {
    setSelectedCompany({
      name: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      description: ''
    });
    setIsEditing(true);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải danh sách công ty...</p>
      </div>
    );
  }

  return (
    <div className="data-list-container">
      <div className="data-list-header">
        <h1>Danh sách Công ty</h1>
        <button onClick={handleAddNewCompany} className="add-button">
          + Thêm công ty mới
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchCompanies} className="retry-button">
            Thử lại
          </button>
        </div>
      )}

      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên công ty, email hoặc địa chỉ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="no-data">
          <p>Không có công ty nào được tìm thấy.</p>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên công ty</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Website</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.id}>
                  <td>{company.id}</td>
                  <td>{company.name}</td>
                  <td>{company.email}</td>
                  <td>{company.phone || 'N/A'}</td>
                  <td>{company.address || 'N/A'}</td>
                  <td>
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        {company.website}
                      </a>
                    ) : 'N/A'}
                  </td>
                  <td>{new Date(company.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleViewCompany(company)}
                        className="view-button"
                        title="Xem chi tiết"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleEditCompany(company)}
                        className="edit-button"
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteCompany(company.id)}
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

      {/* Modal for viewing/editing company */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {isEditing 
                  ? (selectedCompany.id ? 'Chỉnh sửa công ty' : 'Thêm công ty mới')
                  : 'Chi tiết công ty'
                }
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Tên công ty:</label>
                  <input
                    type="text"
                    value={selectedCompany.name}
                    onChange={(e) => setSelectedCompany({
                      ...selectedCompany,
                      name: e.target.value
                    })}
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={selectedCompany.email}
                    onChange={(e) => setSelectedCompany({
                      ...selectedCompany,
                      email: e.target.value
                    })}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Số điện thoại:</label>
                  <input
                    type="tel"
                    value={selectedCompany.phone || ''}
                    onChange={(e) => setSelectedCompany({
                      ...selectedCompany,
                      phone: e.target.value
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Website:</label>
                  <input
                    type="url"
                    value={selectedCompany.website || ''}
                    onChange={(e) => setSelectedCompany({
                      ...selectedCompany,
                      website: e.target.value
                    })}
                    disabled={!isEditing}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Địa chỉ:</label>
                <input
                  type="text"
                  value={selectedCompany.address || ''}
                  onChange={(e) => setSelectedCompany({
                    ...selectedCompany,
                    address: e.target.value
                  })}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Mô tả:</label>
                <textarea
                  value={selectedCompany.description || ''}
                  onChange={(e) => setSelectedCompany({
                    ...selectedCompany,
                    description: e.target.value
                  })}
                  disabled={!isEditing}
                  rows="4"
                  placeholder="Mô tả về công ty..."
                />
              </div>

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

export default CompaniesList;