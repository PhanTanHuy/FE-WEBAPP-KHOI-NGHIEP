import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout';

import './App.css';

const DeliveryPage = lazy(() => import('./pages/DeliveryPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FindTutorPage = lazy(() => import('./pages/FindTutorPage'));
const TutorDetailPage = lazy(() => import('./pages/TutorDetailPage'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const StudyMaterialsPage = lazy(() => import('./pages/StudyMaterialsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const OnlineTutorPage = lazy(() => import('./pages/OnlineTutorPage'));
const HomeTutorPage = lazy(() => import('./pages/HomeTutorPage'));
const TrialPage = lazy(() => import('./pages/TrialPage'));
const TutorRegisterPage = lazy(() => import('./pages/TutorRegisterPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const ReviewPage = lazy(() => import('./pages/ReviewPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AdminTutorApplicationsPage = lazy(() => import('./pages/AdminTutorApplicationsPage'));
const BookingsDashboardPage = lazy(() => import('./pages/BookingsDashboardPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const RideHailingPage = lazy(() => import('./pages/RideHailingPage'));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));

function App() {
  return (
    <Router>
      <Layout>

        <Suspense fallback={<div className="page-loading">Đang tải...</div>}>
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
            element={<RideHailingPage />}
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
          <Route
            path="/quan-ly-dat-lich"
            element={<BookingsDashboardPage />}
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
              <ProgressPage />
            }
          />

          <Route
            path="/danh-gia"
            element={
              <ReviewPage />
            }
          />

          <Route
            path="/dang-nhap"
            element={
              <LoginPage />
            }
          />

          <Route
            path="/dang-ky"
            element={
              <RegisterPage />
            }
          />

          <Route
            path="/admin/duyet-gia-su"
            element={
              <AdminTutorApplicationsPage />
            }
          />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AnalyticsDashboard />} />


          {/* ================= 404 ================= */}

          <Route
            path="*"
            element={
              <NotFoundPage />
            }
          />

        </Routes>
        </Suspense>

      </Layout>
    </Router>
  );
}


export default App;
