import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import FindTutorPage from './pages/FindTutorPage';
import TutorDetailPage from './pages/TutorDetailPage';
import BookingPage from './pages/BookingPage';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tim-gia-su" element={<FindTutorPage />} />
          <Route path="/gia-su/:id" element={<TutorDetailPage />} />
          <Route path="/dat-lich" element={<BookingPage />} />
          {/* Các trang còn lại sẽ được bổ sung sau */}
          <Route path="/dang-ky-gia-su" element={<div style={{padding: '100px', textAlign: 'center'}}><h2>Trang Đăng Ký Gia Sư đang được xây dựng</h2></div>} />
          <Route path="/tai-lieu" element={<div style={{padding: '100px', textAlign: 'center'}}><h2>Trang Tài Liệu Học Tập đang được xây dựng</h2></div>} />
          <Route path="/tien-do" element={<div style={{padding: '100px', textAlign: 'center'}}><h2>Trang Theo Dõi Tiến Độ đang được xây dựng</h2></div>} />
          <Route path="/danh-gia" element={<div style={{padding: '100px', textAlign: 'center'}}><h2>Trang Đánh Giá & Hỗ Trợ đang được xây dựng</h2></div>} />
          <Route path="/dang-nhap" element={<div style={{padding: '100px', textAlign: 'center'}}><h2>Trang Đăng Nhập đang được xây dựng</h2></div>} />
          <Route path="/dang-ky" element={<div style={{padding: '100px', textAlign: 'center'}}><h2>Trang Đăng Ký đang được xây dựng</h2></div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
