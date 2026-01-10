import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { employeeApi } from '@/services/api';
import type { EmployeeDetail } from '@/types/employee';
import styles from './ProfilePage.module.css';

export const ProfilePage = () => {
    const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await employeeApi.getEmployeeProfile();
                setEmployee(data);
            } catch (err) {
                console.error(err);
                setError('Xodim ma\'lumotlarini yuklashda xatolik yuz berdi');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Yuklanmoqda...</div>;
    }

    if (error || !employee) {
        return <div className="p-8 text-center text-red-500">{error || 'Ma\'lumot topilmadi'}</div>;
    }

    return (
        <div className={styles.container}>
            {/* Header Card */}
            <div className={styles.headerCard}>
                <div className={styles.avatarBox}>
                    <User size={24} color="white" />
                </div>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Profile</h1>
                    <p className={styles.subTitle}>Foydalanuvchi ma'lumotlari</p>
                </div>
            </div>

            {/* Info Grid */}
            <div className={styles.infoCard}>
                <div className={styles.grid}>
                    {/* --- Shaxsiy Ma'lumotlar --- */}
                    <div className={styles.infoGroup + ' ' + styles.fullWidth}>
                        <h3 className={styles.sectionTitle}>Shaxsiy ma'lumotlar</h3>
                        <hr className="border-slate-200" />
                    </div>

                    <div className={styles.infoGroup}>
                        <label className={styles.label}>F.I.O</label>
                        <div className={styles.valueBox}>{employee.full_name}</div>
                    </div>

                    <div className={styles.infoGroup}>
                        <label className={styles.label}>Tug'ilgan sana</label>
                        <div className={styles.valueBox}>{employee.birth_date || '—'}</div>
                    </div>

                    <div className={styles.infoGroup}>
                        <label className={styles.label}>Telefon raqam</label>
                        <div className={styles.valueBox}>{employee.phone || '—'}</div>
                    </div>

                    <div className={styles.infoGroup}>
                        <label className={styles.label}>Manzil</label>
                        <div className={styles.valueBox}>{employee.address || '—'}</div>
                    </div>

                    {/* --- Ish Joyi --- */}
                    <div className={styles.infoGroup + ' ' + styles.fullWidth}>
                        <h3 className={styles.sectionTitle}>Ish joyi ma'lumotlari</h3>
                        <hr className="border-slate-200" />
                    </div>

                    <div className={styles.infoGroup}>
                        <label className={styles.label}>Bo'lim</label>
                        <div className={styles.valueBox}>{employee.department?.name || '—'}</div>
                    </div>

                    <div className={styles.infoGroup}>
                        <label className={styles.label}>Lavozim</label>
                        <div className={styles.valueBox}>{employee.position?.name || '—'}</div>
                    </div>

                    <div className={styles.infoGroup}>
                        <label className={styles.label}>Viloyat</label>
                        <div className={styles.valueBox}>{employee.region?.name || '—'}</div>
                    </div>

                    <div className={styles.infoGroup}>
                        <label className={styles.label}>Tuman</label>
                        <div className={styles.valueBox}>{employee.district?.name || '—'}</div>
                    </div>

                    <div className={styles.infoGroup + ' ' + styles.fullWidth}>
                        <label className={styles.label}>Biriktirilgan ombor</label>
                        <div className={styles.valueBox}>
                            {employee.warehouse && employee.warehouse.length > 0
                                ? employee.warehouse.map(w => w.name).join(', ')
                                : '—'}
                        </div>
                    </div>

                    {/* --- Hujjatlar --- */}
                    <div className={styles.infoGroup + ' ' + styles.fullWidth}>
                        <h3 className={styles.sectionTitle}>Hujjat ma'lumotlari</h3>
                        <hr className="border-slate-200" />
                    </div>

                    <div className={styles.infoGroup}>
                        <label className={styles.label}>Pasport to'liq</label>
                        <div className={styles.valueBox}>
                            {employee.passport_series && employee.passport_number
                                ? `${employee.passport_series} ${employee.passport_number}`
                                : '—'}
                        </div>
                    </div>

                    <div className={styles.infoGroup}>
                        <label className={styles.label}>JSHSHR (PINFL)</label>
                        <div className={styles.valueBox}>{employee.jshshr || '—'}</div>
                    </div>

                    <div className={styles.infoGroup}>
                        <label className={styles.label}>STIR (INN)</label>
                        <div className={styles.valueBox}>{employee.inn || '—'}</div>
                    </div>

                    <div className={styles.infoGroup}>
                        <label className={styles.label}>Holati</label>
                        <div className={styles.valueBox}>
                            <span className={employee.is_active ? "text-green-600 font-medium" : "text-red-600"}>
                                {employee.is_active ? "Faol" : "Faol emas"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
