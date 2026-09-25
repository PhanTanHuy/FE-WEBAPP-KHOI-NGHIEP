import { BookOpen, Users, Target, Shield } from 'lucide-react';
import './AboutPage.css';

export default function AboutPage() {
    return (
        <main className="about-page">
            <section className="about-hero">
                <div className="container">
                    <h1>Về EduConnect</h1>
                    <p>Nền tảng kết nối giáo dục hàng đầu, mang đến giải pháp học tập toàn diện và cá nhân hóa cho từng học sinh.</p>
                </div>
            </section>

            <section className="about-mission container">
                <div className="mission-content">
                    <h2>Sứ mệnh của chúng tôi</h2>
                    <p>Chúng tôi tin rằng mọi học sinh đều có tiềm năng phát triển vượt bậc nếu được hướng dẫn đúng cách. EduConnect ra đời với sứ mệnh phá bỏ mọi rào cản trong việc tiếp cận giáo dục chất lượng cao, kết nối những gia sư giỏi nhất với các em học sinh đang cần sự hỗ trợ.</p>
                </div>
                <div className="mission-stats">
                    <div className="stat-card">
                        <h3>10,000+</h3>
                        <p>Học sinh đã tham gia</p>
                    </div>
                    <div className="stat-card">
                        <h3>5,000+</h3>
                        <p>Gia sư chất lượng</p>
                    </div>
                    <div className="stat-card">
                        <h3>98%</h3>
                        <p>Tỷ lệ hài lòng</p>
                    </div>
                </div>
            </section>

            <section className="about-values bg-light">
                <div className="container">
                    <h2 className="section-title">Giá trị cốt lõi</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="icon-wrapper"><BookOpen size={32} /></div>
                            <h3>Chất lượng</h3>
                            <p>Đội ngũ gia sư được tuyển chọn kỹ lưỡng, đảm bảo chuyên môn và kỹ năng sư phạm.</p>
                        </div>
                        <div className="value-card">
                            <div className="icon-wrapper"><Users size={32} /></div>
                            <h3>Tận tâm</h3>
                            <p>Luôn đặt sự tiến bộ của học sinh lên hàng đầu, đồng hành cùng các em trong suốt quá trình.</p>
                        </div>
                        <div className="value-card">
                            <div className="icon-wrapper"><Target size={32} /></div>
                            <h3>Hiệu quả</h3>
                            <p>Lộ trình học tập được cá nhân hóa, tối ưu hóa thời gian và năng lực của từng học sinh.</p>
                        </div>
                        <div className="value-card">
                            <div className="icon-wrapper"><Shield size={32} /></div>
                            <h3>Uy tín</h3>
                            <p>Môi trường giáo dục minh bạch, an toàn và đáng tin cậy cho phụ huynh và học sinh.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}