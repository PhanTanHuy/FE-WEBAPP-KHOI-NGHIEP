import { useMemo, useState, useEffect } from 'react';
import {
    Search,
    FileText,
    Download,
    Eye,
    Bookmark,
    CalendarDays,
    X,
    BookOpen,
    PenLine,
    Plus,
    Loader2,
    CheckCircle,
    UploadCloud,
    FileCheck,
    Layers,
    Tag,
    User
} from 'lucide-react';
import { getMaterials, downloadMaterial, toggleFavorite, uploadMaterialFile, createMaterial } from '../api/materials';
import { useAuth } from '../context/AuthContext';
import { trackPage, trackMaterialView, trackMaterialDownload, trackSearch } from '../api/analytics';
import './StudyMaterialsPage.css';

const GRADES = [
    'Lớp 9',
    'Lớp 10',
    'Lớp 11',
    'Lớp 12',
    'Đại học'
];

const SUBJECTS = [
    'Toán',
    'Vật lý',
    'Hóa học',
    'Ngữ văn',
    'Tiếng Anh',
    'Sinh học',
    'Lịch sử',
    'Địa lý',
    'Tin học'
];

const TABS = [
    { id: 'all', label: 'Tất cả tài liệu', icon: BookOpen },
    { id: 'material', label: 'Tài liệu lý thuyết', icon: BookOpen },
    { id: 'exam', label: 'Đề thi & Đáp án', icon: FileText },
    { id: 'exercise', label: 'Bài tập rèn luyện', icon: PenLine }
];

