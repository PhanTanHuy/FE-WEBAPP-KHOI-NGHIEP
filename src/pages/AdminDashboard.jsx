import React, { useEffect, useState } from 'react';

import {
  Users,
  FileText,
  CheckSquare,
  Activity,
  Shield,
  MessageSquare,
  Eye,
  X,
  Star,
  RefreshCw
} from 'lucide-react';

import {
  getFeedbackList,
  getFeedbackDetail
} from '../api/feedback';

import './AdminDashboard.css';


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  // =========================
  // FEEDBACK STATE
  // =========================

  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackTotal, setFeedbackTotal] = useState(0);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);


  // =========================
  // LOAD FEEDBACK
  // =========================

  const loadFeedbacks = async () => {
    try {
      setFeedbackLoading(true);
      setFeedbackError('');

      const data = await getFeedbackList(0, 100);

      /*
       * Backend mới:
       *
       * {
       *   items: [...],
       *   total: 10
       * }
       *
       * Nhưng nếu backend hiện tại vẫn trả trực tiếp
       * array thì vẫn hỗ trợ.
       */

      if (Array.isArray(data)) {
        setFeedbacks(data);
        setFeedbackTotal(data.length);
      } else {
        setFeedbacks(data?.items || []);
        setFeedbackTotal(data?.total || 0);
      }

    } catch (error) {
      console.error('Lỗi khi lấy feedback:', error);

      setFeedbackError(
        error?.message ||
        'Không thể tải danh sách feedback.'
      );

    } finally {
      setFeedbackLoading(false);
    }
  };


  // =========================
  // LOAD DETAIL
  // =========================

  const handleViewFeedback = async (feedbackId) => {
    try {
      setDetailLoading(true);

      const data = await getFeedbackDetail(feedbackId);

      setSelectedFeedback(data);

    } catch (error) {
      console.error('Lỗi khi lấy chi tiết feedback:', error);

      alert(
        error?.message ||
        'Không thể tải chi tiết feedback.'
      );

    } finally {
      setDetailLoading(false);
    }
  };


  // =========================
  // LOAD WHEN OPEN FEEDBACK TAB
  // =========================

  useEffect(() => {
    if (activeTab === 'feedback') {
      loadFeedbacks();
    }
  }, [activeTab]);


  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) return '-';

    return new Date(date).toLocaleString('vi-VN');
  };


  // =========================
  // ROLE LABEL
  // =========================

  const getRoleLabel = (role) => {
    const roles = {
      student: 'Học sinh',
      parent: 'Phụ huynh',
      tutor: 'Gia sư',
      admin: 'Admin'
    };

    return roles[role] || role || '-';
  };


  // =========================
  // RATING
  // =========================

  const renderRating = (value) => {
    if (!value) {
      return (
        <span className="feedback-no-rating">
          Chưa đánh giá
        </span>
      );
    }

    return (
      <div className="feedback-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={15}
            fill={star <= value ? 'currentColor' : 'none'}
          />
        ))}

        <span>{value}/5</span>
      </div>
    );
  };


  return (
    <div className="admin-container">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="admin-sidebar">

        <div className="admin-logo">
          <Shield
            size={24}
            className="text-indigo-500 mr-2"
          />

          <span>EduConnect Admin</span>
        </div>


        <nav className="admin-nav">

          {/* USERS */}

          <button
            className={`admin-nav-item ${
              activeTab === 'users' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />

            <span>User Management</span>
          </button>


          {/* MATERIALS */}

          <button
            className={`admin-nav-item ${
              activeTab === 'materials' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('materials')}
          >
            <FileText size={18} />

            <span>Materials Approval</span>
          </button>


          {/* APPLICATIONS */}

          <button
            className={`admin-nav-item ${
              activeTab === 'applications' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('applications')}
          >
            <CheckSquare size={18} />

            <span>Tutor Applications</span>
          </button>


          {/* FEEDBACK */}

          <button
            className={`admin-nav-item ${
              activeTab === 'feedback' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('feedback')}
          >
            <MessageSquare size={18} />

            <span>User Feedback</span>
          </button>


          {/* LOGS */}

          <button
            className={`admin-nav-item ${
              activeTab === 'logs' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('logs')}
          >
            <Activity size={18} />

            <span>Audit Logs</span>
          </button>

        </nav>

      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="admin-main">

        {/* TOP BAR */}

        <header className="admin-topbar">

          <h2>
            {activeTab === 'users' && 'User Management'}

            {activeTab === 'materials' &&
              'Material Approvals'}

            {activeTab === 'applications' &&
              'Tutor Applications'}

            {activeTab === 'feedback' &&
              'User Feedback'}

            {activeTab === 'logs' &&
              'System Audit Logs'}
          </h2>


          <div className="admin-profile">

            <div className="avatar">
              AD
            </div>

            <span>Super Admin</span>

          </div>

        </header>


        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="admin-content">


          {/* =================================================
              USERS
          ================================================= */}

          {activeTab === 'users' && (

            <div className="admin-card">

              <div className="table-responsive">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>


                  <tbody>

                    <tr>
                      <td>1</td>

                      <td>
                        Nguyen Van A
                      </td>

                      <td>
                        vana@example.com
                      </td>

                      <td>
                        <span className="role-badge tutor">
                          Tutor
                        </span>
                      </td>

                      <td>
                        <button className="btn-sm text-blue-600">
                          Edit Role
                        </button>
                      </td>
                    </tr>


                    <tr>
                      <td>2</td>

                      <td>
                        Le Thi B
                      </td>

                      <td>
                        thib@example.com
                      </td>

                      <td>
                        <span className="role-badge parent">
                          Parent
                        </span>
                      </td>

                      <td>
                        <button className="btn-sm text-blue-600">
                          Edit Role
                        </button>
                      </td>
                    </tr>

                  </tbody>

                </table>

              </div>

            </div>

          )}


          {/* =================================================
              MATERIALS
          ================================================= */}

          {activeTab === 'materials' && (

            <div className="admin-card">

              <p className="text-gray-500">
                Showing pending materials requiring approval...
              </p>

              <div className="material-item">

                <div className="material-info">

                  <h4>
                    Toán 12 - Đề cương ôn tập HK1
                  </h4>

                  <p>
                    Uploaded by: Tutor Nguyen Van A
                  </p>

                </div>


                <div className="material-actions">

                  <button className="btn-sm btn-success">
                    Approve
                  </button>

                  <button className="btn-sm btn-danger">
                    Reject
                  </button>

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              APPLICATIONS
          ================================================= */}

          {activeTab === 'applications' && (

            <div className="admin-card">

              <p className="text-gray-500">
                Showing pending tutor applications...
              </p>

              <div className="application-item">

                <div className="app-info">

                  <h4>
                    Tran Van C
                  </h4>

                  <p>
                    Subject: Math | Experience: 5 years
                  </p>

                </div>


                <div className="app-actions">

                  <button className="btn-sm btn-primary">
                    Review Docs
                  </button>

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              FEEDBACK
          ================================================= */}

          {activeTab === 'feedback' && (

            <div className="admin-card feedback-admin-card">

              {/* HEADER */}

              <div className="feedback-admin-header">

                <div>

                  <h3>
                    Feedback người dùng
                  </h3>

                  <p>
                    Tổng số phản hồi: <strong>
                      {feedbackTotal}
                    </strong>
                  </p>

                </div>


                <button
                  className="feedback-refresh-btn"
                  onClick={loadFeedbacks}
                  disabled={feedbackLoading}
                >
                  <RefreshCw
                    size={16}
                    className={
                      feedbackLoading
                        ? 'spin'
                        : ''
                    }
                  />

                  Làm mới
                </button>

              </div>


              {/* ERROR */}

              {feedbackError && (

                <div className="feedback-admin-error">

                  {feedbackError}

                </div>

              )}


              {/* LOADING */}

              {feedbackLoading ? (

                <div className="feedback-admin-loading">

                  <RefreshCw
                    size={24}
                    className="spin"
                  />

                  <span>
                    Đang tải feedback...
                  </span>

                </div>

              ) : feedbacks.length === 0 ? (

                <div className="feedback-empty">

                  <MessageSquare size={40} />

                  <h4>
                    Chưa có feedback
                  </h4>

                  <p>
                    Hiện tại chưa có người dùng nào gửi góp ý.
                  </p>

                </div>

              ) : (

                <div className="table-responsive">

                  <table className="admin-table feedback-table">

                    <thead>

                      <tr>

                        <th>ID</th>

                        <th>Vai trò</th>

                        <th>Nguồn</th>

                        <th>Mục đích</th>

                        <th>Dễ sử dụng</th>

                        <th>Mức độ tin tưởng</th>

                        <th>Liên hệ</th>

                        <th>Thời gian</th>

                        <th></th>

                      </tr>

                    </thead>


                    <tbody>

                      {feedbacks.map((feedback) => (

                        <tr key={feedback.id}>

                          {/* ID */}

                          <td>
                            <strong>
                              #{feedback.id}
                            </strong>
                          </td>


                          {/* ROLE */}

                          <td>

                            <span
                              className={`feedback-role ${feedback.role}`}
                            >
                              {getRoleLabel(
                                feedback.role
                              )}
                            </span>

                          </td>


                          {/* SOURCE */}

                          <td>
                            {feedback.source || '-'}
                          </td>


                          {/* PURPOSE */}

                          <td>
                            {feedback.purpose || '-'}
                          </td>


                          {/* EASE OF USE */}

                          <td>
                            {renderRating(
                              feedback.ease_of_use
                            )}
                          </td>


                          {/* TRUST */}

                          <td>
                            {renderRating(
                              feedback.trust_level
                            )}
                          </td>


                          {/* CONTACT */}

                          <td>

                            {feedback.contact_requested ? (

                              <span className="contact-yes">
                                Có
                              </span>

                            ) : (

                              <span className="contact-no">
                                Không
                              </span>

                            )}

                          </td>


                          {/* DATE */}

                          <td className="feedback-date">

                            {formatDate(
                              feedback.created_at
                            )}

                          </td>


                          {/* DETAIL */}

                          <td>

                            <button
                              className="feedback-view-btn"
                              onClick={() =>
                                handleViewFeedback(
                                  feedback.id
                                )
                              }
                            >

                              <Eye size={16} />

                              Xem

                            </button>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          )}


          {/* =================================================
              LOGS
          ================================================= */}

          {activeTab === 'logs' && (

            <div className="admin-card">

              <ul className="audit-list">

                <li>

                  <span className="time">
                    10:45 AM
                  </span>

                  <span className="action">
                    Admin approved material #102
                  </span>

                </li>


                <li>

                  <span className="time">
                    09:12 AM
                  </span>

                  <span className="action">
                    User role updated for ID 45
                  </span>

                </li>

              </ul>

            </div>

          )}

        </div>

      </main>


      {/* =====================================================
          FEEDBACK DETAIL MODAL
      ===================================================== */}

      {selectedFeedback && (

        <div
          className="feedback-modal-overlay"
          onClick={() => setSelectedFeedback(null)}
        >

          <div
            className="feedback-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="feedback-modal-header">

              <div>

                <h3>
                  Chi tiết Feedback #{selectedFeedback.id}
                </h3>

                <p>
                  {formatDate(
                    selectedFeedback.created_at
                  )}
                </p>

              </div>


              <button
                className="feedback-modal-close"
                onClick={() =>
                  setSelectedFeedback(null)
                }
              >
                <X size={20} />
              </button>

            </div>


            {/* LOADING */}

            {detailLoading ? (

              <div className="feedback-detail-loading">

                <RefreshCw
                  size={24}
                  className="spin"
                />

                Đang tải...

              </div>

            ) : (

              <div className="feedback-detail">

                {/* GENERAL */}

                <section className="feedback-detail-section">

                  <h4>
                    Thông tin chung
                  </h4>


                  <div className="feedback-detail-grid">

                    <div>

                      <span className="detail-label">
                        Vai trò
                      </span>

                      <strong>
                        {getRoleLabel(
                          selectedFeedback.role
                        )}
                      </strong>

                    </div>


                    <div>

                      <span className="detail-label">
                        Nguồn biết đến
                      </span>

                      <strong>
                        {selectedFeedback.source || '-'}
                      </strong>

                    </div>


                    <div>

                      <span className="detail-label">
                        Mục đích sử dụng
                      </span>

                      <strong>
                        {selectedFeedback.purpose || '-'}
                      </strong>

                    </div>


                    <div>

                      <span className="detail-label">
                        Tìm được thông tin
                      </span>

                      <strong>
                        {selectedFeedback.found_information || '-'}
                      </strong>

                    </div>

                  </div>

                </section>


                {/* RATINGS */}

                <section className="feedback-detail-section">

                  <h4>
                    Đánh giá
                  </h4>


                  <div className="feedback-rating-grid">

                    <div className="rating-box">

                      <span>
                        Mức độ dễ sử dụng
                      </span>

                      {renderRating(
                        selectedFeedback.ease_of_use
                      )}

                    </div>


                    <div className="rating-box">

                      <span>
                        Mức độ tin tưởng
                      </span>

                      {renderRating(
                        selectedFeedback.trust_level
                      )}

                    </div>

                  </div>

                </section>


                {/* TUTOR */}

                <section className="feedback-detail-section">

                  <h4>
                    Nhu cầu gia sư
                  </h4>


                  <div className="feedback-detail-grid">

                    <div>

                      <span className="detail-label">
                        Tiêu chí ưu tiên
                      </span>

                      <strong>
                        {selectedFeedback.tutor_priority || '-'}
                      </strong>

                    </div>


                    <div>

                      <span className="detail-label">
                        Khoảng giá
                      </span>

                      <strong>
                        {selectedFeedback.price_range || '-'}
                      </strong>

                    </div>


                    <div>

                      <span className="detail-label">
                        Ý định sử dụng
                      </span>

                      <strong>
                        {selectedFeedback.usage_intention || '-'}
                      </strong>

                    </div>

                  </div>

                </section>


                {/* DIFFICULTY */}

                <section className="feedback-detail-section">

                  <h4>
                    Khó khăn gặp phải
                  </h4>

                  <p className="feedback-text">
                    {selectedFeedback.difficulty || 'Không có'}
                  </p>

                </section>


                {/* DESIRED FEATURES */}

                <section className="feedback-detail-section">

                  <h4>
                    Tính năng mong muốn
                  </h4>

                  <p className="feedback-text">
                    {selectedFeedback.desired_features || 'Không có'}
                  </p>

                </section>


                {/* CONTACT */}

                <section className="feedback-detail-section">

                  <h4>
                    Liên hệ
                  </h4>

                  <p className="feedback-text">

                    {selectedFeedback.contact_requested
                      ? `Người dùng đồng ý liên hệ${
                          selectedFeedback.contact_value
                            ? `: ${selectedFeedback.contact_value}`
                            : ''
                        }`
                      : 'Người dùng không yêu cầu liên hệ'}

                  </p>

                </section>


                {/* RAW ANSWERS */}

                {selectedFeedback.answers &&
                  Object.keys(
                    selectedFeedback.answers
                  ).length > 0 && (

                    <section className="feedback-detail-section">

                      <h4>
                        Dữ liệu khảo sát bổ sung
                      </h4>

                      <pre className="feedback-json">
                        {JSON.stringify(
                          selectedFeedback.answers,
                          null,
                          2
                        )}
                      </pre>

                    </section>

                  )}

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminDashboard;