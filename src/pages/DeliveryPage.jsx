import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
    MapPin,
    ArrowLeftRight,
    CalendarDays,
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Heart,
    Star,
    ShieldCheck,
    Users,
    Bell,
    Handshake,
    HeartHandshake,
    Clock3,
    Car,
    Navigation,
    CheckCircle,
    MapPinned
} from 'lucide-react';

import './DeliveryPage.css';


const drivers = [
    {
        id: 1,
        name: 'Nguyễn Văn Minh',
        image:
            'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 4.9,
        reviews: 56,
        experience: '2 năm kinh nghiệm',
        vehicle: 'Xe 7 chỗ',
        service: 'Đưa đón 2 chiều',
        price: '2.000.000đ/tháng',
        distance: '1 - 15 km',
        location: 'Quận 1, TP.HCM',
        description:
            'Luôn đúng giờ, ưu tiên sự an toàn của các em.',
        tags: [
            'Xe 7 chỗ',
            'Camera giám sát',
            'Đưa đón 2 chiều'
        ]
    },

    {
        id: 2,
        name: 'Trần Thị Lan',
        image:
            'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 4.8,
        reviews: 42,
        experience: '3 năm kinh nghiệm',
        vehicle: 'Xe 4 chỗ',
        service: 'Đưa đón 1/2 chiều',
        price: '1.500.000đ/tháng',
        distance: '1 - 10 km',
        location: 'Quận 3, TP.HCM',
        description:
            'Tận tâm như người thân trong gia đình.',
        tags: [
            'Xe 4 chỗ',
            'Đưa đón 1/2 chiều',
            'Linh hoạt thời gian'
        ]
    },

    {
        id: 3,
        name: 'Lê Quang Huy',
        image:
            'https://randomuser.me/api/portraits/men/45.jpg',
        rating: 4.9,
        reviews: 73,
        experience: '4 năm kinh nghiệm',
        vehicle: 'Xe 7 chỗ',
        service: 'Đưa đón 2 chiều',
        price: '2.500.000đ/tháng',
        distance: '5 - 20 km',
        location: 'Quận 7, TP.HCM',
        description:
            'Đưa đón an toàn - Phụ huynh yên tâm.',
        tags: [
            'Xe 7 chỗ',
            'Camera giám sát',
            'Có người giám hộ'
        ]
    },

    {
        id: 4,
        name: 'Phạm Đức Tài',
        image:
            'https://randomuser.me/api/portraits/men/67.jpg',
        rating: 4.7,
        reviews: 28,
        experience: '2 năm kinh nghiệm',
        vehicle: 'Xe 7 chỗ',
        service: 'Đưa đón theo buổi',
        price: '1.800.000đ/tháng',
        distance: '1 - 15 km',
        location: 'Thủ Đức, TP.HCM',
        description:
            'Đúng giờ - An toàn - Thân thiện.',
        tags: [
            'Xe 7 chỗ',
            'Đưa đón theo buổi',
            'Linh hoạt lộ trình'
        ]
    }
];


function FilterSection({ title, children }) {
    return (
        <div className="delivery-filter-section">

            <div className="delivery-filter-title">
                <span>{title}</span>
                <ChevronDown size={16} />
            </div>

            {children}

        </div>
    );
}


function Checkbox({ label, checked = false }) {
    return (
        <label className="delivery-checkbox">

            <input
                type="checkbox"
                defaultChecked={checked}
            />

            <span className="delivery-checkbox-box">
                {checked && <CheckCircle size={13} />}
            </span>

            <span>
                {label}
            </span>

        </label>
    );
}


