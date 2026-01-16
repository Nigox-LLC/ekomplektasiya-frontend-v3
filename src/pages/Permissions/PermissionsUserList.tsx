import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, User, Briefcase, Activity, RefreshCw, Map, MapPin, Building2, X, FilterX } from 'lucide-react';
import { permissionApi, directoryApi } from '../../services/api';
import type { UserWithPermissions } from '../../types/permission';
import type { Region, District, Department, Position } from '../../types/reference';
import styles from './PermissionsUserList.module.css';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { usePageTitle } from '../../hooks/usePageTitle';

const PermissionsUserList: React.FC = () => {
    usePageTitle("Foydalanuvchilar va Ruxsatlar");
    const navigate = useNavigate();

    // Data state
    const [data, setData] = useState<UserWithPermissions[]>([]);
    const [loading, setLoading] = useState(true);
    const [moreLoading, setMoreLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);

    // Reference Data
    const [regions, setRegions] = useState<Region[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    // Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [filterPosition, setFilterPosition] = useState('');
    const [filterStatus, setFilterStatus] = useState(''); // 'active' | 'inactive' | ''
    const [filterRegion, setFilterRegion] = useState('');
    const [filterDistrict, setFilterDistrict] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');

    const fetchReferenceData = useCallback(async () => {
        try {
            const [regionsRes, districtsRes, deptsRes, positionsRes] = await Promise.all([
                directoryApi.getRegions({ page_size: 100 }),
                directoryApi.getDistricts({ page_size: 1000 }),
                directoryApi.getDepartments({ page_size: 100 }),
                directoryApi.getPositions({ page_size: 100 }),
            ]);
            setRegions(regionsRes.results);
            setDistricts(districtsRes.results);
            setDepartments(deptsRes.results);
            setPositions(positionsRes.results);
        } catch (err) {
            console.error("Reference data loading error:", err);
        }
    }, []);

    const fetchData = useCallback(async (
        page: number = 1,
        search: string = '',
        limit: number = pageSize,
        isAppend: boolean = false,
        position: string = filterPosition,
        status: string = filterStatus,
        region: string = filterRegion,
        district: string = filterDistrict,
        department: string = filterDepartment
    ) => {
        if (isAppend) {
            setMoreLoading(true);
        } else {
            setLoading(true);
        }

        try {
            const params: any = { page, search, page_size: limit };
            if (position) params.position = position;
            if (status) params.is_active = status === 'active' ? 'true' : 'false';
            if (region) params.region = region;
            if (district) params.district = district;
            if (department) params.department = department;

            const response: any = await permissionApi.getUsers(params);

            let results: UserWithPermissions[] = [];
            let count = 0;
            let next = null;

            if (Array.isArray(response)) {
                results = response;
                count = response.length;
            } else if (response && response.results) {
                results = response.results;
                count = response.count;
                next = response.next;
            }

            if (isAppend) {
                setData(prev => {
                    const newItems = results.filter(newItem => !prev.some(existing => existing.id === newItem.id));
                    return [...prev, ...newItems];
                });
            } else {
                setData(results);
            }

            setTotal(count);
            setHasNextPage(!!next);

        } catch (err) {
            console.error("Failed to load users", err);
        } finally {
            setLoading(false);
            setMoreLoading(false);
        }
    }, [pageSize]);

    useEffect(() => {
        fetchReferenceData();
        fetchData(1);
    }, [fetchReferenceData, fetchData]);

    // Search debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(inputValue);
        }, 500);
        return () => clearTimeout(timer);
    }, [inputValue]);

    // Refetch on filter change
    useEffect(() => {
        setCurrentPage(1);
        fetchData(1, searchTerm, pageSize, false, filterPosition, filterStatus, filterRegion, filterDistrict, filterDepartment);
    }, [fetchData, searchTerm, pageSize, filterPosition, filterStatus, filterRegion, filterDistrict, filterDepartment]);

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !moreLoading && !loading) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchData(nextPage, searchTerm, pageSize, true, filterPosition, filterStatus, filterRegion, filterDistrict, filterDepartment);
        }
    }, [hasNextPage, moreLoading, loading, currentPage, searchTerm, pageSize, fetchData, filterPosition, filterStatus, filterRegion, filterDistrict, filterDepartment]);

    const handleRefresh = () => {
        setCurrentPage(1);
        fetchData(1, searchTerm, pageSize, false, filterPosition, filterStatus, filterRegion, filterDistrict, filterDepartment);
    };

    const handleClearFilters = () => {
        setInputValue('');
        setSearchTerm('');
        setFilterPosition('');
        setFilterStatus('');
        setFilterRegion('');
        setFilterDistrict('');
        setFilterDepartment('');
        setCurrentPage(1);
    };

    const columns: Column<UserWithPermissions>[] = [
        {
            key: 'id',
            header: 'ID',
            render: (val) => val as number
        },
        {
            key: 'full_name',
            header: 'F.I.O',
            render: (val) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className={styles.userIconBox}>
                        <User size={16} />
                    </div>
                    {(val as string) || 'Ismi kiritilmagan'}
                </div>
            )
        },
        {
            key: 'username',
            header: 'Login'
        },
        {
            key: 'region',
            header: 'Viloyat',
            render: (val) => {
                if (val && typeof val === 'object' && 'name' in val) {
                    return (val as any).name;
                }
                return (val as string) || '—';
            }
        },
        {
            key: 'district',
            header: 'Tuman',
            render: (val) => {
                if (val && typeof val === 'object' && 'name' in val) {
                    return (val as any).name;
                }
                return (val as string) || '—';
            }
        },
        {
            key: 'department',
            header: 'Bo\'lim',
            render: (val) => {
                if (val && typeof val === 'object' && 'name' in val) {
                    return (val as any).name;
                }
                return (val as string) || '—';
            }
        },
        {
            key: 'position',
            header: 'Lavozim',
            render: (val) => {
                if (val && typeof val === 'object' && 'name' in val) {
                    return (val as any).name;
                }
                return (val as string) || '—';
            }
        },
        {
            key: 'is_active',
            header: 'Status',
            render: (val) => (
                <span className={`${styles.badge} ${val ? styles.badgeGreen : styles.badgeRed}`}>
                    <span className={`${styles.statusDot} ${val ? styles.dotGreen : styles.dotRed}`} />
                    {val ? 'Faol' : 'Nofaol'}
                </span>
            )
        },
        {
            key: 'id', // Action column
            header: '',
            render: (_, item) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/permissions/users/${item.id}`);
                    }}
                    className={styles.actionButton}
                >
                    <Shield size={16} />
                    Ruxsatlar
                </button>
            )
        }
    ];

    return (
        <div className="flex flex-col gap-4 flex-1 min-h-0 h-full" style={{ position: 'relative' }}>
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                moreLoading={moreLoading}
                totalItems={total}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                onRefresh={undefined} // Hiding default refresh
                enableInfiniteScroll={true}
                onLoadMore={handleLoadMore}
                hasMore={hasNextPage}
                onRowClick={(item) => navigate(`/permissions/users/${item.id}`)}
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
                            {inputValue && (
                                <button
                                    className={styles.clearSearchButton}
                                    onClick={() => setInputValue('')}
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>


                        <div className={styles.filterGroup}>
                            <Map className={styles.filterIcon} size={16} />
                            <select
                                className={styles.filterSelect}
                                value={filterRegion}
                                onChange={(e) => {
                                    setFilterRegion(e.target.value);
                                    setFilterDistrict('');
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
                                onChange={(e) => setFilterDistrict(e.target.value)}
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
                                onChange={(e) => setFilterDepartment(e.target.value)}
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
                                onChange={(e) => setFilterPosition(e.target.value)}
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

                        <div className={styles.filterGroup}>
                            <Activity className={styles.filterIcon} size={16} />
                            <select
                                className={styles.filterSelect}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">Barcha statuslar</option>
                                <option value="active">Faol</option>
                                <option value="inactive">Nofaol</option>
                            </select>
                            <svg className={styles.filterChevron} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                            {(filterPosition || filterStatus || filterRegion || filterDistrict || filterDepartment || inputValue) && (
                                <button
                                    onClick={handleClearFilters}
                                    className={`${styles.refreshButton} ${styles.clearFiltersButton}`}
                                    title="Filtrlarni tozalash"
                                >
                                    <FilterX size={18} />
                                </button>
                            )}
                            <button
                                onClick={handleRefresh}
                                className={styles.refreshButton}
                                title="Yangilash"
                            >
                                <RefreshCw size={18} />
                            </button>
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default PermissionsUserList;
