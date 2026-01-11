import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar/Sidebar';
import { Header } from './Header/Header';
import styles from './DashboardLayout.module.css';

// Routes that should NOT have page scrolling (internal table scroll instead)
const NO_SCROLL_ROUTES = ['/reference/regions'];

export const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const isFixedPage = NO_SCROLL_ROUTES.some((route) => location.pathname.startsWith(route));

  return (
    <div className={styles.container}>
      <Sidebar collapsed={isSidebarCollapsed} />
      <div className={styles.contentWrapper}>
        <Header onToggleSidebar={toggleSidebar} />
        <main className={`${styles.mainContent} ${!isFixedPage ? styles.scrollable : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