export default function DeliveryPage() {

    const [activePage, setActivePage] = useState(1);

    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');

    const handleSearch = () => {
        console.log('Điểm đón:', pickup);
        console.log('Điểm đến:', destination);
    };


    return (
        <main className="delivery-page">

            {/* =====================================================
                BREADCRUMB
            ===================================================== */}

            <div className="delivery-breadcrumb">

                <div className="delivery-container">

                    <Link to="/">
                        Trang chủ
                    </Link>

                    <span>›</span>

                    <Link to="/dich-vu">
                        Dịch vụ
                    </Link>

                    <span>›</span>

                    <span className="current">
                        Đưa đón học sinh
                    </span>

                </div>

            </div>


            {/* =====================================================
                MAIN
            ===================================================== */}

            <div className="delivery-container delivery-layout">


                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside className="delivery-sidebar">

                    <div className="delivery-filter-header">

                        <h2>
                            Bộ lọc tìm kiếm
                        </h2>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                        >
                            Xóa tất cả
                        </button>

                    </div>


                    {/* KHU VỰC */}

                    <FilterSection title="Khu vực">

                        <select className="delivery-select">
                            <option>TP. Hồ Chí Minh</option>
                            <option>Hà Nội</option>
                            <option>Đà Nẵng</option>
                        </select>

                        <select className="delivery-select">
                            <option>Quận / Huyện</option>
                            <option>Quận 1</option>
                            <option>Quận 3</option>
                            <option>Quận 7</option>
                            <option>Thủ Đức</option>
                        </select>

                        <select className="delivery-select">
                            <option>Phường / Xã</option>
                        </select>

                    </FilterSection>


                    {/* LOẠI DỊCH VỤ */}

                    <FilterSection title="Loại dịch vụ">

                        <Checkbox
                            label="Đưa đón 1 chiều"
                            checked
                        />

                        <Checkbox
                            label="Đưa đón 2 chiều"
                            checked
                        />

                        <Checkbox
                            label="Đưa đón theo tháng"
                        />

                        <Checkbox
                            label="Đưa đón theo buổi"
                        />

                        <Checkbox
                            label="Đưa đón linh hoạt"
                        />

                    </FilterSection>


                    {/* CẤP HỌC */}

                    <FilterSection title="Cấp học">

                        <Checkbox
                            label="Tiểu học"
                            checked
                        />

                        <Checkbox
                            label="THCS"
                        />

                        <Checkbox
                            label="THPT"
                        />

                        <Checkbox
                            label="Khác"
                        />

                    </FilterSection>


                    {/* KHOẢNG CÁCH */}

                    <FilterSection title="Khoảng cách tối đa">

                        <div className="delivery-range">

                            <input
                                type="range"
                                min="1"
                                max="20"
                                defaultValue="20"
                            />

                            <div>
                                <span>1 km</span>
                                <span>20 km</span>
                            </div>

                        </div>

                    </FilterSection>


                    {/* MỨC PHÍ */}

                    <FilterSection title="Mức phí (VNĐ/tháng)">

                        <div className="delivery-range">

                            <input
                                type="range"
                                min="500000"
                                max="3000000"
                                defaultValue="1500000"
                            />

                            <div>
                                <span>500.000</span>
                                <span>3.000.000</span>
                            </div>

                        </div>

                    </FilterSection>


                    {/* THỜI GIAN */}

                    <FilterSection title="Thời gian đưa đón">

                        <Checkbox
                            label="Sáng (6h - 8h)"
                            checked
                        />

                        <Checkbox
                            label="Trưa (10h - 13h)"
                        />

                        <Checkbox
                            label="Chiều (15h - 17h)"
                            checked
                        />

                        <Checkbox
                            label="Tối (17h - 19h)"
                        />

                    </FilterSection>


                    {/* TIỆN ÍCH */}

                    <FilterSection title="Tiện ích khác">

                        <Checkbox
                            label="Xe 4 chỗ"
                            checked
                        />

                        <Checkbox
                            label="Xe 7 chỗ"
                            checked
                        />

                        <Checkbox
                            label="Có camera giám sát"
                        />

                        <Checkbox
                            label="Có người giám hộ đi kèm"
                        />

                    </FilterSection>

                </aside>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <section className="delivery-content">


                    {/* =================================================
                        HERO
                    ================================================= */}




                    {/* =================================================
                        SEARCH
                    ================================================= */}

                    <section className="delivery-search">

                        <div className="delivery-search-field">

                            <MapPin size={20} />

                            <input
                                value={pickup}
                                onChange={(e) =>
                                    setPickup(e.target.value)
                                }
                                placeholder="Nhập điểm đón (ví dụ: 123 Nguyễn Văn Cừ, Quận 1)"
                            />

                        </div>


                        <button
                            className="delivery-swap"
                            type="button"
                            onClick={() => {
                                const temp = pickup;
                                setPickup(destination);
                                setDestination(temp);
                            }}
                        >
                            <ArrowLeftRight size={18} />
                        </button>


                        <div className="delivery-search-field">

                            <MapPin size={20} />

                            <input
                                value={destination}
                                onChange={(e) =>
                                    setDestination(e.target.value)
                                }
                                placeholder="Nhập điểm đến (ví dụ: Trường THCS Nguyễn Du)"
                            />

                        </div>


                        <button className="delivery-time">

                            <CalendarDays size={18} />

                            <span>
                                Chọn khung giờ
                            </span>

                            <ChevronDown size={15} />

                        </button>


                        <button
                            className="delivery-search-button"
                            onClick={handleSearch}
                        >
                            <Search size={18} />
                            Tìm kiếm
                        </button>

                    </section>


                    {/* =================================================
                        RESULT HEADER
                    ================================================= */}

                    <div className="delivery-result-header">

                        <strong>
                            Có 18 tài xế/đối tác phù hợp
                        </strong>


                        <div className="delivery-sort">

                            <span>
                                Sắp xếp theo
                            </span>

                            <select>
                                <option>
                                    Phù hợp nhất
                                </option>

                                <option>
                                    Giá thấp nhất
                                </option>

                                <option>
                                    Khoảng cách gần nhất
                                </option>

                                <option>
                                    Đánh giá cao nhất
                                </option>
                            </select>


                            <button className="delivery-view-button active">
                                ▦
                            </button>

                            <button className="delivery-view-button">
                                ☰
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        RESULT BODY
                    ================================================= */}

                    <div className="delivery-result-grid">


                        {/* =============================================
                            DRIVER LIST
                        ============================================= */}

                        <div className="delivery-driver-list">

                            {drivers.map((driver) => (

                                <article
                                    className="driver-card"
                                    key={driver.id}
                                >

                                    <div className="driver-avatar">

                                        <img
                                            src={driver.image}
                                            alt={driver.name}
                                        />

                                    </div>


                                    <div className="driver-info">

                                        <div className="driver-name-row">

                                            <h3>
                                                {driver.name}
                                            </h3>

                                            <span className="verified">
                                                ✓
                                            </span>

                                        </div>


                                        <div className="driver-rating">

                                            <Star
                                                size={14}
                                                fill="currentColor"
                                            />

                                            <strong>
                                                {driver.rating}
                                            </strong>

                                            <span>
                                                ({driver.reviews} đánh giá)
                                            </span>

                                            <span>
                                                • {driver.experience}
                                            </span>

                                        </div>


                                        <div className="driver-tags">

                                            {driver.tags.map(
                                                (tag) => (
                                                    <span key={tag}>
                                                        {tag}
                                                    </span>
                                                )
                                            )}

                                        </div>


                                        <p className="driver-description">
                                            “{driver.description}”
                                        </p>

                                    </div>


                                    <div className="driver-price">

                                        <strong>
                                            {driver.price}
                                        </strong>

                                        <span>
                                            ({driver.distance})
                                        </span>

                                        <div className="driver-location">
                                            <MapPin size={13} />
                                            {driver.location}
                                        </div>


                                        <button>
                                            Xem chi tiết
                                        </button>

                                    </div>


                                    <button className="driver-heart">
                                        <Heart size={18} />
                                    </button>

                                </article>

                            ))}


                            {/* PAGINATION */}

                            <div className="delivery-pagination">

                                <button
                                    onClick={() =>
                                        setActivePage(
                                            Math.max(
                                                1,
                                                activePage - 1
                                            )
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

                        </div>


                        {/* =============================================
                            MAP
                        ============================================= */}

                        <div className="delivery-map-column">

                            <div className="delivery-map-tabs">

                                <button className="active">
                                    <MapPinned size={16} />
                                    Bản đồ
                                </button>

                                <button>
                                    Danh sách
                                </button>

                                <label>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                    />
                                    Hiển thị tài xế gần bạn
                                </label>

                            </div>


                            <div className="delivery-map">

                                {/* Fake map background */}

                                <div className="map-road road-1" />
                                <div className="map-road road-2" />
                                <div className="map-road road-3" />
                                <div className="map-road road-4" />
                                <div className="map-road road-5" />


                                <span className="map-district district-1">
                                    Bình Thạnh
                                </span>

                                <span className="map-district district-2">
                                    Quận 3
                                </span>

                                <span className="map-district district-3">
                                    Quận 7
                                </span>

                                <span className="map-district district-4">
                                    Thủ Đức
                                </span>


                                <div className="map-home">
                                    <Navigation size={20} />
                                </div>


                                <div className="map-driver driver-marker-1">
                                    <Car size={18} />
                                </div>

                                <div className="map-driver driver-marker-2">
                                    <Car size={18} />
                                </div>

                                <div className="map-driver driver-marker-3">
                                    <Car size={18} />
                                </div>

                                <div className="map-driver driver-marker-4">
                                    <Car size={18} />
                                </div>


                                <div className="map-distance">
                                    Tài xế cách bạn
                                    <strong>
                                        2.5 km
                                    </strong>
                                </div>


                                <button className="map-location-button">
                                    <Navigation size={18} />
                                </button>

                            </div>


                            {/* =========================================
                                TRACKING
                            ========================================= */}

                            <div className="delivery-map-bottom">

                                <div className="tracking-card">

                                    <div className="tracking-image">
                                        <img
                                            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=500&q=80"
                                            alt="Theo dõi hành trình"
                                        />
                                    </div>


                                    <div>

                                        <h3>
                                            Theo dõi hành trình đưa đón
                                        </h3>

                                        <p>
                                            Cập nhật vị trí theo thời gian thực,
                                            nhận thông báo khi tài xế đến đón.
                                        </p>

                                        <button>
                                            Tìm hiểu thêm →
                                        </button>

                                    </div>

                                </div>


                                <div className="safety-card">

                                    <ShieldCheck size={31} />

                                    <h3>
                                        Cam kết an toàn
                                    </h3>

                                    <ul>

                                        <li>
                                            <CheckCircle size={14} />
                                            Tài xế được xác minh
                                        </li>

                                        <li>
                                            <CheckCircle size={14} />
                                            Xe chất lượng, bảo dưỡng định kỳ
                                        </li>

                                        <li>
                                            <CheckCircle size={14} />
                                            Hỗ trợ 24/7
                                        </li>

                                    </ul>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            </div>

        </main>
    );
}