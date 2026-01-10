import { useState, useEffect, useCallback } from 'react';
import { directoryApi } from '@/services/api';
import type { District, Region } from '@/types/reference';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';

export const DistrictPage = () => {
    const [data, setData] = useState<District[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // Form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<District | null>(null);
    const [formData, setFormData] = useState({ name: '', region: '' });
    const [error, setError] = useState('');

    const fetchData = useCallback(async (page: number = 1, search: string = '') => {
        setLoading(true);
        try {
            const response = await directoryApi.getDistricts({ page, search });
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

    const handleSearch = (query: string) => {
        setCurrentPage(1);
        fetchData(1, query);
    };

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

    const handleDelete = async (item: District) => {
        if (!window.confirm(`"${item.name}" tumanini o'chirishni tasdiqlaysizmi?`)) return;
        try {
            await directoryApi.deleteDistrict(item.id);
            fetchData(currentPage);
        } catch (err) {
            alert("O'chirishda xatolik yuz berdi");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const payload = {
                name: formData.name,
                region: parseInt(formData.region)
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
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.name?.[0] || 'Xatolik yuz berdi');
        }
    };

    const columns: Column<District>[] = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Nom' },
        {
            key: 'region',
            header: 'Viloyat',
            render: (value) => regions.find(r => r.id === value)?.name || value
        }
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Tumanlar</h1>
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
                title={editingItem ? "Tumanni tahrirlash" : "Yangi tuman qo'shish"}
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Viloyat</label>
                        <select
                            className="border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.region}
                            onChange={e => setFormData({ ...formData, region: e.target.value })}
                            required
                        >
                            <option value="">Tanlang</option>
                            {regions.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>
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
