from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, ForeignKey, Table, DateTime, Time, Date
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

tutor_subjects = Table(
    "tutor_subjects",
    Base.metadata,
    Column("tutor_profile_id", Integer, ForeignKey("tutor_profiles.id", ondelete="CASCADE"), primary_key=True),
    Column("subject_id", Integer, ForeignKey("subjects.id", ondelete="CASCADE"), primary_key=True),
)

tutor_levels = Table(
    "tutor_levels",
    Base.metadata,
    Column("tutor_profile_id", Integer, ForeignKey("tutor_profiles.id", ondelete="CASCADE"), primary_key=True),
    Column("level_id", Integer, ForeignKey("levels.id", ondelete="CASCADE"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(30), nullable=True)
    full_name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False, default="")
    role = Column(String(20), nullable=False, default="parent")
    avatar_url = Column(String(500), nullable=True)
    birthday = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    tutor_profile = relationship("TutorProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user")
    bookings_as_student = relationship("Booking", back_populates="student", cascade="all, delete-orphan")
    driver_profile = relationship("DriverProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    rides_as_customer = relationship("Ride", back_populates="customer", cascade="all, delete-orphan")


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(120), unique=True, nullable=False)
    icon = Column(String(20), nullable=True)
    color = Column(String(20), nullable=True)

    tutors = relationship("TutorProfile", secondary=tutor_subjects, back_populates="subjects")


class Level(Base):
    __tablename__ = "levels"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(120), unique=True, nullable=False)
    grades = Column(String(120), nullable=True)

    tutors = relationship("TutorProfile", secondary=tutor_levels, back_populates="levels")


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(160), unique=True, index=True, nullable=False)
    city = Column(String(120), index=True, nullable=False)
    district = Column(String(120), index=True, nullable=False)

    tutors = relationship("TutorProfile", back_populates="location")


class TutorProfile(Base):
    __tablename__ = "tutor_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    location_id = Column(Integer, ForeignKey("locations.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    bio = Column(Text, nullable=False)
    experience_years = Column(Integer, default=0, nullable=False)
    price_per_hour = Column(Integer, default=0, nullable=False)
    teaching_mode = Column(String(20), default="online", nullable=False)
    verified = Column(Boolean, default=False, nullable=False)
    status = Column(String(20), default="draft", nullable=False)
    rejection_reason = Column(Text, nullable=True)
    rating = Column(Float, default=0.0, nullable=False)
    review_count = Column(Integer, default=0, nullable=False)
    completed_lessons = Column(Integer, default=0, nullable=False)
    student_count = Column(Integer, default=0, nullable=False)

    user = relationship("User", back_populates="tutor_profile")
    location = relationship("Location", back_populates="tutors")
    subjects = relationship("Subject", secondary=tutor_subjects, back_populates="tutors")
    levels = relationship("Level", secondary=tutor_levels, back_populates="tutors")
    educations = relationship("TutorEducation", back_populates="tutor_profile", cascade="all, delete-orphan")
    certificates = relationship("TutorCertificate", back_populates="tutor_profile", cascade="all, delete-orphan")
    availabilities = relationship("TutorAvailability", back_populates="tutor_profile", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="tutor_profile", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="tutor", cascade="all, delete-orphan")


class TutorEducation(Base):
    __tablename__ = "tutor_educations"

    id = Column(Integer, primary_key=True, index=True)
    tutor_profile_id = Column(Integer, ForeignKey("tutor_profiles.id", ondelete="CASCADE"), nullable=False)
    degree = Column(String(120), nullable=False)
    major = Column(String(255), nullable=False)
    school = Column(String(255), nullable=False)
    year = Column(Integer, nullable=True)

    tutor_profile = relationship("TutorProfile", back_populates="educations")


