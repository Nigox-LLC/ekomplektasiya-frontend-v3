import { useState, useEffect, useCallback } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { directoryApi } from '@/services/api';
import type { Region } from '@/types/reference';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal';
import { exportToExcel } from '@/utils/exportToExcel';
import { MapPin, Hash, Info } from 'lucide-react';
import { ModernModal } from '@/components/ui/Modal/ModernModal';
import styles from './RegionPage.module.css';

interface RegionFormData {
  name: string;
  prefix?: string;
}

export const RegionPage = () => {
  const [data, setData] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasNextPage, setHasNextPage] = useState(true);

  // Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Region | null>(null);
  const [formData, setFormData] = useState<RegionFormData>({ name: '', prefix: '' });
  const [error, setError] = useState('');
  const [deletingItem, setDeletingItem] = useState<Region | null>(null);

  usePageTitle('Viloyatlar');

  const fetchData = useCallback(
    async (
      page: number = 1,
      search: string = '',
      limit: number = pageSize,
      isAppend: boolean = false
    ) => {
      if (isAppend) {
        setMoreLoading(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await directoryApi.getRegions({ page, search, page_size: limit });

        if (isAppend) {
          setData((prev) => {
            // Filter duplicates
            const newItems = response.results.filter(
              (newItem) => !prev.some((existingItem) => existingItem.id === newItem.id)
            );
            return [...prev, ...newItems];
          });
        } else {
          setData(response.results);
        }

        setTotal(response.count);
        setHasNextPage(!!response.next);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setMoreLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !moreLoading && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchData(nextPage, searchTerm, pageSize, true);
    }
  }, [hasNextPage, moreLoading, loading, currentPage, searchTerm, pageSize, fetchData]);

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', prefix: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Region) => {
    setEditingItem(item);
    setFormData({ name: item.name, prefix: item.prefix || '' });
    setIsModalOpen(true);
  };

  const handleDelete = (item: Region) => {
    setDeletingItem(item);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setLoading(true);
    try {
      await directoryApi.deleteRegion(deletingItem.id);
      await fetchData(currentPage);
      setDeletingItem(null);
    } catch {
      alert("O'chirishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { name: formData.name, prefix: formData.prefix || '' };
      if (editingItem) {
        await directoryApi.updateRegion(editingItem.id, payload);
      } else {
        await directoryApi.createRegion(payload);
      }
      fetchData(currentPage);
      setIsModalOpen(false);
      setFormData({ name: '', prefix: '' });
      setEditingItem(null);
    } catch (err: unknown) {
      console.error(err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      setError(error.response?.data?.name?.[0] || 'Xatolik yuz berdi');
    }
  };

  const handleExcelExport = async () => {
    try {
      setExporting(true);
      const response = await directoryApi.getRegions({ page_size: 10000 });

      // Define columns for export
      const exportColumns = [
        { key: 'id' as keyof Region, header: 'ID' },
        { key: 'prefix' as keyof Region, header: 'Prefiks' },
        { key: 'name' as keyof Region, header: 'Nom' },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      exportToExcel(response.results as any, 'Viloyatlar', exportColumns);
    } catch (e) {
      console.error(e);
      alert('Excel yuklashda xatolik');
    } finally {
      setExporting(false);
    }
  };

  const handleRefresh = () => {
    fetchData(currentPage);
  };

  const columns: Column<Region>[] = [
    { key: 'id', header: 'ID' },
    {
      key: 'prefix',
      header: 'Prefiks',
      render: (value) => value || '—',
    },
    { key: 'name', header: 'Nom' },
  ];

  const handleSearch = useCallback(
    (query: string) => {
      setSearchTerm(query);
      setCurrentPage(1);
      fetchData(1, query, pageSize, false);
    },
    [fetchData, pageSize]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
      fetchData(1, searchTerm, size, false);
    },
    [fetchData, searchTerm]
  );

  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0" style={{ position: 'relative' }}>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        moreLoading={moreLoading}
        totalItems={total}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onImport={handleExcelExport}
        onRowClick={handleEdit}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        onRefresh={handleRefresh}
        enableInfiniteScroll={true}
        onLoadMore={handleLoadMore}
        hasMore={hasNextPage}
      />

      <ModernModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Viloyatni tahrirlash' : "Yangi viloyat qo'shish"}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Nom</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.input}
                placeholder="Viloyat nomini kiriting..."
                value={formData.name}
                onChange={(e) => {
                  const newName = e.target.value;
                  const updates: RegionFormData = { name: newName, prefix: formData.prefix };
                  const currentPrefix = formData.prefix || '';
                  const generatedPrefix = newName.slice(0, 3).toUpperCase();
                  const isAutoGenerated =
                    !currentPrefix ||
                    generatedPrefix.startsWith(currentPrefix) ||
                    currentPrefix.startsWith(generatedPrefix);
                  if (isAutoGenerated) {
                    updates.prefix = generatedPrefix;
                  }
                  setFormData({ ...formData, ...updates });
                }}
                required
              />
              <span className={styles.icon}>
                <MapPin size={18} />
              </span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Prefiks</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.input}
                placeholder="001"
                value={formData.prefix || ''}
                onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
              />
              <span className={styles.icon}>
                <Hash size={18} />
              </span>
            </div>
          </div>

          <div className={styles.infoBox}>
            <Info size={20} className={styles.infoIcon} />
            <span>Yangi viloyat ma'lumotlarini to'g'ri va aniq kiriting.</span>
          </div>

          {error && <p className={styles.errorBox}>{error}</p>}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className={`${styles.button} ${styles.cancelButton}`}
            >
              Bekor qilish
            </button>
            <button type="submit" className={`${styles.button} ${styles.submitButton}`}>
              {editingItem ? 'Saqlash' : "Qo'shish"}
            </button>
          </div>
        </form>
      </ModernModal>

      <ConfirmModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
        title="O'chirishni tasdiqlang!"
        message={`"${deletingItem?.name}" viloyatini o'chirishni tasdiqlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.`}
        isLoading={loading}
      />

      <ModernModal isOpen={exporting} onClose={() => {}} title="Export">
        <div className="flex flex-col items-center justify-center p-6 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 font-medium">Ma'lumotlar yuklanmoqda... Iltimos kuting.</p>
        </div>
      </ModernModal>
    </div>
  );
};
