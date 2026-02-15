import { useState, useEffect } from 'react';
// import { Button } from '@/app/components/ui/button';
// import { Input } from '@/app/components/ui/input';
import { X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { IjroStep } from './IjroHarakatiModal';
import { Button } from 'antd';

interface KelishishModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentNumber?: string;
  documentId?: string;
  status: AgreementStatus;
  setStatus: (status: AgreementStatus) => void;
  onAddStep?: (step: IjroStep) => void; // Ijro qadamiga qo'shish
}

type AgreementStatus = 'roziman' | 'rozi-emasman' | 'qisman' | null;

export function KelishishModal({ isOpen, onClose, documentNumber, documentId, status, setStatus, onAddStep }: KelishishModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<AgreementStatus>(status);
  const [comment, setComment] = useState('');

  // Modal ochilganda avval tanlangan statusni ko'rsatish
  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(status);
    }
  }, [isOpen, status]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedStatus) {
      alert('Iltimos, kelishuv holatini tanlang!');
      return;
    }
    
    // Statusni saqlash
    setStatus(selectedStatus);

    // Ijro qadamiga qo'shish
    if (onAddStep) {
      const now = new Date();
      const formattedDate = `${now.getDate()} ${['yan', 'fev', 'mart', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek'][now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const getActionText = () => {
        switch (selectedStatus) {
          case 'roziman': return 'Kelishilgan';
          case 'rozi-emasman': return 'Kelishilmagan';
          case 'qisman': return 'Qisman kelishilgan';
          default: return 'Kelishish';
        }
      };

      const step: IjroStep = {
        id: Date.now().toString(),
        employee: 'Joriy xodim', // Bu yerda haqiqiy xodim ma'lumotlari bo'ladi
        position: 'Lavozim',
        department: 'Bo\'lim',
        action: getActionText(),
        date: formattedDate,
        status: 'completed',
        comment: comment || undefined
      };
      onAddStep(step);
    }

    // Modal yopiladi va ma'lumotlar tozalanadi
    setComment('');
    onClose();
  };

  const handleStatusSelect = (status: AgreementStatus) => {
    setSelectedStatus(status);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Kelishish</h2>
            <p className="text-sm text-gray-600 mt-1">
              {documentNumber ? `Hujjat: ${documentNumber}` : 'Hujjat bilan kelishish'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="size-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Kelishuv holati *
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(['roziman', 'rozi-emasman', 'qisman'] as const).map((status) => {
                const config = getStatusConfig(status);
                if (!config) return null;

                const Icon = config.icon;
                const isSelected = selectedStatus === status;

                return (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`
                      relative p-4 rounded-lg border-2 transition-all duration-200
                      ${isSelected 
                        ? `${config.borderColor} ${config.selectedBg}` 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                      }
                      ${config.hoverBg}
                    `}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Icon 
                        className={`size-10 ${
                          isSelected ? config.iconColor : 'text-gray-400'
                        }`}
                        strokeWidth={2}
                      />
                      <span className={`text-sm font-semibold ${
                        isSelected ? config.textColor : 'text-gray-600'
                      }`}>
                        {config.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Izoh (ixtiyoriy)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Kelishuv bo'yicha izoh yoki taklif kiriting..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            />
          </div>

          {selectedStatus && (
            <div className={`p-4 rounded-lg border-2 ${getStatusConfig(selectedStatus)?.borderColor} ${getStatusConfig(selectedStatus)?.bgColor}`}>
              <div className="flex items-start gap-3">
                {(() => {
                  const config = getStatusConfig(selectedStatus);
                  if (!config) return null;
                  const Icon = config.icon;
                  return <Icon className={`size-6 ${config.iconColor} flex-shrink-0 mt-0.5`} />;
                })()}
                <div>
                  <p className={`text-sm font-semibold ${getStatusConfig(selectedStatus)?.textColor}`}>
                    Siz "{getStatusConfig(selectedStatus)?.label}" holatini tanladingiz
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {selectedStatus === 'roziman' && 'Hujjat bilan to\'liq rozisiz.'}
                    {selectedStatus === 'rozi-emasman' && 'Hujjat bilan rozi emasligingizni bildirdingiz.'}
                    {selectedStatus === 'qisman' && 'Hujjat bilan qisman rozisiz. Izoh qoldirishingiz tavsiya etiladi.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outlined"
            onClick={onClose}
            className="border-2"
          >
            Bekor qilish
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedStatus}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <CheckCircle className="size-4 mr-2" />
            Tasdiqlash
          </Button>
        </div>
      </div>
    </div>
  );
}

function getStatusConfig(status: AgreementStatus) {
  const configs = {
    'roziman': {
      label: 'Raziman',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      textColor: 'text-green-700',
      borderColor: 'border-green-600',
      bgColor: 'bg-green-50',
      selectedBg: 'bg-green-50',
      hoverBg: 'hover:bg-green-50'
    },
    'rozi-emasman': {
      label: 'Roziemasman',
      icon: XCircle,
      iconColor: 'text-red-600',
      textColor: 'text-red-700',
      borderColor: 'border-red-600',
      bgColor: 'bg-red-50',
      selectedBg: 'bg-red-50',
      hoverBg: 'hover:bg-red-50'
    },
    'qisman': {
      label: 'Qisman roziman',
      icon: AlertCircle,
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-600',
      bgColor: 'bg-yellow-50',
      selectedBg: 'bg-yellow-50',
      hoverBg: 'hover:bg-yellow-50'
    },
  };

  return status ? configs[status] : null;
}