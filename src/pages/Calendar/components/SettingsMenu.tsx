// import { Button } from '@/app/components/ui/button';
import { Button } from 'antd';
import { X, Monitor, Sun, Moon } from 'lucide-react';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'auto' | 'light' | 'dark';
  onThemeChange: (theme: 'auto' | 'light' | 'dark') => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, onClose, theme, onThemeChange }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed right-4 top-20 w-80 bg-white rounded-lg shadow-2xl z-50 border border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Sozlamalar</h3>
          <Button variant="outlined" size="small" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Theme Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Rang rejimi
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => onThemeChange('auto')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'auto'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Monitor className={`size-6 mx-auto mb-2 ${
                  theme === 'auto' ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <p className={`text-sm font-medium ${
                  theme === 'auto' ? 'text-blue-700' : 'text-gray-900'
                }`}>Avto</p>
              </button>
              <button
                onClick={() => onThemeChange('light')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Sun className={`size-6 mx-auto mb-2 ${
                  theme === 'light' ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <p className={`text-sm font-medium ${
                  theme === 'light' ? 'text-blue-700' : 'text-gray-900'
                }`}>Yorqin</p>
              </button>
              <button
                onClick={() => onThemeChange('dark')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Moon className={`size-6 mx-auto mb-2 ${
                  theme === 'dark' ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-blue-700' : 'text-gray-900'
                }`}>Qora</p>
              </button>
            </div>
            
            {/* Description */}
            <p className="mt-4 text-xs text-gray-500 leading-relaxed">
              {theme === 'auto' && 'Tizim sozlamalariga moslashadi'}
              {theme === 'light' && 'Yorqin rang rejimi faollashtirilgan'}
              {theme === 'dark' && 'Qora rang rejimi faollashtirilgan'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingsMenu;