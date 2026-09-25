import Header from './Header';
import Footer from './Footer';
import './Layout.css';

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <div className="layout__main">
        {children}
      </div>
      <Footer />
    </div>
  );
}
