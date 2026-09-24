import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    SlidersHorizontal,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Heart,
    Star,
    Clock3,
    Video,
    CheckCircle2,
    BookOpen,
    GraduationCap,
    Languages,
    X
} from 'lucide-react';
import { getTutors } from '../api/tutors';
import { getSubjects } from '../api/subjects';

import './OnlineTutorPage.css';


/* =========================================================
   DỮ LIỆU GIA SƯ
   ========================================================= */

const defaultSubjects = [
    'Toán', 'Ngữ văn', 'Tiếng Anh', 'Vật lý', 'Hóa học', 'Sinh học',
    'Lịch sử', 'Địa lý', 'Tin học', 'Lập trình', 'Kinh tế', 'Âm nhạc'
];


const grades = [
    'Tiểu học',
    'THCS',
    'THPT',
    'Luyện thi vào 10',
    'Luyện thi Đại học',
    'Khác'
];


const quickFilters = [
    'Tiếng Anh',
    'IELTS',
    'Toán',
    'Luyện thi Đại học',
    'Ngữ văn',
    'Tiếng Trung',
    'Tiếng Nhật'
];

const pageContentByMode = {
    online: {
        breadcrumb: 'Gia sư online',
        title: 'Gia sư online –',
        subtitle: 'Học mọi lúc, mọi nơi',
        description:
            'Kết nối với gia sư chất lượng qua lớp học trực tuyến. Linh hoạt thời gian, tiết kiệm chi phí, hiệu quả vượt trội.',
        typeLabel: 'Gia sư online',
        resultLabel: 'gia sư online phù hợp',
        statusLabel: 'Online',
        sessionLabel: 'Học trực tuyến',
        sessionStatus: '● Đang kết nối'
    },
    offline: {
        breadcrumb: 'Gia sư tại nhà',
        title: 'Gia sư tại nhà –',
        subtitle: 'Đồng hành sát sao',
        description:
            'Kết nối với gia sư phù hợp ngay tại khu vực của bạn. Học trực tiếp, theo sát tiến độ và linh hoạt lịch học.',
        typeLabel: 'Gia sư tại nhà',
        resultLabel: 'gia sư tại nhà phù hợp',
        statusLabel: 'Tại nhà',
        sessionLabel: 'Học tại nhà',
        sessionStatus: '● Sẵn sàng nhận lớp'
    }
};


/* =========================================================
   COMPONENT
   ========================================================= */

