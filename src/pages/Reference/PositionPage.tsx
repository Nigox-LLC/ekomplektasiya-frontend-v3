import { useState, useEffect, useCallback } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { directoryApi } from '@/services/api';
import type { Position } from '@/types/reference';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal';
import { exportToExcel } from '@/utils/exportToExcel';
import { Briefcase, Info } from 'lucide-react';
import { ModernModal } from '@/components/ui/Modal/ModernModal';
import styles from './PositionPage.module.css';

interface PositionFormData {
    name: string;
}

export const PositionPage = () => {
    const [data, setData] = useState<Position[]>([]);
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
    const [editingItem, setEditingItem] = useState<Position | null>(null);
    const [formData, setFormData] = useState<PositionFormData>({ name: '' });
    const [error, setError] = useState('');
    const [deletingItem, setDeletingItem] = useState<Position | null>(null);

    usePageTitle('Lavozimlar');

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
                const response = await directoryApi.getPositions({ page, search, page_size: limit });

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
        setFormData({ name: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (item: Position) => {
        setEditingItem(item);
        setFormData({ name: item.name });
        setIsModalOpen(true);
    };

    const handleDelete = (item: Position) => {
        setDeletingItem(item);
    };

    const handleConfirmDelete = async () => {
        if (!deletingItem) return;
        setLoading(true);
        try {
            await directoryApi.deletePosition(deletingItem.id);
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
                await directoryApi.updatePosition(editingItem.id, payload);
            } else {
                await directoryApi.createPosition(payload);
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

    const handleExcelExport = async () => {
        try {
            setExporting(true);
            const response = await directoryApi.getPositions({ page_size: 10000 });

            // Define columns for export
            const exportColumns = [
                { key: 'id' as keyof Position, header: 'ID' },
                { key: 'name' as keyof Position, header: 'Nom' },
            ];

            exportToExcel(response.results, 'Lavozimlar', exportColumns);
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

    const columns: Column<Position>[] = [
        { key: 'id', header: 'ID' },
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
                title={editingItem ? 'Lavozimni tahrirlash' : "Yangi lavozim qo'shish"}
            >
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Nom</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Lavozim nomini kiriting..."
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <span className={styles.icon}>
                                <Briefcase size={18} />
                            </span>
                        </div>
                    </div>

                    <div className={styles.infoBox}>
                        <Info size={20} className={styles.infoIcon} />
                        <span>Yangi lavozim ma'lumotlarini to'g'ri va aniq kiriting.</span>
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
                message={`"${deletingItem?.name}" lavozimini o'chirishni tasdiqlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.`}
                isLoading={loading}
            />

            <ModernModal isOpen={exporting} onClose={() => { }} title="Export">
                <div className="flex flex-col items-center justify-center p-6 gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-slate-600 font-medium">Ma'lumotlar yuklanmoqda... Iltimos kuting.</p>
                </div>
            </ModernModal>
        </div>
    );
};
