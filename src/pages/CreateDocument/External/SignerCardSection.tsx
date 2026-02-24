import React, { useState } from "react";
import { Button, Empty } from "antd";
import { Plus, User, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import EmployeeSelectModal from "@/components/EmployeeSelectModal/EmployeeSelectModal";
import { axiosAPI } from "@/service/axiosAPI";
import { toast } from "react-toastify";
import { useAppSelector } from "@/store/hooks/hooks";

interface Signer {
  id: string;
  name: string;
  position: string;
}

interface IProps {
  orderID: number;
}

const SignerCardSection: React.FC<IProps> = ({ orderID }) => {
  const [signers, setSigners] = useState<Signer[]>([]);
  const [signerAccordionOpen, setSignerAccordionOpen] = useState(true);
  const [signerSelectModalOpen, setSignerSelectModalOpen] = useState(false);

  const { currentUserInfo } = useAppSelector((state) => state.info);

  // handle send for signer
  const handleSendToSigner = async (employeeID: number) => {
    try {
      const response = await axiosAPI.post(`document/orders/${orderID}/send/`, {
        receiver: employeeID,
        movement_type: "in_signing",
        department: Number(currentUserInfo?.department_id),
      });
      if (response.status === 201) {
        toast.success("Hujjat imzolovchiga yuborildi!");
        setSigners((prev) =>
          prev.filter((signer) => signer.id !== String(employeeID)),
        );
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.detail || "Xatolik yuz berdi!");
    }
  };

  const handleAddSigner = (employees: EmployeeType[]) => {
    const newSigners = employees.map((employee) => ({
      id: String(employee.id),
      name: employee.full_name,
      position: employee.position_name,
    }));
    setSigners((prev) => [...prev, ...newSigners]);

    handleSendToSigner(employees[0].id);
  };

  const handleRemoveSigner = (id: string) => {
    setSigners(signers.filter((signer) => signer.id !== id));
  };

  return (
    <>
      <div className="flex flex-col gap-4 bg-white rounded-lg border border-gray-200 p-6">
        {/* Header Section */}
        <div
          className="flex items-center justify-between border-b border-gray-100 pb-4"
          onClick={() => setSignerAccordionOpen((prev) => !prev)}
        >
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900">
              Imzolovchilar ro'yxati
            </h3>
            <p className="text-xs text-gray-500">
              Hujjatni imzolovchi xodimga yuborish
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              type="primary"
              icon={<Plus className="size-4" />}
              onClick={() => setSignerSelectModalOpen(true)}
              className="gap-2"
            >
              Imzolovchi qo'shish
            </Button>

            {signerAccordionOpen ? (
              <ChevronUp className="size-5 text-gray-500" />
            ) : (
              <ChevronDown className="size-5 text-gray-500" />
            )}
          </div>
        </div>

        {/* Cards Grid Section */}
        {signerAccordionOpen && (
          <div className="flex-1">
            {signers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {signers.map((signer) => (
                  <div
                    key={signer.id}
                    className="flex items-start justify-between gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    {/* Left Section - Icon and Info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 mt-1">
                        <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="size-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {signer.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate mt-1">
                          {signer.position}
                        </p>
                      </div>
                    </div>

                    {/* Right Section - Delete Button */}
                    <button
                      onClick={() => handleRemoveSigner(signer.id)}
                      className="flex-shrink-0 mt-1 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="O'chirish"
                      aria-label="Remove signer"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12">
                <Empty
                  description="Imzolovchilar qo'shilmadi"
                  style={{
                    color: "var(--text-tertiary, #ccc)",
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Signer Select Modal */}
      {signerSelectModalOpen && (
        <EmployeeSelectModal
          onClose={() => setSignerSelectModalOpen(false)}
          onSelect={handleAddSigner}
          selectionType="single"
        />
      )}
    </>
  );
};

export default SignerCardSection;
