import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown, Loader2 } from 'lucide-react';
import TutorCard from '../components/ui/TutorCard';
import { getTutors } from '../api/tutors';
import { getSubjects, getLevels, getLocations } from '../api/subjects';
import { priceRanges } from '../data/subjects';
import { trackPage, trackTutorView, trackSearch } from '../api/analytics';
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
  const [tutorsList, setTutorsList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [levelsList, setLevelsList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [totalTutors, setTotalTutors] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    subject: searchParams.get('subject') || '',
    level: searchParams.get('level') || '',
    city: searchParams.get('city') || '',
    priceRange: searchParams.get('priceRange') || '',
    mode: searchParams.get('mode') || '',
    verified: searchParams.get('verified') === 'true',
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'rating');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const itemsPerPage = 6;

  // Track page view on mount
  useEffect(() => { trackPage('/tim-gia-su'); }, []);

  // 1. Load catalogs on mount
  useEffect(() => {
    async function loadCatalogs() {
      try {
        const [subjectsData, levelsData, locationsData] = await Promise.all([
          getSubjects(),
          getLevels(),
          getLocations()
        ]);
        setSubjectsList(subjectsData || []);
        setLevelsList(levelsData || []);
        
        const uniqueCities = Array.from(new Set((locationsData || []).map(l => l.city))).map(city => ({
          id: city.toLowerCase().replace(/\s+/g, '-'),
          name: city
        }));
        setLocationsList(uniqueCities);
      } catch (err) {
        console.error('Error fetching catalogs:', err);
      }
    }
    loadCatalogs();
  }, []);

  // 2. Fetch tutors with server-side query and pagination
  useEffect(() => {
    let isCancelled = false;

    async function fetchServerTutors() {
      try {
        setLoading(true);
        setError(null);

        let min_price = undefined;
        let max_price = undefined;
        if (filters.priceRange) {
          const pr = priceRanges.find(p => p.id === filters.priceRange);
          if (pr) {
            min_price = pr.min;
            max_price = pr.max === Infinity ? undefined : pr.max;
          }
        }

        // Map sort
        let sortParam = 'rating_desc';
        if (sortBy === 'price-asc') sortParam = 'price_asc';
        else if (sortBy === 'price-desc') sortParam = 'price_desc';
        else if (sortBy === 'experience') sortParam = 'experience_desc';
        else if (sortBy === 'reviews') sortParam = 'reviews_desc';

        const data = await getTutors({
          q: searchQuery || undefined,
          subject: filters.subject || undefined,
          level: filters.level || undefined,
          city: filters.city || undefined,
          mode: filters.mode || undefined,
          min_price,
          max_price,
          verified: filters.verified ? true : undefined,
          sort: sortParam,
          page: currentPage,
          per_page: itemsPerPage,
          paginate: true
        });

        if (!isCancelled) {
          if (data && data.items) {
            setTutorsList(data.items);
            setTotalTutors(data.total);
            setTotalPages(data.total_pages);
          } else if (Array.isArray(data)) {
            setTutorsList(data);
            setTotalTutors(data.length);
            setTotalPages(Math.ceil(data.length / itemsPerPage) || 1);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error fetching tutors from server:', err);
          setError('Không thể tải danh sách gia sư từ máy chủ. Vui lòng thử lại sau.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchServerTutors();

    // Sync with URL params
    const newParams = {};
    if (searchQuery) newParams.q = searchQuery;
    if (filters.subject) newParams.subject = filters.subject;
    if (filters.level) newParams.level = filters.level;
    if (filters.city) newParams.city = filters.city;
    if (filters.priceRange) newParams.priceRange = filters.priceRange;
    if (filters.mode) newParams.mode = filters.mode;
    if (filters.verified) newParams.verified = 'true';
    if (sortBy && sortBy !== 'rating') newParams.sort = sortBy;
    if (currentPage > 1) newParams.page = currentPage.toString();
    setSearchParams(newParams, { replace: true });

    return () => {
      isCancelled = true;
    };
  }, [searchQuery, filters, sortBy, currentPage]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ subject: '', level: '', city: '', priceRange: '', mode: '', verified: false });
    setSearchQuery('');
    setCurrentPage(1);
    setSortBy('rating');
  };

  // Track search whenever searchQuery or filters change (debounced by effect deps)
  useEffect(() => {
    if (searchQuery || filters.subject) {
      trackSearch(searchQuery, {
        subject: filters.subject || undefined,
        level:   filters.level   || undefined,
        city:    filters.city    || undefined,
        mode:    filters.mode    || undefined,
      });
    }
  }, [searchQuery, filters.subject, filters.level]);

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
              {subjectsList.map((sub) => (
                <button
                  key={sub.id}
                  className={`filter-chip ${filters.subject === sub.slug ? 'active' : ''}`}
                  onClick={() => handleFilterChange('subject', sub.slug)}
                  id={`filter-subject-${sub.slug}`}
                >
                  <span>{sub.icon}</span> {sub.name}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Cấp học */}
          <FilterSection title="Cấp học">
            <div className="filter-list">
              {levelsList.map((lv) => (
                <label key={lv.id} className="filter-radio">
                  <input
                    type="radio"
                    name="level"
                    checked={filters.level === lv.slug}
                    onChange={() => handleFilterChange('level', lv.slug)}
                    id={`filter-level-${lv.slug}`}
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
              {locationsList.map((city) => (
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
              Tìm thấy <strong>{totalTutors}</strong> gia sư
              {searchQuery && <span className="search-term"> cho "{searchQuery}"</span>}
            </div>
            <div className="find-sort">
              <span>Sắp xếp:</span>
              <div className="sort-select-wrap">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
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

          {/* Loading / Error / Results */}
          {loading ? (
            <div className="empty-state" style={{ padding: '60px 0' }}>
              <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 16px', color: '#3B82F6' }} />
              <div className="empty-state-title">Đang tải danh sách gia sư...</div>
            </div>
          ) : error ? (
            <div className="empty-state">
              <div className="empty-state-icon">⚠️</div>
              <div className="empty-state-title">{error}</div>
            </div>
          ) : tutorsList.length > 0 ? (
            <>
              <div className="find-grid">
                {tutorsList.map((tutor) => (
                  <div key={tutor.id} onClick={() => trackTutorView(tutor, { subject: filters.subject })}>
                    <TutorCard tutor={tutor} />
                  </div>
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
