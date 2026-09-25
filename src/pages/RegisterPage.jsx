import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './RegisterPage.css';

const initialForm = { fullName: '', email: '', phone: '', password: '', confirmPassword: '', agree: false };

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const validate = () => {
    if (form.fullName.trim().length < 2) return 'Vui lòng nhập họ và tên hợp lệ.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return 'Email không hợp lệ.';
    if (!/^\+?[\d\s.-]{9,18}$/.test(form.phone.trim())) return 'Số điện thoại không hợp lệ.';
    if (form.password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.';
    if (form.password !== form.confirmPassword) return 'Mật khẩu xác nhận không khớp.';
    if (!form.agree) return 'Vui lòng đồng ý với điều khoản sử dụng.';
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);
    setError('');
    setIsLoading(true);
    const result = await register({
      full_name: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });
    if (result.success) navigate('/', { replace: true });
    else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-container">
        <section className="register-form-section">
          <div className="register-form-inner">
            <Link to="/" className="register-logo"><span className="register-logo-icon">E</span><span>Edu<span>Connect</span></span></Link>
            <div className="register-heading"><h1>Tạo tài khoản</h1><p>Đăng ký tài khoản gia đình để bắt đầu sử dụng EduConnect.</p></div>
            {error && <div className="login-error" role="alert"><AlertCircle size={18} /><span>{error}</span></div>}

            <form className="register-form" onSubmit={handleSubmit} noValidate>
              <Field label="Họ và tên" icon={<User size={18} />}>
                <input type="text" autoComplete="name" placeholder="Nguyễn Văn A" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
              </Field>
              <Field label="Email" icon={<Mail size={18} />}>
                <input type="email" autoComplete="email" placeholder="example@email.com" value={form.email} onChange={(e) => update('email', e.target.value)} />
              </Field>
              <Field label="Số điện thoại" icon={<Phone size={18} />}>
                <input type="tel" autoComplete="tel" placeholder="0987 654 321" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </Field>
              <Field label="Mật khẩu" icon={<Lock size={18} />} hint="Ít nhất 6 ký tự">
                <input type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Nhập mật khẩu" value={form.password} onChange={(e) => update('password', e.target.value)} />
                <PasswordToggle shown={showPassword} onClick={() => setShowPassword((value) => !value)} />
              </Field>
              <Field label="Xác nhận mật khẩu" icon={<Lock size={18} />}>
                <input type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Nhập lại mật khẩu" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} />
                <PasswordToggle shown={showConfirmPassword} onClick={() => setShowConfirmPassword((value) => !value)} />
              </Field>

              <label className="register-terms">
                <input type="checkbox" checked={form.agree} onChange={(e) => update('agree', e.target.checked)} />
                <span className="register-custom-check">{form.agree && '✓'}</span>
                <span>Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật của EduConnect.</span>
              </label>

              <button type="submit" className="register-submit" disabled={isLoading}>
                {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'} {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>
            <p className="register-login">Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link></p>
          </div>
        </section>

        <section className="register-intro-section">
          <div className="register-intro-content">
            <div className="intro-badge">EDUCONNECT</div>
            <h2>Kết nối học tập,<br /><span>mở rộng tương lai.</span></h2>
            <p>Tìm giáo viên phù hợp, quản lý lịch học và theo dõi tiến độ trong cùng một tài khoản gia đình.</p>
            <div className="intro-features">
              {['Tìm giáo viên theo nhu cầu', 'Học online hoặc trực tiếp', 'Theo dõi tiến độ học tập'].map((text) => (
                <div key={text}><CheckCircle2 size={19} /><span>{text}</span></div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, icon, hint, children }) {
  return <div className="register-field"><label>{label}<span>*</span></label><div className="register-input">{icon}{children}</div>{hint && <small>{hint}</small>}</div>;
}

function PasswordToggle({ shown, onClick }) {
  return <button type="button" onClick={onClick} aria-label={shown ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>{shown ? <EyeOff size={18} /> : <Eye size={18} />}</button>;
}
