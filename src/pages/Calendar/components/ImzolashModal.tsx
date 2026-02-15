import { useState } from 'react';
import { X, Key, CheckCircle, Loader2, HardDrive } from 'lucide-react';
import { Badge, Button } from 'antd';
// import { Button } from './ui/button';
// import { Badge } from './ui/badge';
import { IjroStep } from './IjroHarakatiModal';

interface ImzolashModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentNumber?: string;
  onSuccess?: () => void;
  onAddStep?: (step: IjroStep) => void; // Ijro qadamiga qo'shish
}

interface EriKey {
  id: string;
  name: string;
  inn: string;
  organization: string;
  validFrom: string;
  validTo: string;
  serialNumber: string;
  type: 'JISMONIY_SHAXS' | 'YURIDIK_SHAXS';
}

export function ImzolashModal({ isOpen, onClose, documentNumber, onSuccess, onAddStep }: ImzolashModalProps) {
  const [selectedKey, setSelectedKey] = useState<EriKey | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [step, setStep] = useState<'select' | 'loading' | 'success'>('select');

  // Mock ERI kalitlar ro'yxati
  const mockKeys: EriKey[] = [
    {
      id: '1',
      name: 'Karimov Aziz Shavkatovich',
      inn: '123456789012',
      organization: 'O\'zbekiston Respublikasi Moliya vazirligi',
      validFrom: '01.01.2024',
      validTo: '01.01.2027',
      serialNumber: '01AA234567',
      type: 'YURIDIK_SHAXS'
    },
    {
      id: '2',
      name: 'Rahmonov Jamshid Alievich',
      inn: '987654321098',
      organization: 'Jismoniy shaxs',
      validFrom: '15.03.2024',
      validTo: '15.03.2027',
      serialNumber: '02BB789012',
      type: 'JISMONIY_SHAXS'
    },
    {
      id: '3',
      name: 'Toshmatov Sardor Bekovich',
      inn: '456789123456',
      organization: 'Toshkent shahar hokimligi',
      validFrom: '10.02.2024',
      validTo: '10.02.2027',
      serialNumber: '03CC345678',
      type: 'YURIDIK_SHAXS'
    }
  ];

  const handleSign = async () => {
    if (!selectedKey) return;

    setStep('loading');
    setIsLoading(true);

    // Simulyatsiya - 2 soniya kutish
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);
    setIsSigned(true);
    setStep('success');

    // Ijro qadamiga qo'shish
    if (onAddStep) {
      const now = new Date();
      const formattedDate = `${now.getDate()} ${['yan', 'fev', 'mart', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek'][now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const step: IjroStep = {
        id: Date.now().toString(),
        employee: selectedKey.name,
        position: 'Imzolovchi',
        department: selectedKey.organization,
        action: 'Imzolandi',
        date: formattedDate,
        status: 'completed',
        comment: `ERI kalit: ${selectedKey.serialNumber}`
      };
      onAddStep(step);
    }

    // 2 soniyadan keyin muvaffaqiyatli yopish
    setTimeout(() => {
      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setSelectedKey(null);
    setIsLoading(false);
    setIsSigned(false);
    setStep('select');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Key className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Elektron raqamli imzo</h2>
              <p className="text-sm text-red-100">DSKEYS - E-IMZO 3.0</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors disabled:opacity-50"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'select' && (
            <>
              {/* Hujjat ma'lumotlari */}
              {documentNumber && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <HardDrive className="size-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">Imzolash uchun hujjat:</p>
                      <p className="text-sm text-blue-700">{documentNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Kalitlar ro'yxati */}
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Kalitni tanlang:</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {mockKeys.map((key) => (
                    <button
                      key={key.id}
                      onClick={() => setSelectedKey(key)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedKey?.id === key.id
                          ? 'border-red-600 bg-red-50 shadow-md'
                          : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Ism */}
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{key.name}</h4>
                            <Badge className={
                              key.type === 'YURIDIK_SHAXS'
                                ? 'bg-blue-100 text-blue-700 border-blue-300 text-xs'
                                : 'bg-green-100 text-green-700 border-green-300 text-xs'
                            }>
                              {key.type === 'YURIDIK_SHAXS' ? 'Yuridik shaxs' : 'Jismoniy shaxs'}
                            </Badge>
                          </div>

                          {/* Ma'lumotlar */}
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">INN:</span>
                              <span className="ml-2 text-gray-900 font-medium">{key.inn}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Seriya:</span>
                              <span className="ml-2 text-gray-900 font-medium">{key.serialNumber}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-500">Tashkilot:</span>
                              <span className="ml-2 text-gray-900">{key.organization}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Amal qiladi:</span>
                              <span className="ml-2 text-gray-900">{key.validFrom} - {key.validTo}</span>
                            </div>
                          </div>
                        </div>

                        {/* Checkbox */}
                        <div className={`size-6 rounded-full border-2 flex items-center justify-center ${
                          selectedKey?.id === key.id
                            ? 'border-red-600 bg-red-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedKey?.id === key.id && (
                            <CheckCircle className="size-5 text-white" fill="white" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tugmalar */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  className="px-6"
                >
                  Bekor qilish
                </Button>
                <Button
                  onClick={handleSign}
                  disabled={!selectedKey}
                  className="gap-2 bg-red-600 hover:bg-red-700 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Key className="size-4" />
                  Imzolash
                </Button>
              </div>
            </>
          )}

          {step === 'loading' && (
            <div className="py-12 text-center">
              <Loader2 className="size-16 text-red-600 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Imzo qo'yilmoqda...</h3>
              <p className="text-gray-500">Iltimos kuting, hujjat imzolanmoqda</p>
              {selectedKey && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4 inline-block">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">{selectedKey.name}</span> kaliti bilan
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 text-center">
              <div className="size-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="size-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Muvaffaqiyatli imzolandi!</h3>
              <p className="text-gray-500 mb-4">Hujjat elektron raqamli imzo bilan imzolandi</p>
              {selectedKey && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">{selectedKey.name}</span>
                  </p>
                  <p className="text-xs text-green-600 mt-1">INN: {selectedKey.inn}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}