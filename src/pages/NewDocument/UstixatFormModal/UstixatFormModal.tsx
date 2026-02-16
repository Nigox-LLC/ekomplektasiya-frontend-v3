import { useState, useEffect } from 'react';
import { X, User, Calendar, CheckCircle, FileText, Key, GripVertical, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Input } from 'antd';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
}

interface UstixatFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    performers: Employee[];
    deadline: string;
    isSigned: boolean;
  }) => void;
  parentDocumentNumber?: string; // Parent hujjat raqami (masalan: "2001")
}

// Mock xodimlar
const mockEmployees: Employee[] = [
  { id: '1', name: 'Aliyev Jamshid Nuriddinovich', position: 'Bo\'lim boshlig\'i', department: 'Moliya bo\'limi' },
  { id: '2', name: 'Karimova Nodira Shavkatovna', position: 'Bo\'lim boshlig\'i', department: 'Kadrlar bo\'limi' },
  { id: '3', name: 'Rahimov Sardor Akmalovich', position: 'Bo\'lim boshlig\'i', department: 'Xo\'jalik bo\'limi' },
  { id: '4', name: 'Toshmatova Gulnora Botirovna', position: 'Bo\'lim boshlig\'i', department: 'Buxgalteriya' },
];
const UstixatFormModal: React.FC<UstixatFormModalProps> = ({ isOpen, onClose, onSubmit, parentDocumentNumber }) => {
  const [selectedPerformers, setSelectedPerformers] = useState<Employee[]>([]);
  const [deadline, setDeadline] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [dsKeyFile, setDsKeyFile] = useState<File | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [dsKeyOwner, setDsKeyOwner] = useState<string>('');
  const [ustixatNumber, setUstixatNumber] = useState<string>(''); // Ustixat raqami

  // Joriy foydalanuvchini yuklash
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setCurrentUser(userData.name || 'Aliyev Jamshid Nuriddinovich');
      } catch {
        setCurrentUser('Aliyev Jamshid Nuriddinovich');
      }
    } else {
      setCurrentUser('Aliyev Jamshid Nuriddinovich');
    }
  }, []);

  // Ustixat raqamini hisoblash
  useEffect(() => {
    if (parentDocumentNumber) {
      // LocalStorage dan shu hujjatning ustixatlari sonini olish
      const ustixatsKey = `ustixat_count_${parentDocumentNumber}`;
      const storedCount = localStorage.getItem(ustixatsKey);
      const currentCount = storedCount ? parseInt(storedCount) : 0;
      const nextNumber = currentCount + 1;

      // Raqamni saqlash
      setUstixatNumber(`${parentDocumentNumber}-${nextNumber}`);

      // Yangi ustixat yaratilganda localStorage ni yangilash (submit da)
      // Bu yerda faqat preview ko'rsatamiz
    } else {
      // Agar parent hujjat yo'q bo'lsa, oddiy raqam
      setUstixatNumber('____');
    }
  }, [parentDocumentNumber]);

  if (!isOpen) return null;

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newPerformers = [...selectedPerformers];
    const draggedItem = newPerformers[draggedIndex];
    newPerformers.splice(draggedIndex, 1);
    newPerformers.splice(dropIndex, 0, draggedItem);

    setSelectedPerformers(newPerformers);
    setDraggedIndex(null);

    // Asosiy ijrochi o'zgardi
    if (dropIndex === 0 || draggedIndex === 0) {
      toast.success('Asosiy ijrochi o\'zgartirildi!');
    }
  };

  // E-imzo fayl tanlash
  const handleSelectDSKey = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pfx,.p12'; // DSKey fayllar
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        setDsKeyFile(file);

        // E-imzo egasini fayl nomidan olish (mock)
        // Real integratsiyada E-imzo faylidan ma'lumot o'qiladi
        const fileName = file.name.replace(/\.(pfx|p12)$/i, '');
        // Mock: Fayl nomidan ismni ajratish
        let ownerName = fileName;

        // Agar fayl nomida probel bo'lsa, ism deb qabul qilish
        if (fileName.includes('_') || fileName.includes('-')) {
          ownerName = fileName.split(/[_-]/g).join(' ');
        }

        // Agar mockEmployees ichida shu nom bor bo'lsa
        const matchedEmployee = mockEmployees.find(emp =>
          emp.name.toLowerCase().includes(fileName.toLowerCase())
        );

        if (matchedEmployee) {
          setDsKeyOwner(matchedEmployee.name);
          toast.success(`E-imzo kaliti tanlandi: ${matchedEmployee.name}`, {
            description: file.name
          });
        } else {
          setDsKeyOwner(ownerName || 'Karimov Jasur Akmalovich');
          toast.success(`E-imzo kaliti tanlandi: ${file.name}`);
        }
      }
    };
    input.click();
  };

  // Hujjatni imzolash
  const handleSignDocument = () => {
    if (!dsKeyFile) {
      toast.error('Avval E-imzo kalitini tanlang!');
      return;
    }
    if (selectedPerformers.length === 0) {
      toast.error('Avval ijrochilarni tanlang!');
      return;
    }
    if (!deadline) {
      toast.error('Avval ijro muddatini kiriting!');
      return;
    }

    // Bu yerda real E-imzo integratsiyasi bo'ladi
    // Hozircha mock
    toast.success('Hujjat muvaffaqiyatli imzolandi!', {
      description: `${dsKeyFile.name} bilan imzolandi`,
      duration: 3000
    });
    setIsSigned(true);
  };

  const handleSubmit = () => {
    if (selectedPerformers.length === 0) {
      toast.error('Kamida bitta ijrochi tanlang!');
      return;
    }
    if (!deadline) {
      toast.error('Ijro muddatini kiriting!');
      return;
    }

    // LocalStorage da ustixat sonini yangilash
    if (parentDocumentNumber) {
      const ustixatsKey = `ustixat_count_${parentDocumentNumber}`;
      const storedCount = localStorage.getItem(ustixatsKey);
      const currentCount = storedCount ? parseInt(storedCount) : 0;
      localStorage.setItem(ustixatsKey, (currentCount + 1).toString());
    }

    onSubmit({
      performers: selectedPerformers,
      deadline,
      isSigned
    });

    // Toast
    if (isSigned) {
      toast.success('Hujjat imzolangan holda saqlandi!', {
        description: `Ustixat № ${ustixatNumber}`
      });
    } else {
      toast.warning('Hujjat imzosiz saqlandi!', {
        description: 'Keyinroq imzolashingiz mumkin'
      });
    }

    // Reset
    setSelectedPerformers([]);
    setDeadline('');
    setIsSigned(false);
    setDsKeyFile(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700">
          <div className="flex items-center gap-3">
            <FileText className="size-6 text-white" />
            <h2 className="text-xl font-bold text-white">Ustixat hujjat shakllantirish</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-800 rounded-lg transition-colors"
          >
            <X className="size-5 text-white" />
          </button>
        </div>

        {/* Body - A4 Format */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* A4 Paper Simulation */}
          <div className="max-w-3xl mx-auto bg-white border-2 border-gray-300 shadow-lg p-12 rounded-lg">
            {/* Document Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">USTIXAT</h1>
              <p className="text-sm text-gray-600">№ {ustixatNumber} / {new Date().getFullYear()}</p>
              <p className="text-sm text-gray-600">{new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>

            {/* Document Content */}
            <div className="space-y-6">
              {/* Ijrochilar tanlash */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <User className="size-5 text-purple-600" />
                  Ijrochilar
                </label>

                {/* Tanlangan ijrochilar */}
                {selectedPerformers.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {selectedPerformers.map((performer, index) => {
                      const isMainPerformer = index === 0; // Birinchi ijrochi asosiy
                      return (
                        <div
                          key={performer.id}
                          className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 cursor-move transition-all ${isMainPerformer
                              ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-400 shadow-md'
                              : 'bg-purple-50 border-purple-200'
                            } ${draggedIndex === index ? 'opacity-50 scale-95' : ''}`}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDrop={(e) => handleDrop(e, index)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {/* Drag handle */}
                            <GripVertical className={`size-5 cursor-grab ${isMainPerformer ? 'text-amber-600' : 'text-purple-400'}`} />

                            {/* Avatar */}
                            <div className={`size-10 rounded-full flex items-center justify-center ${isMainPerformer ? 'bg-gradient-to-br from-amber-500 to-yellow-600' : 'bg-purple-600'
                              }`}>
                              {isMainPerformer ? (
                                <Star className="size-5 text-white fill-white" />
                              ) : (
                                <User className="size-5 text-white" />
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm ${isMainPerformer ? 'font-bold text-amber-900' : 'font-semibold text-purple-900'}`}>
                                  {performer.name}
                                </p>
                                {isMainPerformer && (
                                  <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-xs font-bold rounded-full">
                                    Asosiy ijrochi
                                  </span>
                                )}
                              </div>
                              <p className={`text-xs ${isMainPerformer ? 'text-amber-700' : 'text-purple-700'}`}>
                                {performer.position} • {performer.department}
                              </p>
                            </div>
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPerformers(selectedPerformers.filter(p => p.id !== performer.id));
                              if (isMainPerformer && selectedPerformers.length > 1) {
                                toast.info('Yangi asosiy ijrochi: ' + selectedPerformers[1].name);
                              }
                            }}
                            className={`p-2 rounded-lg transition-colors ${isMainPerformer ? 'hover:bg-amber-100' : 'hover:bg-purple-100'
                              }`}
                          >
                            <X className={`size-5 ${isMainPerformer ? 'text-amber-600' : 'text-purple-600'}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Ijrochi qo'shish */}
                <div className="relative">
                  <Button
                    type="default"
                    onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                    variant="outlined"
                    className="w-full border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50 text-purple-600"
                  >
                    + Ijrochi qo'shish
                  </Button>

                  {showEmployeeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                      {mockEmployees
                        .filter(emp => !selectedPerformers.some(p => p.id === emp.id))
                        .map((employee) => (
                          <button
                            key={employee.id}
                            type="button"
                            onClick={() => {
                              setSelectedPerformers([...selectedPerformers, employee]);
                              setShowEmployeeDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                          >
                            <div className="size-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="size-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{employee.name}</p>
                              <p className="text-xs text-gray-500">{employee.position} • {employee.department}</p>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Ijro muddati */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="size-5 text-purple-600" />
                  Ijro muddati
                </label>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Imzolash */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Key className="size-5 text-purple-600" />
                  E-imzo kaliti
                </label>
                <Button
                  type="default"
                  onClick={handleSelectDSKey}
                  variant="outlined"
                  className="w-full border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50 text-purple-600"
                >
                  + E-imzo kaliti tanlash
                </Button>
              </div>

              {/* Signatures Section */}
              {isSigned && (
                <div className="mt-6 pt-6 border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tayyorlovchi:</p>
                      <div className="border-b-2 border-gray-900 pb-1 mb-1">
                        <p className="text-sm font-bold text-gray-900">{currentUser}</p>
                      </div>
                      <p className="text-xs text-gray-500">Ism va imzo</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tasdiqladi:</p>
                      <div className="border-b-2 border-gray-900 pb-1 mb-1">
                        <p className="text-sm font-bold text-gray-900">{dsKeyOwner}</p>
                      </div>
                      <p className="text-xs text-gray-500">Ism va imzo</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-2">
            {dsKeyFile && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                <Key className="size-4 text-green-600" />
                <span className="text-sm text-green-700">{dsKeyFile.name}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outlined"
              onClick={onClose}
              className="px-6"
            >
              Bekor qilish
            </Button>
            {!isSigned && (
              <Button
                onClick={handleSignDocument}
                className="px-6 bg-green-600 hover:bg-green-700 text-white gap-2"
                disabled={!dsKeyFile}
              >
                <Key className="size-4" />
                Hujjatni imzolash
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              className="px-6 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSigned ? 'Saqlash (Imzolangan)' : 'Saqlash (Imzosiz)'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UstixatFormModal;