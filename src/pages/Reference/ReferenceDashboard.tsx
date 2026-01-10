import { useNavigate } from 'react-router-dom';
import {
    MapPin,
    Map,
    Building2,
    Briefcase,
    Package,
    Box,
    Scale,
    Ruler
} from 'lucide-react';
import styles from './ReferenceDashboard.module.css';

interface ReferenceTile {
    title: string;
    description: string;
    icon: any;
    path: string;
    color: string;
    bgColor: string;
}

export const ReferenceDashboard = () => {
    const navigate = useNavigate();

    const references: ReferenceTile[] = [
        {
            title: "Viloyatlar",
            description: "Respublika bo'yicha barcha viloyatlar ro'yxati",
            icon: Map,
            path: "area/regions",
            color: "#3b82f6", // blue-500
            bgColor: "#eff6ff" // blue-50
        },
        {
            title: "Tumanlar",
            description: "Viloyatlar kesimida tumanlar ro'yxati",
            icon: MapPin,
            path: "area/districts",
            color: "#8b5cf6", // violet-500
            bgColor: "#f5f3ff" // violet-50
        },
        {
            title: "Bo'limlar",
            description: "Tashkilot bo'limlari va ularning tuzilmasi",
            icon: Building2,
            path: "organization/department",
            color: "#10b981", // emerald-500
            bgColor: "#ecfdf5" // emerald-50
        },
        {
            title: "Lavozimlar",
            description: "Xodimlar shtat birligi va lavozimlar",
            icon: Briefcase,
            path: "organization/position",
            color: "#f59e0b", // amber-500
            bgColor: "#fffbeb" // amber-50
        },
        {
            title: "Mahsulot turlari",
            description: "Ombordagi mahsulotlarning asosiy turlari",
            icon: Package,
            path: "product/type",
            color: "#ec4899", // pink-500
            bgColor: "#fdf2f8" // pink-50
        },
        {
            title: "Mahsulot modellari",
            description: "Mahsulot turlariga bog'langan modellar",
            icon: Box,
            path: "product/model",
            color: "#06b6d4", // cyan-500
            bgColor: "#ecfeff" // cyan-50
        },
        {
            title: "O'lchov birliklari",
            description: "Asosiy o'lchov birliklari (kg, m, dona...)",
            icon: Scale,
            path: "measurement/unit",
            color: "#6366f1", // indigo-500
            bgColor: "#eef2ff" // indigo-50
        },
        {
            title: "O'lchamlar",
            description: "Mahsulot modellari uchun o'lchamlar",
            icon: Ruler,
            path: "measurement/size",
            color: "#f43f5e", // rose-500
            bgColor: "#fff1f2" // rose-50
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Ma'lumotnomalar</h1>
                <p className={styles.subtitle}>Tizimning asosiy ma'lumotnoma va klassifikatorlarini boshqarish</p>
            </div>

            <div className={styles.grid}>
                {references.map((item, index) => (
                    <div
                        key={index}
                        className={styles.card}
                        onClick={() => navigate(item.path)}
                    >
                        <div
                            className={styles.iconBox}
                            style={{ backgroundColor: item.bgColor }}
                        >
                            <item.icon size={24} color={item.color} />
                        </div>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                        <p className={styles.cardDescription}>{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
