import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { toast } from "react-toastify";
import { axiosAPI } from "@/service/axiosAPI";
import ProductsStep from "./Steps/ProductsStep";
import CommercialOffersStep from "./Steps/CommercialOffersStep";
import SignatoriesStep from "./Steps/SignatoriesStep";
import PriceAnalysisStep from "./Steps/PriceAnalysisStep";

// Types (shared with steps)
export interface IDname {
  id: number;
  name: string;
}

export interface Product {
  id: number;                     // order_product id
  product_name: string;
  quantity: number;               // available quantity (from API)
  price_analysis_quantity: number;
  product_type: IDname | null;
  product_model: IDname | null;
  unit: IDname | null;
  size: IDname | null;
  comment: string;
  // added for selection
  selectedQuantity: number;       // how many we plan to use
}

export interface CommercialOffer {
  id: number;
  number: string;
  date: string;                   // ISO
  organization: string;
  stir: string;
  delivery_day: number;
  delivery_condition_name: string | null;
  employee_name: string | null;
  org_info_name: string | null;
  stat_name: string | null;
  file_name: string | null;
}

export interface AttachInfo {
  [offerId: number]: { productId: number; price: number }[];
}

export interface Staff {
  id: number;
  full_name: string;
  position: string;
}

export interface SelectedSigner extends Staff {
  signed_at?: string;
}

export interface PriceAnalysisFormData {
  number: string;                  // document number (required)
  products: Product[];
  commercials: CommercialOffer[];
  attachments: AttachInfo;         // mapping: offerId -> list of {productId, price}
  executors: SelectedSigner[];
  id?: string | number;            // for edit mode
  is_approved?: boolean;
}

interface PriceAnalysisFormProps {
  setIsCreateFormModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isCreateFormModalOpen?: boolean;
  isEditMode?: boolean;
  priceAnalysisId?: string | number;
}

const PriceAnalysisForm: React.FC<PriceAnalysisFormProps> = ({
  setIsCreateFormModalOpen,
  isEditMode = false,
  priceAnalysisId,
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PriceAnalysisFormData>({
    number: "",
    products: [],
    commercials: [],
    attachments: {},
    executors: [],
  });

  // Fetch details if editing
  useEffect(() => {
    if (isEditMode && priceAnalysisId) {
      fetchDetail();
    }
  }, [isEditMode, priceAnalysisId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await axiosAPI.get(`/document/analysis/${priceAnalysisId}/`);
      const data = response.data;
      // Transform API response to our form structure
      // data: { id, number, items, signs, file, is_signed, employee_name, created_at }
      const products: Product[] = data.items.map((item: any) => ({
        id: item.order_product,
        product_name: item.order_product_name,
        quantity: item.quantity, // ?? careful: item.quantity is the used quantity, not available
        price_analysis_quantity: item.quantity, // we may not have available quantity here
        product_type: null, // these are not returned in detail? We'll need to fetch separately if needed
        product_model: null,
        unit: null,
        size: null,
        comment: "",
        selectedQuantity: item.quantity,
      }));
      // Build attachments: for each item, we have commercials list with price
      const attachments: AttachInfo = {};
      data.items.forEach((item: any) => {
        item.commercials.forEach((com: any) => {
          if (!attachments[com.commercial.id]) attachments[com.commercial.id] = [];
          attachments[com.commercial.id].push({
            productId: item.order_product,
            price: com.price,
          });
        });
      });
      // Commercials: need full list? Possibly we have to fetch them separately.
      // For now, we'll set empty and let user re-fetch.
      const executors: SelectedSigner[] = data.signs.map((s: any) => ({
        id: s.employee.id,
        full_name: s.employee.full_name,
        position: "", // not provided in sign? We'll leave empty
        signed_at: s.signed_date,
      }));
      setFormData({
        number: data.number,
        products,
        commercials: [], // will need to load from /commercial/ later if needed
        attachments,
        executors,
        id: data.id,
        is_approved: data.is_signed,
      });
    } catch (error) {
      toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const stepTitles: Record<1 | 2 | 3 | 4, { title: string; subtitle: string }> = {
    1: { title: "Yangi narx tahlili yaratish", subtitle: "Tovarlar - Qadam 1/4" },
    2: { title: "Yangi narx tahlili yaratish", subtitle: "Tijoriy takliflar - Qadam 2/4" },
    3: { title: "Yangi narx tahlili yaratish", subtitle: "Imzolovchilar - Qadam 3/4" },
    4: { title: "Yangi narx tahlili yaratish", subtitle: "Narx tahlili - Qadam 4/4" },
  };

  const nextStep = () => setCurrentStep((s) => (s < 4 ? (s + 1) as 1 | 2 | 3 | 4 : s));
  const prevStep = () => setCurrentStep((s) => (s > 1 ? (s - 1) as 1 | 2 | 3 | 4 : s));
  const closeForm = () => {
    if (setIsCreateFormModalOpen) setIsCreateFormModalOpen(false);
    else navigate("/price-analysis");
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: return formData.products.length > 0;
      case 2: return formData.commercials.length > 0 && Object.keys(formData.attachments).length > 0;
      case 3: return formData.executors.length > 0;
      default: return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.warning("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }
    nextStep();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <span className="ml-3 text-gray-600">Ma'lumotlar yuklanmoqda...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl w-full flex flex-col min-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {stepTitles[currentStep].title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {stepTitles[currentStep].subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Document number input */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Hujjat raqami:</span>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="border rounded px-2 py-1 text-sm w-32"
              placeholder="0001"
            />
          </div>
          <button onClick={closeForm} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Step indicator */}
      <div className="px-4 py-2 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step === currentStep
                    ? "bg-blue-600 text-white"
                    : step < currentStep
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }
                `}
              >
                {step < currentStep ? <Check className="w-4 h-4" /> : step}
              </div>
              <span
                className={`ml-2 text-sm ${
                  step === currentStep
                    ? "text-blue-600 font-medium"
                    : step < currentStep
                      ? "text-green-600"
                      : "text-gray-500"
                }`}
              >
                {step === 1 && "Tovarlar"}
                {step === 2 && "Tijoriy takliflar"}
                {step === 3 && "Imzolovchilar"}
                {step === 4 && "Narx tahlili"}
              </span>
              {step < 4 && (
                <div
                  className={`w-12 h-0.5 mx-3 ${
                    step < currentStep ? "bg-green-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 p-4 overflow-auto">
        {currentStep === 1 && (
          <ProductsStep formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 2 && (
          <CommercialOffersStep formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 3 && (
          <SignatoriesStep formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 4 && (
          <PriceAnalysisStep
            formData={formData}
            setFormData={setFormData}
            isEditMode={isEditMode}
            priceAnalysisId={priceAnalysisId}
          />
        )}
      </div>

      {/* Footer navigation */}
      <div className="flex items-center justify-between p-4 border-t bg-gray-50">
        <div>
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Orqaga
            </button>
          )}
        </div>
        <div>
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              Davom etish <ChevronRight className="w-4 h-4" />
            </button>
          ) : null /* Step 4 has its own buttons inside */}
        </div>
      </div>
    </div>
  );
};

export default PriceAnalysisForm;