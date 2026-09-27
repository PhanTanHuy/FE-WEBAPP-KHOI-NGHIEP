import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

import { createFeedback } from '../api/feedback';
import './ContactPage.css';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        role: '',
        source: '',
        purpose: '',
        found_information: '',
        ease_of_use: '',
        interested_features: [],
        tutor_priority: '',
        price_range: '',
        trust_level: '',
        usage_intention: '',
        difficulty: '',
        desired_features: '',
        contact_requested: false,
        contact_value: '',
        answers: {}
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFeatureChange = (feature) => {
        setFormData((prev) => {
            const exists = prev.interested_features.includes(feature);

            return {
                ...prev,
                interested_features: exists
                    ? prev.interested_features.filter(
                        (item) => item !== feature
                    )
                    : [...prev.interested_features, feature]
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setSuccess('');
        setError('');

        try {
            await createFeedback({
                ...formData,

                // Backend yêu cầu integer
                ease_of_use: formData.ease_of_use
                    ? Number(formData.ease_of_use)
                    : null,

                trust_level: formData.trust_level
                    ? Number(formData.trust_level)
                    : null
            });

            setSuccess(
                'Cảm ơn bạn! Góp ý của bạn đã được gửi thành công.'
            );

            // Reset form
            setFormData({
                role: '',
                source: '',
                purpose: '',
                found_information: '',
                ease_of_use: '',
                interested_features: [],
                tutor_priority: '',
                price_range: '',
                trust_level: '',
                usage_intention: '',
                difficulty: '',
                desired_features: '',
                contact_requested: false,
                contact_value: '',
                answers: {}
            });
        } catch (err) {
            setError(
                err.message ||
                'Không thể gửi góp ý. Vui lòng thử lại.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="contact-page">

            {/* HERO */}
            <section className="contact-hero">
                <div className="container">
                    <h1>Liên hệ với EduConnect</h1>
                    <p>
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7
                    </p>
                </div>
            </section>

            {/* CONTENT */}
            <section className="contact-content container">

                <div className="contact-grid">

                    {/* CONTACT INFO */}
                    <div className="contact-info">

                        <h2>Thông tin liên hệ</h2>

                        <p className="subtitle">
                            Hãy liên hệ với chúng tôi qua các kênh sau
                            hoặc gửi góp ý để giúp EduConnect cải thiện
                            dịch vụ.
                        </p>

                        <div className="info-items">

                            <div className="info-item">
                                <div className="info-icon">
                                    <MapPin />
                                </div>

                                <div>
                                    <h3>Địa chỉ</h3>
                                    <p>
                                        123 Đường Sư Vạn Hạnh,
                                        Quận 10, TP.HCM
                                    </p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">
                                    <Phone />
                                </div>

                                <div>
                                    <h3>Điện thoại</h3>
                                    <p>
                                        0123 456 789
                                        <br />
                                        (Hotline 24/7)
                                    </p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">
                                    <Mail />
                                </div>

                                <div>
                                    <h3>Email</h3>
                                    <p>
                                        support@educonnect.vn
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* FEEDBACK FORM */}
                    <div className="contact-form-container">

                        <h2>Gửi góp ý</h2>

                        <p className="subtitle">
                            Ý kiến của bạn giúp EduConnect cải thiện
                            trải nghiệm cho học sinh, phụ huynh và gia sư.
                        </p>

                        <form
                            className="contact-form"
                            onSubmit={handleSubmit}
                        >

                            {/* ROLE */}
                            <div className="form-group">
                                <label>
                                    Bạn là ai? *
                                </label>

                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        -- Chọn đối tượng --
                                    </option>

                                    <option value="Học sinh">
                                        Học sinh
                                    </option>

                                    <option value="Phụ huynh">
                                        Phụ huynh
                                    </option>

                                    <option value="Gia sư">
                                        Gia sư
                                    </option>

                                    <option value="Sinh viên muốn làm gia sư">
                                        Sinh viên muốn làm gia sư
                                    </option>

                                    <option value="Khác">
                                        Khác
                                    </option>
                                </select>
                            </div>

                            {/* SOURCE */}
                            <div className="form-group">
                                <label>
                                    Bạn biết đến EduConnect từ đâu?
                                </label>

                                <select
                                    name="source"
                                    value={formData.source}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        -- Chọn --
                                    </option>

                                    <option value="Facebook">
                                        Facebook
                                    </option>

                                    <option value="TikTok">
                                        TikTok
                                    </option>

                                    <option value="Google">
                                        Google
                                    </option>

                                    <option value="Bạn bè/người quen">
                                        Bạn bè / người quen
                                    </option>

                                    <option value="Trường học">
                                        Trường học
                                    </option>

                                    <option value="Khác">
                                        Khác
                                    </option>
                                </select>
                            </div>

                            {/* PURPOSE */}
                            <div className="form-group">
                                <label>
                                    Mục đích sử dụng EduConnect?
                                </label>

                                <select
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        -- Chọn --
                                    </option>

                                    <option value="Tìm gia sư">
                                        Tìm gia sư
                                    </option>

                                    <option value="Đăng ký làm gia sư">
                                        Đăng ký làm gia sư
                                    </option>

                                    <option value="Tìm tài liệu">
                                        Tìm tài liệu
                                    </option>

                                    <option value="Tìm lớp học thử">
                                        Tìm lớp học thử
                                    </option>

                                    <option value="Đưa đón học sinh">
                                        Đưa đón học sinh
                                    </option>

                                    <option value="Tìm hiểu EduConnect">
                                        Tìm hiểu EduConnect
                                    </option>

                                    <option value="Khác">
                                        Khác
                                    </option>
                                </select>
                            </div>

                            {/* FIND INFORMATION */}
                            <div className="form-group">
                                <label>
                                    Bạn có dễ tìm thấy thông tin mình cần không?
                                </label>

                                <select
                                    name="found_information"
                                    value={formData.found_information}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        -- Chọn --
                                    </option>

                                    <option value="Rất khó">
                                        Rất khó
                                    </option>

                                    <option value="Khó">
                                        Khó
                                    </option>

                                    <option value="Bình thường">
                                        Bình thường
                                    </option>

                                    <option value="Dễ">
                                        Dễ
                                    </option>

                                    <option value="Rất dễ">
                                        Rất dễ
                                    </option>
                                </select>
                            </div>

                            {/* EASE OF USE */}
                            <div className="form-group">
                                <label>
                                    Bạn đánh giá mức độ dễ sử dụng từ 1 - 5?
                                </label>

                                <select
                                    name="ease_of_use"
                                    value={formData.ease_of_use}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        -- Chọn điểm --
                                    </option>

                                    <option value="1">
                                        1 - Rất khó sử dụng
                                    </option>

                                    <option value="2">
                                        2
                                    </option>

                                    <option value="3">
                                        3 - Bình thường
                                    </option>

                                    <option value="4">
                                        4
                                    </option>

                                    <option value="5">
                                        5 - Rất dễ sử dụng
                                    </option>
                                </select>
                            </div>

                            {/* FEATURES */}
                            <div className="form-group">

                                <label>
                                    Bạn quan tâm tính năng nào?
                                </label>

                                <div className="checkbox-group">

                                    {[
                                        'Lọc gia sư theo khu vực',
                                        'Lọc theo học phí',
                                        'Đặt lịch học',
                                        'Học thử',
                                        'Chat với gia sư',
                                        'Đánh giá gia sư',
                                        'Theo dõi tiến độ',
                                        'Tài liệu học tập',
                                        'Thanh toán online'
                                    ].map((feature) => (
                                        <label
                                            key={feature}
                                            className="checkbox-item"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.interested_features.includes(
                                                    feature
                                                )}
                                                onChange={() =>
                                                    handleFeatureChange(
                                                        feature
                                                    )
                                                }
                                            />

                                            <span>
                                                {feature}
                                            </span>
                                        </label>
                                    ))}

                                </div>
                            </div>

                            {/* TUTOR PRIORITY */}
                            <div className="form-group">
                                <label>
                                    Điều gì quan trọng nhất khi chọn gia sư?
                                </label>

                                <select
                                    name="tutor_priority"
                                    value={formData.tutor_priority}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        -- Chọn --
                                    </option>

                                    <option value="Kinh nghiệm">
                                        Kinh nghiệm
                                    </option>

                                    <option value="Học vấn">
                                        Học vấn
                                    </option>

                                    <option value="Học phí">
                                        Học phí
                                    </option>

                                    <option value="Đánh giá">
                                        Đánh giá từ học viên
                                    </option>

                                    <option value="Khoảng cách">
                                        Khoảng cách
                                    </option>
                                </select>
                            </div>

                            {/* PRICE */}
                            <div className="form-group">
                                <label>
                                    Khoảng học phí mong muốn?
                                </label>

                                <select
                                    name="price_range"
                                    value={formData.price_range}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        -- Chọn --
                                    </option>

                                    <option value="Dưới 100k">
                                        Dưới 100.000đ / giờ
                                    </option>

                                    <option value="100k - 150k">
                                        100.000đ - 150.000đ / giờ
                                    </option>

                                    <option value="150k - 200k">
                                        150.000đ - 200.000đ / giờ
                                    </option>

                                    <option value="Trên 200k">
                                        Trên 200.000đ / giờ
                                    </option>
                                </select>
                            </div>

                            {/* TRUST */}
                            <div className="form-group">
                                <label>
                                    Mức độ tin tưởng nền tảng từ 1 - 5?
                                </label>

                                <select
                                    name="trust_level"
                                    value={formData.trust_level}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        -- Chọn điểm --
                                    </option>

                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>

                            {/* USAGE INTENTION */}
                            <div className="form-group">
                                <label>
                                    Bạn có dự định sử dụng EduConnect?
                                </label>

                                <select
                                    name="usage_intention"
                                    value={formData.usage_intention}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        -- Chọn --
                                    </option>

                                    <option value="Chắc chắn có">
                                        Chắc chắn có
                                    </option>

                                    <option value="Có thể">
                                        Có thể
                                    </option>

                                    <option value="Chưa chắc">
                                        Chưa chắc
                                    </option>

                                    <option value="Có thể không">
                                        Có thể không
                                    </option>

                                    <option value="Không">
                                        Không
                                    </option>
                                </select>
                            </div>

                            {/* DIFFICULTY */}
                            <div className="form-group">
                                <label>
                                    Điều gì khiến bạn gặp khó khăn?
                                </label>

                                <textarea
                                    name="difficulty"
                                    rows="3"
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                    placeholder="Chia sẻ vấn đề bạn gặp phải..."
                                />
                            </div>

                            {/* DESIRED FEATURES */}
                            <div className="form-group">
                                <label>
                                    Bạn muốn EduConnect cải thiện hoặc bổ sung gì?
                                </label>

                                <textarea
                                    name="desired_features"
                                    rows="3"
                                    value={formData.desired_features}
                                    onChange={handleChange}
                                    placeholder="Nhập ý kiến của bạn..."
                                />
                            </div>

                            {/* CONTACT */}
                            <div className="form-group">

                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={formData.contact_requested}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                contact_requested:
                                                    e.target.checked
                                            }))
                                        }
                                    />

                                    <span>
                                        Tôi muốn EduConnect liên hệ lại
                                    </span>
                                </label>

                            </div>

                            {/* CONTACT VALUE */}
                            {formData.contact_requested && (
                                <div className="form-group">

                                    <label>
                                        Email hoặc số điện thoại
                                    </label>

                                    <input
                                        type="text"
                                        name="contact_value"
                                        value={formData.contact_value}
                                        onChange={handleChange}
                                        placeholder="Nhập email hoặc số điện thoại"
                                    />

                                </div>
                            )}

                            {/* STATUS */}
                            {success && (
                                <div className="feedback-success">
                                    {success}
                                </div>
                            )}

                            {error && (
                                <div className="feedback-error">
                                    {error}
                                </div>
                            )}

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading}
                            >
                                <Send size={18} />

                                {loading
                                    ? 'Đang gửi...'
                                    : 'Gửi góp ý'}
                            </button>

                        </form>

                    </div>

                </div>

            </section>

        </main>
    );
}