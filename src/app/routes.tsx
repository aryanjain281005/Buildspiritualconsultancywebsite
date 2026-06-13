import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import CoursesPage from './pages/Courses';
import Admin from './pages/Admin';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFF] dark:bg-[#060312] pt-24">
      <div className="text-center">
        <div className="text-7xl mb-6">✦</div>
        <h1 className="text-4xl text-[#1E1048] dark:text-[#EDE9FF] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Page Not Found
        </h1>
        <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-8">
          The path you seek is not here. Let us guide you back.
        </p>
        <a
          href="/"
          className="px-6 py-3 rounded-full text-white font-medium inline-block"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}
        >
          Return Home
        </a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'blog', Component: Blog },
      { path: 'courses', Component: CoursesPage },
      { path: 'admin', Component: Admin },
      { path: '*', Component: NotFound },
    ],
  },
]);