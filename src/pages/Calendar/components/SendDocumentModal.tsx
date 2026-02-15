import { useState } from 'react';
// import { Button } from '@/app/components/ui/button';
// import { Input } from '@/app/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { X, Search, User, Building2, Send } from 'lucide-react';
import { Button, Input, Select } from 'antd';

interface SendDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (employee: Employee, purpose: string) => void;
  onSuccess: (message: string) => void;
  documentNumber: string;
  documentTitle: string;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
}

const mockEmployees: Employee[] = [
  { id: '1', name: 'Aliyev Jamshid', position: 'Bo\'lim boshlig\'i', department: 'Moliya bo\'limi' },
  { id: '2', name: 'Karimova Dilnoza', position: 'Bosh mutaxassis', department: 'Moliya bo\'limi' },
  { id: '3', name: 'Rahimov Sardor', position: 'Direktor', department: 'Rahbariyat' },
  { id: '4', name: 'Toshmatova Gulnora', position: 'Bosh hisobchi', department: 'Moliya bo\'limi' },
  { id: '5', name: 'Yunusov Akbar', position: 'Bo\'lim boshlig\'i', department: 'Kadrlar bo\'limi' },
  { id: '6', name: 'Sodiqova Madina', position: 'Yurist', department: 'Yuridik bo\'limi' },
  { id: '7', name: 'Ismailov Javohir', position: 'IT mutaxassisi', department: 'IT bo\'limi' },
  { id: '8', name: 'Abdullayeva Feruza', position: 'Menejer', department: 'Savdo bo\'limi' },
  { id: '9', name: 'Tursunov Behzod', position: 'Muhandis', department: 'Texnik bo\'lim' },
  { id: '10', name: 'Sharipova Nodira', position: 'Kotiba', department: 'Umumiy bo\'lim' },
  { id: '11', name: 'Azimov Rustam', position: 'Bosh mutaxassis', department: 'Kadrlar bo\'limi' },
  { id: '12', name: 'Nematova Zilola', position: 'Hisobchi', department: 'Moliya bo\'limi' },
];

export function SendDocumentModal({ isOpen, onClose, onSend, onSuccess, documentNumber, documentTitle }: SendDocumentModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState('');

  if (!isOpen) return null;

  // Unique departments
  const departments = ['all', ...Array.from(new Set(mockEmployees.map(e => e.department)))];

  // Filter employees
  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const handleSend = () => {
    if (selectedEmployee && selectedPurpose) {
      const employeeName = selectedEmployee.name;
      const purposeText = getPurposeText(selectedPurpose);
      
      onSend(selectedEmployee, selectedPurpose);
      
      // Show success message
      onSuccess(`Hujjat ${employeeName} ga ${purposeText.toLowerCase()} yuborildi`);
      
      // Close modal and reset
      onClose();
      setSearchQuery('');
      setSelectedDepartment('all');
      setSelectedEmployee(null);
      setSelectedPurpose('');
    }
  };

  const getPurposeText = (purpose: string) => {
    switch (purpose) {
      case 'signing': return 'Imzolash uchun';
      case 'backup': return 'Ustixat uchun';
      case 'execution': return 'Ijro uchun';
      default: return '';
    }
  };

  // Reset purpose when employee is cleared
  const handleClearEmployee = () => {
    setSelectedEmployee(null);
    setSelectedPurpose('');
  };

  // Reset employee when department is cleared
  const handleClearDepartment = () => {
    setSelectedDepartment('all');
    setSelectedEmployee(null);
    setSelectedPurpose('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Hujjatni yuborish</h2>
            <p className="text-sm text-gray-500 mt-1">
              {documentNumber} - {documentTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="size-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Search and Filter */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Ism, lavozim yoki bo'lim bo'yicha qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Bo'lim</label>
              <div className="relative">
                <Select value={selectedDepartment} onChange={(value) => setSelectedDepartment(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bo'limni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha bo'limlar</SelectItem>
                    {departments.slice(1).map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedDepartment !== 'all' && (
                  <button
                    onClick={handleClearDepartment}
                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Bo'limni tozalash"
                  >
                    <X className="size-4 text-gray-500" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Selected Employee Badge */}
          {selectedEmployee && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="size-5 text-blue-700" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-blue-900">{selectedEmployee.name}</h4>
                <p className="text-sm text-blue-700">{selectedEmployee.position}</p>
                <div className="flex items-center gap-1 text-xs text-blue-600 mt-0.5">
                  <Building2 className="size-3" />
                  <span>{selectedEmployee.department}</span>
                </div>
              </div>
              <button
                onClick={handleClearEmployee}
                className="flex-shrink-0 p-2 hover:bg-blue-200 rounded-lg transition-colors"
                title="Xodimni tozalash"
              >
                <X className="size-5 text-blue-700" />
              </button>
            </div>
          )}

          {/* Employees List */}
          {!selectedEmployee && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Xodimni tanlang</label>
              <div className="border border-gray-200 rounded-lg max-h-[300px] overflow-y-auto">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map(employee => (
                    <div
                      key={employee.id}
                      className={`flex items-center gap-3 p-3 cursor-pointer transition-all border-b border-gray-100 last:border-b-0 ${
                        selectedEmployee?.id === employee.id
                          ? 'bg-blue-50 ring-2 ring-blue-500'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="size-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                        <p className="text-sm text-gray-600">{employee.position}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <Building2 className="size-3" />
                          <span>{employee.department}</span>
                        </div>
                      </div>
                      {selectedEmployee?.id === employee.id && (
                        <div className="flex-shrink-0">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <User className="size-12 text-gray-300 mx-auto mb-2" />
                    <p>Xodim topilmadi</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Purpose Selection */}
          {selectedEmployee && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-sm font-medium text-gray-700">Yuborish maqsadi</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedPurpose('signing')}
                  className={`p-4 border-2 rounded-lg transition-all text-center ${
                    selectedPurpose === 'signing'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-semibold">Imzolash</div>
                  <div className="text-xs mt-1 opacity-75">uchun</div>
                </button>
                <button
                  onClick={() => setSelectedPurpose('backup')}
                  className={`p-4 border-2 rounded-lg transition-all text-center ${
                    selectedPurpose === 'backup'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-semibold">Ustixat</div>
                  <div className="text-xs mt-1 opacity-75">uchun</div>
                </button>
                <button
                  onClick={() => setSelectedPurpose('execution')}
                  className={`p-4 border-2 rounded-lg transition-all text-center ${
                    selectedPurpose === 'execution'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-semibold">Ijro</div>
                  <div className="text-xs mt-1 opacity-75">uchun</div>
                </button>
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedEmployee && selectedPurpose && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <h4 className="font-semibold text-blue-900 mb-2">Tasdiqlash</h4>
              <p className="text-sm text-blue-700">
                <span className="font-medium">{selectedEmployee.name}</span> ga{' '}
                <span className="font-medium">{getPurposeText(selectedPurpose).toLowerCase()}</span> yuboriladi
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {selectedEmployee.department} - {selectedEmployee.position}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="outlined" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSend}
            disabled={!selectedEmployee || !selectedPurpose}
          >
            <Send className="size-4 mr-2" />
            Yuborish
          </Button>
        </div>
      </div>
    </div>
  );
}
