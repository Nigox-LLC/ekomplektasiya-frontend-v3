import { useState, useEffect, useCallback } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { directoryApi } from '@/services/api';
import type { Region } from '@/types/reference';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal';

export const RegionPage = () => {
  const [data, setData] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Region | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [error, setError] = useState('');
  const [deletingItem, setDeletingItem] = useState<Region | null>(null);

  usePageTitle('Viloyatlar');

  const fetchData = useCallback(async (page: number = 1, search: string = '') => {
    setLoading(true);
    try {
      const response = await directoryApi.getRegions({ page, search });
      setData(response.results);
      setTotal(response.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  const handleSearch = useCallback(
    (query: string) => {
      setCurrentPage(1);
      fetchData(1, query);
    },
    [fetchData]
  );

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Region) => {
    setEditingItem(item);
    setFormData({ name: item.name });
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
      const payload = { name: formData.name };
      if (editingItem) {
        await directoryApi.updateRegion(editingItem.id, payload);
      } else {
        await directoryApi.createRegion(payload);
      }
      fetchData(currentPage);
      setIsModalOpen(false);
      setFormData({ name: '' });
      setEditingItem(null);
    } catch (err: unknown) {
      console.error(err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      setError(error.response?.data?.name?.[0] || 'Xatolik yuz berdi');
    }
  };

  const handleExcelExport = () => {
    // TODO: Implement actual Excel export
    alert("Ma'lumotlar Excel formatida yuklanmoqda...");
  };

  const columns: Column<Region>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nom' },
  ];

  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { key: 'all', label: 'Barchasi', count: total },
    { key: 'active', label: 'Tasdiqlangan', count: Math.ceil(total * 0.8) },
    { key: 'inactive', label: 'Tasdiqlanmagan', count: Math.ceil(total * 0.15) },
    { key: 'pending', label: "Ko'rilmagan", count: Math.ceil(total * 0.05) },
  ];

  return (
    <div className="flex flex-col gap-4 flex-1 h-full min-h-0">
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
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Viloyatni tahrirlash' : "Yangi viloyat qo'shish"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        message={`"${deletingItem?.name}" viloyatini o'chirishni tasdiqlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.`}
        isLoading={loading}
      />
    </div>
  );
};
