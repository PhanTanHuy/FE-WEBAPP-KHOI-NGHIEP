import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    GraduationCap,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';

import './RegisterPage.css';

export default function RegisterPage() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agree: false
    });

    const handleChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.fullName.trim()) {
            alert('Vui lòng nhập họ và tên.');
            return;
        }

        if (!form.email.trim()) {
            alert('Vui lòng nhập email.');
            return;
        }

        if (!form.phone.trim()) {
            alert('Vui lòng nhập số điện thoại.');
            return;
        }

        if (form.password.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        if (form.password !== form.confirmPassword) {
            alert('Mật khẩu xác nhận không khớp.');
            return;
        }

        if (!form.agree) {
            alert('Vui lòng đồng ý với điều khoản sử dụng.');
            return;
        }

        // Sau này kết nối API đăng ký tại đây.
        alert('Đăng ký tài khoản thành công!');
    };

    return (
        <main className="register-page">

            <div className="register-container">

                {/* LEFT - REGISTER FORM */}
                <section className="register-form-section">

                    <div className="register-form-inner">

                        <Link
                            to="/"
                            className="register-logo"
                        >
                            <span className="register-logo-icon">
                                E
                            </span>

                            <span>
                                Edu<span>Connect</span>
                            </span>
                        </Link>

                        <div className="register-heading">
                            <h1>Tạo tài khoản</h1>

                            <p>
                                Đăng ký tài khoản để bắt đầu sử dụng
                                EduConnect.
                            </p>
                        </div>

                        <form
                            className="register-form"
                            onSubmit={handleSubmit}
                        >

                            {/* HỌ TÊN */}
                            <div className="register-field">

                                <label>
                                    Họ và tên
                                    <span>*</span>
                                </label>

                                <div className="register-input">
                                    <User size={18} />

                                    <input
                                        type="text"
                                        placeholder="Nguyễn Văn A"
                                        value={form.fullName}
                                        onChange={(e) =>
                                            handleChange(
                                                'fullName',
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                            </div>

                            {/* EMAIL */}
                            <div className="register-field">

                                <label>
                                    Email
                                    <span>*</span>
                                </label>

                                <div className="register-input">
                                    <Mail size={18} />

                                    <input
                                        type="email"
                                        placeholder="example@email.com"
                                        value={form.email}
                                        onChange={(e) =>
                                            handleChange(
                                                'email',
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                            </div>

                            {/* PHONE */}
                            <div className="register-field">

                                <label>
                                    Số điện thoại
                                    <span>*</span>
                                </label>

                                <div className="register-input">
                                    <Phone size={18} />

                                    <input
                                        type="tel"
                                        placeholder="0987 654 321"
                                        value={form.phone}
                                        onChange={(e) =>
                                            handleChange(
                                                'phone',
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                            </div>

                            {/* PASSWORD */}
                            <div className="register-field">

                                <label>
                                    Mật khẩu
                                    <span>*</span>
                                </label>

                                <div className="register-input">
                                    <Lock size={18} />

                                    <input
                                        type={
                                            showPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        placeholder="Nhập mật khẩu"
                                        value={form.password}
                                        onChange={(e) =>
                                            handleChange(
                                                'password',
                                                e.target.value
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>

                                <small>
                                    Mật khẩu tối thiểu 6 ký tự
                                </small>

                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div className="register-field">

                                <label>
                                    Xác nhận mật khẩu
                                    <span>*</span>
                                </label>

                                <div className="register-input">
                                    <Lock size={18} />

                                    <input
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        placeholder="Nhập lại mật khẩu"
                                        value={
                                            form.confirmPassword
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                'confirmPassword',
                                                e.target.value
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>

                            </div>

                            {/* TERMS */}
                            <label className="register-terms">

                                <input
                                    type="checkbox"
                                    checked={form.agree}
                                    onChange={(e) =>
                                        handleChange(
                                            'agree',
                                            e.target.checked
                                        )
                                    }
                                />

                                <span className="register-custom-check">
                                    {form.agree && '✓'}
                                </span>

                                <span>
                                    Tôi đồng ý với{' '}
                                    <Link to="#">
                                        Điều khoản sử dụng
                                    </Link>{' '}
                                    và{' '}
                                    <Link to="#">
                                        Chính sách bảo mật
                                    </Link>{' '}
                                    của EduConnect.
                                </span>

                            </label>

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                className="register-submit"
                            >
                                Tạo tài khoản
                                <ArrowRight size={18} />
                            </button>

                        </form>

                        {/* SOCIAL */}
                        <div className="register-divider">
                            <span>Hoặc đăng ký bằng</span>
                        </div>

                        <div className="register-social">

                            <button type="button">
                                <span className="google-icon">
                                    G
                                </span>
                                Google
                            </button>

                            <button type="button">
                                <span className="facebook-icon">
                                    f
                                </span>
                                Facebook
                            </button>

                        </div>

                        <p className="register-login">
                            Đã có tài khoản?
                            <Link to="/dang-nhap">
                                Đăng nhập
                            </Link>
                        </p>

                    </div>
                </section>


                {/* RIGHT */}
                <section className="register-intro-section">

                    <div className="register-intro-content">

                        <div className="intro-badge">
                            EDUCONNECT
                        </div>

                        <h2>
                            Kết nối học tập,
                            <br />
                            <span>mở rộng tương lai.</span>
                        </h2>

                        <p>
                            Tham gia EduConnect để tìm gia sư phù hợp,
                            quản lý lịch học và xây dựng hành trình
                            học tập hiệu quả hơn.
                        </p>

                        <div className="intro-features">

                            <div>
                                <CheckCircle2 size={19} />
                                <span>
                                    Tìm gia sư phù hợp với nhu cầu
                                </span>
                            </div>

                            <div>
                                <CheckCircle2 size={19} />
                                <span>
                                    Học online hoặc trực tiếp tại nhà
                                </span>
                            </div>

                            <div>
                                <CheckCircle2 size={19} />
                                <span>
                                    Theo dõi quá trình học tập
                                </span>
                            </div>

                        </div>

                    </div>

                    {/* Tutor CTA */}
                    <div className="tutor-register-box">

                        <div className="tutor-register-icon">
                            <GraduationCap size={28} />
                        </div>

                        <div className="tutor-register-text">
                            <h3>
                                Bạn muốn trở thành gia sư?
                            </h3>

                            <p>
                                Tạo hồ sơ gia sư và kết nối với
                                học sinh đang tìm người dạy.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        '/dang-ky-gia-su'
                                    )
                                }
                            >
                                Đăng ký làm gia sư
                                <ArrowRight size={17} />
                            </button>
                        </div>

                    </div>

                    <div className="register-decoration decoration-1" />
                    <div className="register-decoration decoration-2" />

                </section>

            </div>

        </main>
    );
}