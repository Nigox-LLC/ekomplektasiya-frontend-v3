
import React, { useState } from "react";
import { axiosAPI } from "@/service/axiosAPI";

interface AgreementModalProps {
  baseUrl: string;
  orderId: number; // agar backend order id kutsa
  onSuccess?: () => void;
}

const AgreementModal: React.FC<AgreementModalProps> = ({
  baseUrl,
  orderId,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [isAgreement, setIsAgreement] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert("Iltimos izoh kiriting");
      return;
    }

    try {
      setLoading(true);

      await axiosAPI.post(
        `/document/orders/${orderId}/agreement/`,
        {
          description,
          is_agreement: isAgreement,
        }
      )

      setOpen(false);
      setDescription("");
      setIsAgreement(true);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Open Button */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Kelishish
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          ></div>

          {/* Modal Box */}
          <div className="relative bg-white w-[450px] rounded-2xl shadow-2xl p-6 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Kelishish haqida
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            {/* Textarea */}
            <textarea
              placeholder="Izoh kiriting..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-24 mb-4"
            />

            {/* Radio buttons */}
            <div className="flex gap-6 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={isAgreement === true}
                  onChange={() => setIsAgreement(true)}
                />
                Roziman
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={isAgreement === false}
                  onChange={() => setIsAgreement(false)}
                />
                Rozi emasman
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Bekor qilish
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgreementModal;