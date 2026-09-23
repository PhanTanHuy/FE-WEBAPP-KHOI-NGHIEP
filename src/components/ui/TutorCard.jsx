import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, BookOpen, CheckCircle, Users } from 'lucide-react';
import './TutorCard.css';

export default function TutorCard({ tutor }) {
  const {
    id, name, avatar, title, subjects, levels, rating,
    reviewCount, pricePerHour, location, teachingMode,
    verified, experience, completedLessons, studentCount
  } = tutor;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={13}
        className={i < Math.floor(rating) ? 'star-filled' : 'star-empty'}
      />
    ));
  };

  const modeLabel = {
    online: { label: 'Online', class: 'mode-online' },
    offline: { label: 'Tại nhà', class: 'mode-offline' }
  };

  return (
    <Link to={`/gia-su/${id}`} className="tutor-card">
      <div className="tutor-card__header">
        <div className="tutor-card__avatar-wrap">
          <img
            src={avatar}
            alt={name}
            className="tutor-card__avatar"
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1E3A8A&color=fff`; }}
          />
          {verified && (
            <div className="tutor-card__verified" title="Đã xác minh">
              <CheckCircle size={14} />
            </div>
          )}
        </div>
        <div className="tutor-card__info">
          <h3 className="tutor-card__name">{name}</h3>
          <p className="tutor-card__title">{title}</p>
          <div className="tutor-card__rating">
            <div className="stars">{renderStars(rating)}</div>
            <span className="rating-value">{rating}</span>
            <span className="rating-count">({reviewCount} đánh giá)</span>
          </div>
        </div>
      </div>

      <div className="tutor-card__body">
        <div className="tutor-card__subjects">
          {subjects.map((sub) => (
            <span key={sub} className="subject-tag">{sub}</span>
          ))}
          {levels.map((lvl) => (
            <span key={lvl} className="level-tag">{lvl}</span>
          ))}
        </div>

        <div className="tutor-card__meta">
          <div className="meta-item">
            <MapPin size={13} />
            <span>{location}</span>
          </div>
          <div className="meta-item">
            <Clock size={13} />
            <span>{experience} năm kinh nghiệm</span>
          </div>
          <div className="meta-item">
            <Users size={13} />
            <span>{studentCount} học viên</span>
          </div>
          <div className="meta-item">
            <BookOpen size={13} />
            <span>{completedLessons} buổi dạy</span>
          </div>
        </div>

        <div className="tutor-card__modes">
          {teachingMode.map((mode) => (
            <span key={mode} className={`mode-badge ${modeLabel[mode]?.class}`}>
              {modeLabel[mode]?.label}
            </span>
          ))}
        </div>
      </div>

      <div className="tutor-card__footer">
        <div className="tutor-card__price">
          <span className="price-value">
            {pricePerHour.toLocaleString('vi-VN')}đ
          </span>
          <span className="price-unit">/giờ</span>
        </div>
        <button className="btn btn-primary btn-sm tutor-card__btn" onClick={(e) => e.preventDefault()}>
          Xem chi tiết
        </button>
      </div>
    </Link>
  );
}
