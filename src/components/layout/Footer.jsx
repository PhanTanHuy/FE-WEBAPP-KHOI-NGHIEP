import { Link } from 'react-router-dom';
import { BookOpen, Phone, Mail, MapPin, ArrowRight, Heart } from 'lucide-react';
import './Footer.css';

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const footerLinks = {
  services: [
    { to: '/tim-gia-su', label: 'Tìm gia sư' },
    { to: '/dang-ky-gia-su', label: 'Đăng ký dạy' },
    { to: '/dat-lich', label: 'Đặt lịch học' },
    { to: '/tai-lieu', label: 'Tài liệu học tập' },
    { to: '/tien-do', label: 'Theo dõi tiến độ' },
  ],
  support: [
    { to: '/danh-gia', label: 'Trung tâm hỗ trợ' },
    { to: '/danh-gia', label: 'Chính sách bảo mật' },
    { to: '/danh-gia', label: 'Điều khoản sử dụng' },
    { to: '/danh-gia', label: 'Phản hồi & Góp ý' },
  ],
  subjects: ['Toán', 'Tiếng Anh', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Tin học']
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__waves">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,0 L0,0 Z" fill="var(--gray-50)" />
        </svg>
      </div>

      <div className="footer__body">
        <div className="container">
          <div className="footer__grid">
            {/* Brand */}
            <div className="footer__brand">
              <Link to="/" className="footer__logo">
                <div className="footer-logo-icon">
                  <BookOpen size={20} />
                </div>
                <span>Edu<span>Connect</span></span>
              </Link>
              <p className="footer__brand-desc">
                Nền tảng kết nối toàn diện giữa học sinh, gia sư và phụ huynh. Tìm gia sư phù hợp, học hiệu quả, phát triển tương lai.
              </p>
              <div className="footer__social">
                <a href="#" className="social-btn" aria-label="Facebook">
                  <FacebookIcon size={18} />
                </a>
                <a href="#" className="social-btn" aria-label="Youtube">
                  <YoutubeIcon size={18} />
                </a>
                <a href="#" className="social-btn" aria-label="Instagram">
                  <InstagramIcon size={18} />
                </a>
              </div>
              <div className="footer__contact">
                <div className="contact-item">
                  <Phone size={14} />
                  <span>1800 1234 (Miễn phí)</span>
                </div>
                <div className="contact-item">
                  <Mail size={14} />
                  <span>support@educonnect.vn</span>
                </div>
                <div className="contact-item">
                  <MapPin size={14} />
                  <span>123 Cầu Giấy, Hà Nội</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="footer__col">
              <h4 className="footer__title">Dịch vụ</h4>
              <ul className="footer__links">
                {footerLinks.services.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="footer__link">
                      <ArrowRight size={12} />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="footer__col">
              <h4 className="footer__title">Hỗ trợ</h4>
              <ul className="footer__links">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer__link">
                      <ArrowRight size={12} />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subjects */}
            <div className="footer__col">
              <h4 className="footer__title">Môn học phổ biến</h4>
              <div className="footer__tags">
                {footerLinks.subjects.map((sub) => (
                  <Link key={sub} to={`/tim-gia-su?subject=${sub}`} className="footer__tag">
                    {sub}
                  </Link>
                ))}
              </div>
              <div className="footer__app-badges">
                <p className="app-label">Tải ứng dụng</p>
                <div className="app-btns">
                  <div className="app-btn">
                    <span>🍎</span>
                    <div>
                      <div className="app-btn-sub">Download on the</div>
                      <div className="app-btn-main">App Store</div>
                    </div>
                  </div>
                  <div className="app-btn">
                    <span>▶</span>
                    <div>
                      <div className="app-btn-sub">Get it on</div>
                      <div className="app-btn-main">Google Play</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© 2024 EduConnect. Tất cả quyền được bảo lưu.</p>
          <p className="footer__bottom-right">
            Made with <Heart size={12} className="heart-icon" /> by EduConnect Team
          </p>
        </div>
      </div>
    </footer>
  );
}
