import { 
  User, 
  X,
  FileText as FileTextIcon,
  MessageSquare,
  ArrowLeft,
  ArrowDown,
  Download,
  Eye
} from 'lucide-react';

interface IjroHarakatiModalProps {
  isOpen: boolean;
  onClose: () => void;
  steps?: IjroStep[];
  currentEmployee?: string;
}

export interface IjroStep {
  id: string;
  fromEmployee?: string;
  fromPosition?: string;
  fromDepartment?: string;
  employee: string;
  position: string;
  department: string;
  action: string;
  date: string;
  status: 'sent' | 'completed' | 'pending';
  comment?: string; // Izoh
  attachedFile?: { // Biriktirgan fayl
    name: string;
    url?: string;
    type: string;
    size?: string;
  };
}

const IjroHarakatiModal: React.FC<IjroHarakatiModalProps> = ({ isOpen, onClose, steps = [], currentEmployee }) => {
  if (!isOpen) return null;

  const defaultSteps: IjroStep[] = [
    {
      id: '1',
      employee: 'Aliyev J.N.',
      position: 'Bosh mutaxassis',
      department: 'Moliya bo\'limi',
      action: 'Yaratildi',
      date: '28 yan 2026, 09:15',
      status: 'completed'
    },
    {
      id: '2',
      fromEmployee: 'Aliyev J.N.',
      fromPosition: 'Bosh mutaxassis',
      fromDepartment: 'Moliya bo\'limi',
      employee: 'Rahimov Sardor',
      position: 'Direktor',
      department: 'Rahbariyat',
      action: 'Ijro uchun',
      date: '11 fev 2026, 23:05',
      status: 'sent'
    }
  ];

  const displaySteps = steps.length > 0 ? steps : defaultSteps;

  const getCurrentHolder = () => {
    if (currentEmployee) return currentEmployee;
    const lastStep = [...displaySteps].reverse().find(s => s.status === 'sent' || s.status === 'pending');
    return lastStep ? lastStep.employee : displaySteps[displaySteps.length - 1]?.employee;
  };

  const holderName = getCurrentHolder();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
            >
              <ArrowLeft className="size-4" />
            </button>
            <h3 className="text-base font-semibold text-gray-900">Ijro harakati</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 60px)' }}>
          <div className="space-y-0">
            {displaySteps.map((step, index) => {
              const isLast = index === displaySteps.length - 1;
              const isCurrent = step.employee === holderName && (step.status === 'sent' || step.status === 'pending');
              const nextStep = displaySteps[index + 1];
              
              return (
                <div key={step.id}>
                  {/* Yuborgan xodim (fromEmployee) */}
                  {step.fromEmployee && (
                    <>
                      <div className="flex items-center justify-between py-3">
                        {/* Chap: Xodim */}
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 size-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="size-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{step.fromEmployee}</p>
                            {step.fromPosition && <p className="text-xs text-gray-500">{step.fromPosition}</p>}
                            {step.fromDepartment && <p className="text-xs text-gray-400">{step.fromDepartment}</p>}
                          </div>
                        </div>

                        {/* O'ng: Yuborilgan sana - QIZIL KATAK */}
                        <div className="border-2 border-red-500 rounded px-3 py-1.5 bg-white">
                          <p className="text-xs text-gray-900 whitespace-nowrap">{step.date}</p>
                        </div>
                      </div>

                      {/* Qizil strelka pastga + maqsad */}
                      <div className="flex items-center justify-start pl-5 py-2">
                        <ArrowDown className="size-6 text-red-500" strokeWidth={3} />
                        <span className="ml-2 text-xs font-medium text-gray-600">{step.action}</span>
                      </div>

                      {/* Fayl (agar biriktirilgan bo'lsa) - Strelka va xodim o'rtasida */}
                      {step.attachedFile && (
                        <div className="pl-5 pb-3">
                          <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 inline-flex items-center gap-3">
                            <div className="flex-shrink-0 size-10 bg-red-600 rounded flex items-center justify-center">
                              <span className="text-white text-xs font-bold">PDF</span>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-900">{step.attachedFile.name}</p>
                              {step.attachedFile.size && <p className="text-xs text-gray-500">{step.attachedFile.size}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="text-blue-600 hover:text-blue-700">
                                <Eye className="size-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-700">
                                <Download className="size-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Izoh (agar kiritilgan bo'lsa) - Fayl ostida */}
                      {step.comment && (
                        <div className="pl-5 pb-3">
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="size-4 text-yellow-600 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-yellow-800">Izoh:</p>
                                <p className="text-sm text-yellow-900">{step.comment}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Qabul qilgan xodim (employee) - HOZIRGI */}
                  <div className={`flex items-center justify-between py-3 ${isCurrent ? 'bg-blue-50 -mx-4 px-4 py-4 rounded-lg' : ''}`}>
                    {/* Chap: Xodim */}
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 size-10 rounded-full flex items-center justify-center ${isCurrent ? 'bg-blue-500 animate-pulse ring-4 ring-blue-300' : 'bg-blue-500'}`}>
                        <User className="size-5 text-white" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isCurrent ? 'text-blue-900' : 'text-gray-900'}`}>{step.employee}</p>
                        {step.position && <p className="text-xs text-gray-500">{step.position}</p>}
                        {step.department && <p className="text-xs text-gray-400">{step.department}</p>}
                      </div>
                    </div>

                    {/* O'ng: Agar keyingi qadam bo'lsa, yuborilgan sana - QIZIL KATAK */}
                    {nextStep && (
                      <div className="border-2 border-red-500 rounded px-3 py-1.5 bg-white">
                        <p className="text-xs text-gray-900 whitespace-nowrap">{nextStep.date}</p>
                      </div>
                    )}
                  </div>

                  {/* Agar oxirgi emas bo'lsa va keyingi qadam bo'lsa - strelka */}
                  {!isLast && nextStep && (
                    <div className="flex items-center justify-start pl-5 py-2">
                      <ArrowDown className="size-6 text-red-500" strokeWidth={3} />
                      <span className="ml-2 text-xs font-medium text-gray-600">{nextStep.action}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IjroHarakatiModal;