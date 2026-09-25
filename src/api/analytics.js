/**
 * analytics.js  —  EduConnect Product Analytics
 * ------------------------------------------------
 * Thư viện tracking nhỏ gọn, tự host.
 * Không cần Google Analytics hay bên thứ 3 nào.
 *
 * Cách dùng ở bất kỳ component nào:
 *   import { track } from '../api/analytics';
 *
 *   // Khi user click vào card gia sư:
 *   track('view_tutor', { entity_type: 'tutor', entity_id: tutor.id, entity_name: tutor.name,
 *                         meta: { subject: 'Toán', price: tutor.pricePerHour } });
 *
 *   // Khi user tìm kiếm:
 *   track('search', { meta: { query: keyword, subject: selectedSubject } });
 *
 *   // Khi user vào trang:
 *   track('view_page', { entity_name: '/tim-gia-su' });
 */

const API_BASE = import.meta.env.VITE_API_URL ?? 'https://educonnect-backend-p3mf.onrender.com';

// ── Session ID ────────────────────────────────────────────────────────────────
// Một UUID ngẫu nhiên, lưu vào localStorage để nhận diện 1 lượt ghé thăm.
// Giúp phân biệt 1000 click từ 10 người khác với 10 click từ 1 người.
function getSessionId() {
  const KEY = '_edu_sid';
  let sid = sessionStorage.getItem(KEY); // sessionStorage → reset khi đóng tab
  if (!sid) {
    sid = crypto.randomUUID ? crypto.randomUUID()
                            : Math.random().toString(36).slice(2) + Date.now();
    sessionStorage.setItem(KEY, sid);
  }
  return sid;
}

// ── Core track function ───────────────────────────────────────────────────────
/**
 * @param {string} eventType  - 'view_tutor' | 'click_material' | 'search' | 'book_tutor' | 'download_material' | 'view_page'
 * @param {object} opts       - { entity_type, entity_id, entity_name, meta }
 */
export function track(eventType, opts = {}) {
  // Fire-and-forget: không chặn UI
  const payload = {
    event_type: eventType,
    entity_type: opts.entity_type ?? null,
    entity_id:   opts.entity_id   ?? null,
    entity_name: opts.entity_name ?? null,
    meta:        opts.meta        ?? null,
    session_id:  getSessionId(),
  };

  // Dùng sendBeacon nếu trình duyệt hỗ trợ (tốt hơn khi tab đang đóng)
  const url = `${API_BASE}/api/v1/analytics/event`;
  const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, blob);
  } else {
    // Fallback: fetch bình thường, không cần await
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {}); // bỏ qua lỗi mạng, không ảnh hưởng UX
  }
}

// ── Convenience helpers ───────────────────────────────────────────────────────

/** Gọi khi user xem trang — đặt ở đầu mỗi page component */
export function trackPage(pageName) {
  track('view_page', { entity_type: 'page', entity_name: pageName });
}

/** Gọi khi user click vào card gia sư */
export function trackTutorView(tutor, extraMeta = {}) {
  track('view_tutor', {
    entity_type: 'tutor',
    entity_id:   tutor.id,
    entity_name: tutor.name ?? tutor.full_name,
    meta: {
      subject: tutor.subjects?.[0] ?? null,
      price:   tutor.pricePerHour  ?? null,
      rating:  tutor.rating        ?? null,
      ...extraMeta,
    },
  });
}

/** Gọi khi user click/xem tài liệu */
export function trackMaterialView(material, extraMeta = {}) {
  track('view_material', {
    entity_type: 'material',
    entity_id:   material.id,
    entity_name: material.title,
    meta: {
      subject: material.subject ?? null,
      grade:   material.grade   ?? null,
      type:    material.type    ?? null,
      ...extraMeta,
    },
  });
}

/** Gọi khi user tải tài liệu */
export function trackMaterialDownload(material) {
  track('download_material', {
    entity_type: 'material',
    entity_id:   material.id,
    entity_name: material.title,
    meta: { subject: material.subject, grade: material.grade },
  });
}

/** Gọi khi user nhấn nút tìm kiếm / thay đổi filter */
export function trackSearch(query, filters = {}) {
  track('search', {
    entity_type: 'search',
    meta: { query, ...filters },
  });
}

/** Gọi khi user xác nhận đặt lịch */
export function trackBooking(tutorId, tutorName, meta = {}) {
  track('book_tutor', {
    entity_type: 'tutor',
    entity_id:   tutorId,
    entity_name: tutorName,
    meta,
  });
}

// ── Analytics API (admin) ────────────────────────────────────────────────────
const authHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function fetchAnalyticsOverview(days = 7) {
  const res = await fetch(`${API_BASE}/api/v1/analytics/stats/overview?days=${days}`, {
    headers: authHeader()
  });
  if (!res.ok) throw new Error('Unauthorized or server error');
  return res.json();
}

export async function fetchTopTutors(days = 30) {
  const res = await fetch(`${API_BASE}/api/v1/analytics/stats/top-tutors?days=${days}`, {
    headers: authHeader()
  });
  return res.json();
}

export async function fetchTopMaterials(days = 30) {
  const res = await fetch(`${API_BASE}/api/v1/analytics/stats/top-materials?days=${days}`, {
    headers: authHeader()
  });
  return res.json();
}

export async function fetchTopSubjects(days = 30) {
  const res = await fetch(`${API_BASE}/api/v1/analytics/stats/top-subjects?days=${days}`, {
    headers: authHeader()
  });
  return res.json();
}

export async function fetchSearchTerms(days = 14) {
  const res = await fetch(`${API_BASE}/api/v1/analytics/stats/search-terms?days=${days}`, {
    headers: authHeader()
  });
  return res.json();
}

export async function fetchFunnel(days = 30) {
  const res = await fetch(`${API_BASE}/api/v1/analytics/stats/funnel?days=${days}`, {
    headers: authHeader()
  });
  return res.json();
}
