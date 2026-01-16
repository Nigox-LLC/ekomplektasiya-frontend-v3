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
  render?: (value: T[keyof T], item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch?: (query: string) => void;
  onCreate?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onExport?: () => void;
  onImport?: () => void;
  onRowClick?: (item: T) => void;
  tabs?: { key: string; label: string; count?: number }[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  onRefresh?: () => void;
  enableInfiniteScroll?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  moreLoading?: boolean;
  filters?: React.ReactNode;
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
  tabs,
  activeTab,
  onTabChange,
  pageSize = 10,
  onPageSizeChange,
  onRefresh,
  enableInfiniteScroll = false,
  onLoadMore,
  hasMore = false,
  moreLoading = false,
  filters,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search
  const isMounted = useRef(false);

  // Infinite Scroll via IntersectionObserver
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enableInfiniteScroll || !onLoadMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && !moreLoading) {
          console.log('IntersectionObserver: Visible! Loading more...');
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' } // Load 100px before reaching bottom
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [enableInfiniteScroll, onLoadMore, hasMore, loading, moreLoading]);

  // Debounce search
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (onSearch) {
      const timer = setTimeout(() => {
        onSearch(searchTerm);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, onSearch]);

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className={styles.container}>
      {tabs && (
        <div className={styles.tabsList}>
          {tabs.map((tab) => (
            <div
              key={tab.key}
              className={cn(styles.tab, activeTab === tab.key && styles.activeTab)}
              onClick={() => onTabChange && onTabChange(tab.key)}
            >
              {tab.label}
              {tab.count !== undefined && <span className={styles.tabCount}>{tab.count}</span>}
            </div>
          ))}
        </div>
      )}

      <div className={styles.controls}>
        {onSearch && (
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
        )}

        <div className={styles.actions}>
          {filters && <div className={styles.filters}>{filters}</div>}
          {onRefresh && (
            <button
              className={cn(styles.button, styles.secondaryButton)}
              onClick={onRefresh}
              title="Yangilash"
            >
              <div className={loading ? 'animate-spin' : ''}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
              </div>
            </button>
          )}
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
            {loading && !moreLoading ? (
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
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className={styles.tr}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((col) => (
                    <td key={`${item.id}-${String(col.key)}`} className={styles.td}>
                      {col.render ? col.render(item[col.key], item, index) : String(item[col.key] || '—')}
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
            {enableInfiniteScroll && moreLoading && (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-4 text-slate-500">
                  Yuklanmoqda...
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {enableInfiniteScroll && (
          <div ref={observerTarget} style={{ height: '20px', width: '100%' }} />
        )}
      </div>

      {/* Pagination */}
      {!enableInfiniteScroll && (
        <div className={styles.pagination}>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span style={{ paddingRight: '10px' }}>
              Jami: <span className="font-semibold text-slate-900">{totalItems}</span>
            </span>

            {onPageSizeChange && (
              <>
                <span className="mx-2 text-slate-300">|</span>
                <span style={{ paddingLeft: '10px', paddingRight: '15px' }}>Ko'rsatish:</span>
                <select
                  className={styles.pageSizeSelect}
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                >
                  {[10, 25, 50, 70, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
          <div className={styles.paginationActions}>
            <button
              className={cn(styles.pageNumber, 'disabled:opacity-50 hover:bg-transparent')}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              title="Oldingi"
            >
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Simple pagination logic: show active and surrounding.
              // For simplicity, let's just show a sliding window or if pages < 7 show all.
              let p = i + 1;
              if (totalPages > 5) {
                if (currentPage > 3) {
                  p = currentPage - 2 + i;
                }
                if (p > totalPages) {
                  p = totalPages - 4 + i;
                }
              }
              // Boundary checks to be safe, though tricky with simple logic.
              // Let's implement a cleaner "getVisiblePages" array.
              return null;
            })}

            {/* Simplified Logic for robustness */}
            {(() => {
              const pages = [];
              const maxVisible = 5;
              let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
              const end = Math.min(totalPages, start + maxVisible - 1);

              if (end - start + 1 < maxVisible) {
                start = Math.max(1, end - maxVisible + 1);
              }

              for (let i = start; i <= end; i++) {
                pages.push(
                  <button
                    key={i}
                    className={cn(styles.pageNumber, currentPage === i && styles.activePageNumber)}
                    onClick={() => onPageChange(i)}
                    disabled={loading}
                  >
                    {i}
                  </button>
                );
              }
              return pages;
            })()}

            <button
              className={cn(styles.pageNumber, 'disabled:opacity-50 hover:bg-transparent')}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || loading}
              title="Keyingi"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
