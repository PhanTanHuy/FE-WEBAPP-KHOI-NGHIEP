import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  BookOpen,
  Search,
  Bell,
  User,
  LogIn
} from 'lucide-react';

import './Header.css';

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
  const [isLoggedIn] = useState(false);

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


              {/* Avatar */}

              <Link
                to="/ho-so"
                className="header__avatar"
              >
                <img
                  src="https://i.pravatar.cc/150?img=50"
                  alt="Avatar"
                  className="avatar avatar-sm"
                />
              </Link>
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

            <Link
              to="/dang-nhap"
              className="btn btn-outline btn-full"
              onClick={closeMobileMenu}
            >
              Đăng nhập
            </Link>

            <Link
              to="/dang-ky"
              className="btn btn-primary btn-full"
              onClick={closeMobileMenu}
            >
              Đăng ký ngay
            </Link>

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