import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    setError('');
    setIsLoading(true);
    const result = await login(email, password, remember);
    if (result.success) navigate(from, { replace: true });
    else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Đăng nhập</h1>
          <p>Chào mừng bạn quay lại với EduConnect</p>
        </div>

        {error && <div className="login-error" role="alert"><AlertCircle size={18} /><span>{error}</span></div>}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={20} />
              <input id="login-email" type="email" autoComplete="email" placeholder="example@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Mật khẩu</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={20} />
              <input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                placeholder="Nhập mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-actions">
            <label className="remember-me">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Ghi nhớ đăng nhập
            </label>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading || !email || !password}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="login-footer">
          <p>Chưa có tài khoản? <Link to="/dang-ky">Đăng ký ngay</Link></p>
        </div>
      </div>
    </main>
  );
}
