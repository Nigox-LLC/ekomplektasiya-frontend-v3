import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/utils/cn';
import styles from './HomePage.module.css';
import { Moon, Sun, ArrowRight } from 'lucide-react';

export const HomePage = () => {
  const { theme, toggleTheme } = useAppStore();

  // Apply theme effect (in a real app this might be in a provider)
  if (typeof document !== 'undefined') {
    if (theme === 'dark') {
      document.documentElement.style.setProperty('--color-bg', 'hsl(220, 15%, 10%)');
      document.documentElement.style.setProperty('--color-surface', 'hsl(220, 15%, 15%)');
      document.documentElement.style.setProperty('--color-text', '#ffffff');
      document.documentElement.style.setProperty('--color-text-secondary', 'hsl(220, 15%, 70%)');
    } else {
      document.documentElement.style.removeProperty('--color-bg');
      document.documentElement.style.removeProperty('--color-surface');
      document.documentElement.style.removeProperty('--color-text');
      document.documentElement.style.removeProperty('--color-text-secondary');
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Welcome to E-Komplektasiya</h1>
        <p className={styles.subtitle}>
          A professional, senior-level React boilerplate built for scalability and performance.
        </p>

        <div className={styles.actions}>
          <button
            className={cn(styles.button, styles.buttonPrimary)}
            onClick={() => console.log('Get Started')}
            type="button"
          >
            Get Started <ArrowRight size={20} />
          </button>

          <button
            className={cn(styles.button, styles.buttonSecondary)}
            onClick={toggleTheme}
            type="button"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};
