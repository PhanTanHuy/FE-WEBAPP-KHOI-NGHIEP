import { useMemo, useState } from 'react';
import {
    Search,
    FileText,
    Download,
    Eye,
    Bookmark,
    CalendarDays,
    X,
    BookOpen,
    PenLine
} from 'lucide-react';

import './StudyMaterialsPage.css';

const materials = [
    {
        id: 1,
        title: 'Tổng hợp công thức Toán 12 (đầy đủ)',
        type: 'PDF',
        subject: 'Toán',
        grade: 'Lớp 12',
        price: 'Miễn phí',
        downloads: '12.5k',
        date: '12/08/2025',
        action: 'download'
    },
    {
        id: 2,
        title: 'Bài tập Tiếng Anh lớp 10 (có đáp án)',
        type: 'DOC',
        subject: 'Anh',
        grade: 'Lớp 10',
        price: 'Miễn phí',
        downloads: '8.2k',
        date: '05/08/2025',
        action: 'download'
    },
    {
        id: 3,
        title: 'Đề thi thử THPT Quốc gia môn Vật lý 2026',
        type: 'ZIP',
        subject: 'Lý',
        grade: 'Lớp 12',
        price: 'Trả phí',
        downloads: '5.6k',
        date: '28/07/2025',
        action: 'preview'
    },
    {
        id: 4,
        title: 'Chuyên đề Hóa học hữu cơ (lý thuyết + bài tập)',
        type: 'PDF',
        subject: 'Hóa',
        grade: 'Lớp 12',
        price: 'Miễn phí',
        downloads: '9.8k',
        date: '22/07/2025',
        action: 'download'
    },
    {
        id: 5,
        title: 'Đề cương ôn thi Ngữ văn 12',
        type: 'DOC',
        subject: 'Văn',
        grade: 'Lớp 12',
        price: 'Miễn phí',
        downloads: '7.1k',
        date: '15/07/2025',
        action: 'download'
    },
    {
        id: 6,
        title: 'Tài liệu luyện Listening Tiếng Anh',
        type: 'ZIP',
        subject: 'Anh',
        grade: 'Lớp 12',
        price: 'Trả phí',
        downloads: '4.3k',
        date: '10/07/2025',
        action: 'preview'
    },
    {
        id: 7,
        title: 'Tổng hợp công thức Vật lý 12',
        type: 'DOC',
        subject: 'Lý',
        grade: 'Lớp 12',
        price: 'Miễn phí',
        downloads: '6.7k',
        date: '02/07/2025',
        action: 'download'
    },
    {
        id: 8,
        title: 'Bài tập Tiếng Anh nâng cao (luyện đề)',
        type: 'PDF',
        subject: 'Anh',
        grade: 'Lớp 12',
        price: 'Trả phí',
        downloads: '3.9k',
        date: '01/07/2025',
        action: 'preview'
    },
    {
        id: 9,
        title: 'Đề thi học kì 1 môn Sinh học 12',
        type: 'DOC',
        subject: 'Sinh',
        grade: 'Lớp 12',
        price: 'Miễn phí',
        downloads: '5.4k',
        date: '25/06/2025',
        action: 'download'
    },
    {
        id: 10,
        title: 'Đề thi học kỳ Toán 9',
        type: 'PDF',
        subject: 'Toán',
        grade: 'Lớp 9',
        price: 'Miễn phí',
        downloads: '4.8k',
        date: '20/06/2025',
        action: 'download'
    },
    {
        id: 11,
        title: 'Bộ đề luyện thi IELTS Reading',
        type: 'ZIP',
        subject: 'Anh',
        grade: 'Lớp 12',
        price: 'Trả phí',
        downloads: '3.2k',
        date: '18/06/2025',
        action: 'preview'
    },
    {
        id: 12,
        title: 'Tổng hợp kiến thức Ngữ văn THCS',
        type: 'PDF',
        subject: 'Văn',
        grade: 'THCS',
        price: 'Miễn phí',
        downloads: '6.1k',
        date: '15/06/2025',
        action: 'download'
    }
];

const grades = [
    'Cấp 1',
    'Cấp 2',
    'Cấp 3',
    'Đại học'
];

