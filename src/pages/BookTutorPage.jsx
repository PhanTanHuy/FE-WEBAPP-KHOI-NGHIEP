import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, BookOpen, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { getTutorById } from '../api/tutors';
import { createBooking } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import './BookTutorPage.css';

const DAYS_VI = { Mon: 'Thứ 2', Tue: 'Thứ 3', Wed: 'Thứ 4', Thu: 'Thứ 5', Fri: 'Thứ 6', Sat: 'Thứ 7', Sun: 'CN' };

export default function BookTutorPage() {
  const [searchParams] = useSearchParams();
  const tutorId = searchParams.get('tutorId');
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!tutorId) {
      setError('Không tìm thấy thông tin gia sư để đặt lịch');
      setLoading(false);
      return;
    }

    async function fetchTutor() {
      try {
        setLoading(true);
        const data = await getTutorById(tutorId);
        setTutor(data);
      } catch (err) {
        setError('Lỗi khi tải thông tin gia sư');
      } finally {
        setLoading(false);
      }
    }

    fetchTutor();
  }, [tutorId]);

  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Bạn cần đăng nhập để đặt lịch</h2>
        <Link to="/dang-nhap" className="btn btn-primary" style={{ marginTop: '16px' }}>Đăng nhập ngay</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <Loader2 size={36} className="animate-spin" color="#3B82F6" />
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>{error}</h2>
        <button onClick={() => navigate(-1)} className="btn btn-primary" style={{ marginTop: '16px' }}>Quay lại</button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <CheckCircle size={80} color="#10B981" />
        </div>
        <h2 style={{ marginBottom: '16px', color: '#111827' }}>Đặt lịch thành công!</h2>
        <p style={{ color: '#4B5563', marginBottom: '32px' }}>
          Yêu cầu đặt lịch của bạn đã được gửi đến gia sư <strong>{tutor.name}</strong>. 
          Gia sư sẽ xem xét và phản hồi trong thời gian sớm nhất.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to={`/gia-su/${tutor.id}`} className="btn btn-outline">Quay lại hồ sơ</Link>
          <Link to="/quan-ly-dat-lich" className="btn btn-primary">Xem lịch đã đặt</Link>
        </div>
      </div>
    );
  }

  // Generate next 14 days for selection
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedSlot(''); // reset slot when date changes
  };

  const getDayOfWeekEn = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const dayIndex = date.getDay(); // 0 is Sunday, 1 is Monday
    const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return daysEn[dayIndex];
  };

  const selectedDayEn = getDayOfWeekEn(selectedDate);
  const availableSlots = selectedDayEn && tutor.schedule ? tutor.schedule[selectedDayEn] : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      alert('Vui lòng chọn ngày và giờ học');
      return;
    }

    try {
      setSubmitting(true);
      const [start_time, end_time] = selectedSlot.split('-');
      
      const payload = {
        tutor_id: parseInt(tutorId),
        subject_id: null, // Depending on backend logic, if subjects are needed, we map string to id. Let's pass null for now or we would need the subject object mapping.
        date: selectedDate,
        start_time: `${start_time}:00`,
        end_time: `${end_time}:00`,
        notes: notes
      };

      await createBooking(payload);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="book-page">
      <div className="container" style={{ maxWidth: '800px', padding: '40px 16px' }}>
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Quay lại
        </button>

        <div className="book-card">
          <div className="book-header">
            <h1 className="book-title">Đặt lịch học</h1>
            <p className="book-subtitle">Điền thông tin để gửi yêu cầu đặt lịch cho gia sư</p>
          </div>

          <div className="tutor-summary">
            <img 
              src={tutor.avatar} 
              alt={tutor.name} 
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=1E3A8A&color=fff`; }}
            />
            <div>
              <h3>{tutor.name}</h3>
              <p>{tutor.title}</p>
              <div className="price">{tutor.pricePerHour.toLocaleString('vi-VN')}đ / giờ</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="book-form">
            <div className="form-group">
              <label><BookOpen size={16}/> Môn học quan tâm (Tùy chọn)</label>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="form-control"
              >
                <option value="">-- Chọn môn học --</option>
                {tutor.subjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><Calendar size={16}/> Ngày học</label>
                <select 
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="form-control"
                  required
                >
                  <option value="">-- Chọn ngày --</option>
                  {dates.map((d, idx) => {
                    const dateStr = d.toISOString().split('T')[0];
                    const dayName = DAYS_VI[getDayOfWeekEn(dateStr)];
                    const formatted = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
                    return (
                      <option key={idx} value={dateStr}>
                        {dayName}, {formatted}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label><Clock size={16}/> Khung giờ</label>
              {!selectedDate ? (
                <div className="empty-slot-msg">Vui lòng chọn ngày để xem các khung giờ trống</div>
              ) : (
                <div className="slots-grid">
                  {availableSlots && availableSlots.length > 0 ? (
                    availableSlots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <div className="empty-slot-msg">Gia sư không có lịch rảnh vào ngày này</div>
                  )}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Ghi chú cho gia sư (Tùy chọn)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-control"
                placeholder="Ví dụ: Mong muốn tập trung ôn thi, học lực hiện tại khá..."
                rows="4"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full book-submit-btn"
              disabled={submitting || !selectedDate || !selectedSlot}
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Gửi yêu cầu đặt lịch'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
