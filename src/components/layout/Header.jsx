import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, Search, Bell, User, ChevronDown, LogIn } from 'lucide-react';
import './Header.css';

const navLinks = [
  { to: '/', label: 'Trang chủ' },
  { to: '/tim-gia-su', label: 'Tìm gia sư' },
  {
    label: 'Dịch vụ',
    children: [
      { to: '/tai-lieu', label: 'Tài liệu học tập' },
      { to: '/dat-lich', label: 'Đặt lịch học' },
      { to: '/tien-do', label: 'Theo dõi tiến độ' },
    ]
  },
  { to: '/dang-ky-gia-su', label: 'Đăng ký dạy' },
  { to: '/danh-gia', label: 'Đánh giá & Hỗ trợ' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <div className="logo-icon">
            <BookOpen size={22} />
          </div>
          <span className="logo-text">
            Edu<span className="logo-accent">Connect</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="header__nav">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className="nav-dropdown"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className="nav-link nav-link--dropdown">
                  {link.label}
                  <ChevronDown size={14} className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} />
                </button>
                <div className={`dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
                  {link.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Actions */}
        <div className="header__actions">
          <button
            className="action-btn"
            id="header-search-btn"
            onClick={() => navigate('/tim-gia-su')}
            title="Tìm kiếm"
          >
            <Search size={20} />
          </button>
          {isLoggedIn ? (
            <>
              <button className="action-btn" id="header-notif-btn">
                <Bell size={20} />
                <span className="notif-badge">3</span>
              </button>
              <Link to="/ho-so" className="header__avatar">
                <img src="https://i.pravatar.cc/150?img=50" alt="Avatar" className="avatar avatar-sm" />
              </Link>
            </>
          ) : (
            <>
              <Link to="/dang-nhap" className="btn btn-outline btn-sm hide-mobile" id="header-login-btn">
                <LogIn size={16} />
                Đăng nhập
              </Link>
              <Link to="/dang-ky" className="btn btn-primary btn-sm" id="header-register-btn">
                <User size={16} />
                <span className="hide-mobile">Đăng ký</span>
              </Link>
            </>
          )}
          <button
            className="mobile-menu-btn"
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <div className="mobile-nav-section">{link.label}</div>
                {link.children.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    className={({ isActive }) => `mobile-nav-link sub ${isActive ? 'active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            )
          )}
          <div className="mobile-nav-actions">
            <Link to="/dang-nhap" className="btn btn-outline btn-full" onClick={() => setMobileOpen(false)}>
              Đăng nhập
            </Link>
            <Link to="/dang-ky" className="btn btn-primary btn-full" onClick={() => setMobileOpen(false)}>
              Đăng ký ngay
            </Link>
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}
    </header>
  );
}