const subjects = [
    'Toán',
    'Lý',
    'Hóa',
    'Văn',
    'Anh',
    'Sinh',
    'Sử',
    'Địa',
    'GDCD',
    'Khác'
];

const tabs = [
    {
        id: 'subject',
        label: 'Tài liệu theo môn',
        icon: BookOpen
    },
    {
        id: 'exam',
        label: 'Đề thi',
        icon: FileText
    },
    {
        id: 'exercise',
        label: 'Bài tập',
        icon: PenLine
    }
];

export default function StudyMaterialsPage() {
    const [search, setSearch] = useState('');
    const [selectedGrades, setSelectedGrades] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [activeTab, setActiveTab] = useState('subject');

    const toggleFilter = (type, value) => {
        const setter =
            type === 'grade'
                ? setSelectedGrades
                : setSelectedSubjects;

        setter((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const clearFilters = () => {
        setSelectedGrades([]);
        setSelectedSubjects([]);
        setSearch('');
    };

    const filteredMaterials = useMemo(() => {
        return materials.filter((item) => {
            const matchesSearch =
                !search.trim() ||
                item.title
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                item.subject
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesSubject =
                selectedSubjects.length === 0 ||
                selectedSubjects.includes(item.subject);

            const matchesGrade =
                selectedGrades.length === 0 ||
                selectedGrades.some((grade) => {
                    if (grade === 'Cấp 1') {
                        return ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5']
                            .some((x) => item.grade.includes(x));
                    }

                    if (grade === 'Cấp 2') {
                        return ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9']
                            .some((x) => item.grade.includes(x));
                    }

                    if (grade === 'Cấp 3') {
                        return ['Lớp 10', 'Lớp 11', 'Lớp 12']
                            .some((x) => item.grade.includes(x));
                    }

                    return item.grade === grade;
                });

            return (
                matchesSearch &&
                matchesSubject &&
                matchesGrade
            );
        });
    }, [
        search,
        selectedGrades,
        selectedSubjects
    ]);

    const handleAction = (item) => {
        if (item.action === 'download') {
            alert(`Đang tải xuống: ${item.title}`);
        } else {
            alert(`Xem trước tài liệu: ${item.title}`);
        }
    };

    return (
        <main className="study-page">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="study-hero">

                <div className="study-hero-content">

                    <div className="study-hero-text">

                        <span className="study-hero-label">
                            TÀI LIỆU HỌC TẬP
                        </span>

                        <h1>
                            Khám phá Kho tài liệu học tập
                        </h1>

                        <p>
                            Tài liệu chất lượng, bám sát chương trình,
                            giúp bạn học hiệu quả hơn và đạt kết quả tốt.
                        </p>

                    </div>

                    <div className="study-hero-illustration">

                        <div className="study-hero-lightbulb">
                            💡
                        </div>

                        <div className="study-hero-person">
                            👩🏻‍🎓
                        </div>

                        <div className="study-hero-books">
                            📚
                        </div>

                        <div className="study-hero-graduation">
                            🎓
                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                MAIN
            ================================================= */}

            <section className="study-main">

                {/* SIDEBAR */}

                <aside className="study-sidebar">

                    {/* SEARCH */}

                    <div className="study-search">

                        <Search size={17} />

                        <input
                            type="text"
                            placeholder="Tìm kiếm tài liệu..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                            >
                                <X size={15} />
                            </button>
                        )}

                    </div>


                    {/* GRADE */}

                    <FilterSection title="Cấp học">

                        {grades.map((grade) => (
                            <label
                                className="filter-checkbox"
                                key={grade}
                            >

                                <input
                                    type="checkbox"
                                    checked={selectedGrades.includes(
                                        grade
                                    )}
                                    onChange={() =>
                                        toggleFilter(
                                            'grade',
                                            grade
                                        )
                                    }
                                />

                                <span className="filter-box">
                                    {selectedGrades.includes(
                                        grade
                                    ) && '✓'}
                                </span>

                                <span>{grade}</span>

                            </label>
                        ))}

                    </FilterSection>


                    {/* SUBJECT */}

                    <FilterSection title="Môn học">

                        {subjects.map((subject) => (
                            <label
                                className="filter-checkbox"
                                key={subject}
                            >

                                <input
                                    type="checkbox"
                                    checked={selectedSubjects.includes(
                                        subject
                                    )}
                                    onChange={() =>
                                        toggleFilter(
                                            'subject',
                                            subject
                                        )
                                    }
                                />

                                <span className="filter-box">
                                    {selectedSubjects.includes(
                                        subject
                                    ) && '✓'}
                                </span>

                                <span>{subject}</span>

                            </label>
                        ))}

                    </FilterSection>


                    {/* CLEAR */}

                    <button
                        type="button"
                        className="clear-filter"
                        onClick={clearFilters}
                    >
                        <X size={14} />
                        Xóa bộ lọc
                    </button>

                </aside>


                {/* CONTENT */}

                <div className="study-content">

                    {/* TABS */}

                    <div className="study-tabs">

                        {tabs.map((tab) => {
                            const Icon = tab.icon;

                            return (
                                <button
                                    type="button"
                                    key={tab.id}
                                    className={`study-tab ${activeTab === tab.id
                                            ? 'active'
                                            : ''
                                        }`}
                                    onClick={() =>
                                        setActiveTab(tab.id)
                                    }
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}

                    </div>


                    {/* RESULT */}

                    <div className="study-result-header">

                        <div>
                            <h2>
                                {activeTab === 'subject'
                                    ? 'Tài liệu học tập'
                                    : activeTab === 'exam'
                                        ? 'Đề thi'
                                        : 'Bài tập'}
                            </h2>

                            <span>
                                {filteredMaterials.length} tài liệu
                            </span>
                        </div>

                    </div>


                    {/* CARDS */}

                    {filteredMaterials.length > 0 ? (
                        <div className="materials-grid">

                            {filteredMaterials.map((item) => (
                                <MaterialCard
                                    key={item.id}
                                    item={item}
                                    onAction={handleAction}
                                />
                            ))}

                        </div>
                    ) : (
                        <div className="study-empty">

                            <FileText size={45} />

                            <h3>
                                Không tìm thấy tài liệu
                            </h3>

                            <p>
                                Hãy thử thay đổi từ khóa hoặc bộ lọc.
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                            >
                                Xóa bộ lọc
                            </button>

                        </div>
                    )}

                </div>

            </section>

        </main>
    );
}


/* =========================================================
   FILTER SECTION
========================================================= */

function FilterSection({ title, children }) {
    return (
        <div className="filter-section">

            <h3>{title}</h3>

            <div className="filter-list">
                {children}
            </div>

        </div>
    );
}


/* =========================================================
   MATERIAL CARD
========================================================= */

function MaterialCard({ item, onAction }) {
    const fileClass = item.type.toLowerCase();

    return (
        <article className="material-card">

            <div className="material-card-top">

                <div
                    className={`file-icon file-${fileClass}`}
                >
                    {item.type === 'PDF' && 'PDF'}
                    {item.type === 'DOC' && 'DOC'}
                    {item.type === 'ZIP' && 'ZIP'}
                </div>

                <button
                    type="button"
                    className="bookmark-button"
                    title="Lưu tài liệu"
                    onClick={() =>
                        alert('Đã thêm vào tài liệu yêu thích.')
                    }
                >
                    <Bookmark size={16} />
                </button>

            </div>


            <h3 className="material-title">
                {item.title}
            </h3>


            <div className="material-tags">

                <span>{item.subject}</span>

                <span>{item.grade}</span>

                <span
                    className={
                        item.price === 'Trả phí'
                            ? 'paid'
                            : ''
                    }
                >
                    {item.price}
                </span>

            </div>


            <div className="material-meta">

                <span>
                    <Download size={12} />
                    {item.downloads} lượt tải
                </span>

                <span>
                    <CalendarDays size={12} />
                    {item.date}
                </span>

            </div>


            <button
                type="button"
                className="material-action"
                onClick={() => onAction(item)}
            >

                {item.action === 'download' ? (
                    <>
                        <Download size={15} />
                        Tải xuống
                    </>
                ) : (
                    <>
                        <Eye size={15} />
                        Xem trước
                    </>
                )}

            </button>

        </article>
    );
}