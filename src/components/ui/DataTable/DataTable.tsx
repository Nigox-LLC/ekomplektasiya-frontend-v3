import { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  FileSpreadsheet,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import styles from './DataTable.module.css';

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
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
  onImport?: () => void;
  onRowClick?: (item: T) => void;
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
  onImport,
  onRowClick,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search
  const isMounted = useRef(false);

  // Debounce search
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

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
          {onImport && (
            <button className={cn(styles.button, styles.importButton)} onClick={onImport}>
              <FileSpreadsheet size={16} />
              Excel
            </button>
          )}
          {onExport && (
            <button className={cn(styles.button, styles.secondaryButton)} onClick={onExport}>
              <FileSpreadsheet size={16} />
              Export
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
                <td colSpan={columns.length + 1}>
                  <div className={styles.emptyState}>
                    <Inbox className={styles.emptyIcon} strokeWidth={1.5} />
                    <span className={styles.emptyText}>Ro'yxat bo'sh</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className={styles.tr}
                  onClick={() => onRowClick && onRowClick(item)}
                >
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
                            className={cn(styles.iconButton, styles.editButton)}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(item);
                            }}
                            title="Tahrirlash"
                          >
                            <Pencil size={18} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            className={cn(styles.iconButton, styles.deleteButton)}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(item);
                            }}
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
          Jami: {totalItems} | Sahifa {currentPage} / {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <button
            className={cn(styles.iconButton, 'disabled:opacity-50')}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
            title="Oldingi"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            className={cn(styles.iconButton, 'disabled:opacity-50')}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
            title="Keyingi"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
