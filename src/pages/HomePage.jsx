import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, Star, Users, BookOpen, Award,
  Shield, Zap, Play, ChevronRight, CheckCircle,
  Laptop, Home, GraduationCap, Clock, MapPin, TrendingUp
} from 'lucide-react';
import TutorCard from '../components/ui/TutorCard';
import { featuredTutors } from '../data/tutors';
import { subjects } from '../data/subjects';
import './HomePage.css';

const stats = [
  { value: '10,000+', label: 'Gia sư chất lượng', icon: <GraduationCap size={24} /> },
  { value: '50,000+', label: 'Học sinh tin dùng', icon: <Users size={24} /> },
  { value: '200,000+', label: 'Buổi học thành công', icon: <BookOpen size={24} /> },
  { value: '4.9/5', label: 'Đánh giá trung bình', icon: <Star size={24} /> },
];

const howItWorks = [
  {
    step: '01',
    icon: <Search size={28} />,
    title: 'Tìm gia sư phù hợp',
    desc: 'Tìm kiếm và lọc gia sư theo môn học, khu vực, học phí và lịch dạy phù hợp với nhu cầu của bạn.'
  },
  {
    step: '02',
    icon: <Users size={28} />,
    title: 'Xem hồ sơ & đánh giá',
    desc: 'Đọc hồ sơ chi tiết, bằng cấp, kinh nghiệm và hàng ngàn đánh giá thật từ phụ huynh và học sinh.'
  },
  {
    step: '03',
    icon: <Clock size={28} />,
    title: 'Đặt lịch học dễ dàng',
    desc: 'Chọn khung giờ phù hợp, học online hoặc tại nhà. Xác nhận lịch học nhanh chóng, tiện lợi.'
  },
  {
    step: '04',
    icon: <TrendingUp size={28} />,
    title: 'Theo dõi tiến độ',
    desc: 'Phụ huynh có thể theo dõi tiến độ học tập của con, nhận báo cáo và đánh giá từ gia sư.'
  },
];

const services = [
  {
    icon: <Laptop size={32} />,
    title: 'Gia sư Online',
    desc: 'Học trực tuyến qua video call với gia sư uy tín. Linh hoạt thời gian, tiết kiệm chi phí đi lại.',
    color: '#3B82F6',
    bg: '#EFF6FF',
    link: '/tim-gia-su?mode=online'
  },
  {
    icon: <Home size={32} />,
    title: 'Gia sư tại nhà',
    desc: 'Gia sư đến tận nhà dạy kèm. Môi trường học tập quen thuộc, tập trung và hiệu quả hơn.',
    color: '#10B981',
    bg: '#ECFDF5',
    link: '/tim-gia-su?mode=offline'
  },
  {
    icon: <Play size={32} />,
    title: 'Học thử miễn phí',
    desc: 'Trải nghiệm 1 buổi học thử miễn phí với gia sư trước khi quyết định. Không rủi ro, không ràng buộc.',
    color: '#F59E0B',
    bg: '#FFFBEB',
    link: '/tim-gia-su'
  },
  {
    icon: <Shield size={32} />,
    title: 'Gia sư được xác minh',
    desc: 'Tất cả gia sư đều được kiểm tra bằng cấp, lý lịch và kỹ năng trước khi được đăng ký trên nền tảng.',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    link: '/dang-ky-gia-su'
  },
];

