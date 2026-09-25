import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Star, MessageSquare, CheckCircle, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { createReview, checkBookingReview } from '../api/reviews';
import { getMyBookings } from '../api/bookings';
import { getTutorById } from '../api/tutors';
import { useAuth } from '../context/AuthContext';
import './ReviewPage.css';

const QUICK_TAGS = [
    "Giảng dạy nhiệt tình",
    "Đúng giờ, chuyên nghiệp",
    "Phương pháp dễ hiểu",
    "Kiên nhẫn với học sinh",
    "Chuyên môn vững vàng",
    "Rất tận tâm và chu đáo"
];

const RATING_LABELS = {
    5: "Tuyệt vời - Rất hài lòng",
    4: "Rất tốt - Đạt kỳ vọng",
    3: "Bình thường - Ổn định",
    2: "Cần cải thiện thêm",
    1: "Không hài lòng"
};

export default function ReviewPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const paramBookingId = searchParams.get('bookingId');
    const paramTutorId = searchParams.get('tutorId');

    const [selectedBookingId, setSelectedBookingId] = useState(paramBookingId ? parseInt(paramBookingId) : null);
    const [selectedTutorId, setSelectedTutorId] = useState(paramTutorId ? parseInt(paramTutorId) : null);
    const [tutorInfo, setTutorInfo] = useState(null);
    const [completedBookings, setCompletedBookings] = useState([]);

    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [alreadyReviewed, setAlreadyReviewed] = useState(false);
    const [loadingInfo, setLoadingInfo] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        async function initData() {
            if (!user) {
                setLoadingInfo(false);
                return;
            }

            try {
                setLoadingInfo(true);
                // 1. Fetch user's bookings to get list of completed classes
                const bookings = await getMyBookings();
                const completed = (bookings || []).filter(b => b.status === 'completed' || b.status === 'confirmed');
                setCompletedBookings(completed);

                // Determine booking & tutor to review
                let currentBooking = null;
                if (selectedBookingId) {
                    currentBooking = (bookings || []).find(b => b.id === selectedBookingId);
                } else if (completed.length > 0) {
                    currentBooking = completed[0];
                    setSelectedBookingId(currentBooking.id);
                }

                if (currentBooking) {
                    setSelectedTutorId(currentBooking.tutor_id);
                    // Check if already reviewed
                    const check = await checkBookingReview(currentBooking.id);
                    if (check.reviewed) {
                        setAlreadyReviewed(true);
                        setRating(check.rating || 5);
                        setComment(check.comment || '');
                    }
                    
                    // Fetch full tutor info
                    const tutor = await getTutorById(currentBooking.tutor_id);
                    setTutorInfo(tutor);
                } else if (selectedTutorId) {
                    const tutor = await getTutorById(selectedTutorId);
                    setTutorInfo(tutor);
                }
            } catch (err) {
                console.error("Error loading review target:", err);
            } finally {
                setLoadingInfo(false);
            }
        }
        initData();
    }, [user, selectedBookingId]);

    const handleSelectBooking = async (bId) => {
        setSelectedBookingId(bId);
        setAlreadyReviewed(false);
        setErrorMsg('');
        const b = completedBookings.find(x => x.id === bId);
        if (b) {
            setSelectedTutorId(b.tutor_id);
            try {
                const check = await checkBookingReview(bId);
                if (check.reviewed) {
                    setAlreadyReviewed(true);
                    setRating(check.rating || 5);
                    setComment(check.comment || '');
                } else {
                    setRating(5);
                    setComment('');
                }
                const tutor = await getTutorById(b.tutor_id);
                setTutorInfo(tutor);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleToggleTag = (tag) => {
        let newTags;
        if (selectedTags.includes(tag)) {
            newTags = selectedTags.filter(t => t !== tag);
        } else {
            newTags = [...selectedTags, tag];
        }
        setSelectedTags(newTags);

        // Prepend or append tag to comment
        if (!selectedTags.includes(tag)) {
            setComment(prev => prev ? `${prev}. ${tag}` : tag);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating) {
            setErrorMsg('Vui lòng chọn số sao đánh giá');
            return;
        }
        if (!comment.trim()) {
            setErrorMsg('Vui lòng viết nhận xét hoặc chọn lời khen cho gia sư');
            return;
        }

        try {
            setSubmitting(true);
            setErrorMsg('');
            await createReview({
                tutor_profile_id: selectedTutorId || (tutorInfo?.id),
                booking_id: selectedBookingId,
                rating: rating,
                comment: comment.trim()
            });
            setSuccess(true);
        } catch (err) {
            console.error("Failed to submit review:", err);
            setErrorMsg(err.message || 'Không thể gửi đánh giá lúc này');
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <main className="review-page">
                <div className="container">
                    <div className="review-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <h2>Vui lòng đăng nhập</h2>
                        <p style={{ color: '#64748b', margin: '16px 0 24px' }}>
                            Bạn cần đăng nhập tài khoản học viên để thực hiện đánh giá gia sư.
                        </p>
                        <Link to="/dang-nhap" className="btn btn-primary">Đăng nhập ngay</Link>
                    </div>
                </div>
            </main>
        );
    }

    if (loadingInfo) {
        return (
            <main className="review-page">
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <Loader2 size={36} className="animate-spin" color="#3B82F6" style={{ margin: '0 auto 16px' }} />
                    <p style={{ color: '#64748B' }}>Đang chuẩn bị trang đánh giá...</p>
                </div>
            </main>
        );
    }

    if (success) {
        return (
            <main className="review-page">
                <div className="container">
                    <div className="review-container success-card">
                        <div className="success-icon-wrap">
                            <CheckCircle size={64} color="#10B981" />
                        </div>
                        <h2>Đánh giá thành công!</h2>
                        <p className="success-desc">
                            Cảm ơn bạn đã dành thời gian đóng góp ý kiến quý báu cho gia sư <strong>{tutorInfo?.name || 'Gia sư'}</strong>. Phản hồi của bạn giúp nâng cao chất lượng dạy học của cộng đồng EduConnect.
                        </p>
                        <div className="success-actions">
                            <Link to="/quan-ly-dat-lich" className="btn btn-primary">
                                Về Quản lý Lịch học
                            </Link>
                            {selectedTutorId && (
                                <Link to={`/gia-su/${selectedTutorId}`} className="btn btn-outline">
                                    Xem hồ sơ gia sư
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="review-page">
            <div className="container">
                <div className="review-container">
                    <button onClick={() => navigate(-1)} className="review-back-btn">
                        <ArrowLeft size={16} /> Quay lại
                    </button>

                    <div className="review-header">
                        <h1>Đánh giá & Phản hồi Gia sư</h1>
                        <p>Ý kiến trải nghiệm thực tế của bạn sẽ giúp các học viên khác lựa chọn gia sư phù hợp.</p>
                    </div>

                    {/* Booking Selector if multiple completed */}
                    {completedBookings.length > 1 && (
                        <div className="booking-picker">
                            <label>Chọn khóa / buổi học cần đánh giá:</label>
                            <select 
                                value={selectedBookingId || ''} 
                                onChange={(e) => handleSelectBooking(parseInt(e.target.value))}
                                className="booking-select"
                            >
                                {completedBookings.map(b => (
                                    <option key={b.id} value={b.id}>
                                        Buổi #{b.id} - {b.tutor?.user?.full_name || 'Gia sư'} ({b.subject?.name || 'Môn học'}) - {b.date}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Tutor Profile Summary Card */}
                    {tutorInfo && (
                        <div className="tutor-info-card">
                            <img 
                                src={tutorInfo.avatar} 
                                alt={tutorInfo.name} 
                                className="tutor-avatar"
                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tutorInfo.name)}&background=3B82F6&color=fff`; }}
                            />
                            <div className="tutor-card-meta">
                                <h3>{tutorInfo.name}</h3>
                                <p className="tutor-headline">{tutorInfo.title}</p>
                                <div className="tutor-tags-row">
                                    {(tutorInfo.subjects || []).map(s => (
                                        <span key={s} className="mini-tag">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {alreadyReviewed ? (
                        <div className="already-reviewed-notice">
                            <div className="notice-icon"><CheckCircle size={28} color="#10B981" /></div>
                            <div>
                                <h4>Bạn đã đánh giá buổi học này</h4>
                                <div className="user-review-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} fill={i < rating ? "#F59E0B" : "none"} color={i < rating ? "#F59E0B" : "#D1D5DB"} />
                                    ))}
                                    <span>({rating}/5 sao)</span>
                                </div>
                                <p className="user-review-comment">"{comment}"</p>
                            </div>
                        </div>
                    ) : (
                        <form className="review-form" onSubmit={handleSubmit}>
                            {/* Star Rating Selection */}
                            <div className="form-group rating-group">
                                <label>Mức độ hài lòng của bạn</label>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            className={star <= (hover || rating) ? "on" : "off"}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                            title={`${star} sao`}
                                        >
                                            <Star 
                                                size={36} 
                                                fill={star <= (hover || rating) ? "#F59E0B" : "none"} 
                                                color={star <= (hover || rating) ? "#F59E0B" : "#CBD5E1"} 
                                            />
                                        </button>
                                    ))}
                                </div>
                                <div className="rating-text">
                                    {RATING_LABELS[hover || rating]}
                                </div>
                            </div>

                            {/* Quick compliments tags */}
                            <div className="form-group">
                                <label className="quick-tags-label">
                                    <Sparkles size={16} color="#3B82F6" /> Điểm nổi bật bạn muốn khen ngợi:
                                </label>
                                <div className="quick-tags-wrap">
                                    {QUICK_TAGS.map((tag) => {
                                        const isSelected = selectedTags.includes(tag);
                                        return (
                                            <button
                                                type="button"
                                                key={tag}
                                                className={`quick-tag-chip ${isSelected ? 'active' : ''}`}
                                                onClick={() => handleToggleTag(tag)}
                                            >
                                                {tag}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="form-group">
                                <label>Nhận xét chi tiết</label>
                                <textarea 
                                    rows="5" 
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Chia sẻ trải nghiệm học tập cùng gia sư: cách giảng bài, sự hỗ trợ, sự tiến bộ của học viên..."
                                ></textarea>
                            </div>

                            {errorMsg && (
                                <div className="review-error-alert">
                                    {errorMsg}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className="submit-review-btn"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Đang gửi đánh giá...
                                    </>
                                ) : (
                                    <>
                                        <MessageSquare size={18} /> Gửi đánh giá ngay
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
}
