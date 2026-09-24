import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './ContactPage.css';

export default function ContactPage() {
    return (
        <main className="contact-page">
            <section className="contact-hero">
                <div className="container">
                    <h1>Liên hệ với EduConnect</h1>
                    <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7</p>
                </div>
            </section>

            <section className="contact-content container">
                <div className="contact-grid">
                    <div className="contact-info">
                        <h2>Thông tin liên hệ</h2>
                        <p className="subtitle">Hãy liên hệ với chúng tôi qua các kênh sau hoặc để lại tin nhắn, chúng tôi sẽ phản hồi sớm nhất.</p>

                        <div className="info-items">
                            <div className="info-item">
                                <div className="info-icon"><MapPin /></div>
                                <div>
                                    <h3>Địa chỉ</h3>
                                    <p>123 Đường Sư Vạn Hạnh, Quận 10, TP.HCM</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon"><Phone /></div>
                                <div>
                                    <h3>Điện thoại</h3>
                                    <p>0123 456 789 (Hotline 24/7)</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon"><Mail /></div>
                                <div>
                                    <h3>Email</h3>
                                    <p>support@educonnect.vn</p>
                                </div>
                            </div>
                        </div>

                        <div className="map-container">
                            <img src="https://via.placeholder.com/600x300?text=B%E1%BA%A3n+%C4%91%E1%BB%93+EduConnect" alt="Map Placeholder" />
                        </div>
                    </div>

                    <div className="contact-form-container">
                        <h2>Gửi tin nhắn</h2>
                        <form className="contact-form">
                            <div className="form-group">
                                <label>Họ và tên</label>
                                <input type="text" placeholder="Nhập họ tên của bạn" required />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" placeholder="Nhập địa chỉ email" required />
                            </div>
                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <input type="tel" placeholder="Nhập số điện thoại" />
                            </div>
                            <div className="form-group">
                                <label>Nội dung tin nhắn</label>
                                <textarea rows="5" placeholder="Bạn cần chúng tôi hỗ trợ vấn đề gì?" required></textarea>
                            </div>
                            <button type="submit" className="submit-btn">
                                <Send size={18} /> Gửi tin nhắn
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
