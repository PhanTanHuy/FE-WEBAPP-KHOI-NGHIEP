import { useState, useEffect } from 'react';
import {
  ShieldCheck, Check, X, Clock3, AlertCircle, Search,
  GraduationCap, Mail, Phone, MapPin, FileText, ExternalLink,
  ChevronRight, RefreshCw, Award
} from 'lucide-react';
import {
  getAdminTutorApplications,
  approveTutorApplication,
  rejectTutorApplication
} from '../api/tutorApplication';
import { useAuth } from '../context/AuthContext';
import './AdminTutorApplicationsPage.css';

export default function AdminTutorApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // all, pending, approved, rejected
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getAdminTutorApplications('all');
      setApplications(data || []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách hồ sơ:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn phê duyệt hồ sơ gia sư này?')) return;
    try {
      setActionLoading(id);
      const updated = await approveTutorApplication(id);
      setApplications(prev => prev.map(a => a.id === id ? updated : a));
    } catch (err) {
      alert(err.message || 'Không thể duyệt hồ sơ');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt(
      'Nhập lý do từ chối hồ sơ:',
      'Bằng cấp/chứng chỉ chưa rõ ràng hoặc thông tin cần bổ sung thêm.'
    );
    if (reason === null) return;

    try {
      setActionLoading(id);
      const updated = await rejectTutorApplication(id, reason);
      setApplications(prev => prev.map(a => a.id === id ? updated : a));
    } catch (err) {
      alert(err.message || 'Không thể từ chối hồ sơ');
    } finally {
      setActionLoading(null);
    }
  };

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const filteredApps = applications.filter(app => {
    const matchesTab = activeTab === 'all' || app.status === activeTab;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || (
      app.fullName?.toLowerCase().includes(q) ||
      app.email?.toLowerCase().includes(q) ||
      app.subjects?.some(s => s.toLowerCase().includes(q))
    );
    return matchesTab && matchesQuery;
  });

  return (
    <div className="admin-apps-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <h1>
            <ShieldCheck size={32} color="#2563EB" />
            Hệ thống Quản trị — Phê duyệt Hồ sơ Gia sư
          </h1>
          <p>Xem xét, kiểm tra chứng chỉ bằng cấp và kích hoạt hồ sơ gia sư trên toàn hệ thống EduConnect.</p>
        </div>

        {/* Stats */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-info">
              <span>Chờ duyệt</span>
              <strong>{counts.pending}</strong>
            </div>
            <div className="admin-stat-icon pending">
              <Clock3 size={24} />
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-info">
              <span>Đã phê duyệt</span>
              <strong>{counts.approved}</strong>
            </div>
            <div className="admin-stat-icon approved">
              <Check size={24} />
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-info">
              <span>Từ chối</span>
              <strong>{counts.rejected}</strong>
            </div>
            <div className="admin-stat-icon rejected">
              <X size={24} />
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-info">
              <span>Tổng số</span>
              <strong>{counts.all}</strong>
            </div>
            <div className="admin-stat-icon total">
              <GraduationCap size={24} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="admin-controls">
          <div className="admin-tabs">
            <button
              className={`admin-tab ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Chờ duyệt ({counts.pending})
            </button>
            <button
              className={`admin-tab ${activeTab === 'approved' ? 'active' : ''}`}
              onClick={() => setActiveTab('approved')}
            >
              Đã duyệt ({counts.approved})
            </button>
            <button
              className={`admin-tab ${activeTab === 'rejected' ? 'active' : ''}`}
              onClick={() => setActiveTab('rejected')}
            >
              Bị từ chối ({counts.rejected})
            </button>
            <button
              className={`admin-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Tất cả ({counts.all})
            </button>
          </div>

          <div className="admin-search-box">
            <Search size={18} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Tìm theo tên, email, môn dạy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="empty-state">
            <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 12px' }} />
            <p>Đang tải danh sách hồ sơ gia sư...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>Không có hồ sơ nào</h3>
            <p>Hiện không có hồ sơ gia sư nào phù hợp với bộ lọc này.</p>
          </div>
        ) : (
          <div className="admin-apps-list">
            {filteredApps.map((app) => (
              <div key={app.id} className="app-card">
                {/* Card Top */}
                <div className="app-card-top">
                  <div className="app-card-user">
                    <img
                      src={app.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.fullName || 'Tutor')}&background=random`}
                      alt={app.fullName}
                      className="app-card-avatar"
                    />
                    <div>
                      <h3 className="app-card-name">{app.fullName}</h3>
                      <div className="app-card-title">{app.title}</div>
                      <div className="app-card-contact">
                        <span><Mail size={14} /> {app.email}</span>
                        {app.phone && <span><Phone size={14} /> {app.phone}</span>}
                        {app.city && <span><MapPin size={14} /> {app.city} {app.districts?.length ? `(${app.districts.join(', ')})` : ''}</span>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className={`status-badge ${app.status}`}>
                      {app.status === 'pending' && <Clock3 size={14} />}
                      {app.status === 'approved' && <Check size={14} />}
                      {app.status === 'rejected' && <X size={14} />}
                      {app.status === 'draft' && <FileText size={14} />}
                      {app.status === 'pending' ? 'Chờ duyệt' : app.status === 'approved' ? 'Đã duyệt' : app.status === 'rejected' ? 'Đã từ chối' : 'Bản nháp'}
                    </span>
                  </div>
                </div>

                {/* Rejection Reason if any */}
                {app.status === 'rejected' && app.rejectionReason && (
                  <div className="rejection-box">
                    <strong>Lý do từ chối:</strong> {app.rejectionReason}
                  </div>
                )}

                {/* Card Body */}
                <div className="app-card-body">
                  {/* Bio */}
                  <div>
                    <div className="app-section-title">Giới thiệu bản thân</div>
                    <div className="app-intro">
                      {app.introduction || 'Chưa cập nhật giới thiệu'}
                    </div>
                  </div>

                  {/* Education & Certs */}
                  <div>
                    <div className="app-section-title">Học vấn & Bằng cấp</div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                      🎓 <strong>{app.educationLevel || 'Đại học'}</strong>: {app.major || 'Chuyên ngành'} {app.school ? `— ${app.school}` : ''} {app.year ? `(${app.year})` : ''}
                    </div>
                    {app.certificates?.length > 0 && (
                      <div style={{ fontSize: '13px', color: '#475569', marginBottom: '6px' }}>
                        📜 Chứng chỉ: {app.certificates.join(', ')}
                      </div>
                    )}
                    {app.certificateFile && (
                      <a
                        href={app.certificateFile}
                        target="_blank"
                        rel="noreferrer"
                        className="cert-file-link"
                      >
                        <FileText size={14} />
                        Xem tệp chứng chỉ đính kèm
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  {/* Subjects & Settings */}
                  <div>
                    <div className="app-section-title">Môn dạy & Hình thức</div>
                    <div style={{ marginBottom: '8px' }}>
                      <div className="app-tags">
                        {app.subjects?.map((sub, i) => (
                          <span key={i} className="app-tag subject">{sub}</span>
                        ))}
                        {app.grades?.map((gr, i) => (
                          <span key={i} className="app-tag grade">{gr}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#475569', marginTop: '8px' }}>
                      💵 Học phí: <strong>{app.minPrice?.toLocaleString('vi-VN')} đ/giờ</strong>
                      <br />
                      📍 Hình thức: <strong>{app.teachingMode === 'both' ? 'Online & Tại nhà' : app.teachingMode === 'online' ? 'Trực tuyến' : 'Tại nhà'}</strong>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="app-card-actions">
                  {app.status !== 'approved' && (
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(app.id)}
                      disabled={actionLoading === app.id}
                    >
                      <Check size={16} />
                      Phê duyệt hồ sơ
                    </button>
                  )}
                  {app.status !== 'rejected' && (
                    <button
                      className="btn-reject"
                      onClick={() => handleReject(app.id)}
                      disabled={actionLoading === app.id}
                    >
                      <X size={16} />
                      Từ chối
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
