import { useState, useEffect, useCallback } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { directoryApi } from '@/services/api';
import type { District, Region } from '@/types/reference';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal';
import { exportToExcel } from '@/utils/exportToExcel';
import { ModernModal } from '@/components/ui/Modal/ModernModal';
import { MapPin, Info, Map } from 'lucide-react';
import styles from './DistrictPage.module.css';

interface DistrictFormData {
  name: string;
  region: string;
  prefix?: string;
}

export const DistrictPage = () => {
  const [data, setData] = useState<District[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
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
  const [editingItem, setEditingItem] = useState<District | null>(null);
  const [formData, setFormData] = useState<DistrictFormData>({ name: '', region: '', prefix: '' });
  const [error, setError] = useState('');
  const [deletingItem, setDeletingItem] = useState<District | null>(null);

  usePageTitle('Tumanlar');

  const fetchRegions = useCallback(async () => {
    try {
      const response = await directoryApi.getRegions({ page_size: 100 });
      setRegions(response.results);
    } catch (err) {
      console.error(err);
    }
  }, []);

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
        const response = await directoryApi.getDistricts({ page, search, page_size: limit });

        if (isAppend) {
          setData((prev) => {
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
    fetchRegions();
  }, [fetchData, fetchRegions]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !moreLoading && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchData(nextPage, searchTerm, pageSize, true);
    }
  }, [hasNextPage, moreLoading, loading, currentPage, searchTerm, pageSize, fetchData]);

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', region: '', prefix: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: District) => {
    setEditingItem(item);
    setFormData({ name: item.name, region: String(item.region_id), prefix: item.prefix || '' });
    setIsModalOpen(true);
  };

  const handleDelete = (item: District) => {
    setDeletingItem(item);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setLoading(true);
    try {
      await directoryApi.deleteDistrict(deletingItem.id);
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
      const payload = {
        name: formData.name,
        region: parseInt(formData.region),
        // Only include prefix if it's relevant, District interface usually has it
        prefix: formData.prefix,
      };

      if (editingItem) {
        await directoryApi.updateDistrict(editingItem.id, payload);
      } else {
        await directoryApi.createDistrict(payload);
      }
      fetchData(currentPage);
      setIsModalOpen(false);
      setFormData({ name: '', region: '', prefix: '' });
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
      const response = await directoryApi.getDistricts({ page_size: 10000 });

      const exportColumns = [
        { key: 'id' as keyof District, header: 'ID' },
        { key: 'name' as keyof District, header: 'Nom' },
        { key: 'region_name' as keyof District, header: 'Viloyat' },
      ];

      exportToExcel(response.results, 'Tumanlar', exportColumns);
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

  const columns: Column<District>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nom' },
    {
      key: 'region_name',
      header: 'Viloyat',
      render: (value) => value || '—',
    },
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
        title={editingItem ? 'Tumanni tahrirlash' : "Yangi tuman qo'shish"}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Viloyat</label>
            <div className={styles.inputWrapper}>
              <select
                className={styles.input}
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                required
              >
                <option value="">Tanlang</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <span className={styles.icon}>
                <Map size={18} />
              </span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Nom</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.input}
                placeholder="Tuman nomini kiriting..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <span className={styles.icon}>
                <MapPin size={18} />
              </span>
            </div>
          </div>

          <div className={styles.infoBox}>
            <Info size={20} className={styles.infoIcon} />
            <span>Yangi tuman ma'lumotlarini to'g'ri va aniq kiriting.</span>
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
        title="O'chirishni tasdiqlang"
        message={`"${deletingItem?.name}" tumanini o'chirishni tasdiqlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.`}
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
