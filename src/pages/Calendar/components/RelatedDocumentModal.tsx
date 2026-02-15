import { useState } from 'react';
// import { Button } from '@/app/components/ui/button';
import { X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Select } from 'antd';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

interface RelatedDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (documents: any[]) => void;
}

type TabType = 'incomingNumber' | 'outgoingNumber' | 'outgoingDate' | 'documentType' | 'summary' | 'files';

export function RelatedDocumentModal({ isOpen, onClose, onSave }: RelatedDocumentModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('incomingNumber');
  const [incomingNumber, setIncomingNumber] = useState('');
  const [outgoingNumber, setOutgoingNumber] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<any[]>([]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selectedDocuments);
    onClose();
  };

  const tabs = [
    { id: 'incomingNumber' as TabType, label: 'Kirish raqami' },
    { id: 'outgoingNumber' as TabType, label: 'Chiqish raqami' },
    { id: 'outgoingDate' as TabType, label: 'Chiqish sanasi' },
    { id: 'documentType' as TabType, label: 'Hujjat turi' },
    { id: 'summary' as TabType, label: 'Qisqacha mazmuni' },
    { id: 'files' as TabType, label: 'Fayllar' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Aloqador hujjat qo'shish</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Search Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 items-start">
            {/* Kirish raqami */}
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kirish raqami*
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={incomingNumber}
                  onChange={(e) => setIncomingNumber(e.target.value)}
                  placeholder="Qidirishni maydoniga eng kamida 1 ta belgi kiriting va"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              </div>
            </div>

            {/* Chiqish raqami */}
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chiqish raqami*
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={outgoingNumber}
                  onChange={(e) => setOutgoingNumber(e.target.value)}
                  placeholder="Qidirishni maydoniga eng kamida 1 ta belgi kiriting va"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              </div>
            </div>

            {/* Yil */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yil
              </label>
              <Select value={selectedYear} onChange={(value) => setSelectedYear(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Yil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Aniq qidiruv button */}
            <div className="col-span-2 flex items-end">
              <Button
                variant="outlined"
                className="w-full gap-2 border-gray-400 text-gray-700 hover:bg-gray-50"
              >
                <span className="text-2xl leading-none mb-1">−</span>
                Aniq qidiruv
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content - Empty State */}
        <div className="flex-1 flex items-center justify-center p-12">
          <p className="text-gray-400 text-lg">Hujjatlar mavjud emas</p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          {/* Pagination */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Sahifadagi elementlar: 10</span>
            <div className="flex items-center gap-2">
              <button
                disabled
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="size-5 text-gray-400" />
              </button>
              <span className="text-sm text-gray-600">0 / 0</span>
              <button
                disabled
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="size-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outlined"
              onClick={onClose}
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              Bekor qilish
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Saqlash
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
