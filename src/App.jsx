import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout';
import DeliveryPage from './pages/DeliveryPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FindTutorPage from './pages/FindTutorPage';
import TutorDetailPage from './pages/TutorDetailPage';
import ServicePage from './pages/ServicePage';
import BookingPage from './pages/BookingPage';
import StudyMaterialsPage from './pages/StudyMaterialsPage';
import ContactPage from './pages/ContactPage';
import OnlineTutorPage from './pages/OnlineTutorPage';
import HomeTutorPage from './pages/HomeTutorPage';
import TrialPage from './pages/TrialPage';
import TutorRegisterPage from './pages/TutorRegisterPage';
import RegisterPage from './pages/RegisterPage';

import './App.css';

function App() {
  return (
    <Router>
      <Layout>

        <Routes>

          {/* ================= TRANG CHỦ ================= */}

          <Route
            path="/"
            element={<HomePage />}
          />


          {/* ================= GIỚI THIỆU ================= */}

          <Route
            path="/gioi-thieu"
            element={<AboutPage />}
          />


          {/* ================= TÌM GIA SƯ ================= */}

          <Route
            path="/tim-gia-su"
            element={<FindTutorPage />}
          />


          {/* ================= CHI TIẾT GIA SƯ ================= */}

          <Route
            path="/gia-su/:id"
            element={<TutorDetailPage />}
          />


          {/* ================= DỊCH VỤ ================= */}

          <Route
            path="/dich-vu"
            element={<ServicePage />}
          />
          <Route
            path="/gia-su-online"
            element={<OnlineTutorPage />}
          />
          <Route
            path="/gia-su-tai-nha"
            element={<HomeTutorPage />}
          />
          <Route
            path="/dua-don-hoc-sinh"
            element={<DeliveryPage />}
          />
          <Route
            path="/hoc-thu"
            element={<TrialPage />}
          />
          {/* ================= ĐẶT LỊCH ================= */}

          <Route
            path="/dat-lich"
            element={<BookingPage />}
          />


          {/* ================= TÀI LIỆU HỌC TẬP ================= */}

          <Route
            path="/tai-lieu"
            element={<StudyMaterialsPage />}
          />


          {/* ================= LIÊN HỆ ================= */}

          <Route
            path="/lien-he"
            element={<ContactPage />}
          />


          {/* ================= CÁC TRANG KHÁC ================= */}

          <Route
            path="/dang-ky-gia-su"
            element={
              <TutorRegisterPage />
            }
          />

          <Route
            path="/tien-do"
            element={
              <PagePlaceholder title="Theo dõi tiến độ" />
            }
          />

          <Route
            path="/danh-gia"
            element={
              <PagePlaceholder title="Đánh giá & Hỗ trợ" />
            }
          />

          <Route
            path="/dang-nhap"
            element={
              <PagePlaceholder title="Đăng nhập" />
            }
          />

          <Route
            path="/dang-ky"
            element={
              <RegisterPage />
            }
          />


          {/* ================= 404 ================= */}

          <Route
            path="*"
            element={
              <PagePlaceholder title="Không tìm thấy trang" />
            }
          />

        </Routes>

      </Layout>
    </Router>
  );
}


/*
 * Component tạm thời cho những trang
 * chưa làm giao diện.
 */
function PagePlaceholder({ title }) {
  return (
    <div className="page-placeholder">
      <h2>{title}</h2>
      <p>Trang này đang được xây dựng.</p>
    </div>
  );
}

export default App;