import { useState, useEffect, useCallback } from 'react';
import { directoryApi } from '@/services/api';
import type { Region } from '@/types/reference';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';

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

    const handleSearch = (query: string) => {
        setCurrentPage(1);
        fetchData(1, query);
    };

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

    const handleDelete = async (item: Region) => {
        if (!window.confirm(`"${item.name}" viloyatini o'chirishni tasdiqlaysizmi?`)) return;
        try {
            await directoryApi.deleteRegion(item.id);
            fetchData(currentPage);
        } catch (err) {
            alert("O'chirishda xatolik yuz berdi");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (editingItem) {
                await directoryApi.updateRegion(editingItem.id, formData);
            } else {
                await directoryApi.createRegion(formData);
            }
            fetchData(currentPage);
            setIsModalOpen(false);
            setFormData({ name: '' });
            setEditingItem(null);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.name?.[0] || 'Xatolik yuz berdi');
        }
    };

    const columns: Column<Region>[] = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Nom' }
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Viloyatlar</h1>
            </div>

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
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? "Viloyatni tahrirlash" : "Yangi viloyat qo'shish"}
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Nom</label>
                        <input
                            type="text"
                            className="border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
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
        </div>
    );
};
