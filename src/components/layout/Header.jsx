import { useState, useEffect, useRef } from 'react';
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
  TrendingUp,
  ChevronDown,
  UserCheck,
} from 'lucide-react';

import './Header.css';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  {
    to: '/',
    label: 'Trang chủ',
  },
  {
    to: '/gioi-thieu',
    label: 'Giới thiệu',
  },
  {
    to: '/tim-gia-su',
    label: 'Tìm gia sư',
  },
  {
    to: '/tien-do',
    label: 'Tiến độ',
  },
  {
    to: '/dich-vu',
    label: 'Dịch vụ',
  },
  {
    to: '/tai-lieu',
    label: 'Tài liệu',
  },
  {
    to: '/lien-he',
    label: 'Liên hệ',
  },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminMenuRef = useRef(null);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';

  // =========================
  // HEADER SCROLL
  // =========================
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // =========================
  // LOCK BODY SCROLL MOBILE
  // =========================
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // =========================
  // CLOSE ADMIN MENU
  // WHEN CLICK OUTSIDE
  // =========================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target)
      ) {
        setAdminMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // =========================
  // MOBILE
  // =========================
  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setAdminMenuOpen(false);
    closeMobileMenu();
    navigate('/');
  };

  // =========================
  // AVATAR
  // =========================
  const avatarUrl =
    user?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.full_name || 'User'
    )}&background=random`;

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">

        {/* =========================
            LOGO
        ========================= */}
        <Link
          to="/"
          className="header__logo"
          onClick={closeMobileMenu}
        >
          <div className="logo-icon">
            <BookOpen size={21} />
          </div>

          <span className="logo-text">
            Edu<span className="logo-accent">Connect</span>
          </span>
        </Link>

        {/* =========================
            DESKTOP NAV
        ========================= */}
        <nav className="header__nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* =========================
            DESKTOP ACTIONS
        ========================= */}
        <div className="header__actions">

          {/* Search */}
          <button
            className="action-btn"
            id="header-search-btn"
            onClick={() => navigate('/tim-gia-su')}
            title="Tìm kiếm gia sư"
            aria-label="Tìm kiếm gia sư"
          >
            <Search size={19} />
          </button>

          {isLoggedIn ? (
            <>
              {/* Notification */}
              <button
                className="action-btn notification-btn"
                id="header-notif-btn"
                title="Thông báo"
                aria-label="Thông báo"
              >
                <Bell size={19} />

                <span className="notif-badge">
                  3
                </span>
              </button>

              {/* =========================
                  ADMIN MENU
              ========================= */}
              {isAdmin && (
                <div
                  className="admin-menu-wrapper"
                  ref={adminMenuRef}
                >
                  <button
                    type="button"
                    className={`admin-menu-trigger ${
                      adminMenuOpen ? 'active' : ''
                    }`}
                    onClick={() =>
                      setAdminMenuOpen((prev) => !prev)
                    }
                    title="Quản trị hệ thống"
                  >
                    <ShieldCheck size={17} />

                    <span>Quản trị</span>

                    <ChevronDown
                      size={15}
                      className={`admin-chevron ${
                        adminMenuOpen ? 'rotate' : ''
                      }`}
                    />
                  </button>

                  {adminMenuOpen && (
                    <div className="admin-dropdown">

                      <Link
                        to="/admin"
                        className="admin-dropdown-item"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        <ShieldCheck size={17} />

                        <div>
                          <strong>Quản trị hệ thống</strong>
                          <span>Bảng điều khiển Admin</span>
                        </div>
                      </Link>

                      <Link
                        to="/admin/duyet-gia-su"
                        className="admin-dropdown-item"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        <UserCheck size={17} />

                        <div>
                          <strong>Duyệt gia sư</strong>
                          <span>Quản lý hồ sơ gia sư</span>
                        </div>
                      </Link>

                    </div>
                  )}
                </div>
              )}

              {/* =========================
                  QUICK ACTIONS
              ========================= */}
              <div className="header__quick-actions">

                <Link
                  to="/tien-do"
                  className="quick-action-btn"
                  title="Tiến độ học tập"
                  aria-label="Tiến độ học tập"
                >
                  <TrendingUp size={17} />
                </Link>

                <Link
                  to="/quan-ly-dat-lich"
                  className="quick-action-btn"
                  title="Quản lý đặt lịch"
                  aria-label="Quản lý đặt lịch"
                >
                  <Calendar size={17} />
                </Link>

              </div>

              {/* =========================
                  USER
              ========================= */}
              <Link
                to="/ho-so"
                className="header__avatar"
                title="Hồ sơ cá nhân"
              >
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="avatar avatar-sm"
                />

                <span className="user-name">
                  {user?.full_name || 'Người dùng'}
                </span>
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="logout-btn"
                title="Đăng xuất"
                aria-label="Đăng xuất"
              >
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/dang-nhap"
                className="btn btn-outline btn-sm login-btn"
                id="header-login-btn"
              >
                <LogIn size={16} />
                <span>Đăng nhập</span>
              </Link>

              {/* Register */}
              <Link
                to="/dang-ky"
                className="btn btn-primary btn-sm register-btn"
                id="header-register-btn"
              >
                <User size={16} />
                <span>Đăng ký</span>
              </Link>
            </>
          )}

          {/* =========================
              MOBILE BUTTON
          ========================= */}
          <button
            className="mobile-menu-btn"
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={
              mobileOpen ? 'Đóng menu' : 'Mở menu'
            }
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>
        </div>
      </div>

      {/* =========================
          MOBILE MENU
      ========================= */}
      <div
        className={`mobile-menu ${
          mobileOpen ? 'open' : ''
        }`}
      >
        <nav className="mobile-nav">

          {/* Navigation */}
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `mobile-nav-link ${
                  isActive ? 'active' : ''
                }`
              }
              onClick={closeMobileMenu}
            >
              {link.label}
            </NavLink>
          ))}

          {/* =========================
              MOBILE USER ACTIONS
          ========================= */}
          <div className="mobile-nav-actions">

            {isLoggedIn ? (
              <>
                <Link
                  to="/ho-so"
                  className="mobile-user-card"
                  onClick={closeMobileMenu}
                >
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="avatar avatar-md"
                  />

                  <div>
                    <strong>
                      {user?.full_name || 'Người dùng'}
                    </strong>

                    <span>
                      {isAdmin ? 'Quản trị viên' : 'Tài khoản'}
                    </span>
                  </div>
                </Link>

                <Link
                  to="/quan-ly-dat-lich"
                  className="btn btn-outline btn-full"
                  onClick={closeMobileMenu}
                >
                  <Calendar size={17} />
                  Quản lý lịch học
                </Link>

                <Link
                  to="/tien-do"
                  className="btn btn-outline btn-full"
                  onClick={closeMobileMenu}
                >
                  <TrendingUp size={17} />
                  Tiến độ học tập
                </Link>

                {isAdmin && (
                  <>
                    <Link
                      to="/admin"
                      className="btn btn-outline btn-full"
                      onClick={closeMobileMenu}
                    >
                      <ShieldCheck size={17} />
                      Quản trị hệ thống
                    </Link>

                    <Link
                      to="/admin/duyet-gia-su"
                      className="btn btn-warning-full"
                      onClick={closeMobileMenu}
                    >
                      <UserCheck size={17} />
                      Duyệt gia sư
                    </Link>
                  </>
                )}

                <button
                  type="button"
                  className="btn btn-danger-full"
                  onClick={handleLogout}
                >
                  <LogOut size={17} />
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/dang-nhap"
                  className="btn btn-outline btn-full"
                  onClick={closeMobileMenu}
                >
                  <LogIn size={17} />
                  Đăng nhập
                </Link>

                <Link
                  to="/dang-ky"
                  className="btn btn-primary btn-full"
                  onClick={closeMobileMenu}
                >
                  <User size={17} />
                  Đăng ký ngay
                </Link>
              </>
            )}

          </div>
        </nav>
      </div>

      {/* =========================
          MOBILE OVERLAY
      ========================= */}
      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={closeMobileMenu}
        />
      )}
    </header>
  );
}