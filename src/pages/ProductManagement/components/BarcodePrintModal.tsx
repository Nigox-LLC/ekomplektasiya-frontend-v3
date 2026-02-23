import React from "react";
import { X, Printer } from "lucide-react";
import { Button } from "antd";

interface DetailProduct {
  id?: string;
  productName?: string;
  name?: string;
  barcode: string;
  shouldPrint?: boolean;
  printCount: number;
}

interface BarcodePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: DetailProduct[];
}
const BarcodePrintModal: React.FC<BarcodePrintModalProps> = ({ isOpen, onClose, products,}) => {

  if (!isOpen) return null;

  // Filter products that should be printed
  const printableProducts = products.filter(p => p.barcode && p.printCount > 0);

  // Generate labels - repeat each product by printCount
  const labels: Array<{ productName: string; barcode: string }> = [];
  printableProducts.forEach(product => {
    for (let i = 0; i < product.printCount; i++) {
      labels.push({
        productName: product.productName || product.name || "Nomsiz",
        barcode: product.barcode,
      });
    }
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-purple-50 to-white print:hidden">
          <h3 className="text-lg font-bold text-gray-900">Shtrix kod chop etish - Rulon etiketka</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Labels Preview */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 custom-scrollbar-barcode">
          <div className="space-y-1">
            {labels.map((label, index) => (
              <div
                key={index}
                className="bg-white border-2 border-dashed border-gray-300 p-4 rounded-lg"
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  margin: "0 auto",
                  pageBreakAfter: "always",
                  pageBreakInside: "avoid",
                }}
              >
                {/* Label Number */}
                <div className="text-right text-[9px] text-gray-400 mb-2">
                  {index + 1}
                </div>

                {/* Product Name */}
                <div className="text-center mb-3">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">
                    {label.productName}
                  </h4>
                </div>

                {/* Barcode Visualization */}
                <div className="bg-white p-2 rounded border border-gray-200">
                  {/* Barcode bars visualization */}
                  <svg
                    viewBox="0 0 200 60"
                    className="w-full h-auto"
                    style={{ maxHeight: "80px" }}
                  >
                    {/* Generate barcode pattern from digits */}
                    {label.barcode.split("").map((digit, idx) => {
                      const patterns = [
                        [3, 2, 1, 1], // 0
                        [2, 2, 2, 1], // 1
                        [2, 1, 2, 2], // 2
                        [1, 4, 1, 1], // 3
                        [1, 1, 3, 2], // 4
                        [1, 2, 3, 1], // 5
                        [1, 1, 1, 4], // 6
                        [1, 3, 1, 2], // 7
                        [1, 2, 1, 3], // 8
                        [3, 1, 1, 2], // 9
                      ];
                      const pattern = patterns[parseInt(digit)] || patterns[0];
                      const xBase = idx * (200 / label.barcode.length);
                      const width = 200 / label.barcode.length;
                      
                      return (
                        <g key={idx}>
                          {pattern.map((bar, barIdx) => (
                            <rect
                              key={barIdx}
                              x={xBase + (barIdx * width) / 4}
                              y="0"
                              width={(bar * width) / 10}
                              height="50"
                              fill={barIdx % 2 === 0 ? "#000" : "#fff"}
                            />
                          ))}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Barcode Number */}
                  <div className="text-center mt-1">
                    <p className="text-xs font-mono font-semibold text-gray-900 tracking-wider">
                      {label.barcode}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {labels.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-sm">
                Chop etish uchun mahsulotlar topilmadi
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Jadvalda "Chop etish" tugmasini yoqing va "Chop soni" kiriting
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white print:hidden flex-shrink-0">
          <div className="text-sm text-gray-600">
            Jami etiketkalar: <span className="font-bold text-gray-900">{labels.length} ta</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outlined" onClick={onClose}>
              Yopish
            </Button>
            <Button
              onClick={handlePrint}
              disabled={labels.length === 0}
              className="gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              <Printer className="size-4" />
              Chop etish
            </Button>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        .custom-scrollbar-barcode::-webkit-scrollbar {
          width: 10px;
        }
        
        .custom-scrollbar-barcode::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 5px;
        }
        
        .custom-scrollbar-barcode::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #a855f7 0%, #9333ea 100%);
          border-radius: 5px;
        }
        
        .custom-scrollbar-barcode::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #9333ea 0%, #7e22ce 100%);
        }

        @media print {
          @page {
            size: 100mm 50mm;
            margin: 0;
          }
          
          body * {
            visibility: hidden;
          }
          
          .custom-scrollbar-barcode,
          .custom-scrollbar-barcode * {
            visibility: visible;
          }
          
          .custom-scrollbar-barcode {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            overflow: visible !important;
            background: white !important;
          }
          
          .custom-scrollbar-barcode > div > div {
            border: none !important;
            margin: 0 !important;
            padding: 5mm !important;
            max-width: 100mm !important;
            width: 100mm !important;
            page-break-after: always;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}

export default BarcodePrintModal;