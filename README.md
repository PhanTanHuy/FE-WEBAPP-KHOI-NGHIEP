# 🎓 EduConnect — Nền tảng kết nối gia sư & phụ huynh

> Ứng dụng full-stack giúp phụ huynh tìm gia sư, đặt lịch học, theo dõi tiến độ và chia sẻ tài liệu học tập.

---

## ✨ Tính năng chính

| Module | Mô tả |
|---|---|
| 🔐 Auth | Đăng ký / Đăng nhập (JWT), phân quyền 3 role |
| 👨‍🏫 Tìm gia sư | Tìm kiếm, lọc theo môn/khu vực/giá, xem chi tiết |
| 📋 Đặt lịch | Đặt / xác nhận / hủy buổi học |
| 📈 Tiến độ | Theo dõi từng buổi học, điểm số, bài tập |
| ⭐ Đánh giá | Review gia sư sau buổi học, auto tính rating |
| 📚 Tài liệu | Chia sẻ, tìm kiếm, tải tài liệu học tập |
| 🚗 Đưa đón | Dịch vụ đặt xe đưa đón học sinh |
| 🛡️ Admin | Quản lý user, duyệt gia sư, duyệt tài liệu, audit log |
| 📊 Analytics | Tracking hành vi người dùng, dashboard thống kê real-time |

---

## 🏗️ Công nghệ sử dụng

**Frontend**
- React 19 + Vite
- React Router DOM
- Vanilla CSS (không dùng framework)

**Backend**
- FastAPI (Python)
- SQLAlchemy + Alembic (migration)
- PostgreSQL
- JWT Authentication (python-jose)
- slowapi (rate limiting) · loguru (logging)

---

## 🚀 Chạy local

### 1. Frontend

```bash
npm install
npm run dev
# → http://localhost:5173
```

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt

# Tạo file .env (xem mục Biến môi trường bên dưới)

alembic upgrade head         # tạo bảng DB
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000
# → Swagger docs: http://localhost:8000/docs
```

---

## ⚙️ Biến môi trường

Tạo file `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/educonnect
SECRET_KEY=your-super-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=10080
CORS_ORIGINS=["http://localhost:5173"]
```

Tạo file `.env` ở root (frontend):

```env
VITE_API_URL=http://localhost:8000
```

---

## 📁 Cấu trúc thư mục

```
projectCK/
├── src/                    # React frontend
│   ├── api/                # Gọi API (tutors, bookings, analytics...)
│   ├── components/         # Layout, UI components
│   ├── context/            # AuthContext
│   └── pages/              # Các trang (FindTutor, Booking, Admin...)
│
├── backend/
│   ├── app/
│   │   ├── models/         # SQLAlchemy models (21 bảng)
│   │   ├── routers/        # API endpoints (auth, tutors, bookings...)
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── core/           # Security (JWT, bcrypt)
│   │   └── main.py         # Entry point FastAPI
│   ├── alembic/            # DB migrations
│   └── tests/              # pytest
│
├── render.yaml             # Deploy config (Render.com)
└── README.md
```

---

## 🔌 API nhanh

| Endpoint | Mô tả |
|---|---|
| `POST /api/v1/auth/login` | Đăng nhập → JWT token |
| `GET /api/v1/tutors` | Tìm gia sư (có filter + phân trang) |
| `POST /api/v1/bookings/` | Đặt lịch học |
| `GET /api/v1/progress/` | Tổng quan tiến độ học tập |
| `POST /api/v1/analytics/event` | Ghi sự kiện hành vi người dùng |
| `GET /api/v1/analytics/stats/overview` | Dashboard analytics (admin) |

> Xem toàn bộ API tại: **http://localhost:8000/docs**

---

## 📊 Hệ thống Analytics

EduConnect tự host analytics — **không cần Google Analytics**.

Cách hoạt động:
1. User thao tác trên app → frontend gọi `track('view_tutor', {...})`
2. Sự kiện gửi lên server qua `sendBeacon` (không chặn UI)
3. Admin xem dashboard tại `/admin/analytics`

Dashboard bao gồm: KPIs, biểu đồ theo ngày, top gia sư/tài liệu, funnel chuyển đổi, từ khóa tìm kiếm.

---

## 👥 Roles

| Role | Quyền |
|---|---|
| `parent` | Tìm gia sư, đặt lịch, xem tài liệu, review |
| `tutor` | Quản lý hồ sơ, lịch dạy, báo cáo tiến độ |
| `admin` | Duyệt gia sư/tài liệu, quản lý user, xem analytics |

---

*EduConnect — Kết nối tri thức, ươm mầm tương lai 🌱*