export default function OnlineTutorPage({ mode = 'online' }) {
    const [tutorsList, setTutorsList] = useState([]);
    const [subjectsList, setSubjectsList] = useState(defaultSubjects);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        Promise.all([
            getTutors({ mode, paginate: false }),
            getSubjects()
        ]).then(([tutorsData, subjectsData]) => {
            if (isMounted) {
                const list = Array.isArray(tutorsData) ? tutorsData : (tutorsData?.items || []);
                setTutorsList(list);
                if (subjectsData && subjectsData.length > 0) {
                    setSubjectsList(subjectsData.map(s => s.name));
                }
                setLoading(false);
            }
        }).catch(err => {
            console.error('Error fetching online tutors:', err);
            if (isMounted) setLoading(false);
        });
        return () => { isMounted = false; };
    }, [mode]);

    const tutors = useMemo(() => {
        return tutorsList.map((tutor) => ({
            id: tutor.id,
            name: tutor.name,
            avatar: tutor.avatar,
            subject: tutor.subjects?.[0] || 'Toán',
            tags: [...(tutor.subjects || []), ...(tutor.levels || [])],
            experience: `${tutor.experience} năm`,
            rating: tutor.rating,
            reviews: tutor.reviewCount,
            lessons: tutor.completedLessons,
            price: tutor.pricePerHour,
            online: tutor.teachingMode?.includes('online'),
            offline: tutor.teachingMode?.includes('offline'),
            available: true,
            description: tutor.bio
        }));
    }, [tutorsList]);

    const subjects = subjectsList;

    const pageContent = pageContentByMode[mode] ?? pageContentByMode.online;

    const [search, setSearch] = useState('');

    const [selectedSubject, setSelectedSubject] = useState(
        'Tiếng Anh'
    );

    const [selectedGrade, setSelectedGrade] = useState('');

    const [onlyAvailable, setOnlyAvailable] = useState(true);

    const [sortBy, setSortBy] = useState('Phù hợp nhất');

    const [maxPrice, setMaxPrice] = useState(500000);

    const [selectedRating, setSelectedRating] = useState('');

    const [selectedType, setSelectedType] = useState(mode);

    const [currentPage, setCurrentPage] = useState(1);


    /* =======================================================
       FILTER
       ======================================================= */

    const filteredTutors = useMemo(() => {

        let result = [...tutors];


        /* Search */
        if (search.trim()) {

            const keyword = search.toLowerCase().trim();

            result = result.filter((tutor) => {

                return (
                    tutor.name.toLowerCase().includes(keyword) ||
                    tutor.subject.toLowerCase().includes(keyword) ||
                    tutor.tags.some((tag) =>
                        tag.toLowerCase().includes(keyword)
                    )
                );

            });
        }


        /* Subject */
        if (selectedSubject) {

            result = result.filter((tutor) => {

                return (
                    tutor.subject === selectedSubject ||
                    tutor.tags.includes(selectedSubject)
                );

            });
        }


        /* Grade */
        if (selectedGrade) {

            result = result.filter((tutor) => {

                return tutor.tags.includes(selectedGrade);

            });

        }


        /* Available */
        if (onlyAvailable) {

            result = result.filter(
                (tutor) => tutor.available
            );

        }


        /* Price */
        result = result.filter(
            (tutor) => tutor.price <= maxPrice
        );


        /* Rating */
        if (selectedRating) {

            const rating = Number(selectedRating);

            result = result.filter(
                (tutor) => tutor.rating >= rating
            );

        }


        /* Type */
        if (selectedType) {

            result = result.filter(
                (tutor) => tutor[selectedType]
            );

        }


        /* Sort */
        if (sortBy === 'Giá thấp nhất') {

            result.sort(
                (a, b) => a.price - b.price
            );

        } else if (sortBy === 'Đánh giá cao nhất') {

            result.sort(
                (a, b) => b.rating - a.rating
            );

        } else if (sortBy === 'Kinh nghiệm') {

            result.sort(
                (a, b) =>
                    parseInt(b.experience) -
                    parseInt(a.experience)
            );

        }


        return result;

    }, [
        search,
        selectedSubject,
        selectedGrade,
        onlyAvailable,
        maxPrice,
        selectedRating,
        selectedType,
        sortBy
    ]);


    /* =======================================================
       RESET
       ======================================================= */

    const resetFilters = () => {

        setSearch('');

        setSelectedSubject('');

        setSelectedGrade('');

        setOnlyAvailable(false);

        setMaxPrice(500000);

        setSelectedRating('');

        setSelectedType(mode);

        setSortBy('Phù hợp nhất');

        setCurrentPage(1);

    };


    /* =======================================================
       FORMAT PRICE
       ======================================================= */

    const formatPrice = (price) => {

        return new Intl.NumberFormat('vi-VN').format(
            price
        );

    };


    return (
        <main className="online-tutor-page">


            {/* ===================================================
          BREADCRUMB
          =================================================== */}

            <div className="online-breadcrumb">

                <div className="container">

                    <div className="breadcrumb-content">

                        <Link to="/">
                            Trang chủ
                        </Link>

                        <span>›</span>

                        <Link to="/dich-vu">
                            Dịch vụ
                        </Link>

                        <span>›</span>

                        <span className="current">
                            {pageContent.breadcrumb}
                        </span>

                    </div>

                </div>

            </div>


            {/* ===================================================
          MAIN
          =================================================== */}

            <div className="container online-layout">


                {/* =================================================
            SIDEBAR
            ================================================= */}

                <aside className="tutor-filter-sidebar">

                    <div className="filter-header">

                        <div>
                            <SlidersHorizontal size={17} />

                            <span>
                                Bộ lọc tìm kiếm
                            </span>
                        </div>

                        <button
                            onClick={resetFilters}
                        >
                            Xóa tất cả
                        </button>

                    </div>


                    {/* Môn học */}

                    <FilterSection
                        title="Môn học"
                        icon={<BookOpen size={15} />}
                    >

                        <div className="filter-search">

                            <Search size={14} />

                            <input
                                placeholder="Tìm môn học..."
                            />

                        </div>


                        <div className="checkbox-list">

                            {subjects.map((subject) => (

                                <label
                                    key={subject}
                                    className="checkbox-item"
                                >

                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedSubject === subject
                                        }
                                        onChange={() => {

                                            setSelectedSubject(
                                                selectedSubject === subject
                                                    ? ''
                                                    : subject
                                            );

                                            setCurrentPage(1);

                                        }}
                                    />

                                    <span>
                                        {subject}
                                    </span>

                                </label>

                            ))}

                        </div>

                    </FilterSection>


                    {/* Cấp học */}

                    <FilterSection
                        title="Cấp học"
                        icon={<GraduationCap size={15} />}
                    >

                        <div className="checkbox-list">

                            {grades.map((grade) => (

                                <label
                                    key={grade}
                                    className="checkbox-item"
                                >

                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedGrade === grade
                                        }
                                        onChange={() => {

                                            setSelectedGrade(
                                                selectedGrade === grade
                                                    ? ''
                                                    : grade
                                            );

                                            setCurrentPage(1);

                                        }}
                                    />

                                    <span>
                                        {grade}
                                    </span>

                                </label>

                            ))}

                        </div>

                    </FilterSection>


                    {/* Mức học phí */}

                    <FilterSection
                        title="Mức học phí (VNĐ/giờ)"
                        icon={<span>₫</span>}
                    >

                        <div className="price-range">

                            <div className="price-labels">

                                <span>
                                    50.000đ
                                </span>

                                <span>
                                    {formatPrice(maxPrice)}đ
                                </span>

                            </div>

                            <input
                                type="range"
                                min="50000"
                                max="500000"
                                step="10000"
                                value={maxPrice}
                                onChange={(e) => {
                                    setMaxPrice(
                                        Number(e.target.value)
                                    );

                                    setCurrentPage(1);
                                }}
                            />

                        </div>

                    </FilterSection>


                    {/* Khung giờ */}

                    <FilterSection
                        title="Khung giờ học"
                        icon={<Clock3 size={15} />}
                    >

                        <select className="filter-select">

                            <option>
                                Chọn khung giờ
                            </option>

                            <option>
                                Sáng
                            </option>

                            <option>
                                Chiều
                            </option>

                            <option>
                                Tối
                            </option>

                        </select>

                    </FilterSection>


                    {/* Đánh giá */}

                    <FilterSection
                        title="Đánh giá"
                        icon={<Star size={15} />}
                    >

                        {[4.5, 4, 3.5, 3].map(
                            (rating) => (

                                <label
                                    key={rating}
                                    className="checkbox-item rating-filter"
                                >

                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedRating ===
                                            String(rating)
                                        }
                                        onChange={() => {

                                            setSelectedRating(
                                                selectedRating ===
                                                    String(rating)
                                                    ? ''
                                                    : String(rating)
                                            );

                                        }}
                                    />

                                    <span className="stars">

                                        {'★'.repeat(
                                            Math.floor(rating)
                                        )}

                                        <span className="rating-number">
                                            {rating} trở lên
                                        </span>

                                    </span>

                                </label>

                            )
                        )}

                    </FilterSection>


                    {/* Kinh nghiệm */}

                    <FilterSection
                        title="Kinh nghiệm"
                        icon={<GraduationCap size={15} />}
                    >

                        <select className="filter-select">

                            <option>
                                Tất cả kinh nghiệm
                            </option>

                            <option>
                                Dưới 1 năm
                            </option>

                            <option>
                                1 - 3 năm
                            </option>

                            <option>
                                3 - 5 năm
                            </option>

                            <option>
                                Trên 5 năm
                            </option>

                        </select>

                    </FilterSection>


                    {/* Loại hình */}

                    <FilterSection
                        title="Loại hình"
                        icon={<Video size={15} />}
                    >

                        <label className="checkbox-item">

                            <input
                                type="checkbox"
                                checked={
                                    selectedType === mode
                                }
                                onChange={() => {

                                    setSelectedType(
                                        selectedType === mode
                                            ? ''
                                            : mode
                                    );

                                }}
                            />

                            <span>
                                {pageContent.typeLabel}
                            </span>

                        </label>

                        <label className="checkbox-item">

                            <input type="checkbox" />

                            <span>
                                Sinh viên
                            </span>

                        </label>

                    </FilterSection>

                </aside>


                {/* =================================================
            CONTENT
            ================================================= */}

                <section className="online-tutor-content">


                    {/* =================================================
              HERO
              ================================================= */}

                    <section className="online-hero">

                        <div className="hero-content">

                            <span className="hero-label">
                                DỊCH VỤ EDUCONNECT
                            </span>

                            <h1>
                                {pageContent.title}
                                <br />
                                {pageContent.subtitle}
                            </h1>

                            <p>
                                {pageContent.description}
                            </p>


                            <div className="hero-features">

                                <div className="hero-feature">

                                    <div className="hero-feature-icon">
                                        <Languages size={17} />
                                    </div>

                                    <span>
                                        Học 1 kèm 1 hoặc
                                        <br />
                                        nhóm nhỏ
                                    </span>

                                </div>


                                <div className="hero-feature">

                                    <div className="hero-feature-icon">
                                        <Video size={17} />
                                    </div>

                                    <span>
                                        Tương tác trực tiếp
                                        <br />
                                        qua video call
                                    </span>

                                </div>


                                <div className="hero-feature">

                                    <div className="hero-feature-icon">
                                        <BookOpen size={17} />
                                    </div>

                                    <span>
                                        Tài liệu học tập được
                                        <br />
                                        chia sẻ
                                    </span>

                                </div>


                                <div className="hero-feature">

                                    <div className="hero-feature-icon">
                                        <CheckCircle2 size={17} />
                                    </div>

                                    <span>
                                        Phù hợp mọi
                                        <br />
                                        cấp học
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* Hero illustration */}

                        <div className="hero-illustration">

                            <div className="hero-circle"></div>

                            <div className="hero-person">

                                <img
                                    src="https://i.pravatar.cc/350?img=47"
                                    alt={pageContent.breadcrumb}
                                />

                            </div>


                            <div className="video-call-card">

                                <div className="video-avatar">
                                    <img
                                        src="https://i.pravatar.cc/100?img=12"
                                        alt="Học sinh"
                                    />
                                </div>

                                <div className="video-info">

                                    <strong>
                                        {pageContent.sessionLabel}
                                    </strong>

                                    <span>
                                        {pageContent.sessionStatus}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
              SEARCH
              ================================================= */}

                    <div className="online-search-section">

                        <div className="main-search">

                            <Search size={19} />

                            <input
                                value={search}
                                onChange={(e) => {

                                    setSearch(e.target.value);

                                    setCurrentPage(1);

                                }}
                                placeholder="Tìm kiếm gia sư theo tên, môn học, trường học..."
                            />

                            {search && (

                                <button
                                    className="clear-search"
                                    onClick={() => setSearch('')}
                                >
                                    <X size={16} />
                                </button>

                            )}

                            <button
                                className="search-button"
                            >
                                Tìm kiếm
                            </button>

                        </div>


                        <label className="available-checkbox">

                            <input
                                type="checkbox"
                                checked={onlyAvailable}
                                onChange={(e) => {

                                    setOnlyAvailable(
                                        e.target.checked
                                    );

                                    setCurrentPage(1);

                                }}
                            />

                            <span>
                                Chỉ hiện gia sư có thể học ngay
                            </span>

                        </label>

                    </div>


                    {/* =================================================
              QUICK FILTER
              ================================================= */}

                    <div className="quick-filter-row">

                        <div className="quick-filter-left">

                            <strong>
                                Lọc nhanh:
                            </strong>

                            {quickFilters.map(
                                (filter) => (

                                    <button
                                        key={filter}
                                        className={
                                            selectedSubject === filter
                                                ? 'quick-filter active'
                                                : 'quick-filter'
                                        }
                                        onClick={() => {

                                            setSelectedSubject(
                                                selectedSubject === filter
                                                    ? ''
                                                    : filter
                                            );

                                            setCurrentPage(1);

                                        }}
                                    >
                                        {filter}
                                    </button>

                                )
                            )}

                        </div>


                        <div className="sort-wrapper">

                            <span>
                                Sắp xếp theo
                            </span>

                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(e.target.value)
                                }
                            >

                                <option>
                                    Phù hợp nhất
                                </option>

                                <option>
                                    Giá thấp nhất
                                </option>

                                <option>
                                    Đánh giá cao nhất
                                </option>

                                <option>
                                    Kinh nghiệm
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* =================================================
              RESULT HEADER
              ================================================= */}

                    <div className="result-header">

                        <strong>
                            Hiển thị {filteredTutors.length}{' '}
                            {pageContent.resultLabel}
                        </strong>

                        <div className="view-buttons">

                            <button className="active">
                                ▦
                            </button>

                            <button>
                                ☰
                            </button>

                        </div>

                    </div>


                    {/* =================================================
              TUTOR GRID
              ================================================= */}

                    {filteredTutors.length > 0 ? (

                        <div className="tutor-grid">

                            {filteredTutors.map(
                                (tutor) => (

                                    <TutorCard
                                        key={tutor.id}
                                        tutor={tutor}
                                        formatPrice={formatPrice}
                                        mode={mode}
                                    />

                                )
                            )}

                        </div>

                    ) : (

                        <div className="empty-result">

                            <Search size={40} />

                            <h3>
                                Không tìm thấy gia sư
                            </h3>

                            <p>
                                Hãy thử thay đổi bộ lọc hoặc từ khóa
                                tìm kiếm.
                            </p>

                            <button
                                onClick={resetFilters}
                            >
                                Xóa bộ lọc
                            </button>

                        </div>

                    )}


                    {/* =================================================
              PAGINATION
              ================================================= */}

                    <div className="pagination">

                        <button
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage(
                                    Math.max(1, currentPage - 1)
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
                                        currentPage === page
                                            ? 'active'
                                            : ''
                                    }
                                    onClick={() =>
                                        setCurrentPage(page)
                                    }
                                >
                                    {page}
                                </button>

                            )
                        )}


                        <span>
                            ...
                        </span>


                        <button>
                            10
                        </button>


                        <button
                            onClick={() =>
                                setCurrentPage(
                                    Math.min(10, currentPage + 1)
                                )
                            }
                        >
                            <ChevronRight size={17} />
                        </button>

                    </div>

                </section>

            </div>

        </main>
    );
}


