import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Heart,
    Star,
    MapPin,
    Video,
    Home,
    CalendarDays,
    CheckCircle,
    UserRoundSearch,
    MessageCircle,
    ClipboardCheck,
    Clock3
} from 'lucide-react';

import './TrialPage.css';


const tutors = [
    {
        id: 1,
        name: 'Nguyễn Hoàng Anh',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        role: 'Sinh viên',
        rating: 4.9,
        reviews: 120,
        lessons: 150,
        location: 'Quận 1, TP.HCM',
        subjects: ['Tiếng Anh', 'IELTS', 'Giao tiếp'],
        price: '200.000đ / giờ',
        trial: 'Học thử 1 buổi miễn phí',
        trialType: 'free',
        trialDetail: '(45 phút)',
        badge: 'Học thử miễn phí',
        form: 'Online / Tại nhà'
    },
    {
        id: 2,
        name: 'Trần Minh Đức',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        role: 'Giáo viên',
        rating: 4.8,
        reviews: 89,
        lessons: 320,
        location: 'Quận 3, TP.HCM',
        subjects: ['Toán', 'Vật lý', 'Luyện thi 10'],
        price: '250.000đ / giờ',
        trial: 'Học thử chỉ 50.000đ',
        trialType: 'discount',
        trialDetail: '(60 phút)',
        badge: 'Học thử giảm 50%',
        form: 'Online / Tại nhà'
    },
    {
        id: 3,
        name: 'Lê Thùy Linh',
        image: 'https://randomuser.me/api/portraits/women/68.jpg',
        role: 'Sinh viên',
        rating: 4.7,
        reviews: 85,
        lessons: 120,
        location: 'Bình Thạnh, TP.HCM',
        subjects: ['Ngữ văn', 'Kỹ năng viết', 'THCS'],
        price: '180.000đ / giờ',
        trial: 'Học thử 1 buổi miễn phí',
        trialType: 'free',
        trialDetail: '(45 phút)',
        badge: 'Học thử miễn phí',
        form: 'Online'
    },
    {
        id: 4,
        name: 'Phạm Gia Huy',
        image: 'https://randomuser.me/api/portraits/men/45.jpg',
        role: 'Giáo viên',
        rating: 4.9,
        reviews: 110,
        lessons: 260,
        location: 'Phú Nhuận, TP.HCM',
        subjects: ['Tiếng Trung', 'HSK', 'Giao tiếp'],
        price: '220.000đ / giờ',
        trial: 'Học thử chỉ 1.000đ',
        trialType: 'cheap',
        trialDetail: '(45 phút)',
        badge: 'Học thử 1K',
        form: 'Online / Tại nhà'
    },
    {
        id: 5,
        name: 'Trần Ngọc Mai',
        image: 'https://randomuser.me/api/portraits/women/65.jpg',
        role: 'Sinh viên',
        rating: 4.8,
        reviews: 76,
        lessons: 90,
        location: 'Quận 5, TP.HCM',
        subjects: ['Tiếng Nhật', 'JLPT', 'Giao tiếp'],
        price: '180.000đ / giờ',
        trial: 'Học thử 1 buổi miễn phí',
        trialType: 'free',
        trialDetail: '(45 phút)',
        badge: 'Học thử miễn phí',
        form: 'Online'
    },
    {
        id: 6,
        name: 'Hoàng Văn Phúc',
        image: 'https://randomuser.me/api/portraits/men/51.jpg',
        role: 'Chuyên gia',
        rating: 4.9,
        reviews: 101,
        lessons: 280,
        location: 'Quận 1, TP.HCM',
        subjects: ['Hóa học', 'Sinh học', 'Luyện thi ĐH'],
        price: '300.000đ / giờ',
        trial: 'Học thử chỉ 50.000đ',
        trialType: 'discount',
        trialDetail: '(60 phút)',
        badge: 'Học thử giảm 50%',
        form: 'Online'
    },
    {
        id: 7,
        name: 'Đỗ Bảo Ngọc',
        image: 'https://randomuser.me/api/portraits/women/32.jpg',
        role: 'Sinh viên',
        rating: 4.7,
        reviews: 92,
        lessons: 160,
        location: 'Bình Thạnh, TP.HCM',
        subjects: ['Tiếng Anh', 'IELTS', 'Phát âm'],
        price: '220.000đ / giờ',
        trial: 'Học thử 1 buổi miễn phí',
        trialType: 'free',
        trialDetail: '(45 phút)',
        badge: 'Học thử miễn phí',
        form: 'Online / Tại nhà'
    },
    {
        id: 8,
        name: 'Lý Minh Khôi',
        image: 'https://randomuser.me/api/portraits/men/68.jpg',
        role: 'Giáo viên',
        rating: 4.8,
        reviews: 134,
        lessons: 360,
        location: 'Gò Vấp, TP.HCM',
        subjects: ['Toán', 'THCS', 'Luyện thi vào 10'],
        price: '250.000đ / giờ',
        trial: 'Học thử chỉ 1.000đ',
        trialType: 'cheap',
        trialDetail: '(45 phút)',
        badge: 'Học thử 1K',
        form: 'Tại nhà'
    }
];


