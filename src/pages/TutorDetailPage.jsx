import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, MapPin, Clock, CheckCircle, BookOpen,
  Users, Award, ArrowLeft, Calendar, Heart, Share2,
  Video, Home, GraduationCap, MessageCircle, Loader2,
  Edit, Check, X
} from 'lucide-react';
import { getTutorById, getTutors, updateMyAvailability } from '../api/tutors';
import { useAuth } from '../context/AuthContext';
import './TutorDetailPage.css';

const DAYS_VI = { Mon: 'Thứ 2', Tue: 'Thứ 3', Wed: 'Thứ 4', Thu: 'Thứ 5', Fri: 'Thứ 6', Sat: 'Thứ 7', Sun: 'CN' };

export default function TutorDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [similarTutors, setSimilarTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [liked, setLiked] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    async function loadTutor() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTutorById(id);
        setTutor(data);

        // Fetch similar tutors
        const allTutorsData = await getTutors({ paginate: false });
        const allTutors = Array.isArray(allTutorsData) ? allTutorsData : (allTutorsData?.items || []);
        const filtered = allTutors
          .filter(t => t.id !== parseInt(id) && t.subjects.some(s => data.subjects.includes(s)))
          .slice(0, 3);
        setSimilarTutors(filtered);
      } catch (err) {
        console.error('Error fetching tutor detail:', err);
        setError('Không tìm thấy thông tin gia sư');
      } finally {
        setLoading(false);
      }
    }
    loadTutor();
    window.scrollTo(0, 0);
  }, [id]);

  const handleSaveAvailability = async (newSchedule) => {
    const res = await updateMyAvailability(newSchedule);
    setTutor(prev => ({ ...prev, schedule: res.schedule }));
    alert('Đã cập nhật lịch rảnh thành công!');
  };

  if (loading) {
    return (
      <div className="not-found" style={{ padding: '80px 0' }}>
        <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 16px', color: '#3B82F6' }} />
        <h2>Đang tải hồ sơ gia sư...</h2>
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="not-found">
        <h2>{error || 'Không tìm thấy gia sư'}</h2>
        <Link to="/tim-gia-su" className="btn btn-primary">Quay lại tìm gia sư</Link>
      </div>
    );
  }

  const renderStars = (rating, size = 16) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={size}
        fill={i < Math.floor(rating) ? '#F59E0B' : 'none'}
        color={i < Math.floor(rating) ? '#F59E0B' : '#D1D5DB'}
      />
    ));

  return (
    <div className="tutor-detail">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="breadcrumb">
            <button onClick={() => navigate(-1)} className="breadcrumb-back">
              <ArrowLeft size={16} /> Quay lại
            </button>
            <span className="breadcrumb-sep">/</span>
            <Link to="/tim-gia-su">Tìm gia sư</Link>
            <span className="breadcrumb-sep">/</span>
            <span>{tutor.name}</span>
          </div>
        </div>
      </div>

      <div className="container tutor-detail__grid">
        {/* Main */}
        <main className="tutor-detail__main">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-header__left">
              <div className="profile-avatar-wrap">
                <img
                  src={tutor.avatar}
                  alt={tutor.name}
                  className="profile-avatar"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=1E3A8A&color=fff&size=120`; }}
                />
                {tutor.verified && (
                  <div className="profile-verified">
                    <CheckCircle size={18} />
                  </div>
                )}
              </div>
              <div className="profile-info">
                <div className="profile-name-row">
                  <h1 className="profile-name">{tutor.name}</h1>
                  {tutor.verified && (
                    <span className="badge badge-verified">
                      <CheckCircle size={11} /> Đã xác minh
                    </span>
                  )}
                </div>
                <p className="profile-title">{tutor.title}</p>
                <div className="profile-rating">
                  <div className="stars-row">{renderStars(tutor.rating)}</div>
                  <span className="rating-score">{tutor.rating}</span>
                  <span className="rating-count">({tutor.reviewCount} đánh giá)</span>
                  <span className="rating-sep">•</span>
                  <span className="completed-count">{tutor.completedLessons} buổi dạy</span>
                </div>
                <div className="profile-tags">
                  <div className="profile-tag">
                    <MapPin size={14} /> {tutor.location}
                  </div>
                  <div className="profile-tag">
                    <Clock size={14} /> {tutor.experience} năm kinh nghiệm
                  </div>
                  <div className="profile-tag">
                    <Users size={14} /> {tutor.studentCount} học viên
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-header__actions">
              <button
                className={`action-icon-btn ${liked ? 'liked' : ''}`}
                onClick={() => setLiked(!liked)}
                title="Yêu thích"
              >
                <Heart size={20} fill={liked ? '#EF4444' : 'none'} />
              </button>
              <button className="action-icon-btn" title="Chia sẻ">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="detail-tabs">
            {[
              { id: 'info', label: 'Thông tin' },
              { id: 'schedule', label: 'Lịch dạy' },
              { id: 'reviews', label: `Đánh giá (${tutor.reviews?.length || 0})` },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`detail-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                id={`tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'info' && (
              <div className="tab-info">
                {/* About */}
                <section className="detail-section">
                  <h2 className="detail-section-title">Giới thiệu bản thân</h2>
                  <p className="detail-bio">{tutor.bio}</p>
                </section>

                {/* Subjects & Levels */}
                <section className="detail-section">
                  <h2 className="detail-section-title">Môn dạy & Cấp học</h2>
                  <div className="subjects-wrap">
                    <div>
                      <div className="wrap-label">Môn học</div>
                      <div className="tags-row">
                        {tutor.subjects.map(s => <span key={s} className="subject-tag">{s}</span>)}
                      </div>
                    </div>
                    <div>
                      <div className="wrap-label">Cấp học</div>
                      <div className="tags-row">
                        {tutor.levels.map(l => <span key={l} className="level-tag">{l}</span>)}
                      </div>
                    </div>
                    <div>
                      <div className="wrap-label">Hình thức</div>
                      <div className="tags-row">
                        {tutor.teachingMode.includes('online') && (
                          <span className="mode-badge mode-online"><Video size={12} /> Online</span>
                        )}
                        {tutor.teachingMode.includes('offline') && (
                          <span className="mode-badge mode-offline"><Home size={12} /> Tại nhà</span>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Education */}
                <section className="detail-section">
                  <h2 className="detail-section-title">Học vấn & Bằng cấp</h2>
                  <div className="education-list">
                    {(tutor.education || []).map((edu, i) => (
                      <div key={i} className="education-item">
                        <div className="edu-icon">
                          <GraduationCap size={18} />
                        </div>
                        <div>
                          <div className="edu-degree">{edu.degree} {edu.major}</div>
                          <div className="edu-school">{edu.school} {edu.year ? `• ${edu.year}` : ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {tutor.certifications?.length > 0 && (
                    <div className="certs">
                      <div className="certs-label">Chứng chỉ:</div>
                      <div className="tags-row">
                        {tutor.certifications.map(c => (
                          <span key={c} className="cert-tag">
                            <Award size={11} /> {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="tab-schedule">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 className="detail-section-title" style={{ margin: 0 }}>Lịch dạy trong tuần</h2>
                    <p className="schedule-note" style={{ margin: '4px 0 0' }}>Các khung giờ gia sư có thể dạy. Liên hệ để xác nhận lịch cụ thể.</p>
                  </div>
                  {user && (user.role === 'tutor' || user.role === 'admin' || user.full_name === tutor.name) && (
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => setShowScheduleModal(true)}
                    >
                      <Calendar size={15} /> Cập nhật lịch rảnh
                    </button>
                  )}
                </div>
                <div className="schedule-grid">
                  {Object.entries(DAYS_VI).map(([key, day]) => {
                    const slots = tutor.schedule?.[key] || [];
                    return (
                      <div key={key} className={`schedule-day ${slots.length > 0 ? 'has-slots' : ''}`}>
                        <div className="schedule-day-name">{day}</div>
                        {slots.length > 0 ? (
                          <div className="schedule-slots">
                            {slots.map(slot => (
                              <div key={slot} className="schedule-slot">{slot}</div>
                            ))}
                          </div>
                        ) : (
                          <div className="schedule-empty">Không có</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-reviews">
                {/* Summary */}
                <div className="reviews-summary">
                  <div className="rating-big">{tutor.rating}</div>
                  <div>
                    <div className="stars-row">{renderStars(tutor.rating, 22)}</div>
                    <div className="rating-total">Dựa trên {tutor.reviewCount} đánh giá</div>
                  </div>
                </div>

                {/* Review list */}
                {tutor.reviews && tutor.reviews.length > 0 ? (
                  <div className="reviews-list">
                    {tutor.reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <img
                          src={review.avatar}
                          alt={review.studentName}
                          className="avatar avatar-md"
                          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.studentName)}&background=1E3A8A&color=fff`; }}
                        />
                        <div className="review-body">
                          <div className="review-header">
                            <span className="review-author">{review.studentName}</span>
                            <div className="stars-row">
                              {renderStars(review.rating, 13)}
                            </div>
                            <span className="review-date">{review.date}</span>
                          </div>
                          <p className="review-comment">{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">⭐</div>
                    <div className="empty-state-title">Chưa có đánh giá</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Sticky Sidebar */}
        <aside className="tutor-detail__sidebar">
          <div className="booking-card">
            <div className="booking-price">
              <span className="price-value">{tutor.pricePerHour.toLocaleString('vi-VN')}đ</span>
              <span className="price-unit">/giờ</span>
            </div>
            <div className="booking-stats">
              <div className="bstat">
                <Star size={14} fill="#F59E0B" color="#F59E0B" />
                <span>{tutor.rating} ({tutor.reviewCount})</span>
              </div>
              <div className="bstat">
                <BookOpen size={14} />
                <span>{tutor.completedLessons} buổi</span>
              </div>
              <div className="bstat">
                <Users size={14} />
                <span>{tutor.studentCount} học viên</span>
              </div>
            </div>
            <button
              className="btn btn-primary btn-full"
              id="booking-btn"
              onClick={() => navigate(`/dat-lich?tutorId=${tutor.id}`)}
            >
              <Calendar size={18} />
              Đặt lịch học ngay
            </button>
            <button className="btn btn-outline btn-full" id="contact-btn">
              <MessageCircle size={18} />
              Nhắn tin gia sư
            </button>
            <div className="booking-note">
              <CheckCircle size={14} />
              Học thử miễn phí buổi đầu tiên
            </div>
          </div>
        </aside>
      </div>

      {/* Similar tutors */}
      {similarTutors.length > 0 && (
        <section className="section similar-section">
          <div className="container">
            <h2 className="section-title">Gia sư <span>tương tự</span></h2>
            <div className="similar-grid">
              {similarTutors.map((t) => (
                <Link key={t.id} to={`/gia-su/${t.id}`} className="similar-card">
                  <img src={t.avatar} alt={t.name} className="avatar avatar-md"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=1E3A8A&color=fff`; }}
                  />
                  <div>
                    <div className="similar-name">{t.name}</div>
                    <div className="similar-sub">{t.subjects.join(', ')}</div>
                    <div className="similar-price">{t.pricePerHour.toLocaleString('vi-VN')}đ/giờ</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      {showScheduleModal && (
        <ScheduleEditModal
          currentSchedule={tutor.schedule}
          onClose={() => setShowScheduleModal(false)}
          onSave={handleSaveAvailability}
        />
      )}
    </div>
  );
}

function ScheduleEditModal({ currentSchedule, onClose, onSave }) {
  const [schedule, setSchedule] = useState(() => {
    return JSON.parse(JSON.stringify(currentSchedule || {}));
  });
  const [saving, setSaving] = useState(false);

  const ALL_SLOTS = [
    '08:00-10:00',
    '10:00-12:00',
    '14:00-16:00',
    '16:00-18:00',
    '18:00-20:00',
    '20:00-22:00'
  ];

  const toggleSlot = (day, slot) => {
    setSchedule(prev => {
      const daySlots = prev[day] || [];
      const updated = daySlots.includes(slot)
        ? daySlots.filter(s => s !== slot)
        : [...daySlots, slot];
      return { ...prev, [day]: updated };
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(schedule);
      onClose();
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu lịch rảnh');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{
        background: 'white', borderRadius: '16px', maxWidth: '650px', width: '100%',
        maxHeight: '90vh', overflowY: 'auto', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Cập nhật lịch rảnh giảng dạy</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
          Chọn các khung giờ bạn có thể nhận học viên trong tuần. Học sinh sẽ đặt lịch theo các khung giờ này.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {Object.entries(DAYS_VI).map(([dayKey, dayLabel]) => {
            const daySlots = schedule[dayKey] || [];
            return (
              <div key={dayKey} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', color: '#1e293b' }}>
                  {dayLabel}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {ALL_SLOTS.map(slot => {
                    const isSelected = daySlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => toggleSlot(dayKey, slot)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          border: isSelected ? '1px solid #2563eb' : '1px solid #cbd5e1',
                          backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                          color: isSelected ? '#1d4ed8' : '#475569'
                        }}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn btn-outline btn-sm" onClick={onClose} disabled={saving}>
            Hủy
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu lịch rảnh'}
          </button>
        </div>
      </div>
    </div>
  );
}