/* =========================================================
   FILTER SECTION
   ========================================================= */

function FilterSection({
    title,
    icon,
    children
}) {

    return (
        <div className="filter-section">

            <div className="filter-section-title">

                <div>
                    {icon}

                    <span>
                        {title}
                    </span>
                </div>

                <ChevronDown size={14} />

            </div>

            <div className="filter-section-content">
                {children}
            </div>

        </div>
    );
}


/* =========================================================
   TUTOR CARD
   ========================================================= */

function TutorCard({
    tutor,
    formatPrice,
    mode
}) {

    return (
        <article className="tutor-card">


            {/* Card top */}

            <div className="tutor-card-top">

                <div className="tutor-avatar-wrapper">

                    <img
                        src={tutor.avatar}
                        alt={tutor.name}
                        className="tutor-avatar"
                    />

                    {tutor.available && (

                        <span className="online-status">
                            {pageContentByMode[mode]?.statusLabel ?? 'Online'}
                        </span>

                    )}

                </div>


                <button
                    className="favorite-button"
                    title="Yêu thích"
                >
                    <Heart size={17} />
                </button>

            </div>


            {/* Name */}

            <div className="tutor-info">

                <h3>

                    {tutor.name}

                    <CheckCircle2
                        size={13}
                        className="verified-icon"
                    />

                </h3>


                <div className="tutor-meta">

                    <span>
                        {tutor.experience}
                    </span>

                    <span>
                        <Star
                            size={12}
                            fill="currentColor"
                        />

                        {tutor.rating}
                    </span>

                    <span>
                        ({tutor.reviews} đánh giá)
                    </span>

                </div>


                <div className="lesson-count">

                    <Clock3 size={12} />

                    {tutor.lessons} giờ dạy

                </div>


                {/* Tags */}

                <div className="tutor-tags">

                    {tutor.tags.map(
                        (tag) => (

                            <span key={tag}>
                                {tag}
                            </span>

                        )
                    )}

                </div>


                {/* Price */}

                <div className="tutor-price">

                    <strong>
                        {formatPrice(tutor.price)}
                    </strong>

                    <span>
                        đ / giờ
                    </span>

                </div>


                {tutor.available && (

                    <div className="available-now">

                        <span className="available-dot"></span>

                        Có thể học ngay

                    </div>

                )}

            </div>


            {/* Buttons */}

            <div className="tutor-actions">

                <Link
                    to={`/gia-su/${tutor.id}`}
                    className="view-profile-button"
                >
                    Xem hồ sơ
                </Link>

                <Link
                    to={`/dat-lich?tutorId=${tutor.id}`}
                    className="book-button"
                >
                    Đặt lịch học
                </Link>

            </div>

        </article>
    );
}