const testimonials = [
  {
    name: 'Chị Nguyễn Thị Lan',
    role: 'Phụ huynh học sinh lớp 11',
    avatar: 'https://i.pravatar.cc/150?img=32',
    rating: 5,
    content: 'Con tôi học Toán với gia sư trên EduConnect, từ điểm 5 lên 8.5 chỉ sau 2 tháng. Giao diện dễ dùng, gia sư nhiệt tình và chuyên nghiệp.'
  },
  {
    name: 'Anh Trần Minh Đức',
    role: 'Phụ huynh học sinh lớp 8',
    avatar: 'https://i.pravatar.cc/150?img=60',
    rating: 5,
    content: 'Rất hài lòng với dịch vụ. Tôi có thể theo dõi tiến độ học của con mọi lúc mọi nơi. Gia sư được kiểm duyệt kỹ, đáng tin cậy.'
  },
  {
    name: 'Em Lê Thị Hà',
    role: 'Học sinh lớp 12, Hà Nội',
    avatar: 'https://i.pravatar.cc/150?img=48',
    rating: 5,
    content: 'Mình tìm được gia sư IELTS tuyệt vời qua EduConnect. Sau 3 tháng học, mình đạt 7.0 IELTS. Cảm ơn nền tảng này rất nhiều!'
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/tim-gia-su${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`);
  };

  const filteredSubjects = activeTab === 'all'
    ? subjects
    : subjects.filter(s => s.id === activeTab);

  return (
    <div className="home-page">
      {/* ===================== HERO ===================== */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__circle hero__circle--1" />
          <div className="hero__circle hero__circle--2" />
          <div className="hero__circle hero__circle--3" />
          <div className="hero__grid" />
        </div>

        <div className="container hero__content">
          <div className="hero__text animate-fadeInUp">
            <div className="hero__badge">
              <Zap size={14} />
              <span>Nền tảng #1 kết nối gia sư tại Việt Nam</span>
            </div>
            <h1 className="hero__title">
              Kết nối toàn diện<br />
              <span className="hero__title-accent">Học sinh — Gia sư — Phụ huynh</span>
            </h1>
            <p className="hero__desc">
              Tìm gia sư phù hợp trong hàng nghìn gia sư chất lượng, đã được xác minh. Học online hoặc tại nhà, theo dõi tiến độ và đảm bảo kết quả học tập tốt nhất.
            </p>

            {/* Search */}
            <form className="hero__search" onSubmit={handleSearch}>
              <div className="hero__search-inner">
                <Search size={20} className="hero__search-icon" />
                <input
                  type="text"
                  placeholder="Tìm gia sư Toán, Tiếng Anh, Lập trình..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="hero__search-input"
                  id="hero-search-input"
                />
                <button type="submit" className="hero__search-btn" id="hero-search-submit">
                  Tìm ngay
                </button>
              </div>
              <div className="hero__search-quick">
                <span>Phổ biến:</span>
                {['Toán', 'Tiếng Anh', 'Vật lý', 'Lập trình'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => navigate(`/tim-gia-su?q=${s}`)}
                    className="quick-tag"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </form>

            <div className="hero__ctas">
              <Link to="/tim-gia-su" className="btn btn-accent btn-lg" id="hero-find-tutor">
                <Search size={18} />
                Tìm gia sư ngay
              </Link>
              <Link to="/dang-ky-gia-su" className="btn btn-ghost btn-lg" id="hero-become-tutor">
                <GraduationCap size={18} />
                Trở thành gia sư
              </Link>
            </div>
          </div>

          {/* Hero Card */}
          <div className="hero__visual animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="hero-card">
              <div className="hero-card__header">
                <img src="https://i.pravatar.cc/150?img=47" alt="Gia sư" className="hero-card__avatar" />
                <div>
                  <div className="hero-card__name">Nguyễn Thị Minh Anh</div>
                  <div className="hero-card__sub">Gia sư Toán • 6 năm kinh nghiệm</div>
                  <div className="hero-card__rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />
                    ))}
                    <span>4.9 (128 đánh giá)</span>
                  </div>
                </div>
                <div className="hero-card__badge">
                  <CheckCircle size={14} />
                  Đã xác minh
                </div>
              </div>
              <div className="hero-card__info">
                <div className="hero-card__row">
                  <MapPin size={14} />
                  <span>Hà Nội - Cầu Giấy</span>
                </div>
                <div className="hero-card__row">
                  <Clock size={14} />
                  <span>250.000đ / giờ</span>
                </div>
              </div>
              <div className="hero-card__modes">
                <span className="mode-badge mode-online">Online</span>
                <span className="mode-badge mode-offline">Tại nhà</span>
              </div>
              <Link to="/gia-su/1" className="btn btn-primary btn-full btn-sm">
                Xem hồ sơ
              </Link>
            </div>

            {/* Floating stats */}
            <div className="hero-float hero-float--1">
              <Award size={16} />
              <div>
                <div className="float-val">10,000+</div>
                <div className="float-label">Gia sư</div>
              </div>
            </div>
            <div className="hero-float hero-float--2">
              <TrendingUp size={16} />
              <div>
                <div className="float-val">98%</div>
                <div className="float-label">Hài lòng</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="hero__stats">
          <div className="container">
            <div className="stats-grid">
              {stats.map((stat, i) => (
                <div key={i} className="stat-item">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SUBJECTS ===================== */}
      <section className="section subjects-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Môn học</div>
            <h2 className="section-title">Tìm gia sư theo <span>môn học yêu thích</span></h2>
            <p className="section-desc">Hàng nghìn gia sư đang chờ kết nối với bạn</p>
          </div>
          <div className="subjects-grid">
            {subjects.map((sub) => (
              <Link
                key={sub.id}
                to={`/tim-gia-su?subject=${sub.id}`}
                className="subject-card"
                style={{ '--subject-color': sub.color }}
              >
                <div className="subject-card__icon">{sub.icon}</div>
                <div className="subject-card__name">{sub.name}</div>
                <ChevronRight size={14} className="subject-card__arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="section how-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Cách thức hoạt động</div>
            <h2 className="section-title">Bắt đầu học chỉ với <span>4 bước đơn giản</span></h2>
          </div>
          <div className="how-grid">
            {howItWorks.map((step, i) => (
              <div key={i} className="how-card">
                <div className="how-card__step">{step.step}</div>
                <div className="how-card__icon">{step.icon}</div>
                <h3 className="how-card__title">{step.title}</h3>
                <p className="how-card__desc">{step.desc}</p>
                {i < howItWorks.length - 1 && (
                  <div className="how-arrow">
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SERVICES ===================== */}
      <section className="section services-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Dịch vụ</div>
            <h2 className="section-title">Dịch vụ <span>đa dạng, linh hoạt</span></h2>
            <p className="section-desc">Chúng tôi cung cấp giải pháp học tập toàn diện cho mọi nhu cầu</p>
          </div>
          <div className="services-grid">
            {services.map((service, i) => (
              <Link key={i} to={service.link} className="service-card">
                <div
                  className="service-card__icon"
                  style={{ background: service.bg, color: service.color }}
                >
                  {service.icon}
                </div>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__desc">{service.desc}</p>
                <div className="service-card__link" style={{ color: service.color }}>
                  Tìm hiểu thêm <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURED TUTORS ===================== */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-tag">Nổi bật</div>
              <h2 className="section-title">Gia sư <span>được đề xuất</span></h2>
            </div>
            <Link to="/tim-gia-su" className="btn btn-outline">
              Xem tất cả <ArrowRight size={16} />
            </Link>
          </div>
          <div className="tutors-grid">
            {featuredTutors.slice(0, 4).map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Đánh giá</div>
            <h2 className="section-title">Phụ huynh & học sinh <span>nói gì về chúng tôi</span></h2>
          </div>
          <div className="testimonials-wrapper">
            <div className="testimonials-track">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className={`testimonial-card ${i === currentTestimonial ? 'active' : ''} ${
                    i === (currentTestimonial - 1 + testimonials.length) % testimonials.length ? 'prev' : ''
                  } ${i === (currentTestimonial + 1) % testimonials.length ? 'next' : ''}`}
                >
                  <div className="testimonial-quote">"</div>
                  <p className="testimonial-content">{t.content}</p>
                  <div className="testimonial-author">
                    <img src={t.avatar} alt={t.name} className="avatar avatar-md" />
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-role">{t.role}</div>
                    </div>
                    <div className="testimonial-stars">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="testimonial-dots">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="cta-section">
        <div className="container cta-content">
          <div className="cta-text">
            <h2 className="cta-title">Bắt đầu hành trình học tập ngay hôm nay!</h2>
            <p className="cta-desc">Đăng ký miễn phí và kết nối với hàng nghìn gia sư chất lượng</p>
          </div>
          <div className="cta-actions">
            <Link to="/dang-ky" className="btn btn-accent btn-lg" id="cta-register-btn">
              Đăng ký miễn phí
            </Link>
            <Link to="/tim-gia-su" className="btn btn-ghost btn-lg" id="cta-find-tutor">
              Tìm gia sư
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
