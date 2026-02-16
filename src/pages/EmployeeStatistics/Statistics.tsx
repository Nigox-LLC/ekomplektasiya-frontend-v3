import { useState } from 'react';
import { Calendar, Filter, Download, Printer, TrendingUp, TrendingDown, CheckCircle, XCircle, Clock, Users, Building2, X, ChevronDown } from 'lucide-react';
import React from 'react';
import { Badge, Button } from 'antd';

interface DepartmentStats {
  id: string;
  name: string;
  approved: number;
  cancelled: number;
  delayed: number;
  total: number;
  employees: EmployeeStats[];
}

interface EmployeeStats {
  id: string;
  name: string;
  position: string;
  approved: number;
  cancelled: number;
  delayed: number;
  total: number;
}

const Statistics: React.FC = () => {
  const [year, setYear] = useState('2026');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([]);

  const years = ['2024', '2025', '2026'];

  // Mock ma'lumotlar
  const departmentStats: DepartmentStats[] = [
    {
      id: 'dept1',
      name: 'IT bo\'limi',
      approved: 1250,
      cancelled: 45,
      delayed: 180,
      total: 1475,
      employees: [
        { id: 'emp1', name: 'Aliyev Jamshid', position: 'Bo\'lim boshlig\'i', approved: 450, cancelled: 15, delayed: 60, total: 525 },
        { id: 'emp2', name: 'Karimov Aziz', position: 'Mutaxassis', approved: 400, cancelled: 20, delayed: 70, total: 490 },
        { id: 'emp3', name: 'Toshmatov Sardor', position: 'Dasturchi', approved: 400, cancelled: 10, delayed: 50, total: 460 },
      ]
    },
    {
      id: 'dept2',
      name: 'Moliya bo\'limi',
      approved: 980,
      cancelled: 120,
      delayed: 150,
      total: 1250,
      employees: [
        { id: 'emp4', name: 'Rahimova Nodira', position: 'Bo\'lim boshlig\'i', approved: 350, cancelled: 40, delayed: 50, total: 440 },
        { id: 'emp5', name: 'Usmanov Timur', position: 'Bosh hisobchi', approved: 380, cancelled: 50, delayed: 60, total: 490 },
        { id: 'emp6', name: 'Qodirova Dilnoza', position: 'Hisobchi', approved: 250, cancelled: 30, delayed: 40, total: 320 },
      ]
    },
    {
      id: 'dept3',
      name: 'Kadrlar bo\'limi',
      approved: 650,
      cancelled: 85,
      delayed: 95,
      total: 830,
      employees: [
        { id: 'emp7', name: 'Nurmatov Shoxrux', position: 'Bo\'lim boshlig\'i', approved: 300, cancelled: 35, delayed: 45, total: 380 },
        { id: 'emp8', name: 'Ismoilova Gulnora', position: 'Mutaxassis', approved: 350, cancelled: 50, delayed: 50, total: 450 },
      ]
    },
    {
      id: 'dept4',
      name: 'Yuridik bo\'limi',
      approved: 540,
      cancelled: 60,
      delayed: 110,
      total: 710,
      employees: [
        { id: 'emp9', name: 'Tursunov Botir', position: 'Yurist', approved: 320, cancelled: 30, delayed: 60, total: 410 },
        { id: 'emp10', name: 'Abdullayeva Kamola', position: 'Yurist', approved: 220, cancelled: 30, delayed: 50, total: 300 },
      ]
    },
  ];

  const toggleDepartment = (deptId: string) => {
    setExpandedDepartments(prev =>
      prev.includes(deptId)
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  // Umumiy statistika
  const totalStats = {
    approved: departmentStats.reduce((sum, dept) => sum + dept.approved, 0),
    cancelled: departmentStats.reduce((sum, dept) => sum + dept.cancelled, 0),
    delayed: departmentStats.reduce((sum, dept) => sum + dept.delayed, 0),
    total: departmentStats.reduce((sum, dept) => sum + dept.total, 0),
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Filtrlar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-end gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Yil</label>
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bo'lim</label>
            <div className="relative">
              {selectedDepartment ? (
                <div className="flex items-center justify-between px-3 py-2 border-2 border-blue-500 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-900">
                    {departmentStats.find(d => d.id === selectedDepartment)?.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDepartment('');
                      setSelectedEmployee('');
                    }}
                    className="ml-2 p-1 hover:bg-blue-200 rounded-full transition-colors"
                    title="Tozalash"
                  >
                    <X className="size-4 text-blue-700" />
                  </button>
                </div>
              ) : (
                <>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                  >
                    <option value="">Barcha bo'limlar</option>
                    {departmentStats.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                </>
              )}
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Xodim</label>
            <div className="relative">
              {selectedEmployee ? (
                <div className="flex items-center justify-between px-3 py-2 border-2 border-blue-500 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-900">
                    {departmentStats
                      .find(d => d.id === selectedDepartment)
                      ?.employees.find(e => e.id === selectedEmployee)?.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEmployee('');
                    }}
                    className="ml-2 p-1 hover:bg-blue-200 rounded-full transition-colors"
                    title="Tozalash"
                  >
                    <X className="size-4 text-blue-700" />
                  </button>
                </div>
              ) : (
                <>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={!selectedDepartment}
                  >
                    <option value="">Barcha xodimlar</option>
                    {selectedDepartment && 
                      departmentStats
                        .find(d => d.id === selectedDepartment)
                        ?.employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                  </select>
                  {selectedDepartment && (
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2">
              <Filter className="size-4" />
              Shakllantirilish
            </Button>
            <Button variant="outlined" className="px-4 py-2.5 rounded-lg border-gray-300">
              <Printer className="size-4" />
            </Button>
            <Button variant="outlined" className="px-4 py-2.5 rounded-lg border-gray-300">
              <Download className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Umumiy statistika kartalar */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Jami xatlar</span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="size-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalStats.total.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{year} yil davomida</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Tasdiqlangan</span>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="size-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">{totalStats.approved.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">
              {((totalStats.approved / totalStats.total) * 100).toFixed(1)}% jami xatlardan
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Bekor qilingan</span>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="size-5 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-red-600">{totalStats.cancelled.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">
              {((totalStats.cancelled / totalStats.total) * 100).toFixed(1)}% jami xatlardan
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Kechiktirib bajarilgan</span>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="size-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{totalStats.delayed.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">
              {((totalStats.delayed / totalStats.total) * 100).toFixed(1)}% jami xatlardan
            </p>
          </div>
        </div>
      </div>

      {/* Bo'limlar va xodimlar jadvali */}
      <div className="flex-1 overflow-auto p-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Bo'lim / Xodim</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Lavozim</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Jami xatlar</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-green-700 uppercase tracking-wider">Tasdiqlangan</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-red-700 uppercase tracking-wider">Bekor qilingan</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-yellow-700 uppercase tracking-wider">Kechiktirilgan</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Samaradorlik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departmentStats.map((dept) => (
                <React.Fragment key={dept.id}>
                  {/* Bo'lim qatori */}
                  <tr 
                    className="bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors"
                    onClick={() => toggleDepartment(dept.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="size-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">{dept.name}</span>
                        <Badge className="bg-blue-600 text-white text-xs px-2 py-0.5">
                          {dept.employees.length} xodim
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">—</td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-gray-900">{dept.total.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-green-600">{dept.approved.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-red-600">{dept.cancelled.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-yellow-600">{dept.delayed.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-semibold text-gray-900">
                          {((dept.approved / dept.total) * 100).toFixed(1)}%
                        </span>
                        {((dept.approved / dept.total) * 100) > 80 ? (
                          <TrendingUp className="size-4 text-green-600" />
                        ) : (
                          <TrendingDown className="size-4 text-red-600" />
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Xodimlar qatorlari */}
                  {expandedDepartments.includes(dept.id) && dept.employees.map((emp) => (
                    <tr key={emp.id} className="bg-white hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 pl-12">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-700">
                              {emp.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{emp.position}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900">{emp.total.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center text-sm text-green-600">{emp.approved.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center text-sm text-red-600">{emp.cancelled.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center text-sm text-yellow-600">{emp.delayed.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-sm font-medium text-gray-900">
                            {((emp.approved / emp.total) * 100).toFixed(1)}%
                          </span>
                          {((emp.approved / emp.total) * 100) > 80 ? (
                            <TrendingUp className="size-3 text-green-600" />
                          ) : (
                            <TrendingDown className="size-3 text-red-600" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Statistics;