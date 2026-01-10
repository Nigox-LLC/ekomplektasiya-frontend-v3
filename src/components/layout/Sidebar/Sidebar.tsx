import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Globe,
    TrendingUp,
    AlertCircle,
    Book,
    Settings,
    Phone,
    Headphones,
    Flame // Using Flame as logo placeholder based on image look
} from 'lucide-react';
import { cn } from '@/utils/cn';
import styles from './Sidebar.module.css';

interface NavItem {
    label: string;
    path: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { label: 'Bosh sahifa', path: '/', icon: LayoutDashboard },
    { label: 'Buyurtmalar', path: '/orders', icon: Package },
    { label: 'Saytga joylashtirish', path: '/content', icon: Globe },
    { label: 'Narx tahlili', path: '/price-analysis', icon: TrendingUp },
    { label: 'Murojaat xato', path: '/issues', icon: AlertCircle },
    { label: 'Ma\'lumotnomalar', path: '/references', icon: Book },
    { label: 'Sozlamalar', path: '/settings', icon: Settings },
];

export const Sidebar = ({ className, collapsed }: { className?: string; collapsed?: boolean }) => {
    return (
        <aside className={cn(styles.aside, collapsed && styles.asideCollapsed, className)}>
            {/* Brand Header */}
            <div className={styles.header}>
                <div className={styles.logoBox}>
                    <Flame size={24} fill="white" />
                </div>
                <div className={styles.brandInfo}>
                    <span className={styles.brandTitle}>E-KOMPLEKTASIYA</span>
                    <span className={styles.brandSubtitle}>Qulay va zamonaviy platforma</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(styles.navItem, isActive && styles.navItemActive)}
                    >
                        <item.icon size={20} className={styles.navIcon} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className={styles.footer}>
                <div className={styles.contact}>
                    <Phone size={18} />
                    <span>+998 50 200 21 22</span>
                </div>
                <a href="#" className={styles.supportLink}>
                    <Headphones size={18} />
                    <span>Qo'llab-quvvatlash</span>
                </a>
            </div>
        </aside>
    );
};