export default function StudyMaterialsPage() {
    const { user } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState('');
    const [selectedGrades, setSelectedGrades] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [activeTab, setActiveTab] = useState('all');

    // Modals
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [previewItem, setPreviewItem] = useState(null);

    // Upload form state
    const [uploading, setUploading] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        title: '',
        subject_name: 'Toán',
        grade: 'Lớp 12',
        type: 'material',
        price: 'Miễn phí',
        description: '',
        file: null
    });
    const [uploadError, setUploadError] = useState('');

    useEffect(() => {
        fetchMaterials();
    }, [activeTab, selectedGrades, selectedSubjects]);

    // Track page view once on mount
    useEffect(() => { trackPage('/tai-lieu'); }, []);

    const fetchMaterials = async (customSearch = search) => {
        try {
            setLoading(true);
            const params = {};
            if (customSearch.trim()) params.q = customSearch.trim();
            if (activeTab !== 'all') params.type = activeTab;
            if (selectedSubjects.length === 1) params.subject = selectedSubjects[0];
            if (selectedGrades.length === 1) params.grade = selectedGrades[0];

            const res = await getMaterials(params);
            let items = res.items || [];

            // Client-side multi-filter refinement if multiple selected
            if (selectedSubjects.length > 1) {
                items = items.filter(m => selectedSubjects.includes(m.subject_name));
            }
            if (selectedGrades.length > 1) {
                items = items.filter(m => selectedGrades.includes(m.grade));
            }

            setMaterials(items);
            setTotal(res.total || items.length);
        } catch (err) {
            console.error('Error fetching materials:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        trackSearch(search, { type: activeTab, subjects: selectedSubjects, grades: selectedGrades });
        fetchMaterials(search);
    };

    const toggleFilter = (type, value) => {
        const setter = type === 'grade' ? setSelectedGrades : setSelectedSubjects;
        setter((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const clearFilters = () => {
        setSelectedGrades([]);
        setSelectedSubjects([]);
        setSearch('');
        setActiveTab('all');
    };

    const handleDownload = async (item) => {
        trackMaterialDownload(item);
        try {
            const res = await downloadMaterial(item.id);
            // Increment count in UI
            setMaterials(prev => prev.map(m => m.id === item.id ? { ...m, downloads: res.downloads } : m));
            if (previewItem && previewItem.id === item.id) {
                setPreviewItem(prev => ({ ...prev, downloads: res.downloads }));
            }
            alert(`Bắt đầu tải xuống: ${item.title}\n(${item.file_size} - ${item.file_format})`);
        } catch (err) {
            console.error(err);
            alert(`Đang tải xuống: ${item.title}`);
        }
    };

    const handleToggleFavorite = async (item) => {
        if (!user) {
            alert('Vui lòng đăng nhập để lưu tài liệu vào danh sách yêu thích!');
            return;
        }

        try {
            const res = await toggleFavorite(item.id);
            setMaterials(prev => prev.map(m => m.id === item.id ? { ...m, is_favorite: res.is_favorite } : m));
            if (previewItem && previewItem.id === item.id) {
                setPreviewItem(prev => ({ ...prev, is_favorite: res.is_favorite }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Vui lòng đăng nhập để đóng góp tài liệu');
            return;
        }
        if (!uploadForm.title.trim()) {
            setUploadError('Vui lòng nhập tên tài liệu');
            return;
        }

        try {
            setUploading(true);
            setUploadError('');

            let fileUrl = '/uploads/documents/sample_document.pdf';
            let fileSize = '2.4 MB';
            let fileFormat = 'PDF';

            if (uploadForm.file) {
                const uploadRes = await uploadMaterialFile(uploadForm.file);
                fileUrl = uploadRes.file_url;
                fileSize = uploadRes.file_size;
                fileFormat = uploadRes.file_format;
            }

            await createMaterial({
                title: uploadForm.title.trim(),
                description: uploadForm.description.trim() || 'Tài liệu ôn tập chất lượng cao',
                grade: uploadForm.grade,
                type: uploadForm.type,
                file_format: fileFormat,
                is_premium: uploadForm.price === 'Trả phí',
                price: uploadForm.price,
                file_size: fileSize,
                file_url: fileUrl,
                tags: `${uploadForm.subject_name}, ${uploadForm.grade}`
            });

            alert('Đăng tải tài liệu thành công!');
            setUploadModalOpen(false);
            setUploadForm({
                title: '',
                subject_name: 'Toán',
                grade: 'Lớp 12',
                type: 'material',
                price: 'Miễn phí',
                description: '',
                file: null
            });
            fetchMaterials();
        } catch (err) {
            console.error(err);
            setUploadError(err.message || 'Lỗi khi tải tài liệu lên');
        } finally {
            setUploading(false);
        }
    };

    return (
        <main className="study-page">
            {/* HERO */}
            <section className="study-hero">
                <div className="study-hero-content">
                    <div className="study-hero-text">
                        <span className="study-hero-label">KHO TÀI LIỆU HỌC TẬP</span>
                        <h1>Hàng ngàn tài liệu & Đề thi chất lượng</h1>
                        <p>
                            Bám sát chương trình Giáo dục phổ thông mới, tuyển tập đề thi thử THPTQG,
                            chuyên đề bồi dưỡng học sinh giỏi và bài tập có lời giải chi tiết.
                        </p>
                        <div style={{ marginTop: '16px' }}>
                            <button 
                                className="btn-upload-material"
                                onClick={() => setUploadModalOpen(true)}
                            >
                                <Plus size={16} /> Đóng góp tài liệu mới
                            </button>
                        </div>
                    </div>
                    <div className="study-hero-illustration">
                        <div className="study-hero-lightbulb">💡</div>
                        <div className="study-hero-person">👩🏻‍🎓</div>
                        <div className="study-hero-books">📚</div>
                        <div className="study-hero-graduation">🎓</div>
                    </div>
                </div>
            </section>

            {/* MAIN */}
            <section className="study-main">
                {/* SIDEBAR */}
                <aside className="study-sidebar">
                    {/* SEARCH */}
                    <form className="study-search" onSubmit={handleSearchSubmit}>
                        <Search size={17} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tài liệu, đề thi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button type="button" onClick={() => { setSearch(''); fetchMaterials(''); }}>
                                <X size={15} />
                            </button>
                        )}
                    </form>

                    {/* GRADE */}
                    <FilterSection title="Khối lớp">
                        {GRADES.map((grade) => (
                            <label className="filter-checkbox" key={grade}>
                                <input
                                    type="checkbox"
                                    checked={selectedGrades.includes(grade)}
                                    onChange={() => toggleFilter('grade', grade)}
                                />
                                <span className="filter-box">
                                    {selectedGrades.includes(grade) && '✓'}
                                </span>
                                <span>{grade}</span>
                            </label>
                        ))}
                    </FilterSection>

                    {/* SUBJECT */}
                    <FilterSection title="Môn học">
                        {SUBJECTS.map((subject) => (
                            <label className="filter-checkbox" key={subject}>
                                <input
                                    type="checkbox"
                                    checked={selectedSubjects.includes(subject)}
                                    onChange={() => toggleFilter('subject', subject)}
                                />
                                <span className="filter-box">
                                    {selectedSubjects.includes(subject) && '✓'}
                                </span>
                                <span>{subject}</span>
                            </label>
                        ))}
                    </FilterSection>

                    {/* CLEAR */}
                    <button type="button" className="clear-filter" onClick={clearFilters}>
                        <X size={14} /> Xóa bộ lọc
                    </button>
                </aside>

                {/* CONTENT */}
                <div className="study-content">
                    {/* TABS */}
                    <div className="study-tabs">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    type="button"
                                    key={tab.id}
                                    className={`study-tab ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* RESULT HEADER */}
                    <div className="study-result-header">
                        <div>
                            <h2>
                                {activeTab === 'all'
                                    ? 'Tất cả tài liệu'
                                    : activeTab === 'exam'
                                    ? 'Đề thi & Đáp án'
                                    : activeTab === 'exercise'
                                    ? 'Bài tập rèn luyện'
                                    : 'Tài liệu lý thuyết'}
                            </h2>
                            <span>{materials.length} tài liệu được hiển thị</span>
                        </div>
                    </div>

                    {/* CARDS */}
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                            <Loader2 size={36} className="animate-spin" color="#168ee6" />
                        </div>
                    ) : materials.length > 0 ? (
                        <div className="materials-grid">
                            {materials.map((item) => (
                                <MaterialCard
                                    key={item.id}
                                    item={item}
                                    onDownload={handleDownload}
                                    onPreview={() => { trackMaterialView(item); setPreviewItem(item); }}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="study-empty">
                            <FileText size={45} />
                            <h3>Không tìm thấy tài liệu phù hợp</h3>
                            <p>Hãy thử thay đổi từ khóa hoặc xóa bớt tiêu chí lọc.</p>
                            <button type="button" onClick={clearFilters}>Xóa bộ lọc</button>
                        </div>
                    )}
                </div>
            </section>

            {/* PREVIEW DETAIL MODAL */}
            {previewItem && (
                <div className="modal-backdrop" onClick={() => setPreviewItem(null)}>
                    <div className="material-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setPreviewItem(null)}>
                            <X size={20} />
                        </button>
                        <div className="detail-modal-header">
                            <div className={`file-badge file-${(previewItem.file_format || 'pdf').toLowerCase()}`}>
                                {previewItem.file_format || 'PDF'}
                            </div>
                            <div>
                                <h3>{previewItem.title}</h3>
                                <p className="detail-author">Đăng bởi: <strong>{previewItem.author_name || 'EduConnect'}</strong></p>
                            </div>
                        </div>

                        <div className="detail-modal-grid">
                            <div className="detail-spec">
                                <span className="spec-label">Môn học:</span>
                                <span className="spec-val">{previewItem.subject_name || 'Tổng hợp'}</span>
                            </div>
                            <div className="detail-spec">
                                <span className="spec-label">Khối lớp:</span>
                                <span className="spec-val">{previewItem.grade || 'Lớp 12'}</span>
                            </div>
                            <div className="detail-spec">
                                <span className="spec-label">Dung lượng:</span>
                                <span className="spec-val">{previewItem.file_size || '2.5 MB'}</span>
                            </div>
                            <div className="detail-spec">
                                <span className="spec-label">Số trang:</span>
                                <span className="spec-val">{previewItem.pages || 1} trang</span>
                            </div>
                            <div className="detail-spec">
                                <span className="spec-label">Lượt tải:</span>
                                <span className="spec-val">{previewItem.downloads} lượt</span>
                            </div>
                            <div className="detail-spec">
                                <span className="spec-label">Chi phí:</span>
                                <span className={`spec-val ${previewItem.price === 'Trả phí' ? 'paid-text' : 'free-text'}`}>
                                    {previewItem.price}
                                </span>
                            </div>
                        </div>

                        <div className="detail-description">
                            <h4>Mô tả nội dung tài liệu:</h4>
                            <p>{previewItem.description || 'Tài liệu được biên soạn công phu, chuẩn kiến thức ôn luyện.'}</p>
                        </div>

                        <div className="detail-modal-actions">
                            <button 
                                className={`btn-fav-modal ${previewItem.is_favorite ? 'active' : ''}`}
                                onClick={() => handleToggleFavorite(previewItem)}
                            >
                                <Bookmark size={18} fill={previewItem.is_favorite ? "#3b82f6" : "none"} />
                                {previewItem.is_favorite ? 'Đã lưu tài liệu' : 'Lưu tài liệu'}
                            </button>
                            <button 
                                className="btn-download-modal"
                                onClick={() => handleDownload(previewItem)}
                            >
                                <Download size={18} /> Tải xuống ngay ({previewItem.file_size})
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* UPLOAD MATERIAL MODAL */}
            {uploadModalOpen && (
                <div className="modal-backdrop" onClick={() => setUploadModalOpen(false)}>
                    <div className="material-upload-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setUploadModalOpen(false)}>
                            <X size={20} />
                        </button>
                        <h2>Đóng góp tài liệu học tập</h2>
                        <p className="upload-subtitle">Chia sẻ tài liệu, đề thi hay cùng cộng đồng học viên EduConnect</p>

                        <form onSubmit={handleUploadSubmit}>
                            <div className="form-group">
                                <label>Tiêu đề tài liệu *</label>
                                <input 
                                    type="text"
                                    required
                                    placeholder="Ví dụ: Đề thi thử THPT Quốc gia môn Toán 2026 kèm giải chi tiết"
                                    value={uploadForm.title}
                                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Môn học</label>
                                    <select 
                                        value={uploadForm.subject_name}
                                        onChange={(e) => setUploadForm({ ...uploadForm, subject_name: e.target.value })}
                                    >
                                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Khối lớp</label>
                                    <select 
                                        value={uploadForm.grade}
                                        onChange={(e) => setUploadForm({ ...uploadForm, grade: e.target.value })}
                                    >
                                        {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Loại tài liệu</label>
                                    <select 
                                        value={uploadForm.type}
                                        onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                                    >
                                        <option value="material">Tài liệu lý thuyết / Tóm tắt</option>
                                        <option value="exam">Đề thi / Đề kiểm tra</option>
                                        <option value="exercise">Bài tập rèn luyện</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Mức phí</label>
                                    <select 
                                        value={uploadForm.price}
                                        onChange={(e) => setUploadForm({ ...uploadForm, price: e.target.value })}
                                    >
                                        <option value="Miễn phí">Miễn phí</option>
                                        <option value="Trả phí">Trả phí (EduCoin)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Mô tả ngắn</label>
                                <textarea 
                                    rows="3"
                                    placeholder="Tóm tắt nội dung chính hoặc lưu ý khi học tài liệu này..."
                                    value={uploadForm.description}
                                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>File đính kèm (PDF, DOCX, ZIP)</label>
                                <div className="file-upload-box">
                                    <UploadCloud size={32} color="#168ee6" />
                                    <input 
                                        type="file" 
                                        accept=".pdf,.doc,.docx,.zip,.rar"
                                        onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                                    />
                                    <span>
                                        {uploadForm.file ? uploadForm.file.name : 'Chọn file tài liệu từ máy tính của bạn'}
                                    </span>
                                </div>
                            </div>

                            {uploadError && (
                                <div className="upload-error-msg">{uploadError}</div>
                            )}

                            <div className="upload-modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setUploadModalOpen(false)}>
                                    Hủy bỏ
                                </button>
                                <button type="submit" className="btn-submit-upload" disabled={uploading}>
                                    {uploading ? (
                                        <><Loader2 size={16} className="animate-spin" /> Đang tải lên...</>
                                    ) : (
                                        'Tải lên & Chia sẻ'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

function FilterSection({ title, children }) {
    return (
        <div className="filter-section">
            <h3>{title}</h3>
            <div className="filter-list">{children}</div>
        </div>
    );
}

function MaterialCard({ item, onDownload, onPreview, onToggleFavorite }) {
    const fileClass = (item.file_format || 'pdf').toLowerCase();
    const createdDate = item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : '2026-09-20';

    return (
        <article className="material-card">
            <div className="material-card-top">
                <div className={`file-icon file-${fileClass}`}>
                    {item.file_format || 'PDF'}
                </div>
                <button
                    type="button"
                    className={`bookmark-button ${item.is_favorite ? 'active' : ''}`}
                    title={item.is_favorite ? "Bỏ lưu tài liệu" : "Lưu tài liệu"}
                    onClick={() => onToggleFavorite(item)}
                >
                    <Bookmark size={16} fill={item.is_favorite ? "#3b82f6" : "none"} color={item.is_favorite ? "#3b82f6" : "#64748b"} />
                </button>
            </div>

            <h3 className="material-title" title={item.title} onClick={onPreview}>
                {item.title}
            </h3>

            <div className="material-tags">
                <span>{item.subject_name || 'Toán'}</span>
                <span>{item.grade || 'Lớp 12'}</span>
                <span className={item.price === 'Trả phí' ? 'paid' : 'free'}>
                    {item.price}
                </span>
            </div>

            <div className="material-meta">
                <span>
                    <Download size={13} />
                    {item.downloads} lượt tải
                </span>
                <span>
                    <CalendarDays size={13} />
                    {createdDate}
                </span>
            </div>

            <div className="material-actions-row">
                <button
                    type="button"
                    className="material-action-preview"
                    onClick={onPreview}
                    title="Xem trước"
                >
                    <Eye size={14} /> Chi tiết
                </button>
                <button
                    type="button"
                    className="material-action-download"
                    onClick={() => onDownload(item)}
                    title="Tải xuống"
                >
                    <Download size={14} /> Tải về
                </button>
            </div>
        </article>
    );
}