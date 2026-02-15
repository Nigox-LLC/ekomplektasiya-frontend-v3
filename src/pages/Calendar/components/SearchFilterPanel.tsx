import { Button, Input } from 'antd';
import { X, Search, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface SearchFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (filters: { kirishRaqami: string; kalitSozi: string; jonatuvchi: string }) => void;
}

const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({ isOpen, onClose, onSearch }) => {
  const [kirishRaqami, setKirishRaqami] = useState('');
  const [kalitSozi, setKalitSozi] = useState('');
  const [jonatuvchi, setJonatuvchi] = useState('');

  if (!isOpen) return null;

  const handleClear = () => {
    setKirishRaqami('');
    setKalitSozi('');
    setJonatuvchi('');
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch({ kirishRaqami, kalitSozi, jonatuvchi });
    }
    console.log('Qidiruv:', { kirishRaqami, kalitSozi, jonatuvchi });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        {/* QIDIRISH sarlavhasi */}
        <h3 className="text-base font-bold text-gray-900 uppercase">Qidirish</h3>

        {/* Chiqish strelkasi - qora rang */}
        <button
          onClick={onClose}
          className="flex items-center justify-center size-9 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="size-6 text-gray-900" strokeWidth={2.5} />
        </button>
      </div>

      {/* Filter inputs */}
      <div className="space-y-4">
        {/* Kirish raqami */}
        <Input
          type="text"
          placeholder="Kirish raqami"
          value={kirishRaqami}
          onChange={(e) => setKirishRaqami(e.target.value)}
          className="h-12 text-base bg-gray-50 border-gray-200"
        />

        {/* Kalit so'zi */}
        <Input
          type="text"
          placeholder="Kalit so'zi"
          value={kalitSozi}
          onChange={(e) => setKalitSozi(e.target.value)}
          className="h-12 text-base bg-gray-50 border-gray-200"
        />

        {/* Jo'natuvchi tashkilot */}
        <Input
          type="text"
          placeholder="Jo'natuvchi tashkilot"
          value={jonatuvchi}
          onChange={(e) => setJonatuvchi(e.target.value)}
          className="h-12 text-base bg-gray-50 border-gray-200"
        />

        {/* Tugmalar */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Qidirish tugmasi */}
          <Button 
            onClick={handleSearchClick}
            className="h-12 bg-gray-900 hover:bg-gray-800 text-white text-base font-medium"
          >
            <Search className="size-5 mr-2" />
            Qidirish
          </Button>

          {/* Tozalash tugmasi */}
          <Button 
            onClick={handleClear}
            variant="outlined"
            className="h-12 border-2 border-gray-300 hover:bg-gray-50 text-base font-medium"
          >
            <X className="size-5 mr-2" />
            Tozalash
          </Button>
        </div>
      </div>
    </div>
  );
}
export default SearchFilterPanel;