import { Outlet, Link } from 'react-router-dom';
import styles from './MainLayout.module.css';
import { LayoutDashboard } from 'lucide-react';

export const MainLayout = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <LayoutDashboard size={24} />
          E-Komplektasiya
        </Link>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} E-Komplektasiya. All rights reserved.</p>
      </footer>
    </div>
  );
};
