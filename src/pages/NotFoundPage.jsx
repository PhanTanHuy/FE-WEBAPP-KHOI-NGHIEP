import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import './NotFoundPage.css';

export default function NotFoundPage() {
    return (
        <main className="not-found-page">
            <div className="not-found-content">
                <AlertCircle className="not-found-icon" size={80} />
                <h1>404</h1>
                <h2>Không tìm thấy trang</h2>
                <p>Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không truy cập được.</p>
                <Link to="/" className="home-btn">
                    <Home size={20} /> Về trang chủ
                </Link>
            </div>
        </main>
    );
}
