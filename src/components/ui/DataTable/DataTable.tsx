import { useState, useEffect } from 'react';
import { Search, Plus, FileSpreadsheet, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import styles from './DataTable.module.css';

export interface Column<T> {
    key: keyof T;
    header: string;
    render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading: boolean;
    totalItems: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onSearch: (query: string) => void;
    onCreate?: () => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onExport?: () => void;
    title?: string;
}

export function DataTable<T extends { id: number }>({
    columns,
    data,
    loading,
    totalItems,
    currentPage,
    onPageChange,
    onSearch,
    onCreate,
    onEdit,
    onDelete,
    onExport,
    title
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, onSearch]);

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <div className={styles.searchBox}>
                    <Search size={18} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Qidirish..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className={styles.actions}>
                    {onExport && (
                        <button className={cn(styles.button, styles.secondaryButton)} onClick={onExport}>
                            <FileSpreadsheet size={16} />
                            Excel
                        </button>
                    )}
                    {onCreate && (
                        <button className={cn(styles.button, styles.primaryButton)} onClick={onCreate}>
                            <Plus size={16} />
                            Qo'shish
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={String(col.key)} className={styles.th}>
                                    {col.header}
                                </th>
                            ))}
                            {(onEdit || onDelete) && <th className={styles.th}>Amallar</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="p-8 text-center text-slate-500">
                                    Yuklanmoqda...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="p-8 text-center text-slate-500">
                                    Ma'lumot topilmadi
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.id} className={styles.tr}>
                                    {columns.map((col) => (
                                        <td key={`${item.id}-${String(col.key)}`} className={styles.td}>
                                            {col.render ? col.render(item[col.key], item) : String(item[col.key] || '—')}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className={styles.td}>
                                            <div className={styles.actionCell}>
                                                {onEdit && (
                                                    <button
                                                        className={styles.iconButton}
                                                        onClick={() => onEdit(item)}
                                                        title="Tahrirlash"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        className={cn(styles.iconButton, styles.deleteButton)}
                                                        onClick={() => onDelete(item)}
                                                        title="O'chirish"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
                <span className={styles.pageInfo}>
                    Jami: {totalItems}
                </span>
                <div className="flex gap-2">
                    <button
                        className={cn(styles.iconButton, "disabled:opacity-50")}
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1 || loading}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="flex items-center px-2 text-sm font-medium text-slate-600">
                        {currentPage}
                    </span>
                    <button
                        className={cn(styles.iconButton, "disabled:opacity-50")}
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={data.length === 0 || loading} // Simple check, ideally check next link
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
