import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Video, Home, CheckCircle, ArrowLeft } from 'lucide-react';
import { getTutorById } from '../api/tutors';
import { createBooking } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import './BookingPage.css';

const timeSlots = [
  '07:00 - 09:00', '09:00 - 11:00', '14:00 - 16:00',
  '16:00 - 18:00', '18:00 - 20:00', '20:00 - 22:00'
];

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tutorId = searchParams.get('tutorId');

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    tutorId: tutorId || '',
    subject: '',
    level: '',
    date: '',
    timeSlot: '',
    mode: 'online',
    note: '',
    sessions: 1,
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!tutorId) {
      setLoading(false);
      return;
    }
    const fetchTutor = async () => {
      try {
        const data = await getTutorById(tutorId);
        setTutor(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTutor();
  }, [tutorId]);

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để đặt lịch");
      navigate('/dang-nhap');
      return;
    }
    try {
      setSubmitting(true);
      const [start_time, end_time] = form.timeSlot.split(' - ');
      
      const payload = {
        tutor_id: parseInt(tutorId),
        subject_id: null,
        date: form.date,
        start_time: `${start_time.trim()}:00`,
        end_time: `${end_time.trim()}:00`,
        notes: `${form.note} | Cấp học: ${form.level} | Môn: ${form.subject} | Hình thức: ${form.mode}`
      };

      await createBooking(payload);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="booking-page"><div className="container" style={{padding: '80px 0', textAlign: 'center'}}>Đang tải thông tin gia sư...</div></div>;
  }

  if (!tutor) {
    return <div className="booking-page"><div className="container" style={{padding: '80px 0', textAlign: 'center'}}>Không tìm thấy gia sư!</div></div>;
  }

  const totalPrice = tutor.pricePerHour * 2 * form.sessions; // 2 hours per session

  if (submitted) {
    return (
      <div className="booking-page">
        <div className="container">
          <div className="booking-success">
            <div className="success-icon">
              <CheckCircle size={60} />
            </div>
            <h1>Đặt lịch thành công!</h1>
            <p>Yêu cầu đặt lịch của bạn đã được gửi đến gia sư <strong>{tutor.name}</strong>.</p>
            <p>Gia sư sẽ xác nhận trong vòng 2-4 giờ. Bạn sẽ nhận được thông báo qua email.</p>
            <div className="booking-success-info">
              <div className="success-detail">
                <span>📅 Ngày học:</span>
                <strong>{form.date || '20/11/2024'}</strong>
              </div>
              <div className="success-detail">
                <span>⏰ Giờ học:</span>
                <strong>{form.timeSlot || '18:00 - 20:00'}</strong>
              </div>
              <div className="success-detail">
                <span>📚 Môn học:</span>
                <strong>{form.subject || 'Toán'}</strong>
              </div>
              <div className="success-detail">
                <span>💰 Học phí:</span>
                <strong>{tutor.pricePerHour.toLocaleString('vi-VN')}đ/giờ</strong>
              </div>
            </div>
            <div className="success-actions">
              <Link to="/quan-ly-dat-lich" className="btn btn-primary btn-lg">
                Xem lịch học của tôi
              </Link>
              <Link to="/tim-gia-su" className="btn btn-outline btn-lg">
                Tìm gia sư khác
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      {/* Hero */}
      <div className="booking-hero">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Quay lại
          </button>
          <h1 className="booking-hero-title">Đặt lịch học</h1>
          <p>Hoàn thành các bước để đặt lịch học với gia sư</p>
        </div>
      </div>

      <div className="container booking-container">
        {/* Steps */}
        <div className="booking-steps">
          {['Chọn gia sư', 'Chọn lịch', 'Xác nhận'].map((label, i) => (
            <div key={i} className={`booking-step ${step >= i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="step-circle">{step > i + 1 ? <CheckCircle size={16} /> : i + 1}</div>
              <span className="step-label">{label}</span>
              {i < 2 && <div className="step-line" />}
            </div>
          ))}
        </div>

        <div className="booking-layout">
          {/* Form */}
          <div className="booking-form-card">
            {/* Step 1: Chọn gia sư & môn */}
            {step === 1 && (
              <div className="booking-step-content">
                <h2 className="form-section-title">Bước 1: Thông tin học tập</h2>

                {/* Tutor selected */}
                {tutor && (
                  <div className="selected-tutor">
                    <img src={tutor.avatar} alt={tutor.name} className="avatar avatar-lg"
                      onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=1E3A8A&color=fff`; }}
                    />
                    <div>
                      <div className="sel-tutor-name">{tutor.name}</div>
                      <div className="sel-tutor-sub">{tutor.title}</div>
                    </div>
                    <Link to="/tim-gia-su" className="btn btn-outline btn-sm">Đổi gia sư</Link>
                  </div>
                )}

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Môn học *</label>
                    <select
                      className="form-select"
                      value={form.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      id="booking-subject"
                    >
                      <option value="">Chọn môn học</option>
                      {tutor.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cấp học *</label>
                    <select
                      className="form-select"
                      value={form.level}
                      onChange={(e) => handleChange('level', e.target.value)}
                      id="booking-level"
                    >
                      <option value="">Chọn cấp học</option>
                      {tutor.levels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Hình thức học</label>
                  <div className="mode-options">
                    {tutor.teachingMode.map(mode => (
                      <label key={mode} className={`mode-option ${form.mode === mode ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="mode"
                          value={mode}
                          checked={form.mode === mode}
                          onChange={() => handleChange('mode', mode)}
                        />
                        {mode === 'online' ? <Video size={20} /> : <Home size={20} />}
                        <span>{mode === 'online' ? 'Online (Video call)' : 'Tại nhà'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Số buổi học</label>
                  <div className="sessions-input">
                    <button
                      className="session-btn"
                      onClick={() => handleChange('sessions', Math.max(1, form.sessions - 1))}
                    >−</button>
                    <span className="session-count">{form.sessions}</span>
                    <button
                      className="session-btn"
                      onClick={() => handleChange('sessions', Math.min(20, form.sessions + 1))}
                    >+</button>
                    <span className="session-unit">buổi</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Ghi chú cho gia sư</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Ví dụ: Con đang học yếu phần Giải tích, cần ôn thi THPTQG..."
                    value={form.note}
                    onChange={(e) => handleChange('note', e.target.value)}
                    id="booking-note"
                  />
                </div>

                <button
                  className="btn btn-primary btn-full"
                  onClick={handleNext}
                  disabled={!form.subject}
                  id="booking-next-1"
                >
                  Tiếp theo →
                </button>
              </div>
            )}

            {/* Step 2: Chọn lịch */}
            {step === 2 && (
              <div className="booking-step-content">
                <h2 className="form-section-title">Bước 2: Chọn lịch học</h2>

                <div className="form-group">
                  <label className="form-label">Chọn ngày học *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleChange('date', e.target.value)}
                    id="booking-date"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Chọn khung giờ *</label>
                  <div className="time-slots-grid">
                    {timeSlots.map(slot => (
                      <button
                        key={slot}
                        className={`time-slot ${form.timeSlot === slot ? 'active' : ''}`}
                        onClick={() => handleChange('timeSlot', slot)}
                        id={`slot-${slot.replace(/[: ]/g, '-')}`}
                      >
                        <Clock size={14} />
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="step-btns">
                  <button className="btn btn-outline" onClick={handleBack}>← Quay lại</button>
                  <button
                    className="btn btn-primary"
                    onClick={handleNext}
                    disabled={!form.date || !form.timeSlot}
                    id="booking-next-2"
                  >
                    Tiếp theo →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Xác nhận */}
            {step === 3 && (
              <div className="booking-step-content">
                <h2 className="form-section-title">Bước 3: Xác nhận đặt lịch</h2>

                <div className="confirm-details">
                  <div className="confirm-row">
                    <span>Gia sư:</span>
                    <strong>{tutor.name}</strong>
                  </div>
                  <div className="confirm-row">
                    <span>Môn học:</span>
                    <strong>{form.subject}</strong>
                  </div>
                  <div className="confirm-row">
                    <span>Cấp học:</span>
                    <strong>{form.level}</strong>
                  </div>
                  <div className="confirm-row">
                    <span>Hình thức:</span>
                    <strong>{form.mode === 'online' ? 'Online' : 'Tại nhà'}</strong>
                  </div>
                  <div className="confirm-row">
                    <span>Ngày học:</span>
                    <strong>{form.date}</strong>
                  </div>
                  <div className="confirm-row">
                    <span>Giờ học:</span>
                    <strong>{form.timeSlot}</strong>
                  </div>
                  <div className="confirm-row">
                    <span>Số buổi:</span>
                    <strong>{form.sessions} buổi</strong>
                  </div>
                  {form.note && (
                    <div className="confirm-row confirm-note">
                      <span>Ghi chú:</span>
                      <strong>{form.note}</strong>
                    </div>
                  )}
                  <div className="confirm-divider" />
                  <div className="confirm-row confirm-total">
                    <span>Tổng học phí ước tính:</span>
                    <strong className="total-price">{totalPrice.toLocaleString('vi-VN')}đ</strong>
                  </div>
                  <p className="confirm-note-text">
                    * Học phí thanh toán sau khi gia sư xác nhận lịch học
                  </p>
                </div>

                <div className="step-btns">
                  <button className="btn btn-outline" onClick={handleBack}>← Quay lại</button>
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                    id="booking-confirm"
                  >
                    <CheckCircle size={16} />
                    {submitting ? 'Đang gửi...' : 'Xác nhận đặt lịch'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary card */}
          <div className="booking-summary">
            <div className="summary-card">
              <h3>Thông tin gia sư</h3>
              <div className="summary-tutor">
                <img src={tutor.avatar} alt={tutor.name} className="avatar avatar-md"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=1E3A8A&color=fff`; }}
                />
                <div>
                  <div className="sum-name">{tutor.name}</div>
                  <div className="sum-rating">⭐ {tutor.rating} • {tutor.experience} năm KN</div>
                </div>
              </div>
              <div className="divider" />
              <div className="summary-price-row">
                <span>Học phí:</span>
                <span className="sum-price">{tutor.pricePerHour.toLocaleString('vi-VN')}đ/giờ</span>
              </div>
              <div className="summary-price-row">
                <span>2 giờ × {form.sessions} buổi:</span>
                <span className="sum-price sum-total">{totalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="sum-note">
                <CheckCircle size={12} />
                Học thử miễn phí buổi đầu
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
