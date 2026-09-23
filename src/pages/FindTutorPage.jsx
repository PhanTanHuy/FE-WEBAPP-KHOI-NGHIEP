import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown, Star, MapPin } from 'lucide-react';
import TutorCard from '../components/ui/TutorCard';
import { tutors } from '../data/tutors';
import { subjects, levels, cities, priceRanges } from '../data/subjects';
import './FindTutorPage.css';

const sortOptions = [
  { value: 'rating', label: 'Đánh giá cao nhất' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'experience', label: 'Kinh nghiệm nhiều nhất' },
  { value: 'reviews', label: 'Nhiều đánh giá nhất' },
];

export default function FindTutorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    subject: searchParams.get('subject') || '',
    level: '',
    city: '',
    priceRange: '',
    mode: searchParams.get('mode') || '',
    verified: false,
  });
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter logic
  const filteredTutors = tutors.filter((tutor) => {
    const q = searchQuery.toLowerCase();
    const matchQuery = !q || 
      tutor.name.toLowerCase().includes(q) ||
      tutor.subjects.some(s => s.toLowerCase().includes(q)) ||
      tutor.location.toLowerCase().includes(q);

    const matchSubject = !filters.subject ||
      tutor.subjects.some(s => s.toLowerCase().includes(
        subjects.find(sub => sub.id === filters.subject)?.name.toLowerCase() || ''
      ));

    const matchLevel = !filters.level ||
      tutor.levels.some(l => l.toLowerCase().includes(
        levels.find(lv => lv.id === filters.level)?.name.toLowerCase() || ''
      ));

    const matchCity = !filters.city ||
      tutor.city?.toLowerCase().includes(
        cities.find(c => c.id === filters.city)?.name.toLowerCase() || ''
      );

    const priceRange = priceRanges.find(p => p.id === filters.priceRange);
    const matchPrice = !filters.priceRange ||
      (tutor.pricePerHour >= priceRange.min && tutor.pricePerHour <= priceRange.max);

    const matchMode = !filters.mode ||
      tutor.teachingMode.includes(filters.mode);

    const matchVerified = !filters.verified || tutor.verified;

    return matchQuery && matchSubject && matchLevel && matchCity && matchPrice && matchMode && matchVerified;
  });

  // Sort
  const sortedTutors = [...filteredTutors].sort((a, b) => {
    switch (sortBy) {
      case 'rating': return b.rating - a.rating;
      case 'price-asc': return a.pricePerHour - b.pricePerHour;
      case 'price-desc': return b.pricePerHour - a.pricePerHour;
      case 'experience': return b.experience - a.experience;
      case 'reviews': return b.reviewCount - a.reviewCount;
      default: return 0;
    }
  });

  const totalPages = Math.ceil(sortedTutors.length / itemsPerPage);
  const paginatedTutors = sortedTutors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ subject: '', level: '', city: '', priceRange: '', mode: '', verified: false });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v !== false).length + (searchQuery ? 1 : 0);

  return (
    <div className="find-tutor-page">
      {/* Hero Search */}
      <div className="find-hero">
        <div className="container find-hero__content">
          <h1 className="find-hero__title">Tìm gia sư phù hợp</h1>
          <p className="find-hero__sub">Kết nối với hơn 10,000 gia sư chất lượng trên toàn quốc</p>
          <div className="find-search-bar">
            <div className="find-search-input-wrap">
              <Search size={20} />
              <input
                type="text"
                placeholder="Tìm theo tên gia sư, môn học, khu vực..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                id="find-tutor-search"
                className="find-search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="find-search-clear">
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              className={`find-filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
              id="toggle-filters-btn"
            >
              <SlidersHorizontal size={18} />
              Bộ lọc
              {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="container find-layout">
        {/* Sidebar */}
        <aside className={`find-sidebar ${showFilters ? 'show' : ''}`}>
          <div className="sidebar-header">
            <h3>Bộ lọc tìm kiếm</h3>
            {activeFilterCount > 0 && (
              <button className="clear-all-btn" onClick={clearFilters}>
                Xóa tất cả ({activeFilterCount})
              </button>
            )}
          </div>

          {/* Môn học */}
          <FilterSection title="Môn học">
            <div className="filter-chips">
              {subjects.map((sub) => (
                <button
                  key={sub.id}
                  className={`filter-chip ${filters.subject === sub.id ? 'active' : ''}`}
                  onClick={() => handleFilterChange('subject', sub.id)}
                  id={`filter-subject-${sub.id}`}
                >
                  <span>{sub.icon}</span> {sub.name}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Cấp học */}
          <FilterSection title="Cấp học">
            <div className="filter-list">
              {levels.map((lv) => (
                <label key={lv.id} className="filter-radio">
                  <input
                    type="radio"
                    name="level"
                    checked={filters.level === lv.id}
                    onChange={() => handleFilterChange('level', lv.id)}
                    id={`filter-level-${lv.id}`}
                  />
                  <div className="radio-custom" />
                  <span>{lv.name}</span>
                  <span className="filter-meta">{lv.grades}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Thành phố */}
          <FilterSection title="Khu vực">
            <div className="filter-list">
              {cities.map((city) => (
                <label key={city.id} className="filter-radio">
                  <input
                    type="radio"
                    name="city"
                    checked={filters.city === city.id}
                    onChange={() => handleFilterChange('city', city.id)}
                    id={`filter-city-${city.id}`}
                  />
                  <div className="radio-custom" />
                  <span>{city.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Hình thức */}
          <FilterSection title="Hình thức dạy">
            <div className="filter-chips">
              <button
                className={`filter-chip ${filters.mode === 'online' ? 'active' : ''}`}
                onClick={() => handleFilterChange('mode', 'online')}
              >
                🌐 Online
              </button>
              <button
                className={`filter-chip ${filters.mode === 'offline' ? 'active' : ''}`}
                onClick={() => handleFilterChange('mode', 'offline')}
              >
                🏠 Tại nhà
              </button>
            </div>
          </FilterSection>

          {/* Học phí */}
          <FilterSection title="Học phí">
            <div className="filter-list">
              {priceRanges.map((range) => (
                <label key={range.id} className="filter-radio">
                  <input
                    type="radio"
                    name="price"
                    checked={filters.priceRange === range.id}
                    onChange={() => handleFilterChange('priceRange', range.id)}
                    id={`filter-price-${range.id}`}
                  />
                  <div className="radio-custom" />
                  <span>{range.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Verified */}
          <FilterSection title="Khác">
            <label className="filter-toggle-item">
              <input
                type="checkbox"
                checked={filters.verified}
                onChange={(e) => handleFilterChange('verified', e.target.checked)}
                id="filter-verified"
              />
              <div className="toggle-custom" />
              <span>Chỉ gia sư đã xác minh</span>
            </label>
          </FilterSection>
        </aside>

        {/* Main content */}
        <main className="find-main">
          {/* Toolbar */}
          <div className="find-toolbar">
            <div className="find-results-count">
              Tìm thấy <strong>{filteredTutors.length}</strong> gia sư
              {searchQuery && <span className="search-term"> cho "{searchQuery}"</span>}
            </div>
            <div className="find-sort">
              <span>Sắp xếp:</span>
              <div className="sort-select-wrap">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                  id="sort-select"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          {paginatedTutors.length > 0 ? (
            <>
              <div className="find-grid">
                {paginatedTutors.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <div className="empty-state-title">Không tìm thấy gia sư phù hợp</div>
              <p>Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
              <button className="btn btn-primary" onClick={clearFilters} style={{ marginTop: '16px' }}>
                Xóa bộ lọc
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="filter-section">
      <button className="filter-section-header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <ChevronDown size={16} className={`filter-arrow ${open ? 'open' : ''}`} />
      </button>
      {open && <div className="filter-section-body">{children}</div>}
    </div>
  );
}