class TutorCertificate(Base):
    __tablename__ = "tutor_certificates"

    id = Column(Integer, primary_key=True, index=True)
    tutor_profile_id = Column(Integer, ForeignKey("tutor_profiles.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=True)

    tutor_profile = relationship("TutorProfile", back_populates="certificates")


class TutorAvailability(Base):
    __tablename__ = "tutor_availabilities"

    id = Column(Integer, primary_key=True, index=True)
    tutor_profile_id = Column(Integer, ForeignKey("tutor_profiles.id", ondelete="CASCADE"), nullable=False)
    day_of_week = Column(String(10), nullable=False) # Mon, Tue, Wed, Thu, Fri, Sat, Sun
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    tutor_profile = relationship("TutorProfile", back_populates="availabilities")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    tutor_profile_id = Column(Integer, ForeignKey("tutor_profiles.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    booking_id = Column(Integer, nullable=True)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    tutor_profile = relationship("TutorProfile", back_populates="reviews")
    user = relationship("User", back_populates="reviews")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    tutor_id = Column(Integer, ForeignKey("tutor_profiles.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="SET NULL"), nullable=True)
    
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    
    status = Column(String(20), default="pending", nullable=False) # pending, confirmed, rejected, completed, cancelled
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    student = relationship("User", back_populates="bookings_as_student")
    tutor = relationship("TutorProfile", back_populates="bookings")
    subject = relationship("Subject")
    sessions = relationship("LessonSession", back_populates="booking", cascade="all, delete-orphan")


class LessonSession(Base):
    __tablename__ = "lesson_sessions"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False)
    session_number = Column(Integer, default=1, nullable=False)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    status = Column(String(20), default="scheduled", nullable=False) # scheduled, completed, cancelled, absent
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    booking = relationship("Booking", back_populates="sessions")
    progress_report = relationship("ProgressReport", back_populates="session", uselist=False, cascade="all, delete-orphan")
    assignments = relationship("Assignment", back_populates="session", cascade="all, delete-orphan")


class ProgressReport(Base):
    __tablename__ = "progress_reports"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("lesson_sessions.id", ondelete="CASCADE"), unique=True, nullable=False)
    tutor_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False) # Đánh giá buổi học, điểm mạnh/yếu
    score = Column(Float, nullable=True)   # Điểm số buổi học (thang điểm 10)
    homework = Column(Text, nullable=True) # Bài tập về nhà
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    session = relationship("LessonSession", back_populates="progress_report")
    tutor = relationship("User", foreign_keys=[tutor_id])
    student = relationship("User", foreign_keys=[student_id])


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("lesson_sessions.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(Date, nullable=True)
    status = Column(String(20), default="pending", nullable=False) # pending, submitted, graded
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    grade = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    session = relationship("LessonSession", back_populates="assignments")


class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="SET NULL"), nullable=True)
    level_id = Column(Integer, ForeignKey("levels.id", ondelete="SET NULL"), nullable=True)
    grade = Column(String(50), nullable=True) # "Lớp 10", "Lớp 11", "Lớp 12", "Đại học"...
    type = Column(String(20), default="material", nullable=False) # exam, material, exercise
    file_format = Column(String(20), default="PDF", nullable=False) # PDF, DOC, ZIP
    author_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    status = Column(String(20), default="approved", nullable=False) # pending, approved, rejected
    is_premium = Column(Boolean, default=False, nullable=False)
    price = Column(String(20), default="Miễn phí", nullable=False) # "Miễn phí" hoặc "Trả phí"
    tags = Column(Text, nullable=True) # Comma-separated tags or JSON
    downloads = Column(Integer, default=0, nullable=False)
    pages = Column(Integer, default=1, nullable=False)
    file_size = Column(String(20), default="2.5 MB", nullable=False)
    file_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    subject = relationship("Subject")
    level = relationship("Level")
    author = relationship("User")
    favorites = relationship("MaterialFavorite", back_populates="material", cascade="all, delete-orphan")


class MaterialFavorite(Base):
    __tablename__ = "material_favorites"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    material_id = Column(Integer, ForeignKey("materials.id", ondelete="CASCADE"), primary_key=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    material = relationship("Material", back_populates="favorites")
    user = relationship("User")


class MaterialDownload(Base):
    __tablename__ = "material_downloads"

    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(Integer, ForeignKey("materials.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    downloaded_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)


class DriverProfile(Base):
    __tablename__ = "driver_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    license_number = Column(String(100), nullable=True)
    verified = Column(Boolean, default=False, nullable=False)
    status = Column(String(20), default="offline", nullable=False) # offline, active, busy
    rating = Column(Float, default=0.0, nullable=False)
    review_count = Column(Integer, default=0, nullable=False)
    completed_rides = Column(Integer, default=0, nullable=False)
    current_lat = Column(Float, nullable=True)
    current_lng = Column(Float, nullable=True)
    
    user = relationship("User", back_populates="driver_profile")
    vehicles = relationship("Vehicle", back_populates="driver", cascade="all, delete-orphan")
    rides_as_driver = relationship("Ride", back_populates="driver", cascade="all, delete-orphan")


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("driver_profiles.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False) # motorcycle, car_4, car_7
    plate_number = Column(String(50), unique=True, nullable=False)
    brand = Column(String(100), nullable=True)
    model = Column(String(100), nullable=True)
    color = Column(String(50), nullable=True)
    
    driver = relationship("DriverProfile", back_populates="vehicles")


class Ride(Base):
    __tablename__ = "rides"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    driver_id = Column(Integer, ForeignKey("driver_profiles.id", ondelete="SET NULL"), nullable=True)
    
    pickup_address = Column(Text, nullable=False)
    pickup_lat = Column(Float, nullable=False)
    pickup_lng = Column(Float, nullable=False)
    
    dropoff_address = Column(Text, nullable=False)
    dropoff_lat = Column(Float, nullable=False)
    dropoff_lng = Column(Float, nullable=False)
    
    distance_km = Column(Float, nullable=False)
    price = Column(Integer, nullable=False)
    
    status = Column(String(20), default="pending", nullable=False) # pending, accepted, ongoing, completed, cancelled
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    customer = relationship("User", back_populates="rides_as_customer")
    driver = relationship("DriverProfile", back_populates="rides_as_driver")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(100), nullable=False) # e.g., create_booking, cancel_ride, approve_material
    entity = Column(String(100), nullable=False) # e.g., Booking, Ride, Material
    entity_id = Column(Integer, nullable=True)
    details = Column(Text, nullable=True) # JSON string of details
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)


class AnalyticsEvent(Base):
    """
    Bảng ghi lại mọi tương tác của người dùng (click, view, search, v.v.)
    để phân tích hành vi và sở thích của khách hàng.
    
    event_type  : loại sự kiện, ví dụ: 'view_tutor', 'click_material',
                  'search_tutor', 'book_tutor', 'download_material', 'view_page'
    entity_type : loại đối tượng bị tác động: 'tutor', 'material', 'subject', 'page'
    entity_id   : ID cụ thể (gia sư nào, tài liệu nào...)
    entity_name : tên gợi nhớ (slug, tiêu đề...) để dễ đọc báo cáo
    metadata    : JSON string chứa thêm context: {"subject": "Toán", "grade": "Lớp 10"}
    session_id  : ID phiên trình duyệt (random UUID từ frontend, lưu localStorage)
                  giúp gom nhóm hành vi trong một lần ghé thăm
    """
    __tablename__ = "analytics_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    session_id = Column(String(64), nullable=True, index=True)  # anonymous tracking

    event_type = Column(String(50), nullable=False, index=True)  # view_tutor, click_material...
    entity_type = Column(String(50), nullable=True, index=True)  # tutor, material, subject, page
    entity_id = Column(Integer, nullable=True, index=True)
    entity_name = Column(String(255), nullable=True)             # readable label

    meta = Column(Text, nullable=True)   # JSON: extra context

    referrer = Column(String(500), nullable=True)  # URL trước đó
    user_agent = Column(String(500), nullable=True)
    ip_address = Column(String(50), nullable=True)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False, index=True)


