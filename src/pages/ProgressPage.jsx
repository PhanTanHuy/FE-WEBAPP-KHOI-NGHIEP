import { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, Clock, BookOpen, User, Calendar, Award, AlertCircle, Loader2 } from 'lucide-react';
import { getProgressSummary } from '../api/progress';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './ProgressPage.css';

export default function ProgressPage() {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProgress() {
            try {
                setLoading(true);
                setError(null);
                const data = await getProgressSummary();
                setSummary(data);
            } catch (err) {
                console.error("Error fetching progress:", err);
                setError("Không thể tải thông tin tiến độ học tập");
            } finally {
                setLoading(false);
            }
        }
        fetchProgress();
    }, []);

    if (loading) {
        return (
            <main className="progress-page">
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <Loader2 size={40} className="animate-spin" color="#3B82F6" style={{ margin: '0 auto 16px' }} />
                    <p style={{ color: '#64748B', fontSize: '16px' }}>Đang tải tiến độ học tập...</p>
                </div>
            </main>
        );
    }

    const subjects = summary?.subjects || [];

    return (
        <main className="progress-page">
            <div className="container">
                <div className="page-header">
                    <div className="page-header-title">
                        <h1>Theo dõi tiến độ học tập</h1>
                        <p>
                            {user 
                                ? `Xin chào, ${user.full_name}! Dưới đây là thống kê chi tiết kết quả và lộ trình học tập của bạn.` 
                                : 'Chào mừng bạn! Dưới đây là tổng quan lộ trình và kết quả học tập mẫu.'}
                        </p>
                    </div>
                    {user && (
                        <div className="header-action-wrap">
                            <Link to="/quan-ly-dat-lich" className="btn-secondary-link">
                                Quản lý lịch học
                            </Link>
                        </div>
                    )}
                </div>

                {/* Stat Cards */}
                <div className="stats-cards">
                    <div className="stat-card">
                        <div className="stat-icon icon-blue"><BookOpen size={24} /></div>
                        <div className="stat-info">
                            <h3>Tổng số môn học</h3>
                            <p className="stat-value">{summary?.total_subjects || 0}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon icon-purple"><Clock size={24} /></div>
                        <div className="stat-info">
                            <h3>Giờ học tích lũy</h3>
                            <p className="stat-value">{summary?.total_hours || 0}h</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon icon-amber"><TrendingUp size={24} /></div>
                        <div className="stat-info">
                            <h3>Điểm trung bình</h3>
                            <p className="stat-value">{summary?.average_score || 0} / 10</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon icon-green"><CheckCircle size={24} /></div>
                        <div className="stat-info">
                            <h3>Bài tập hoàn thành</h3>
                            <p className="stat-value">{summary?.assignment_completion_rate || 0}%</p>
                        </div>
                    </div>
                </div>

                <div className="progress-content-grid">
                    {/* Danh sách môn học */}
                    <div className="progress-list-section">
                        <div className="section-head">
                            <h2>Chi tiết môn học & Lộ trình</h2>
                            <span className="section-badge">{subjects.length} khóa học</span>
                        </div>
                        <div className="progress-list">
                            {subjects.map((sub, index) => (
                                <div className="progress-item" key={index}>
                                    <div className="progress-item-top">
                                        <div className="subject-meta">
                                            <div className="subject-title-wrap">
                                                <h3>{sub.subject_name}</h3>
                                                <span className={`status-badge ${sub.progress_percent >= 80 ? 'good' : sub.progress_percent >= 50 ? 'average' : 'warning'}`}>
                                                    {sub.status}
                                                </span>
                                            </div>
                                            <div className="tutor-instructor">
                                                <img 
                                                    src={sub.tutor_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sub.tutor_name)}&background=3B82F6&color=fff`} 
                                                    alt={sub.tutor_name} 
                                                    className="tutor-avatar-sm"
                                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(sub.tutor_name)}&background=3B82F6&color=fff`; }}
                                                />
                                                <span>Gia sư: <strong>{sub.tutor_name}</strong></span>
                                            </div>
                                        </div>
                                        <div className="subject-score-badge">
                                            <Award size={16} color="#F59E0B" />
                                            <span>{sub.average_score || 8.5}/10</span>
                                        </div>
                                    </div>

                                    <div className="progress-bar-container">
                                        <div className="progress-bar-bg">
                                            <div 
                                                className={`progress-bar-fill ${sub.progress_percent >= 80 ? 'bg-success' : sub.progress_percent >= 50 ? 'bg-primary' : 'bg-warning'}`}
                                                style={{ width: `${sub.progress_percent}%` }}
                                            ></div>
                                        </div>
                                        <span className="progress-text">{sub.progress_percent}%</span>
                                    </div>

                                    <div className="progress-item-footer">
                                        <div className="session-progress">
                                            Đã hoàn thành <strong>{sub.completed_sessions}</strong> / {sub.total_sessions} buổi
                                        </div>
                                        {sub.last_session_date && (
                                            <p className="last-update">Buổi gần nhất: {sub.last_session_date}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lời nhận xét & Gợi ý học tập */}
                    <div className="progress-sidebar-section">
                        <div className="sidebar-card">
                            <h3>💡 Đánh giá tổng quát từ giáo viên</h3>
                            <div className="teacher-feedback-box">
                                <p className="feedback-quote">
                                    "Học sinh có ý thức tự giác cao, tiếp thu nhanh các dạng bài nâng cao và hoàn thành đầy đủ bài tập về nhà. Cần duy trì phong độ và luyện thêm tốc độ phản xạ."
                                </p>
                                <div className="feedback-author">
                                    <strong>Ban Cố vấn Học thuật EduConnect</strong>
                                    <span>Đánh giá tuần gần nhất</span>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-card">
                            <h3>🎯 Mục tiêu học tập sắp tới</h3>
                            <ul className="learning-goals-list">
                                <li>
                                    <CheckCircle size={16} color="#10B981" />
                                    <span>Ôn luyện chuyên đề Hàm số và Hình học không gian</span>
                                </li>
                                <li>
                                    <CheckCircle size={16} color="#10B981" />
                                    <span>Hoàn thành 3 bài thi thử định kỳ môn Tiếng Anh</span>
                                </li>
                                <li>
                                    <CheckCircle size={16} color="#3B82F6" />
                                    <span>Nâng mức điểm trung bình mục tiêu lên 9.0</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
