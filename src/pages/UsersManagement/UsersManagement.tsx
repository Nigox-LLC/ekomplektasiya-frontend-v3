import { useState, useEffect, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  User,
  X,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { Badge, Button, Input } from 'antd';
import { toast } from 'react-toastify';

export interface UserData {
  id: string;
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: 'admin' | 'manager' | 'technical' | 'employee';
  status: 'active' | 'inactive';
  createdAt: string;
  permissions: string[];
}

const ALL_PERMISSIONS = [
  { id: 'dashboard', label: 'Bosh sahifa', icon: '🏠' },
  { id: 'dashboard-statistics', label: '↳ Bosh sahifa - Umumiy statistika', icon: '📊', parent: 'dashboard' },
  { id: 'dashboard-employee-stats', label: '↳ Bosh sahifa - Xodimlar statistikasi', icon: '👥', parent: 'dashboard' },
  { id: 'dashboard-documents', label: '↳ Bosh sahifa - Hujjatlar', icon: '📄', parent: 'dashboard' },
  { id: 'dashboard-tasks', label: '↳ Bosh sahifa - Topshiriqlar', icon: '✓', parent: 'dashboard' },
  { id: 'dashboard-calendar', label: '↳ Bosh sahifa - Taqvim', icon: '📅', parent: 'dashboard' },

  { id: 'calendar', label: 'Taqvim', icon: '📅' },
  { id: 'new-document', label: 'Yangi hujjat', icon: '➕' },

  // Yuborilgan va ichki bo'limlari
  { id: 'sent', label: 'Yuborilgan xatlar', icon: '📤' },
  { id: 'sent-all', label: '↳ Yuborilgan - Barchasi', icon: '📤', parent: 'sent' },
  { id: 'sent-instructions', label: '↳ Yuborilgan - Ma\'lumot uchun', icon: '📤', parent: 'sent' },
  { id: 'sent-approval', label: '↳ Yuborilgan - Kelishish uchun', icon: '✓', parent: 'sent' },
  { id: 'sent-for-signing', label: '↳ Yuborilgan - Imzolash uchun', icon: '✍️', parent: 'sent' },
  { id: 'sent-backup', label: '↳ Yuborilgan - Ustixat uchun', icon: '💼', parent: 'sent' },

  // Kelib tushgan va ichki bo'limlari
  { id: 'incoming', label: 'Kelib tushgan xatlar', icon: '📥' },
  { id: 'incoming-all', label: '↳ Kelib tushgan - Barchasi', icon: '📥', parent: 'incoming' },
  { id: 'incoming-info', label: '↳ Kelib tushgan - Ma\'lumot uchun', icon: '📥', parent: 'incoming' },
  { id: 'incoming-approval', label: '↳ Kelib tushgan - Kelishish uchun', icon: '✓', parent: 'incoming' },
  { id: 'incoming-for-signing', label: '↳ Kelib tushgan - Imzolash uchun', icon: '✍️', parent: 'incoming' },
  { id: 'incoming-backup', label: '↳ Kelib tushgan - Ustixat uchun', icon: '💼', parent: 'incoming' },

  { id: 'my-documents', label: 'Mening hujjatlarim', icon: '📄' },
  { id: 'appeal-letter', label: 'Murojaat xati', icon: '✉️' },
  { id: 'price-analysis', label: 'Narx tahlil', icon: '💰' },

  // Ma'lumotnoma va ichki bo'limlari
  { id: 'reference', label: 'Ma\'lumotnoma', icon: '📖' },
  { id: 'reference-requisites', label: '↳ Ma\'lumotnoma - Rekvizitlar', icon: '📋', parent: 'reference' },
  { id: 'reference-bank', label: '↳ Ma\'lumotnoma - Banklar', icon: '🏦', parent: 'reference' },
  { id: 'reference-contracts', label: '↳ Ma\'lumotnoma - Shartnomalar', icon: '📝', parent: 'reference' },
  { id: 'reference-goods-in', label: '↳ Ma\'lumotnoma - Tovarlar kirimi', icon: '📦', parent: 'reference' },
  { id: 'reference-goods-out', label: '↳ Ma\'lumotnoma - Tovarlar chiqimi', icon: '📤', parent: 'reference' },
  { id: 'reference-warehouse-transfer', label: '↳ Ma\'lumotnoma - Ombor o\'tkazmalar', icon: '🔄', parent: 'reference' },
  { id: 'reference-year-plan', label: '↳ Ma\'lumotnoma - Yillik reja', icon: '📅', parent: 'reference' },

  // Statistika va ichki bo'limlari
  { id: 'statistics', label: 'Statistika', icon: '📊' },
  { id: 'statistics-employee', label: '↳ Statistika - Xodimlar statistikasi', icon: '👥', parent: 'statistics' },

  // Hisobotlar va ichki bo'limlari
  { id: 'reports', label: 'Hisobotlar', icon: '📈' },
  { id: 'reports-turnover', label: '↳ Hisobotlar - Tovar aylanma', icon: '🔄', parent: 'reports' },
  { id: 'reports-goods-balance', label: '↳ Hisobotlar - Tovar qoldigi', icon: '📦', parent: 'reports' },
  { id: 'reports-table1', label: '↳ Hisobotlar - 1-jadval', icon: '📊', parent: 'reports' },
  { id: 'reports-table2', label: '↳ Hisobotlar - 2-jadval', icon: '📊', parent: 'reports' },
  { id: 'reports-table3', label: '↳ Hisobotlar - 3-jadval', icon: '📊', parent: 'reports' },

  { id: 'chat', label: 'Muloqot', icon: '💬' },
  { id: 'users-management', label: 'Foydalanuvchilar boshqaruvi', icon: '👥' },
  { id: 'goods-management', label: 'Tovarlar boshqaruvi', icon: '📦' },
];

const UsersManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Boshlang'ich foydalanuvchilar
  const initialUsers: UserData[] = [
    {
      id: '1',
      username: 'admin',
      password: 'admin123',
      fullName: 'Aliyev Jamshid',
      email: 'admin@company.uz',
      phone: '+998 90 123 45 67',
      department: 'Rahbariyat',
      position: 'Direktor',
      role: 'admin',
      status: 'active',
      createdAt: '2025-01-15',
      permissions: ALL_PERMISSIONS.map((p: { id: any; }) => p.id)
    },
    {
      id: '2',
      username: 'tech_spec',
      password: 'tech123',
      fullName: 'Karimov Aziz',
      email: 'tech@company.uz',
      phone: '+998 90 234 56 78',
      department: 'IT bo\'limi',
      position: 'Texnik mutaxassis',
      role: 'technical',
      status: 'active',
      createdAt: '2025-01-20',
      permissions: ['dashboard', 'calendar', 'users-management', 'goods-management', 'reference', 'chat']
    },
    {
      id: '3',
      username: 'manager1',
      password: 'manager123',
      fullName: 'Rahimova Nodira',
      email: 'manager@company.uz',
      phone: '+998 90 345 67 89',
      department: 'Moliya bo\'limi',
      position: 'Bo\'lim boshlig\'i',
      role: 'manager',
      status: 'active',
      createdAt: '2025-01-22',
      permissions: ['dashboard', 'calendar', 'new-document', 'sent', 'incoming', 'my-documents', 'appeal-letter', 'reports', 'statistics', 'chat']
    },
    {
      id: '4',
      username: 'employee1',
      password: 'employee123',
      fullName: 'Toshmatov Sardor',
      email: 'employee@company.uz',
      phone: '+998 90 456 78 90',
      department: 'Kadrlar bo\'limi',
      position: 'Mutaxassis',
      role: 'employee',
      status: 'active',
      createdAt: '2025-02-01',
      permissions: ['dashboard', 'calendar', 'sent', 'incoming', 'my-documents', 'chat']
    },
  ];

  // Local storage dan foydalanuvchilarni o'qish
  const [users, setUsers] = useState<UserData[]>(() => {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : initialUsers;
  });

  // Users o'zgarganda local storage ga saqlash
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const roleConfig = {
    admin: { label: 'Administrator', color: 'bg-red-100 text-red-700 border-red-300' },
    manager: { label: 'Menejer', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    technical: { label: 'Texnik mutaxassis', color: 'bg-purple-100 text-purple-700 border-purple-300' },
    employee: { label: 'Xodim', color: 'bg-gray-100 text-gray-700 border-gray-300' }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(user =>
      user.id === id
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Haqiqatan ham bu foydalanuvchini o\'chirmoqchimisiz?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Foydalanuvchilar boshqaruvi</h1>
            <p className="text-sm text-gray-500 mt-1">Tizim foydalanuvchilarini boshqarish va huquqlarni belgilash</p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={() => setShowAddUserModal(true)}
          >
            <Plus className="size-4" />
            Yangi foydalanuvchi
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Qidirish (ism, username, email)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Barcha rollar</option>
            <option value="admin">Administrator</option>
            <option value="manager">Menejer</option>
            <option value="technical">Texnik mutaxassis</option>
            <option value="employee">Xodim</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Barcha statuslar</option>
            <option value="active">Faol</option>
            <option value="inactive">Nofaol</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Foydalanuvchi</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Bo'lim</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rol</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Huquqlar</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="size-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-900">{user.department}</p>
                    <p className="text-xs text-gray-500">{user.position}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={roleConfig[user.role].color}>
                      {roleConfig[user.role].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-semibold text-blue-600">
                      {user.permissions.length} / {ALL_PERMISSIONS.length}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {user.status === 'active' ? <Unlock className="size-3" /> : <Lock className="size-3" />}
                      {user.status === 'active' ? 'Faol' : 'Nofaol'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditUserModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Tahrirlash"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="O'chirish"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <UserModal
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          onSave={(data) => {
            const newUser: UserData = {
              ...data,
              id: Date.now().toString(),
              createdAt: new Date().toISOString().split('T')[0]
            };
            setUsers([...users, newUser]);
            setShowAddUserModal(false);
            // Muvaffaqiyatli xabar
            toast.success('Foydalanuvchi muvaffaqiyatli qo\'shildi!', {
              description: `${data.fullName} (${data.username}) tizimga qo'shildi`,
              duration: 4000
            });
          }}
        />
      )}

      {/* Edit User Modal */}
      {showEditUserModal && selectedUser && (
        <UserModal
          isOpen={showEditUserModal}
          onClose={() => {
            setShowEditUserModal(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onSave={(data) => {
            setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...data } : u));
            setShowEditUserModal(false);
            setSelectedUser(null);
            // Muvaffaqiyatli xabar
            toast.success('Foydalanuvchi muvaffaqiyatli tahrirlandi!', {
              description: `${data.fullName} ma'lumotlari yangilandi`,
              duration: 4000
            });
          }}
        />
      )}
    </div>
  );
}

// User Modal Component
interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserData;
  onSave: (data: Omit<UserData, 'id' | 'createdAt'>) => void;
}

function UserModal({ isOpen, onClose, user, onSave }: UserModalProps) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    password: user?.password || '', // Parolni qo'shamiz
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    position: user?.position || '',
    role: user?.role || 'employee' as 'admin' | 'manager' | 'technical' | 'employee',
    status: user?.status || 'active' as 'active' | 'inactive',
    permissions: user?.permissions || []
  });

  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !formData.password) {
      alert('Parol kiritish majburiy!');
      return;
    }
    onSave(formData);
  };

  const togglePermission = (permissionId: string) => {
    if (formData.permissions.includes(permissionId)) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(p => p !== permissionId)
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permissionId]
      });
    }
  };

  const selectAllPermissions = () => {
    setFormData({
      ...formData,
      permissions: ALL_PERMISSIONS.map(p => p.id)
    });
  };

  const deselectAllPermissions = () => {
    setFormData({
      ...formData,
      permissions: []
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">
            {user ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi qo\'shish'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Asosiy ma'lumotlar */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Asosiy ma'lumotlar</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    To'liq ism <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Aliyev Jamshid"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="admin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Parol <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={user ? '********' : 'Parolni kiriting'}
                      required={!user}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@company.uz"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+998 90 123 45 67"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bo'lim <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="IT bo'limi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lavozim <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Mutaxassis"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rol <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="employee">Xodim</option>
                    <option value="manager">Menejer</option>
                    <option value="technical">Texnik mutaxassis</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="active">Faol</option>
                    <option value="inactive">Nofaol</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Huquqlar */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Huquqlar ({formData.permissions.length} / {ALL_PERMISSIONS.length})
                </h3>
                <div className="flex gap-2">
                  <Button
                    type="default"
                    variant="outlined"
                    size="small"
                    onClick={selectAllPermissions}
                  >
                    Barchasini tanlash
                  </Button>
                  <Button
                    type="default"
                    variant="outlined"
                    size="small"
                    onClick={deselectAllPermissions}
                  >
                    Barchasini bekor qilish
                  </Button>
                </div>
              </div>

              {/* Guruhlar bo'yicha ajratilgan huquqlar */}
              <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                {/* Asosiy bo'limlar - parent bo'lmagan */}
                {ALL_PERMISSIONS.filter((p: { parent: any; }) => !p.parent).map((mainPermission: { id: Key | null | undefined; icon: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; label: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => {
                  const subPermissions = ALL_PERMISSIONS.filter((p: { parent: Key | null | undefined; }) => p.parent === mainPermission.id);
                  const hasChildren = subPermissions.length > 0;

                  return (
                    <div key={mainPermission.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      {/* Asosiy bo'lim */}
                      <label
                        className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all mb-3 ${formData.permissions.includes(mainPermission.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(mainPermission.id)}
                          onChange={() => mainPermission.id && togglePermission(mainPermission.id as string)}
                          className="size-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-2xl">{mainPermission.icon}</span>
                        <span className="text-base font-bold text-gray-900">{mainPermission.label}</span>
                        {formData.permissions.includes(mainPermission.id) && (
                          <Check className="size-5 text-blue-600 ml-auto" />
                        )}
                      </label>

                      {/* Ichki bo'limlar */}
                      {hasChildren && (
                        <div className="ml-8 space-y-2">
                          {subPermissions.map((subPermission: { id: Key | null | undefined; icon: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; label: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                            <label
                              key={subPermission.id}
                              className={`flex items-center gap-3 p-2.5 border-2 rounded-lg cursor-pointer transition-all ${formData.permissions.includes(subPermission.id)
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.permissions.includes(subPermission.id)}
                                onChange={() => subPermission.id && togglePermission(subPermission.id as string)}
                                className="size-4 text-green-600 rounded focus:ring-green-500"
                              />
                              <span className="text-lg">{subPermission.icon}</span>
                              <span className="text-sm font-medium text-gray-800">{subPermission.label}</span>
                              {formData.permissions.includes(subPermission.id) && (
                                <Check className="size-4 text-green-600 ml-auto" />
                              )}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="outlined" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
          >
            {user ? 'Saqlash' : 'Qo\'shish'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UsersManagement;