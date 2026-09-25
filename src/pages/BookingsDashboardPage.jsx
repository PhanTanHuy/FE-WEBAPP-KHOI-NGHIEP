import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, getTutorBookings, updateBookingStatus } from '../api/bookings';
import { Loader2, Calendar, Clock, BookOpen, CheckCircle, XCircle, AlertCircle, MessageSquare, TrendingUp, Star } from 'lucide-react';
import './BookingsDashboardPage.css';

export default function BookingsDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('student'); // 'student' or 'tutor'
  const [studentBookings, setStudentBookings] = useState([]);
  const [tutorBookings, setTutorBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      if (activeTab === 'student') {
        const res = await getMyBookings();
        setStudentBookings(res);
      } else if (activeTab === 'tutor' && user?.role === 'tutor') {
        const res = await getTutorBookings();
        setTutorBookings(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="status-badge status-pending"><AlertCircle size={14}/> Chờ xác nhận</span>;
      case 'confirmed': return <span className="status-badge status-confirmed"><CheckCircle size={14}/> Đã xác nhận</span>;
      case 'rejected': return <span className="status-badge status-rejected"><XCircle size={14}/> Từ chối</span>;
      case 'completed': return <span className="status-badge status-completed"><CheckCircle size={14}/> Đã hoàn thành</span>;
      case 'cancelled': return <span className="status-badge status-cancelled"><XCircle size={14}/> Đã hủy</span>;
      default: return null;
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Bạn cần đăng nhập để xem lịch học</h2>
        <Link to="/dang-nhap" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-block' }}>Đăng nhập ngay</Link>
      </div>
    );
  }

  return (
    <div className="bookings-dashboard">
      <div className="container" style={{ padding: '40px 16px', maxWidth: '1000px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <h1 className="dashboard-title" style={{ margin: 0 }}>Quản lý đặt lịch</h1>
          <Link to="/tien-do" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} /> Xem tiến độ học tập
          </Link>
        </div>
        
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => setActiveTab('student')}
          >
            Lịch học của tôi
          </button>
          {user.role === 'tutor' && (
            <button 
              className={`tab-btn ${activeTab === 'tutor' ? 'active' : ''}`}
              onClick={() => setActiveTab('tutor')}
            >
              Yêu cầu đặt lịch (Gia sư)
            </button>
          )}
        </div>

        <div className="dashboard-content">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <Loader2 size={32} className="animate-spin" color="#3B82F6"/>
            </div>
          ) : (
            <div className="bookings-list">
              {activeTab === 'student' ? (
                studentBookings.length > 0 ? (
                  studentBookings.map(b => (
                    <BookingCard 
                      key={b.id} 
                      booking={b} 
                      type="student" 
                      badge={getStatusBadge(b.status)}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))
                ) : (
                  <div className="empty-state">Chưa có lịch học nào.</div>
                )
              ) : (
                tutorBookings.length > 0 ? (
                  tutorBookings.map(b => (
                    <BookingCard 
                      key={b.id} 
                      booking={b} 
                      type="tutor" 
                      badge={getStatusBadge(b.status)}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))
                ) : (
                  <div className="empty-state">Chưa có yêu cầu đặt lịch nào.</div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookingCard({ booking, type, badge, onUpdateStatus }) {
  const otherParty = type === 'student' ? booking.tutor : booking.student;

  return (
    <div className="booking-list-card">
      <div className="booking-card-header">
        <div className="booking-id">Mã đặt lịch: #{booking.id}</div>
        {badge}
      </div>
      <div className="booking-card-body">
        <div className="booking-party-info">
          <img 
            src={otherParty.user ? otherParty.user.avatar_url : otherParty.avatar_url} 
            alt={otherParty.user ? otherParty.user.full_name : otherParty.full_name} 
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParty.user ? otherParty.user.full_name : otherParty.full_name)}&background=random`; }}
            className="party-avatar"
          />
          <div>
            <div className="party-name">{otherParty.user ? otherParty.user.full_name : otherParty.full_name}</div>
            <div className="party-role">{type === 'student' ? 'Gia sư' : 'Học viên'}</div>
          </div>
        </div>
        <div className="booking-details">
          <div className="detail-item">
            <Calendar size={16} /> <strong>Ngày:</strong> {booking.date}
          </div>
          <div className="detail-item">
            <Clock size={16} /> <strong>Giờ:</strong> {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}
          </div>
          {booking.subject && (
            <div className="detail-item">
              <BookOpen size={16} /> <strong>Môn học:</strong> {booking.subject.name}
            </div>
          )}
          {booking.notes && (
            <div className="detail-item detail-notes">
              <MessageSquare size={16} /> <strong>Ghi chú:</strong> {booking.notes}
            </div>
          )}
        </div>
      </div>
      <div className="booking-card-actions">
        {type === 'tutor' && booking.status === 'pending' && (
          <>
            <button className="btn btn-outline btn-sm" onClick={() => onUpdateStatus(booking.id, 'rejected')}>
              Từ chối
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => onUpdateStatus(booking.id, 'confirmed')}>
              Xác nhận
            </button>
          </>
        )}
        {type === 'tutor' && booking.status === 'confirmed' && (
          <button className="btn btn-primary btn-sm" onClick={() => onUpdateStatus(booking.id, 'completed')}>
            Đánh dấu Hoàn thành
          </button>
        )}
        {type === 'student' && booking.status === 'pending' && (
          <button className="btn btn-outline btn-sm" onClick={() => onUpdateStatus(booking.id, 'cancelled')}>
            Hủy yêu cầu
          </button>
        )}
        {type === 'student' && (booking.status === 'completed' || booking.status === 'confirmed') && (
          <Link 
            to={`/danh-gia?bookingId=${booking.id}&tutorId=${booking.tutor_id}`} 
            className="btn btn-sm"
            style={{ 
              background: '#FEF3C7', 
              color: '#B45309', 
              border: '1px solid #FDE68A', 
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Star size={14} fill="#F59E0B" color="#F59E0B" /> Đánh giá gia sư
          </Link>
        )}
      </div>
    </div>
  );
}
