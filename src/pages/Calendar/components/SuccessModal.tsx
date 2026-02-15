import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  duration?: number; // milliseconds
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, message, onClose, duration = 2000 }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-[60] flex items-center justify-center p-8 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in slide-in-from-bottom-4 duration-300">
        <div className="flex flex-col items-center text-center">
          {/* Success Icon - Yashil Pitichka */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-ping"></div>
            <div className="relative bg-green-500 rounded-full p-4">
              <CheckCircle className="size-16 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Success Message */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Muvaffaqiyatli!
          </h3>
          <p className="text-gray-600 text-lg">
            {message}
          </p>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-200 rounded-full mt-6 overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full animate-progress"
              style={{
                animation: `progress ${duration}ms linear forwards`
              }}
            ></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

export default SuccessModal;