import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import {
  Menu,
  RotateCcw,
  Maximize,
  Minimize,
  Bell,
  User,
  ChevronDown,
  LogOut,
  ArrowLeft, // Import ArrowLeft
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface HeaderProps {
  className?: string;
  onToggleSidebar?: () => void;
}

export const Header = ({ className, onToggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Default values per screenshot if store is empty
  const displayName = user?.username || 'Администратор';
  const displayRole = 'Администратор';

  const handleOldVersionClick = () => {
    window.open('https://ekomplektasiya.uz/Xaridlar/', '_blank');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const pageTitle = useAppStore((state) => state.pageTitle);

  return (
    <header className={cn(styles.header, className)}>
      {/* Left Section */}
      <div className={styles.leftSection}>
        <button
          type="button"
          className={styles.toggleButton}
          onClick={handleGoBack}
          aria-label="Go Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className={styles.pageTitle}>
          E-KOMPLEKTATSIYA <span className={styles.sep}>|</span>{' '}
          <span className={styles.subTitle}>{pageTitle || 'E-KOMPLEKTASIYA'}</span>
        </div>
      </div>

      {/* Right Section */}
      <div className={styles.rightSection}>
        <button
          type="button"
          className={cn(styles.actionButton, styles.primaryAction)}
          onClick={handleOldVersionClick}
        >
          <RotateCcw size={16} />
          Eski talqinga otish
        </button>

        <button
          type="button"
          className={styles.iconButton}
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>

        <button
          type="button"
          className={styles.iconButton}
          onClick={toggleFullscreen}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>

        <button type="button" className={styles.iconButton} aria-label="Notifications">
          <Bell size={20} />
        </button>

        <div className={styles.profileWrapper} style={{ position: 'relative' }}>
          <div className={styles.userProfile} onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div className={styles.avatar}>
              <User size={20} />
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{displayName}</span>
              <span className={styles.userRole}>{displayRole}</span>
            </div>
            <ChevronDown size={16} color="#94a3b8" />
          </div>

          {showProfileMenu && (
            <div className={styles.dropdownMenu}>
              <button
                onClick={() => {
                  navigate('/profile');
                  setShowProfileMenu(false);
                }}
                className={styles.dropdownItem}
              >
                <User size={16} />
                Profil
              </button>
              <button onClick={handleLogout} className={styles.dropdownItem}>
                <LogOut size={16} />
                Chiqish
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
