import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { authApi } from '../../services/api';
import styles from './LoginPage.module.css';
import { User, Lock, Eye, EyeOff, LayoutDashboard } from 'lucide-react';
import { z } from 'zod';
import { cn } from '../../utils/cn';

// Minimal validation schema
const loginSchema = z.object({
    username: z.string().min(1, 'Logini kiriting'),
    password: z.string().min(1, 'Parolni kiriting'),
});

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError(null);

        // Client-side validation
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        setIsLoading(true);

        try {
            // Call API
            const response = await authApi.login(formData);

            // Update Store
            // Check if username corresponds to the one entered (OpenAPI spec doesn't return user object)
            // We'll use the entered username for now.
            login(
                { username: formData.username },
                response.access,
                response.refresh
            );

            // Redirect
            navigate('/', { replace: true });
        } catch (err) {
            console.error('Login failed', err);
            // Determine error message based on response
            setError('Login yoki parol noto\'g\'ri');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* Left Side - Branding */}
                <div className={styles.brandSide}>
                    <div className={styles.brandHeader}>
                        {/* Logo Placeholder */}
                        {/* <div className={styles.logoBox}>
               <LayoutDashboard size={32} />
            </div> */}
                        {/* Using the icon from the image roughly */}
                        <LayoutDashboard size={40} />
                        <span className={styles.brandTitle}>E-Komplektasiya</span>
                    </div>

                    <div className={styles.brandContent}>
                        <h1 className={styles.mainHeading}>Ombor va mahsulotlar boshqaruvi</h1>
                        <p className={styles.subText}>
                            Tizimga kiring va ombor, mahsulot qoldiqlari hamda hujjatlarni samarali boshqaring.
                        </p>
                    </div>

                    <div className={styles.copyright}>
                        © {new Date().getFullYear()} E-Komplektasiya
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className={styles.formSide}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Tizimga kirish</h2>
                        <p className={styles.formSubtitle}>Login va parolingizni kiriting</p>
                    </div>

                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="username" className={styles.label}>
                                <span className={styles.required}>*</span> Login
                            </label>
                            <div className={styles.inputWrapper}>
                                <User size={18} className={styles.inputIcon} />
                                <input
                                    id="username"
                                    type="text"
                                    className={styles.input}
                                    placeholder="Administrator"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password" className={styles.label}>
                                <span className={styles.required}>*</span> Parol
                            </label>
                            <div className={styles.inputWrapper}>
                                <Lock size={18} className={styles.inputIcon} />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className={styles.input}
                                    placeholder="••••••••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className={styles.togglePassword}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={cn(styles.submitButton)}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Kirilmoqda...' : 'Kirish'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
