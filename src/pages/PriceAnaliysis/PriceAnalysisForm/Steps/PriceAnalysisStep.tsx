import React, { useState, useEffect, useCallback } from "react";
import { Download, RefreshCw, PenLine, CheckCircle } from "lucide-react";
import { Button, Modal } from "antd";
import { toast } from "react-toastify";
import { axiosAPI } from "@/service/axiosAPI";
import FilePreviewer from "@/components/FilePreviewer/FilePreviewer";
import DeleteAlertDialog from "@/components/DeleteAlertDialog";
import SigningModal from "@/pages/Letters/components/Detail/SigningModal";
import { arrayBufferToFile, inferMimeFromExt } from "@/utils/file_preview";
import type { PriceAnalysisFormData } from "../PriceAnalysisForm";

interface PriceAnalysisStepProps {
  formData: PriceAnalysisFormData;
  setFormData: React.Dispatch<React.SetStateAction<PriceAnalysisFormData>>;
  isEditMode?: boolean;
  priceAnalysisId?: string | number;
}

const PriceAnalysisStep: React.FC<PriceAnalysisStepProps> = ({
  formData,
  setFormData,
  isEditMode = false,
  priceAnalysisId,
}) => {
  const [letterFile, setLetterFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ confirm dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [fileURL, setFileURL] = useState("");
  const [eImzoOpen, setEImzoOpen] = useState(false);
  const [refreshModal, setRefreshModal] = useState(false);

  const resolvedId = formData.id || priceAnalysisId || "";

  const resolveFileUrl = useCallback((url: string) => {
    if (!url) return url;
    try {
      const parsed = new URL(url, window.location.origin);
      return parsed.toString();
    } catch {
      return url;
    }
  }, []);

  const pickUrlFromGenerate = (data: any): string => {
    return (
      (Array.isArray(data?.message) ? data.message[0] : "") ||
      data?.file_url ||
      data?.file ||
      ""
    );
  };

  const getFileByURL = useCallback(
    async (url: string) => {
      if (!url) return;
      try {
        const resolved = resolveFileUrl(url);
        console.log(resolved)
        const response = await fetch(resolved, { cache: "no-store" });
        const fileName = resolved.split("?")[0].split("/").pop() || "file";
        const arrayBuffer = await response.arrayBuffer();
        const mime = inferMimeFromExt(fileName) || "application/octet-stream";
        setLetterFile(arrayBufferToFile(arrayBuffer, fileName, mime));
      } catch (e) {
        console.log(e);
        toast.error("Faylni yuklab bo‘lmadi");
      }
    },
    [resolveFileUrl]
  );

  // ✅ generate -> pdf url olib preview ko'rsatish
  const fetchFile = async (id: string | number) => {
    if (!id) return;
    try {
      const response = await axiosAPI.post(`/document/analysis/${id}/generate/`);
      if (response.status === 200) {
        const url = response.data.message[0];
        console.log(url)
        if (url) {
          setFileURL(url);
          await getFileByURL(url);
        }
      }
    } catch (error) {
      console.error("Failed to fetch file", error);
    }
  };

  // ID bo'lsa — generate qilib ko'rsatamiz (4-qadamga kirganda pdf bo'lsa ko'rinadi)
  useEffect(() => {
    if (resolvedId) {
      fetchFile(resolvedId);
    }
  }, [resolvedId]);

  // ✅ CREATE / UPDATE (payloadni backend formatga mos qilamiz)
  const createAnalysis = async () => {
    try {
      setLoading(true);

      const items = formData.products.map((prod) => {
        const commercial_items: { commercial_id: number; price: number }[] = [];

        // attachments: { [offerId]: [{productId, price}] }
        Object.entries(formData.attachments).forEach(([offerIdStr, attached]) => {
          const found = attached.find((a) => a.productId === prod.id);
          if (found) {
            commercial_items.push({
              commercial_id: Number(offerIdStr),
              price: Number(found.price) || 0,
            });
          }
        });

        return {
          order_product: prod.id,
          quantity: prod.selectedQuantity,
          commercial_items, // ✅ backend kutyapti
        };
      });

      const signs = formData.executors.map((ex) => ({ employee: ex.id }));
      const payload = { items, signs };

      let response;
      if (isEditMode && resolvedId) {
        response = await axiosAPI.put(`/document/analysis/${resolvedId}/`, payload);
      } else {
        response = await axiosAPI.post("/document/analysis/", payload);
      }

      if (response.status === 200 || response.status === 201) {
        const newId = response.data?.id || resolvedId;

        // ✅ modalni yopish (MUHIM!)
        setDeleteDialogOpen(false);

        // ✅ id ni formData ga saqlash
        if (!isEditMode && response.data?.id) {
          setFormData((prev) => ({ ...prev, id: response.data.id }));
        }

        // ✅ endi generate qilib pdfni olib ko'rsatamiz
        if (newId) {
          await fetchFile(newId);
        }

        setRefreshModal(true);
        toast.success("Narx tahlili muvaffaqiyatli yaratildi");
      }
    } catch (error) {
      toast.error("Narx tahlilini yaratishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const refetchSignedFile = async () => {
    if (!resolvedId) return;
    try {
      const response = await axiosAPI.get(`/document/analysis/${resolvedId}/file`);
      if (response.status === 200) {
        const url =
          (Array.isArray(response.data?.message) ? response.data.message[0] : "") ||
          response.data?.file_url ||
          response.data?.file ||
          "";
        if (url) {
          setFileURL(url);
          await getFileByURL(url);
        }
      }
    } catch (error) {
      toast.error("Imzolangan faylni olishda xatolik yuz berdi");
    }
  };

  const downloadFile = async () => {
    if (!letterFile) return;
    const url = URL.createObjectURL(letterFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = letterFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full">
      {letterFile ? (
        <>
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-2">
              {formData.is_approved === false && (
                <Button
                  type="primary"
                  icon={<PenLine size={16} />}
                  onClick={() => setEImzoOpen(true)}
                  disabled={formData.is_approved}
                >
                  Imzolash
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button icon={<Download size={16} />} onClick={downloadFile}>
                Yuklab olish
              </Button>
              <Button icon={<RefreshCw size={16} />} onClick={() => resolvedId && fetchFile(resolvedId)}>
                Yangilash
              </Button>
            </div>
          </div>

          <div className="border rounded-lg overflow-auto min-h-[70vh] h-full!">
            <FilePreviewer file={letterFile} className="w-full min-h-[650px]" />
          </div>
        </>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-3">Yaratilmoqda...</span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg text-gray-600 mb-4">
            Narx tahlili shakllantirilmagan. Shakllantirish uchun pastdagi tugmani bosing.
          </p>

          <Button
            type="primary"
            size="large"
            onClick={() => setDeleteDialogOpen(true)} // ✅ faqat bosilganda
            disabled={formData.products.length === 0}
          >
            Shakllantirish
          </Button>

          {formData.products.length === 0 && (
            <p className="text-sm text-red-500 mt-2">
              Kamida bitta tovar qo'shishingiz kerak
            </p>
          )}
        </div>
      )}

      {/* ✅ Confirmation dialog */}
      <DeleteAlertDialog
        open={deleteDialogOpen}         // ✅ mana shu bo'lmasa doim ochiq bo'ladi
        title="Narx tahlilini shakllantirish"
        message="Ushbu amalni bajarishdan oldin barcha ma'lumotlarni tekshiring."
        confirmText="Yaratish"
        cancelText="Bekor qilish"
        loading={loading}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={createAnalysis}
      />

      {/* E-IMZO signing modal */}
      <SigningModal
        isOpen={eImzoOpen}
        onClose={() => setEImzoOpen(false)}
        documentId={resolvedId.toString()}
        documentName="АнализЦен"
        fileEndpoint={resolvedId ? `/document/analysis/${resolvedId}/file` : undefined}
        onSuccess={() => {
          setEImzoOpen(false);
          toast.success("Hujjat imzolandi");
          refetchSignedFile();
        }}
        documentType="price_analysis"
      />
    </div>
  );
};

export default PriceAnalysisStep;