import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp, Users, BookOpen, Search, BarChart2,
  Eye, Download, Activity, RefreshCw, Clock
} from 'lucide-react';
import {
  fetchAnalyticsOverview,
  fetchTopTutors,
  fetchTopMaterials,
  fetchTopSubjects,
  fetchSearchTerms,
  fetchFunnel,
} from '../api/analytics';
import './AnalyticsDashboard.css';

// ── Mini sparkline bar chart ─────────────────────────────────────────────────
function SparkBar({ data = [], color = '#6366f1', label = 'count' }) {
  const max = Math.max(...data.map((d) => d.count || 0), 1);
  return (
    <div className="sparkbar-wrap">
      {data.map((d, i) => (
        <div key={i} className="sparkbar-col" title={`${d.day || d.step}: ${d.count}`}>
          <div
            className="sparkbar-fill"
            style={{ height: `${(d.count / max) * 100}%`, background: color }}
          />
          <span className="sparkbar-label">{d.day ? d.day.slice(5) : ''}</span>
        </div>
      ))}
    </div>
  );
}

// ── Horizontal bar ────────────────────────────────────────────────────────────
function HBar({ label, count, maxCount, color }) {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  return (
    <div className="hbar-row">
      <span className="hbar-label">{label}</span>
      <div className="hbar-track">
        <div className="hbar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="hbar-count">{count}</span>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, title, value, sub, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color + '20', color }}>
        <Icon size={22} />
      </div>
      <div className="stat-body">
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value ?? '—'}</h3>
        {sub && <p className="stat-sub">{sub}</p>}
      </div>
    </div>
  );
}

