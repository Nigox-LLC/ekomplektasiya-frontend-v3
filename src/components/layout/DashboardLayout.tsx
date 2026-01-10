import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar/Sidebar';
import { Header } from './Header/Header';
import styles from './DashboardLayout.module.css';

export const DashboardLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className={styles.container}>
            <Sidebar collapsed={isSidebarCollapsed} />
            <div className={styles.contentWrapper}>
                <Header onToggleSidebar={toggleSidebar} />
                <main className={styles.mainContent}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
