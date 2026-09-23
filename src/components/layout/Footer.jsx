import { Link } from 'react-router-dom';
import { BookOpen, Phone, Mail, MapPin, Facebook, Youtube, Instagram, ArrowRight, Heart } from 'lucide-react';
import './Footer.css';

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
                  <Facebook size={18} />
                </a>
                <a href="#" className="social-btn" aria-label="Youtube">
                  <Youtube size={18} />
                </a>
                <a href="#" className="social-btn" aria-label="Instagram">
                  <Instagram size={18} />
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
