import React, { useState, useEffect, useCallback } from "react";
import { Download, RefreshCw, PenLine, CheckCircle } from "lucide-react";
import { Button, Modal } from "antd";
import { toast } from "react-toastify";
import { axiosAPI } from "@/service/axiosAPI";
import FilePreviewer from "@/components/FilePreviewer/FilePreviewer"; // adjust import
import DeleteAlertDialog from "@/components/DeleteAlertDialog";
import SigningModal from "@/pages/Letters/components/Detail/SigningModal"
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileURL, setFileURL] = useState("");
  const [eImzoOpen, setEImzoOpen] = useState(false);
  const [refreshModal, setRefreshModal] = useState(false);
  const resolvedId = formData.id || priceAnalysisId || "";

  // Resolve file URL (handle relative paths)
  const resolveFileUrl = useCallback((url: string) => {
    if (!url) return url;
    try {
      const parsed = new URL(url, window.location.origin);
      if (parsed.origin !== window.location.origin && parsed.pathname.startsWith("/media/")) {
        return parsed.pathname + parsed.search;
      }
      return parsed.toString();
    } catch {
      return url;
    }
  }, []);

  // Fetch file when we have an ID
  useEffect(() => {
    if (resolvedId) {
      fetchFile();
    }
  }, [resolvedId]);

  const fetchFile = async () => {
    try {
      const response = await axiosAPI.get(`/document/analysis/${resolvedId}/file`);
      if (response.status === 200) {
        setFileURL(response.data.file_url);
      }
    } catch (error) {
      console.error("Failed to fetch file", error);
    }
  };

  // Download file blob from URL
  const getFileByURL = useCallback(async (url: string) => {
    if (!url) return;
    try {
      const resolved = resolveFileUrl(url);
      const response = await fetch(resolved, { cache: "no-store" });
      const fileName = resolved.split("/").pop() || "file";
      const arrayBuffer = await response.arrayBuffer();
      const mime = inferMimeFromExt(fileName) || "application/octet-stream";
      setLetterFile(arrayBufferToFile(arrayBuffer, fileName, mime));
    } catch (error) {
      console.log(error);
    }
  }, [resolveFileUrl]);

  useEffect(() => {
    if (fileURL) getFileByURL(fileURL);
  }, [fileURL, getFileByURL]);

  // Create the analysis document (POST to /document/analysis/)
  const createAnalysis = async () => {
    try {
      setLoading(true);
      // Build payload
      const items = formData.products.map((prod) => {
        // Find all commercial IDs attached to this product
        const commercialIds: number[] = [];
        Object.entries(formData.attachments).forEach(([offerId, attached]) => {
          if (attached.some((a) => a.productId === prod.id)) {
            commercialIds.push(Number(offerId));
          }
        });
        // Determine price: we use the price from the first attached commercial for this product? 
        // Actually we have per-product per-offer prices; we need a single price per product.
        // We'll use the minimum price among attached offers for that product.
        let price = 0;
        Object.entries(formData.attachments).forEach(([offerId, attached]) => {
          const found = attached.find((a) => a.productId === prod.id);
          if (found && (found.price < price || price === 0)) {
            price = found.price;
          }
        });
        return {
          order_product: prod.id,
          quantity: prod.selectedQuantity,
          price: price,
          commercials: commercialIds,
        };
      });

      const signs = formData.executors.map((ex) => ({
        employee: ex.id,
        is_approved: false,
      }));

      const payload = {
        number: formData.number,
        items,
        signs,
      };

      let response;
      if (isEditMode && resolvedId) {
        response = await axiosAPI.put(`/document/analysis/${resolvedId}/`, payload);
      } else {
        response = await axiosAPI.post("/document/analysis/", payload);
      }

      if (response.status === 200 || response.status === 201) {
        setRefreshModal(true);
        setFileURL(response.data.file); // assuming response contains file url
        if (!isEditMode) {
          setFormData((prev) => ({ ...prev, id: response.data.id }));
        }
        toast.success("Narx tahlili muvaffaqiyatli yaratildi");
      }
    } catch (error) {
      toast.error("Xatoni yaratishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const refetchSignedFile = async () => {
    if (!resolvedId) return;
    try {
      const response = await axiosAPI.get(`/document/analysis/${resolvedId}/file`);
      if (response.status === 200) {
        setFileURL(response.data.file_url);
        await getFileByURL(response.data.file_url);
      }
    } catch (error) {
      toast.error("Imzolangan faylni olishda xatolik");
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
              <Button icon={<RefreshCw size={16} />} onClick={() => window.location.reload()}>
                Yangilash
              </Button>
            </div>
          </div>
          <div className="border rounded-lg overflow-auto max-h-[70vh]">
            <FilePreviewer file={letterFile} className="w-full" />
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
            onClick={() => setDeleteDialogOpen(true)}
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

      {/* Confirmation dialog */}
      <DeleteAlertDialog
        open={deleteDialogOpen}
        title="Narx tahlilini shakllantirish"
        message="Ushbu amalni bajarishdan oldin barcha ma'lumotlarni tekshiring."
        confirmText="Yaratish"
        cancelText="Bekor qilish"
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

      {/* Success modal */}
      <Modal
        open={refreshModal}
        onCancel={() => setRefreshModal(false)}
        footer={null}
        centered
      >
        <div className="flex flex-col items-center py-6">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <p className="text-lg font-semibold">Ma'lumotlar yangilandi!</p>
        </div>
      </Modal>
    </div>
  );
};

export default PriceAnalysisStep;