// ── Funnel Step ───────────────────────────────────────────────────────────────
function FunnelStep({ step, count, maxCount, index }) {
  const labels = {
    view_page: 'Vào trang',
    view_tutor: 'Xem gia sư',
    book_tutor: 'Đặt lịch',
    download_material: 'Tải tài liệu',
  };
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];
  const pct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
  return (
    <div className="funnel-step">
      <div className="funnel-bar-wrap">
        <div
          className="funnel-bar"
          style={{ width: `${pct}%`, background: colors[index % colors.length] }}
        />
      </div>
      <div className="funnel-meta">
        <span>{labels[step] || step}</span>
        <strong>{count.toLocaleString()} ({pct}%)</strong>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AnalyticsDashboard() {
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [overview, setOverview]       = useState(null);
  const [topTutors, setTopTutors]     = useState([]);
  const [topMaterials, setTopMaterials] = useState([]);
  const [topSubjects, setTopSubjects] = useState([]);
  const [searchTerms, setSearchTerms] = useState([]);
  const [funnel, setFunnel]           = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ov, tt, tm, ts, st, fn] = await Promise.all([
        fetchAnalyticsOverview(days),
        fetchTopTutors(days),
        fetchTopMaterials(days),
        fetchTopSubjects(days),
        fetchSearchTerms(days),
        fetchFunnel(days),
      ]);
      setOverview(ov);
      setTopTutors(tt);
      setTopMaterials(tm);
      setTopSubjects(ts);
      setSearchTerms(st);
      setFunnel(fn);
      setLastUpdated(new Date().toLocaleTimeString('vi-VN'));
    } catch (e) {
      console.error('Analytics load error:', e);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { load(); }, [load]);

  const maxFunnel = funnel.length > 0 ? Math.max(...funnel.map((f) => f.count)) : 1;

  return (
    <div className="analytics-dash">
      {/* Header */}
      <header className="ad-header">
        <div>
          <h1><Activity size={24} className="inline-icon" /> Analytics Dashboard</h1>
          <p className="ad-sub">Phân tích hành vi người dùng — biết khách thích gì để phát triển đúng hướng</p>
        </div>
        <div className="ad-controls">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="ad-select"
          >
            <option value={7}>7 ngày qua</option>
            <option value={14}>14 ngày qua</option>
            <option value={30}>30 ngày qua</option>
            <option value={90}>90 ngày qua</option>
          </select>
          <button className="ad-refresh" onClick={load} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            Làm mới
          </button>
          {lastUpdated && (
            <span className="ad-updated"><Clock size={12} /> {lastUpdated}</span>
          )}
        </div>
      </header>

      {loading && !overview ? (
        <div className="ad-loading">
          <div className="ad-spinner" />
          <p>Đang tải dữ liệu phân tích...</p>
        </div>
      ) : (
        <>
          {/* KPI Row */}
          <div className="ad-kpi-row">
            <StatCard
              icon={Activity}
              title="Tổng sự kiện"
              value={overview?.total_events?.toLocaleString()}
              sub={`${days} ngày qua`}
              color="#6366f1"
            />
            <StatCard
              icon={Users}
              title="Lượt ghé thăm"
              value={overview?.unique_sessions?.toLocaleString()}
              sub="unique sessions"
              color="#0ea5e9"
            />
            <StatCard
              icon={Eye}
              title="Gia sư hot nhất"
              value={topTutors[0]?.name ?? '—'}
              sub={topTutors[0] ? `${topTutors[0].views} lượt xem` : ''}
              color="#8b5cf6"
            />
            <StatCard
              icon={Download}
              title="Tài liệu hot nhất"
              value={topMaterials[0]?.name?.slice(0, 22) + (topMaterials[0]?.name?.length > 22 ? '…' : '') ?? '—'}
              sub={topMaterials[0] ? `${topMaterials[0].downloads} lượt tải` : ''}
              color="#f59e0b"
            />
          </div>

          {/* Daily Sparkline */}
          <section className="ad-card ad-wide">
            <h2><TrendingUp size={18} /> Hoạt động theo ngày</h2>
            <p className="ad-card-sub">Số events ghi nhận mỗi ngày trong {days} ngày qua</p>
            {overview?.daily?.length > 0 ? (
              <SparkBar data={overview.daily} color="#6366f1" />
            ) : (
              <p className="ad-empty">Chưa có dữ liệu trong khoảng này</p>
            )}
          </section>

          {/* Event Types + Funnel */}
          <div className="ad-row-2">
            <section className="ad-card">
              <h2><BarChart2 size={18} /> Phân bố loại sự kiện</h2>
              <p className="ad-card-sub">Người dùng đang làm gì nhiều nhất?</p>
              <div className="event-type-list">
                {(overview?.by_event_type || []).map((et) => (
                  <HBar
                    key={et.event_type}
                    label={et.event_type}
                    count={et.count}
                    maxCount={overview?.by_event_type[0]?.count || 1}
                    color="#6366f1"
                  />
                ))}
                {overview?.by_event_type?.length === 0 && <p className="ad-empty">Chưa có dữ liệu</p>}
              </div>
            </section>

            <section className="ad-card">
              <h2><TrendingUp size={18} /> Conversion Funnel</h2>
              <p className="ad-card-sub">Từ ghé thăm → đặt lịch tỷ lệ chuyển đổi thế nào?</p>
              <div className="funnel-list">
                {funnel.map((f, i) => (
                  <FunnelStep key={f.step} {...f} index={i} maxCount={maxFunnel} />
                ))}
                {funnel.length === 0 && <p className="ad-empty">Chưa có dữ liệu</p>}
              </div>
            </section>
          </div>

          {/* Top Tutors + Top Materials */}
          <div className="ad-row-2">
            <section className="ad-card">
              <h2><Users size={18} /> Gia sư được xem nhiều nhất</h2>
              <p className="ad-card-sub">Top {days} ngày qua</p>
              <table className="ad-table">
                <thead>
                  <tr><th>#</th><th>Tên gia sư</th><th>Lượt xem</th></tr>
                </thead>
                <tbody>
                  {topTutors.map((t, i) => (
                    <tr key={t.tutor_id}>
                      <td className="rank">{i + 1}</td>
                      <td>{t.name ?? `Tutor #${t.tutor_id}`}</td>
                      <td><span className="badge-view">{t.views}</span></td>
                    </tr>
                  ))}
                  {topTutors.length === 0 && (
                    <tr><td colSpan={3} className="ad-empty">Chưa có dữ liệu</td></tr>
                  )}
                </tbody>
              </table>
            </section>

            <section className="ad-card">
              <h2><BookOpen size={18} /> Tài liệu được quan tâm nhất</h2>
              <p className="ad-card-sub">Kết hợp lượt xem + lượt tải</p>
              <table className="ad-table">
                <thead>
                  <tr><th>#</th><th>Tài liệu</th><th>Xem</th><th>Tải</th></tr>
                </thead>
                <tbody>
                  {topMaterials.map((m, i) => (
                    <tr key={m.material_id}>
                      <td className="rank">{i + 1}</td>
                      <td title={m.name}>{(m.name ?? '').slice(0, 30)}{m.name?.length > 30 ? '…' : ''}</td>
                      <td>{m.views}</td>
                      <td><span className="badge-dl">{m.downloads}</span></td>
                    </tr>
                  ))}
                  {topMaterials.length === 0 && (
                    <tr><td colSpan={4} className="ad-empty">Chưa có dữ liệu</td></tr>
                  )}
                </tbody>
              </table>
            </section>
          </div>

          {/* Subjects + Search Terms */}
          <div className="ad-row-2">
            <section className="ad-card">
              <h2><BookOpen size={18} /> Môn học được quan tâm nhất</h2>
              <p className="ad-card-sub">Dựa trên context của các click</p>
              <div className="tags-cloud">
                {topSubjects.map((s) => (
                  <span
                    key={s.subject}
                    className="subject-tag"
                    style={{ fontSize: `${Math.min(1.4, 0.8 + s.count / 20)}rem` }}
                    title={`${s.count} events`}
                  >
                    {s.subject}
                    <sup className="tag-count">{s.count}</sup>
                  </span>
                ))}
                {topSubjects.length === 0 && <p className="ad-empty">Chưa có dữ liệu</p>}
              </div>
            </section>

            <section className="ad-card">
              <h2><Search size={18} /> Từ khóa tìm kiếm phổ biến</h2>
              <p className="ad-card-sub">Khách đang tìm gì?</p>
              <div className="search-terms-list">
                {searchTerms.map((t, i) => (
                  <div key={t.query} className="search-term-row">
                    <span className={`st-rank rank-${Math.min(i + 1, 3)}`}>{i + 1}</span>
                    <span className="st-query">"{t.query}"</span>
                    <span className="st-count">{t.count} lần</span>
                  </div>
                ))}
                {searchTerms.length === 0 && <p className="ad-empty">Chưa có dữ liệu</p>}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
