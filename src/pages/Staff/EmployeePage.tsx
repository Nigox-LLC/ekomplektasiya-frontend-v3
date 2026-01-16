import { useState, useEffect, useCallback } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { employeeApi, directoryApi } from '@/services/api';
import type { EmployeeListItem, EmployeeCreateUpdate, EmployeeDetail } from '@/types/employee';
import type { Region, District, Department, Position } from '@/types/reference';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal';
import { exportToExcel } from '@/utils/exportToExcel';
import { ModernModal } from '@/components/ui/Modal/ModernModal';
import {
    MapPin,
    Building2,
    Briefcase,
    Phone,
    User,
    FileText,
    Calendar,
    Map,
    Search
} from 'lucide-react';
import styles from './EmployeePage.module.css';

interface EmployeeFormData extends EmployeeCreateUpdate { }

export const EmployeePage = () => {
    const [data, setData] = useState<EmployeeListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [moreLoading, setMoreLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [hasNextPage, setHasNextPage] = useState(true);

    // Reference data
    const [regions, setRegions] = useState<Region[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);

    // Filters
    const [filterRegion, setFilterRegion] = useState('');
    const [filterDistrict, setFilterDistrict] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const [filterPosition, setFilterPosition] = useState('');

    // Form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState<EmployeeFormData>({
        full_name: '',
        region: 0,
        district: 0,
        department: 0,
        position: 0,
        phone: '',
        inn: '',
        address: '',
        birth_date: '',
        passport_series: '',
        passport_number: '',
        jshshr: '',
        is_active: true
    });
    const [error, setError] = useState('');
    const [deletingItem, setDeletingItem] = useState<EmployeeListItem | null>(null);

    usePageTitle("Xodimlar");

    const fetchReferenceData = useCallback(async () => {
        try {
            const [regionsRes, districtsRes, deptsRes, posRes] = await Promise.all([
                directoryApi.getRegions({ page_size: 100 }),
                directoryApi.getDistricts({ page_size: 1000 }), // Load more to filter client-side if needed
                directoryApi.getDepartments({ page_size: 100 }),
                directoryApi.getPositions({ page_size: 100 })
            ]);
            setRegions(regionsRes.results);
            setDistricts(districtsRes.results);
            setDepartments(deptsRes.results);
            setPositions(posRes.results);
        } catch (err) {
            console.error("Reference data loading error:", err);
        }
    }, []);

    const fetchData = useCallback(
        async (
            page: number = 1,
            search: string = '',
            limit: number = pageSize,
            isAppend: boolean = false,
            regionId: string = filterRegion,
            districtId: string = filterDistrict,
            deptId: string = filterDepartment,
            posId: string = filterPosition
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
                if (deptId) params.department = deptId;
                if (posId) params.position = posId;

                const response = await employeeApi.getEmployees(params);

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
        fetchReferenceData();
        fetchData(1);
    }, [fetchReferenceData, fetchData]);

    useEffect(() => {
        fetchData(1, searchTerm, pageSize, false, filterRegion, filterDistrict, filterDepartment, filterPosition);
    }, [fetchData, searchTerm, pageSize, filterRegion, filterDistrict, filterDepartment, filterPosition]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(inputValue);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [inputValue]);

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !moreLoading && !loading) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchData(nextPage, searchTerm, pageSize, true, filterRegion, filterDistrict, filterDepartment, filterPosition);
        }
    }, [hasNextPage, moreLoading, loading, currentPage, searchTerm, pageSize, fetchData, filterRegion, filterDistrict, filterDepartment, filterPosition]);

    const handleCreate = () => {
        setEditingId(null);
        setFormData({
            full_name: '',
            region: 0,
            district: 0,
            department: 0,
            position: 0,
            phone: '',
            inn: '',
            address: '',
            birth_date: '',
            passport_series: '',
            passport_number: '',
            jshshr: '',
            is_active: true
        });
        setIsModalOpen(true);
    };

    const handleEdit = async (item: EmployeeListItem) => {
        setEditingId(item.id);
        setFormLoading(true);
        setIsModalOpen(true);
        try {
            const detail: EmployeeDetail = await employeeApi.getEmployee(item.id);
            setFormData({
                full_name: detail.full_name,
                region: detail.region?.id || 0,
                district: detail.district?.id || 0,
                department: detail.department?.id || 0,
                position: detail.position?.id || 0,
                phone: detail.phone || '',
                inn: detail.inn || '',
                address: detail.address || '',
                birth_date: detail.birth_date || '',
                passport_series: detail.passport_series || '',
                passport_number: detail.passport_number || '',
                jshshr: detail.jshshr || '',
                is_active: detail.is_active
            });
        } catch (err) {
            console.error("Error fetching employee details:", err);
            setError("Xodim ma'lumotlarini yuklashda xatolik");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = (item: EmployeeListItem) => {
        setDeletingItem(item);
    };

    const handleConfirmDelete = async () => {
        if (!deletingItem) return;
        setLoading(true);
        try {
            await employeeApi.deleteEmployee(deletingItem.id);
            await fetchData(currentPage, searchTerm, pageSize, false, filterRegion, filterDistrict, filterDepartment, filterPosition);
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

        // Basic validation
        if (!formData.region || !formData.district || !formData.department || !formData.position) {
            setError("Barcha majburiy maydonlarni to'ldiring (Viloyat, Tuman, Bo'lim, Lavozim)");
            return;
        }

        try {
            if (editingId) {
                await employeeApi.updateEmployee(editingId, formData);
            } else {
                await employeeApi.createEmployee(formData);
            }
            fetchData(currentPage, searchTerm, pageSize, false, filterRegion, filterDistrict, filterDepartment, filterPosition);
            setIsModalOpen(false);
            setEditingId(null);
        } catch (err: unknown) {
            console.error(err);
            const error = err as any;
            setError(error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || 'Xatolik yuz berdi');
        }
    };

    const handleExcelExport = async () => {
        try {
            setExporting(true);
            const response = await employeeApi.getEmployees({ page_size: 10000 });

            const exportColumns = [
                { key: 'id' as keyof EmployeeListItem, header: 'ID' },
                { key: 'full_name' as keyof EmployeeListItem, header: 'F.I.SH' },
                { key: 'phone' as keyof EmployeeListItem, header: 'Telefon' },
                { key: 'region' as keyof EmployeeListItem, header: 'Viloyat' },
                { key: 'district' as keyof EmployeeListItem, header: 'Tuman' },
                { key: 'department' as keyof EmployeeListItem, header: "Bo'lim" },
                { key: 'position' as keyof EmployeeListItem, header: 'Lavozim' },
            ];

            exportToExcel(response.results as any[], 'Xodimlar', exportColumns);
        } catch (e) {
            console.error(e);
            alert("Excel yuklashda xatolik");
        } finally {
            setExporting(false);
        }
    };

    const handleRefresh = () => {
        fetchData(currentPage, searchTerm, pageSize, false, filterRegion, filterDistrict, filterDepartment, filterPosition);
    };

    const columns: Column<EmployeeListItem>[] = [
        {
            key: 'id',
            header: 'T/r',
            render: (_: unknown, __: unknown, index: number) => (currentPage - 1) * pageSize + index + 1
        },
        { key: 'full_name', header: 'F.I.SH' },
        { key: 'phone', header: 'Telefon', render: (val) => val || '—' },
        { key: 'department', header: "Bo'lim", render: (val) => val || '—' },
        { key: 'position', header: 'Lavozim', render: (val) => val || '—' },
        { key: 'region', header: 'Viloyat', render: (val) => val || '—' },
    ];

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
                // onSearch removed to use custom search input
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onImport={handleExcelExport}
                onRowClick={handleEdit}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                onRefresh={handleRefresh}
                enableInfiniteScroll={true}
                onLoadMore={handleLoadMore}
                hasMore={hasNextPage}
                filters={
                    <div className={styles.filterContainer}>
                        <div className={styles.searchFilterGroup}>
                            <Search className={styles.filterIcon} size={16} />
                            <input
                                type="text"
                                className={styles.filterInput}
                                placeholder="Qidirish..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </div>
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
                                    <option key={r.id} value={r.id}>{r.name}</option>
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
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                            </select>
                            <svg className={styles.filterChevron} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <div className={styles.filterGroup}>
                            <Building2 className={styles.filterIcon} size={16} />
                            <select
                                className={styles.filterSelect}
                                value={filterDepartment}
                                onChange={(e) => {
                                    setFilterDepartment(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="">Barcha bo'limlar</option>
                                {departments.map((d) => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                            <svg className={styles.filterChevron} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <div className={styles.filterGroup}>
                            <Briefcase className={styles.filterIcon} size={16} />
                            <select
                                className={styles.filterSelect}
                                value={filterPosition}
                                onChange={(e) => {
                                    setFilterPosition(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="">Barcha lavozimlar</option>
                                {positions.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
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
                title={editingId ? "Xodimni tahrirlash" : "Yangi xodim qo'shish"}
                maxWidth="900px"
            >
                {formLoading ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>F.I.SH</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="Familiya Ism Sharif"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        required
                                    />
                                    <span className={styles.icon}><User size={18} /></span>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Telefon</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="+998..."
                                        value={formData.phone || ''}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                    <span className={styles.icon}><Phone size={18} /></span>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Tug'ilgan sana</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="date"
                                        className={styles.input}
                                        value={formData.birth_date || ''}
                                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                    />
                                    <span className={styles.icon}><Calendar size={18} /></span>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Viloyat</label>
                                <div className={styles.inputWrapper}>
                                    <select
                                        className={styles.input}
                                        value={formData.region}
                                        onChange={(e) => setFormData({ ...formData, region: parseInt(e.target.value) })}
                                        required
                                    >
                                        <option value={0}>Tanlang</option>
                                        {regions.map((r) => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}
                                    </select>
                                    <span className={styles.icon}><Map size={18} /></span>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Tuman</label>
                                <div className={styles.inputWrapper}>
                                    <select
                                        className={styles.input}
                                        value={formData.district}
                                        onChange={(e) => setFormData({ ...formData, district: parseInt(e.target.value) })}
                                        required
                                    >
                                        <option value={0}>Tanlang</option>
                                        {districts
                                            .filter(d => !formData.region || d.region_id === formData.region)
                                            .map((d) => (
                                                <option key={d.id} value={d.id}>{d.name}</option>
                                            ))}
                                    </select>
                                    <span className={styles.icon}><MapPin size={18} /></span>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Bo'lim</label>
                                <div className={styles.inputWrapper}>
                                    <select
                                        className={styles.input}
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: parseInt(e.target.value) })}
                                        required
                                    >
                                        <option value={0}>Tanlang</option>
                                        {departments.map((d) => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                    <span className={styles.icon}><Building2 size={18} /></span>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Lavozim</label>
                                <div className={styles.inputWrapper}>
                                    <select
                                        className={styles.input}
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
                                        required
                                    >
                                        <option value={0}>Tanlang</option>
                                        {positions.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    <span className={styles.icon}><Briefcase size={18} /></span>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Passport Seriya</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="AA"
                                        value={formData.passport_series || ''}
                                        onChange={(e) => setFormData({ ...formData, passport_series: e.target.value })}
                                    />
                                    <span className={styles.icon}><FileText size={18} /></span>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Passport Raqam</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="1234567"
                                        value={formData.passport_number || ''}
                                        onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
                                    />
                                    <span className={styles.icon}><FileText size={18} /></span>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>JSHSHR</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="JSHSHR"
                                        value={formData.jshshr || ''}
                                        onChange={(e) => setFormData({ ...formData, jshshr: e.target.value })}
                                    />
                                    <span className={styles.icon}><FileText size={18} /></span>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>INN</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="INN"
                                        value={formData.inn || ''}
                                        onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
                                    />
                                    <span className={styles.icon}><FileText size={18} /></span>
                                </div>
                            </div>

                            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>Manzil</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="To'liq manzil"
                                        value={formData.address || ''}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                    <span className={styles.icon}><MapPin size={18} /></span>
                                </div>
                            </div>
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
                                {editingId ? 'Saqlash' : "Qo'shish"}
                            </button>
                        </div>
                    </form>
                )}
            </ModernModal>

            <ConfirmModal
                isOpen={!!deletingItem}
                onClose={() => setDeletingItem(null)}
                onConfirm={handleConfirmDelete}
                title="O'chirishni tasdiqlang"
                message={`"${deletingItem?.full_name}" xodimini o'chirishni tasdiqlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.`}
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
