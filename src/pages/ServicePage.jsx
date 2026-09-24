import { Link } from 'react-router-dom';

import {
    Video,
    Home,
    BookOpen,
    Car,
    CheckCircle,
    ArrowRight
} from 'lucide-react';

import './ServicePage.css';


const services = [
    {
        id: 'online',
        title: 'Gia sư online',
        subtitle: 'Học mọi lúc, mọi nơi',
        description:
            'Kết nối với gia sư chất lượng cao qua hình thức học trực tuyến.',
        icon: Video,
        image:
            'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=900&q=80',
        features: [
            'Kết nối gia sư qua video chất lượng cao',
            'Tiết kiệm thời gian và chi phí di chuyển',
            'Linh hoạt lịch học, phù hợp nhiều đối tượng',
            'Đa dạng môn học và cấp học'
        ],

        // QUAN TRỌNG:
        // Trang con Gia sư online
        button: 'Tìm gia sư online',
        link: '/gia-su-online',

        color: 'blue'
    },

    {
        id: 'home',
        title: 'Gia sư tại nhà',
        subtitle: 'Học trực tiếp, hiệu quả hơn',
        description:
            'Học trực tiếp với gia sư tại nhà trong môi trường quen thuộc.',
        icon: Home,
        image:
            'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80',
        features: [
            'Giáo viên đến tận nhà',
            'Cá nhân hóa lộ trình học',
            'Tập trung nâng cao kiến thức và kỹ năng',
            'Phù hợp với học sinh cần kèm sát'
        ],
        button: 'Tìm gia sư tại nhà',
        link: '/gia-su-tai-nha',
        color: 'green'
    },

    {
        id: 'trial',
        title: 'Học thử',
        subtitle: 'Trải nghiệm trước khi đăng ký',
        description:
            'Trải nghiệm phương pháp giảng dạy và làm quen với gia sư trước khi đăng ký.',
        icon: BookOpen,
        image:
            'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
        features: [
            'Làm quen với gia sư và phương pháp dạy',
            'Đánh giá chất lượng buổi học',
            'Linh hoạt lựa chọn tiếp tục học',
            'Tìm được gia sư phù hợp với nhu cầu'
        ],
        button: 'Đăng ký học thử',
        link: '/hoc-thu',
        color: 'purple'
    },

    {
        id: 'pickup',
        title: 'Đưa đón học sinh',
        subtitle: 'An toàn - Tiện lợi - Chủ động thời gian',
        description:
            'Hỗ trợ đưa đón học sinh đến và về sau các buổi học một cách an toàn.',
        icon: Car,
        image:
            'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80',
        features: [
            'Đưa đón học sinh đến và từ buổi học',
            'Lộ trình linh hoạt theo nhu cầu gia đình',
            'Tài xế uy tín, an toàn',
            'Theo dõi hành trình và thời gian thực'
        ],
        button: 'Đăng ký đưa đón',
        link: '/dua-don-hoc-sinh',
        color: 'orange'
    }
];


export default function ServicePage() {

    return (
        <main className="service-page">


            {/* =================================================
                HERO
            ================================================= */}

            <section className="service-hero">

                <div className="service-hero-bg-circle service-hero-bg-circle-1" />

                <div className="service-hero-bg-circle service-hero-bg-circle-2" />


                <div className="service-container service-hero-content">

                    <div className="service-hero-text">

                        <div className="service-eyebrow">
                            DỊCH VỤ CỦA EDUCONNECT
                        </div>


                        <h1>
                            Đa dạng dịch vụ,
                            <br />
                            đáp ứng mọi nhu cầu học tập
                        </h1>


                        <p>
                            EduConnect mang đến hệ sinh thái hỗ trợ học tập toàn diện,
                            giúp học sinh dễ dàng tiếp cận giải pháp học tập phù hợp
                            với nhu cầu và điều kiện của gia đình.
                        </p>

                    </div>


                    <div className="service-hero-image">

                        <div className="hero-decoration graduation">
                            🎓
                        </div>


                        <div className="hero-person">

                            <img
                                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=85"
                                alt="Học sinh EduConnect"
                            />

                        </div>


                        <div className="hero-message">
                            Học theo cách
                            <br />
                            phù hợp nhất
                            <br />
                            với bạn! ♡
                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                SERVICES
            ================================================= */}

            <section className="service-list-section">

                <div className="service-container">

                    <div className="service-grid">

                        {services.map((service) => {

                            const Icon = service.icon;

                            return (
                                <article
                                    key={service.id}
                                    className={`service-card service-card-${service.color}`}
                                >


                                    {/* IMAGE */}

                                    <div className="service-card-image">

                                        <img
                                            src={service.image}
                                            alt={service.title}
                                        />


                                        <div className="service-card-icon">

                                            <Icon
                                                size={25}
                                                strokeWidth={2.5}
                                            />

                                        </div>

                                    </div>


                                    {/* CONTENT */}

                                    <div className="service-card-content">

                                        <h2>
                                            {service.title}
                                        </h2>


                                        <h3>
                                            {service.subtitle}
                                        </h3>


                                        <p className="service-card-description">
                                            {service.description}
                                        </p>


                                        <ul className="service-feature-list">

                                            {service.features.map(
                                                (feature) => (

                                                    <li key={feature}>

                                                        <span className="service-check">

                                                            <CheckCircle
                                                                size={17}
                                                            />

                                                        </span>

                                                        <span>
                                                            {feature}
                                                        </span>

                                                    </li>

                                                )
                                            )}

                                        </ul>


                                        {/* =========================
                                            BUTTON
                                        ========================= */}

                                        <Link
                                            to={service.link}
                                            className="service-card-button"
                                        >

                                            <span>
                                                {service.button}
                                            </span>

                                            <ArrowRight
                                                size={18}
                                            />

                                        </Link>

                                    </div>

                                </article>
                            );

                        })}

                    </div>

                </div>

            </section>


            {/* =================================================
                BOTTOM CTA
            ================================================= */}

            <section className="service-bottom">

                <div className="service-container service-bottom-inner">

                    <div className="service-bottom-text">

                        <h2>
                            Chưa biết dịch vụ nào phù hợp?
                        </h2>


                        <p>
                            Đội ngũ EduConnect luôn sẵn sàng tư vấn
                            và giúp bạn lựa chọn giải pháp học tập tốt nhất.
                        </p>


                        <Link
                            to="/danh-gia"
                            className="service-consult-button"
                        >

                            Nhận tư vấn ngay

                            <ArrowRight
                                size={17}
                            />

                        </Link>

                    </div>


                    <div className="service-bottom-image">

                        <img
                            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=500&q=80"
                            alt="Tư vấn EduConnect"
                        />

                    </div>

                </div>

            </section>

        </main>
    );
}