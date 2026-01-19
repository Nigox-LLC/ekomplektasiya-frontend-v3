import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Shield,
  FileText,
  FolderGit2,
  X,
  Save,
  AlertCircle,
  MapPin,
  Map,
  Building2,
  Briefcase,
} from 'lucide-react';

import { permissionApi } from '../../services/api';
import type { Permission, UserWithPermissions } from '../../types/permission';
import styles from './UserPermissions.module.css';

interface GroupedPermission {
  model: string;
  permissions: {
    view?: Permission;
    add?: Permission;
    change?: Permission;
    delete?: Permission;
  };
}

const UserPermissionsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserWithPermissions | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        setLoading(true);
        setError(null);
        const [permissionsData, userData] = await Promise.all([
          permissionApi.getPermissions(),
          permissionApi.getUserWithPermissions(Number(id)),
        ]);

        setAllPermissions(permissionsData);
        if (userData) {
          setUser(userData);
          setSelectedPermissions(new Set(userData.user_permissions));
        } else {
          setError('Foydalanuvchi topilmadi');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Failed to load data', err);
        setError(
          err.response?.data?.message ||
            "Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos qayta urinib ko'ring."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const groupedPermissions = React.useMemo(() => {
    const groups: Record<string, GroupedPermission['permissions']> = {};

    allPermissions.forEach((perm) => {
      if (!groups[perm.model]) {
        groups[perm.model] = {};
      }
      const codename = perm.codename;
      if (codename.startsWith('view_')) groups[perm.model].view = perm;
      else if (codename.startsWith('add_')) groups[perm.model].add = perm;
      else if (codename.startsWith('change_')) groups[perm.model].change = perm;
      else if (codename.startsWith('delete_')) groups[perm.model].delete = perm;
    });

    return Object.entries(groups).map(([model, perms]) => ({
      model,
      permissions: perms,
    }));
  }, [allPermissions]);

  const handleCheckboxChange = (permId: number) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permId)) {
      newSelected.delete(permId);
    } else {
      newSelected.add(permId);
    }
    setSelectedPermissions(newSelected);
  };

  const handleSelectColumn = (action: 'view' | 'add' | 'change' | 'delete', isSelect: boolean) => {
    const newSelected = new Set(selectedPermissions);
    groupedPermissions.forEach((group) => {
      const perm = group.permissions[action];
      if (perm) {
        if (isSelect) newSelected.add(perm.id);
        else newSelected.delete(perm.id);
      }
    });
    setSelectedPermissions(newSelected);
  };

  const handleSave = async (close: boolean) => {
    if (!user || !id) return;
    setSaving(true);
    try {
      await permissionApi.updateUserPermissions(user.id, Array.from(selectedPermissions));
      if (close) {
        navigate(-1); // Go back
      } else {
        // Show success feedback (optional, simple alert for now or just reload if needed)
        // For a better UX, we could add a toast system, but for now let's rely on the button state clearing
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Failed to save permissions', err);
      // Display error to user
      alert(err.response?.data?.message || 'Saqlashda xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  // Helper to format model name
  const formatModelName = (model: string) => {
    return model.charAt(0).toUpperCase() + model.slice(1).replace(/_/g, ' ');
  };

  const getName = (obj: string | { name: string } | undefined | null) => {
    if (!obj) return '—';
    if (typeof obj === 'string') return obj;
    return obj.name || '—';
  };

  if (loading) return <div className={styles.centerInfo}>Ma'lumotlar yuklanmoqda...</div>;
  if (error)
    return (
      <div className={styles.centerInfo}>
        <div className={styles.errorText}>
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className={`${styles.btnOutline} ${styles.actionButton} mt-4 mx-auto`}
        >
          Ortga qaytish
        </button>
      </div>
    );
  if (!user)
    return <div className={`${styles.centerInfo} ${styles.errorText}`}>User not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.scrollContent}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                <Shield size={24} />
              </div>
              <div>
                <h1 className={styles.userName}>{user.full_name || user.username}</h1>
                <p className={styles.userSubtitle}>Foydalanuvchi sozlamalari</p>
              </div>
            </div>
          </div>
          <div className={styles.actions}>
            <button className={`${styles.actionButton} ${styles.btnPrimary}`}>
              <FileText size={16} />
              <span>documents</span>
            </button>
            <button className={`${styles.actionButton} ${styles.btnOutline}`}>
              <FolderGit2 size={16} />
              <span>directory</span>
            </button>
          </div>
        </div>

        {user && (
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <MapPin size={14} />
                Viloyat
              </div>
              <div className={styles.infoValue}>{getName(user.region)}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <Map size={14} />
                Tuman
              </div>
              <div className={styles.infoValue}>{getName(user.district)}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <Building2 size={14} />
                Bo'lim
              </div>
              <div className={styles.infoValue}>{getName(user.department)}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <Briefcase size={14} />
                Lavozim
              </div>
              <div className={styles.infoValue}>{getName(user.position)}</div>
            </div>
          </div>
        )}

        {/* Table Card */}
        <div className={styles.card}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th className={`${styles.th} ${styles.thCenter}`}>No</th>
                  <th className={styles.th}>Ruxsat nomi</th>
                  {/* Typed action array to avoid any cast */}
                  {(['view', 'add', 'change', 'delete'] as const).map((action) => (
                    <th key={action} className={`${styles.th} ${styles.thCenter}`}>
                      <div className={styles.thContent}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          onChange={(e) => handleSelectColumn(action, e.target.checked)}
                        />
                        <div className={styles.labelWithIcon}>
                          {action === 'view' && <span>👁 view</span>}
                          {action === 'add' && <span>+ create</span>}
                          {action === 'change' && <span>📝 edit</span>}
                          {action === 'delete' && <span>🗑 delete</span>}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupedPermissions.map((group, index) => {
                  return (
                    <tr key={group.model} className={styles.row}>
                      <td className={`${styles.td} ${styles.tdNo}`}>{index + 1}</td>
                      <td className={`${styles.td} ${styles.tdName}`}>
                        {formatModelName(group.model)}
                      </td>
                      {['view', 'add', 'change', 'delete'].map((action) => {
                        const perm = group.permissions[action as keyof typeof group.permissions];
                        return (
                          <td key={action} className={`${styles.td} ${styles.tdCheck}`}>
                            {perm && (
                              <input
                                type="checkbox"
                                checked={selectedPermissions.has(perm.id)}
                                onChange={() => handleCheckboxChange(perm.id)}
                                className={styles.checkbox}
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button onClick={() => navigate(-1)} className={styles.btnFooterCancel}>
          <X size={16} />
          Bekor qilish
        </button>
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className={styles.btnFooterSave}
        >
          <Save size={16} />
          {saving ? 'Saqlayapman...' : 'Saqlash'}
        </button>
        {/* <button
                    onClick={() => handleSave(true)}
                    disabled={saving}
                    className={styles.btnFooterSaveClose}
                >
                    <Check size={16} />
                    {saving ? 'Saqlayapman...' : 'Save&Close'}
                </button> */}
      </div>
    </div>
  );
};

export default UserPermissionsPage;
