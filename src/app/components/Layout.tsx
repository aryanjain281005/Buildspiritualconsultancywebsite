import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import LoginModal from './LoginModal';

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    // Handle hash scrolling on route change
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else if (!location.hash && location.pathname === '/') {
      // scroll to top on home
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#FAFBFF] dark:bg-[#060312] transition-colors duration-300">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <LoginModal />
    </div>
  );
}