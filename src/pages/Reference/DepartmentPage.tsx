import { useState, useEffect, useCallback } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { directoryApi } from '@/services/api';
import type { Department, District, Region } from '@/types/reference';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal';
import { exportToExcel } from '@/utils/exportToExcel';
import { ModernModal } from '@/components/ui/Modal/ModernModal';
import { MapPin, Info, Map, Building2, Globe, Hash } from 'lucide-react';
import styles from './DepartmentPage.module.css';

interface DepartmentFormData {
    name: string;
    index_number?: string;
    region?: string;
    district?: string;
    posted_site_link?: string;
}

export const DepartmentPage = () => {
    const [data, setData] = useState<Department[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [loading, setLoading] = useState(true);
    const [moreLoading, setMoreLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [hasNextPage, setHasNextPage] = useState(true);

    // Filter state
    const [filterRegion, setFilterRegion] = useState('');
    const [filterDistrict, setFilterDistrict] = useState('');

    // Form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Department | null>(null);
    const [formData, setFormData] = useState<DepartmentFormData>({ name: '', index_number: '', region: '', district: '', posted_site_link: '' });
    const [error, setError] = useState('');
    const [deletingItem, setDeletingItem] = useState<Department | null>(null);

    usePageTitle("Bo'limlar");

    const fetchReferenceData = useCallback(async () => {
        try {
            const [regionsRes, districtsRes] = await Promise.all([
                directoryApi.getRegions({ page_size: 100 }),
                directoryApi.getDistricts({ page_size: 100 })
            ]);
            setRegions(regionsRes.results);
            setDistricts(districtsRes.results);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchData = useCallback(
        async (
            page: number = 1,
            search: string = '',
            limit: number = pageSize,
            isAppend: boolean = false,
            regionId: string = filterRegion,
            districtId: string = filterDistrict
        ) => {
            if (isAppend) {
                setMoreLoading(true);
            } else {
                setLoading(true);
            }

            try {
                const params: any = { page, search, page_size: limit };
                if (regionId) params.region = regionId;
                if (districtId) params.district = districtId;

                const response = await directoryApi.getDepartments(params);

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
        // Initial fetch
        fetchData(1);
        fetchReferenceData();
    }, [fetchData, fetchReferenceData]);

    useEffect(() => {
        // Fetch when filters or search change
        fetchData(1, searchTerm, pageSize, false, filterRegion, filterDistrict);
    }, [fetchData, filterRegion, filterDistrict, searchTerm, pageSize]);

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !moreLoading && !loading) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchData(nextPage, searchTerm, pageSize, true, filterRegion, filterDistrict);
        }
    }, [hasNextPage, moreLoading, loading, currentPage, searchTerm, pageSize, fetchData]);

    const handleCreate = () => {
        setEditingItem(null);
        setFormData({ name: '', index_number: '', region: '', district: '', posted_site_link: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (item: Department) => {
        setEditingItem(item);
        const getRefId = (ref: any): string => {
            if (!ref) return '';
            if (typeof ref === 'object' && 'id' in ref) return String(ref.id);
            return String(ref);
        };

        setFormData({
            name: item.name,
            index_number: item.index_number || '',
            region: getRefId(item.region),
            district: getRefId(item.district),
            posted_site_link: item.posted_site_link || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = (item: Department) => {
        setDeletingItem(item);
    };

    const handleConfirmDelete = async () => {
        if (!deletingItem) return;
        setLoading(true);
        try {
            await directoryApi.deleteDepartment(deletingItem.id);
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
            const payload: any = {
                name: formData.name,
            };
            if (formData.index_number) payload.index_number = formData.index_number;
            if (formData.region) payload.region = parseInt(formData.region);
            if (formData.district) payload.district = parseInt(formData.district);
            if (formData.posted_site_link) payload.posted_site_link = formData.posted_site_link;

            if (editingItem) {
                await directoryApi.updateDepartment(editingItem.id, payload);
            } else {
                await directoryApi.createDepartment(payload);
            }
            fetchData(currentPage);
            setIsModalOpen(false);
            setFormData({ name: '', index_number: '', region: '', district: '', posted_site_link: '' });
            setEditingItem(null);
        } catch (err: unknown) {
            console.error(err);
            const error = err as any;
            setError(error.response?.data?.name?.[0] || 'Xatolik yuz berdi');
        }
    };

    const handleExcelExport = async () => {
        try {
            setExporting(true);
            const response = await directoryApi.getDepartments({ page_size: 10000 });

            const exportColumns = [
                { key: 'id' as keyof Department, header: 'ID' },
                { key: 'index_number' as keyof Department, header: 'Indeks' },
                { key: 'name' as keyof Department, header: 'Nom' },
                // Use custom render for export manually if needed, or rely on toString.
                // Since exportToExcel is generic, we might need a better approach or just export IDs if objects don't serialize well.
                // Assuming we want names for users:
                { key: 'region' as keyof Department, header: 'Viloyat' },
                { key: 'district' as keyof Department, header: 'Tuman' },
                { key: 'posted_site_link' as keyof Department, header: 'Sayt' },
            ];

            exportToExcel(response.results as any[], "Bo'limlar", exportColumns);
        } catch (e) {
            console.error(e);
            alert("Excel yuklashda xatolik");
        } finally {
            setExporting(false);
        }
    };

    const handleRefresh = () => {
        fetchData(currentPage);
    };

    const columns: Column<Department>[] = [
        {
            key: 'id',
            header: 'T/r',
            render: (_: unknown, __: unknown, index: number) => (currentPage - 1) * pageSize + index + 1
        },
        { key: 'index_number', header: 'Indeks', render: (val) => (val as string) || '—' },
        { key: 'name', header: 'Nom' },
        { key: 'region', header: 'Viloyat', render: (val) => (val as Region)?.name || '—' },
        { key: 'district', header: 'Tuman', render: (val) => (val as District)?.name || '—' },

    ];

    const handleSearch = useCallback(
        (query: string) => {
            setSearchTerm(query);
            setCurrentPage(1);
            fetchData(1, query, pageSize, false, filterRegion, filterDistrict);
        },
        [fetchData, pageSize]
    );

    const handlePageSizeChange = useCallback(
        (size: number) => {
            setPageSize(size);
            setCurrentPage(1);
            fetchData(1, searchTerm, size, false, filterRegion, filterDistrict);
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
                filters={
                    <div className={styles.filterContainer}>
                        <div className={styles.filterGroup}>
                            <Map className={styles.filterIcon} size={16} />
                            <select
                                className={styles.filterSelect}
                                value={filterRegion}
                                onChange={(e) => {
                                    setFilterRegion(e.target.value);
                                    setFilterDistrict('');
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="">Barcha viloyatlar</option>
                                {regions.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                            <svg className={styles.filterChevron} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <div className={styles.filterGroup}>
                            <MapPin className={styles.filterIcon} size={16} />
                            <select
                                className={styles.filterSelect}
                                value={filterDistrict}
                                onChange={(e) => {
                                    setFilterDistrict(e.target.value);
                                    setCurrentPage(1);
                                }}
                                disabled={!filterRegion}
                            >
                                <option value="">Barcha tumanlar</option>
                                {districts
                                    .filter((d) => !filterRegion || d.region_id === parseInt(filterRegion))
                                    .map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
                                        </option>
                                    ))}
                            </select>
                            <svg className={styles.filterChevron} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                }
            />

            <ModernModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? "Bo'limni tahrirlash" : "Yangi bo'lim qo'shish"}
            >
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Indeks</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Indeks raqami"
                                value={formData.index_number}
                                onChange={(e) => setFormData({ ...formData, index_number: e.target.value })}
                            />
                            <span className={styles.icon}>
                                <Hash size={18} />
                            </span>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Nom</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Bo'lim nomini kiriting..."
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <span className={styles.icon}>
                                <Building2 size={18} />
                            </span>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Viloyat</label>
                        <div className={styles.inputWrapper}>
                            <select
                                className={styles.input}
                                value={formData.region}
                                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
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
                        <label className={styles.label}>Tuman</label>
                        <div className={styles.inputWrapper}>
                            <select
                                className={styles.input}
                                value={formData.district}
                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            >
                                <option value="">Tanlang</option>
                                {districts
                                    .filter(d => {
                                        if (!formData.region) return true;
                                        const regionId = parseInt(formData.region);
                                        // Check region_id or region (if it exists as ID or object)
                                        return d.region_id === regionId || (d as any).region === regionId || (d as any).region?.id === regionId;
                                    })
                                    .map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
                                        </option>
                                    ))}
                            </select>
                            <span className={styles.icon}>
                                <MapPin size={18} />
                            </span>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>E'lon joylash uchun API endpoint</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="url"
                                className={styles.input}
                                placeholder="https://example.com"
                                value={formData.posted_site_link}
                                onChange={(e) => setFormData({ ...formData, posted_site_link: e.target.value })}
                            />
                            <span className={styles.icon}>
                                <Globe size={18} />
                            </span>
                        </div>
                    </div>


                    <div className={styles.infoBox}>
                        <Info size={20} className={styles.infoIcon} />
                        <span>Yangi bo'lim ma'lumotlarini to'g'ri va aniq kiriting.</span>
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
            </ModernModal >

            <ConfirmModal
                isOpen={!!deletingItem}
                onClose={() => setDeletingItem(null)}
                onConfirm={handleConfirmDelete}
                title="O'chirishni tasdiqlang"
                message={`"${deletingItem?.name}" bo'limini o'chirishni tasdiqlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.`}
                isLoading={loading}
            />

            <ModernModal isOpen={exporting} onClose={() => { }} title="Export">
                <div className="flex flex-col items-center justify-center p-6 gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-slate-600 font-medium">Ma'lumotlar yuklanmoqda... Iltimos kuting.</p>
                </div>
            </ModernModal>
        </div >
    );
};
