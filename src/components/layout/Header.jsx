import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  BookOpen,
  Search,
  Bell,
  User,
  LogIn,
  LogOut,
  ShieldCheck,
  Calendar,
  TrendingUp
} from 'lucide-react';

import './Header.css';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  {
    to: '/',
    label: 'Trang chủ'
  },
  {
    to: '/gioi-thieu',
    label: 'Giới thiệu'
  },
  {
    to: '/tim-gia-su',
    label: 'Tìm gia sư'
  },
  {
    to: '/tien-do',
    label: 'Tiến độ học tập'
  },
  {
    to: '/dich-vu',
    label: 'Dịch vụ'
  },
  {
    to: '/tai-lieu',
    label: 'Tài liệu học tập'
  },
  {
    to: '/lien-he',
    label: 'Liên hệ'
  }
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const navigate = useNavigate();

  // Header thay đổi khi scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Khóa scroll body khi mở mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Đóng mobile menu
  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header
      className={`header ${isScrolled ? 'header--scrolled' : ''
        }`}
    >

      <div className="container header__inner">

        {/* ================= LOGO ================= */}

        <Link
          to="/"
          className="header__logo"
          onClick={closeMobileMenu}
        >
          <div className="logo-icon">
            <BookOpen size={22} />
          </div>

          <span className="logo-text">
            Edu
            <span className="logo-accent">
              Connect
            </span>
          </span>
        </Link>


        {/* ================= DESKTOP NAV ================= */}

        <nav className="header__nav">

          {navLinks.map((link) => (

            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''
                }`
              }
            >
              {link.label}
            </NavLink>

          ))}

        </nav>


        {/* ================= ACTIONS ================= */}

        <div className="header__actions">

          {/* Search */}

          <button
            className="action-btn"
            id="header-search-btn"
            onClick={() => navigate('/tim-gia-su')}
            title="Tìm kiếm gia sư"
          >
            <Search size={20} />
          </button>


          {isLoggedIn ? (

            <>
              {/* Notification */}

              <button
                className="action-btn"
                id="header-notif-btn"
                title="Thông báo"
              >
                <Bell size={20} />

                <span className="notif-badge">
                  3
                </span>
              </button>


              {user?.role === 'admin' && (
                <Link
                  to="/admin/duyet-gia-su"
                  className="btn btn-warning btn-sm hide-mobile"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEF3C7', color: '#B45309', border: '1px solid #FCD34D' }}
                  title="Duyệt hồ sơ gia sư"
                >
                  <ShieldCheck size={16} />
                  Duyệt gia sư
                </Link>
              )}

              {/* Avatar & Bookings */}

              <div className="header__user-menu" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link
                  to="/tien-do"
                  className="btn btn-outline btn-sm hide-mobile"
                  title="Tiến độ học tập"
                >
                  <TrendingUp size={16} />
                </Link>
                <Link
                  to="/quan-ly-dat-lich"
                  className="btn btn-outline btn-sm hide-mobile"
                  title="Quản lý đặt lịch"
                >
                  <Calendar size={16} />
                </Link>
                <Link
                  to="/ho-so"
                  className="header__avatar"
                  title="Hồ sơ cá nhân"
                >
                  <img
                    src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.full_name || 'User'}&background=random`}
                    alt="Avatar"
                    className="avatar avatar-sm"
                  />
                  <span className="user-name hide-mobile">{user?.full_name}</span>
                </Link>
                <button 
                  onClick={() => logout()}
                  className="btn btn-outline btn-sm hide-mobile" 
                  title="Đăng xuất"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>

          ) : (

            <>
              {/* Đăng nhập */}

              <Link
                to="/dang-nhap"
                className="btn btn-outline btn-sm hide-mobile"
                id="header-login-btn"
              >
                <LogIn size={16} />

                Đăng nhập
              </Link>


              {/* Đăng ký */}

              <Link
                to="/dang-ky"
                className="btn btn-primary btn-sm"
                id="header-register-btn"
              >
                <User size={16} />

                <span className="hide-mobile">
                  Đăng ký
                </span>
              </Link>
            </>

          )}


          {/* ================= MOBILE BUTTON ================= */}

          <button
            className="mobile-menu-btn"
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Mở menu"
          >
            {mobileOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

        </div>

      </div>


      {/* ================= MOBILE MENU ================= */}

      <div
        className={`mobile-menu ${mobileOpen ? 'open' : ''
          }`}
      >

        <nav className="mobile-nav">

          {navLinks.map((link) => (

            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? 'active' : ''
                }`
              }
              onClick={closeMobileMenu}
            >
              {link.label}
            </NavLink>

          ))}


          {/* ================= MOBILE ACTIONS ================= */}

          <div className="mobile-nav-actions">
            {isLoggedIn ? (
              <>
                <Link to="/quan-ly-dat-lich" className="btn btn-outline btn-full" onClick={closeMobileMenu}>
                  Quản lý lịch học
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="btn btn-outline btn-full" onClick={closeMobileMenu}>
                    Quản trị hệ thống
                  </Link>
                )}
                <button className="btn btn-primary btn-full" onClick={() => { logout(); closeMobileMenu(); navigate('/'); }}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/dang-nhap" className="btn btn-outline btn-full" onClick={closeMobileMenu}>
                  Đăng nhập
                </Link>
                <Link to="/dang-ky" className="btn btn-primary btn-full" onClick={closeMobileMenu}>
                  Đăng ký ngay
                </Link>
              </>
            )}

          </div>

        </nav>

      </div>


      {/* ================= MOBILE OVERLAY ================= */}

      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={closeMobileMenu}
        />
      )}

    </header>
  );
}