const quickFilters = [
    'Tiếng Anh',
    'Toán',
    'Ngữ văn',
    'Luyện thi vào 10',
    'Luyện thi Đại học',
    'Gia sư sinh viên',
    'Giáo viên',
    'Online',
    'Tại nhà'
];


function FilterSection({ title, children }) {
    return (
        <div className="trial-filter-section">

            <div className="trial-filter-title">
                <span>{title}</span>
                <ChevronDown size={15} />
            </div>

            {children}

        </div>
    );
}


function Checkbox({ label, checked = false }) {
    return (
        <label className="trial-checkbox">

            <input
                type="checkbox"
                defaultChecked={checked}
            />

            <span className="trial-check-box">
                {checked && <CheckCircle size={12} />}
            </span>

            <span>{label}</span>

        </label>
    );
}


export default function TrialPage() {

    const [activePage, setActivePage] = useState(1);

    const [search, setSearch] = useState('');

    const filteredTutors = tutors.filter((tutor) => {

        if (!search.trim()) {
            return true;
        }

        const keyword = search.toLowerCase();

        return (
            tutor.name.toLowerCase().includes(keyword) ||
            tutor.subjects.some((subject) =>
                subject.toLowerCase().includes(keyword)
            ) ||
            tutor.location.toLowerCase().includes(keyword)
        );
    });


    return (
        <main className="trial-page">

            {/* =====================================================
                BREADCRUMB
            ===================================================== */}

            <div className="trial-breadcrumb">

                <div className="trial-container">

                    <Link to="/">
                        Trang chủ
                    </Link>

                    <span>›</span>

                    <Link to="/dich-vu">
                        Dịch vụ
                    </Link>

                    <span>›</span>

                    <span className="current">
                        Học thử
                    </span>

                </div>

            </div>


            <div className="trial-container trial-layout">

                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside className="trial-sidebar">

                    <div className="trial-filter-header">

                        <h2>
                            Bộ lọc tìm kiếm
                        </h2>

                        <button
                            onClick={() => window.location.reload()}
                        >
                            Xóa tất cả
                        </button>

                    </div>


                    {/* MÔN HỌC */}

                    <FilterSection title="Môn học">

                        <div className="trial-filter-search">

                            <Search size={14} />

                            <input
                                placeholder="Tìm môn học..."
                            />

                        </div>

                        <Checkbox label="Toán" />
                        <Checkbox label="Vật lý" />
                        <Checkbox label="Hóa học" />
                        <Checkbox label="Sinh học" />
                        <Checkbox label="Ngữ văn" />

                        <Checkbox
                            label="Tiếng Anh"
                            checked
                        />

                        <Checkbox label="Tiếng Trung" />
                        <Checkbox label="Tiếng Nhật" />
                        <Checkbox label="Tin học" />
                        <Checkbox label="Khác" />

                    </FilterSection>


                    {/* CẤP HỌC */}

                    <FilterSection title="Cấp học">

                        <Checkbox label="Tiểu học" />

                        <Checkbox
                            label="THCS"
                            checked
                        />

                        <Checkbox label="THPT" />
                        <Checkbox label="Luyện thi vào 10" />
                        <Checkbox label="Luyện thi Đại học" />
                        <Checkbox label="Khác" />

                    </FilterSection>


                    {/* HÌNH THỨC HỌC THỬ */}

                    <FilterSection title="Hình thức học thử">

                        <Checkbox label="Online" />

                        <Checkbox
                            label="Tại nhà"
                            checked
                        />

                    </FilterSection>


                    {/* ĐỊA ĐIỂM */}

                    <FilterSection title="Địa điểm">

                        <div className="trial-select-group">

                            <select>
                                <option>TP. Hồ Chí Minh</option>
                            </select>

                            <select>
                                <option>Quận 1</option>
                                <option>Quận 3</option>
                                <option>Quận 5</option>
                                <option>Quận 7</option>
                                <option>Bình Thạnh</option>
                                <option>Gò Vấp</option>
                            </select>

                            <select>
                                <option>Phường / Xã</option>
                            </select>

                        </div>

                    </FilterSection>


                    {/* MỨC HỌC PHÍ */}

                    <FilterSection title="Mức học phí (VNĐ/giờ)">

                        <div className="trial-range">

                            <input
                                type="range"
                                min="50000"
                                max="500000"
                                defaultValue="150000"
                            />

                            <div>
                                <span>50.000</span>
                                <span>500.000</span>
                            </div>

                        </div>

                    </FilterSection>


                    {/* THỜI GIAN */}

                    <FilterSection title="Thời gian học thử">

                        <Checkbox label="Trong tuần" />
                        <Checkbox label="Cuối tuần" />

                    </FilterSection>

                </aside>


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <section className="trial-content">


                    {/* =================================================
                        HERO
                    ================================================= */}

                    <section className="trial-hero">

                        <div className="trial-hero-text">

                            <div className="trial-eyebrow">
                                DỊCH VỤ EDUCONNECT
                            </div>

                            <h1>
                                Học thử -
                                <br />
                                <span>Trải nghiệm trước khi đăng ký</span>
                            </h1>

                            <p>
                                Buổi học thử giúp bạn và gia sư hiểu nhau hơn,
                                đánh giá phương pháp giảng dạy và lựa chọn phù hợp nhất.
                            </p>


                            <div className="trial-benefits">

                                <div>
                                    <UserRoundSearch size={21} />
                                    <span>
                                        Trải nghiệm thực tế
                                        <br />
                                        phương pháp dạy
                                    </span>
                                </div>

                                <div>
                                    <Star size={21} />
                                    <span>
                                        Đánh giá chất lượng
                                        <br />
                                        gia sư
                                    </span>
                                </div>

                                <div>
                                    <ClipboardCheck size={21} />
                                    <span>
                                        Hỗ trợ tư vấn
                                        <br />
                                        sau buổi học
                                    </span>
                                </div>

                                <div>
                                    <Clock3 size={21} />
                                    <span>
                                        Dễ dàng chuyển sang
                                        <br />
                                        học chính thức
                                    </span>
                                </div>

                            </div>

                        </div>


                        <div className="trial-hero-image">

                            <img
                                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=85"
                                alt="Học thử EduConnect"
                            />

                            <div className="trial-hero-message">
                                Học thử hôm nay
                                <br />
                                Tự tin ngày mai! ♡
                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        SEARCH
                    ================================================= */}

                    <div className="trial-search">

                        <Search size={20} />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Tìm gia sư theo tên, môn học, khu vực..."
                        />

                        <button>
                            Tìm kiếm
                        </button>

                    </div>


                    {/* =================================================
                        QUICK FILTER
                    ================================================= */}

                    <div className="trial-quick-filter">

                        <strong>
                            Lọc nhanh:
                        </strong>

                        {quickFilters.map((filter, index) => (

                            <button
                                key={filter}
                                className={index === 0 ? 'active' : ''}
                            >
                                {filter}
                            </button>

                        ))}

                    </div>


                    {/* =================================================
                        RESULT HEADER
                    ================================================= */}

                    <div className="trial-result-header">

                        <strong>
                            Hiển thị {filteredTutors.length} gia sư
                            hỗ trợ học thử
                        </strong>


                        <div className="trial-sort">

                            <span>
                                Sắp xếp theo
                            </span>

                            <select>
                                <option>
                                    Phù hợp nhất
                                </option>

                                <option>
                                    Đánh giá cao nhất
                                </option>

                                <option>
                                    Giá thấp nhất
                                </option>

                                <option>
                                    Kinh nghiệm nhiều nhất
                                </option>
                            </select>

                            <button className="trial-view active">
                                ▦
                            </button>

                            <button className="trial-view">
                                ☰
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        TUTOR GRID
                    ================================================= */}

                    <div className="trial-tutor-grid">

                        {filteredTutors.map((tutor) => (

                            <article
                                className="trial-tutor-card"
                                key={tutor.id}
                            >

                                {/* Badge */}

                                <div
                                    className={`trial-badge trial-badge-${tutor.trialType}`}
                                >
                                    {tutor.badge}
                                </div>


                                {/* Favorite */}

                                <button className="trial-heart">
                                    <Heart size={18} />
                                </button>


                                {/* Avatar */}

                                <div className="trial-tutor-top">

                                    <div className="trial-avatar">

                                        <img
                                            src={tutor.image}
                                            alt={tutor.name}
                                        />

                                    </div>


                                    <div>

                                        <h3>
                                            {tutor.name}
                                            <span className="trial-verified">
                                                ✓
                                            </span>
                                        </h3>

                                        <span className="trial-role">
                                            {tutor.role}
                                        </span>


                                        <div className="trial-rating">

                                            <Star
                                                size={13}
                                                fill="currentColor"
                                            />

                                            <strong>
                                                {tutor.rating}
                                            </strong>

                                            <span>
                                                ({tutor.reviews} đánh giá)
                                            </span>

                                            <span>
                                                • {tutor.lessons} giờ dạy
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* Subjects */}

                                <div className="trial-subjects">

                                    {tutor.subjects.map(
                                        (subject) => (
                                            <span key={subject}>
                                                {subject}
                                            </span>
                                        )
                                    )}

                                </div>


                                {/* Location */}

                                <div className="trial-location">

                                    <MapPin size={13} />

                                    {tutor.location}

                                </div>


                                {/* Price */}

                                <div className="trial-price">

                                    {tutor.price}

                                </div>


                                {/* Trial */}

                                <div
                                    className={`trial-offer trial-offer-${tutor.trialType}`}
                                >

                                    <CheckCircle size={15} />

                                    <span>
                                        {tutor.trial}
                                        <small>
                                            {' '}{tutor.trialDetail}
                                        </small>
                                    </span>

                                </div>


                                {/* Buttons */}

                                <div className="trial-card-buttons">

                                    <Link
                                        to={`/gia-su/${tutor.id}`}
                                        className="trial-profile-button"
                                    >
                                        Xem hồ sơ
                                    </Link>


                                    <Link
                                        to={`/dat-lich?trial=true&tutor=${tutor.id}`}
                                        className="trial-book-button"
                                    >
                                        Đặt lịch học thử
                                    </Link>

                                </div>

                            </article>

                        ))}

                    </div>


                    {/* =================================================
                        PAGINATION
                    ================================================= */}

                    <div className="trial-pagination">

                        <button
                            onClick={() =>
                                setActivePage(
                                    Math.max(1, activePage - 1)
                                )
                            }
                        >
                            <ChevronLeft size={17} />
                        </button>


                        {[1, 2, 3, 4, 5].map(
                            (page) => (

                                <button
                                    key={page}
                                    className={
                                        activePage === page
                                            ? 'active'
                                            : ''
                                    }
                                    onClick={() =>
                                        setActivePage(page)
                                    }
                                >
                                    {page}
                                </button>

                            )
                        )}


                        <span>...</span>

                        <button>
                            10
                        </button>


                        <button
                            onClick={() =>
                                setActivePage(
                                    Math.min(
                                        10,
                                        activePage + 1
                                    )
                                )
                            }
                        >
                            <ChevronRight size={17} />
                        </button>

                    </div>


                    {/* =================================================
                        PROCESS
                    ================================================= */}

                    <section className="trial-process">

                        <div className="trial-process-title">

                            <h2>
                                Quy trình học thử tại EduConnect
                            </h2>

                        </div>


                        <div className="trial-process-list">

                            <div className="trial-process-item">

                                <div className="trial-process-icon">
                                    <Search size={21} />
                                </div>

                                <div>
                                    <strong>
                                        1. Chọn gia sư
                                    </strong>

                                    <span>
                                        và đặt lịch học thử
                                    </span>
                                </div>

                            </div>


                            <div className="trial-process-arrow">
                                ›
                            </div>


                            <div className="trial-process-item">

                                <div className="trial-process-icon">
                                    <CalendarDays size={21} />
                                </div>

                                <div>
                                    <strong>
                                        2. Xác nhận lịch
                                    </strong>

                                    <span>
                                        với gia sư
                                    </span>
                                </div>

                            </div>


                            <div className="trial-process-arrow">
                                ›
                            </div>


                            <div className="trial-process-item">

                                <div className="trial-process-icon">
                                    <Video size={21} />
                                </div>

                                <div>
                                    <strong>
                                        3. Tham gia buổi học thử
                                    </strong>

                                    <span>
                                        (Online hoặc tại nhà)
                                    </span>
                                </div>

                            </div>


                            <div className="trial-process-arrow">
                                ›
                            </div>


                            <div className="trial-process-item">

                                <div className="trial-process-icon">
                                    <ClipboardCheck size={21} />
                                </div>

                                <div>
                                    <strong>
                                        4. Đánh giá và quyết định
                                    </strong>

                                    <span>
                                        đăng ký học chính thức
                                    </span>
                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        CONSULT
                    ================================================= */}

                    <section className="trial-consult">

                        <div>

                            <span>
                                Bạn cần tư vấn thêm?
                            </span>

                            <p>
                                Đội ngũ EduConnect luôn sẵn sàng hỗ trợ!
                            </p>

                            <Link to="/lien-he">
                                Liên hệ ngay
                                <span>→</span>
                            </Link>

                        </div>


                        <div className="trial-consult-icon">
                            <MessageCircle size={40} />
                        </div>

                    </section>

                </section>

            </div>

        </main>
    );
}