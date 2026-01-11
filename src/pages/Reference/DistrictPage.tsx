import { useState, useEffect, useCallback } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { directoryApi } from '@/services/api';
import type { District, Region } from '@/types/reference';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal';
import { exportToCSV } from '@/utils/exportToCSV';

export const DistrictPage = () => {
  const [data, setData] = useState<District[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<District | null>(null);
  const [formData, setFormData] = useState({ name: '', region: '' });
  const [error, setError] = useState('');
  const [deletingItem, setDeletingItem] = useState<District | null>(null);

  usePageTitle('Tumanlar');

  const fetchData = useCallback(async (page: number = 1, search: string = '') => {
    setLoading(true);
    try {
      const response = await directoryApi.getDistricts({ page, search, page_size: PAGE_SIZE });
      setData(response.results);
      setTotal(response.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRegions = useCallback(async () => {
    try {
      const response = await directoryApi.getRegions({ page_size: 100 });
      setRegions(response.results);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage);
    fetchRegions();
  }, [fetchData, fetchRegions, currentPage]);

  const handleSearch = useCallback(
    (query: string) => {
      setCurrentPage(1);
      fetchData(1, query);
    },
    [fetchData]
  );

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', region: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: District) => {
    setEditingItem(item);
    setFormData({ name: item.name, region: String(item.region) });
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
      };

      if (editingItem) {
        await directoryApi.updateDistrict(editingItem.id, payload);
      } else {
        await directoryApi.createDistrict(payload);
      }
      fetchData(currentPage);
      setIsModalOpen(false);
      setFormData({ name: '', region: '' });
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
      alert("Ma'lumotlar yuklanmoqda...");
      const response = await directoryApi.getDistricts({ page_size: 10000 });
      exportToCSV(response.results, 'Tumanlar');
    } catch (e) {
      console.error(e);
      alert('Excel yuklashda xatolik');
    }
  };

  const handleRefresh = () => {
    fetchData(currentPage);
  };

  const columns: Column<District>[] = [
    { key: 'id', header: 'ID' },
    {
      key: 'prefix',
      header: 'Prefiks',
      render: (value) => value || '—',
    },
    { key: 'name', header: 'Nom' },
    {
      key: 'region',
      header: 'Viloyat',
      render: (value) => regions.find((r) => r.id === value)?.name || value,
    },
  ];

  return (
    <div className="flex flex-col gap-4 flex-1 h-[calc(125vh-120px)] min-h-0">
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        totalItems={total}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onImport={handleExcelExport}
        onRowClick={handleEdit}
        pageSize={PAGE_SIZE}
        onRefresh={handleRefresh}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Tumanni tahrirlash' : "Yangi tuman qo'shish"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Viloyat</label>
            <select
              className="border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Nom</label>
            <input
              type="text"
              className="border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingItem ? 'Saqlash' : "Qo'shish"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
        title="O'chirishni tasdiqlang"
        message={`"${deletingItem?.name}" tumanini o'chirishni tasdiqlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.`}
        isLoading={loading}
      />
    </div>
  );
};
