import React, { useEffect, useMemo, useRef, useState } from "react";
import { Download, Eye, Plus, Trash2 } from "lucide-react";
import { Button } from "antd";
import type { CreateDocumentType } from "../../External";
import { axiosAPI } from "@/service/axiosAPI";
import { toast } from "react-toastify";

type AttachmentFile = {
  id: number;
  file: string;
  file_name: string;
  file_size: number;
  created_at: string;
};

interface IProps {
  orderData: CreateDocumentType;
  orderDataID: number;
  setOrderData: React.Dispatch<React.SetStateAction<CreateDocumentType>>;
}

const AdditionalFiles: React.FC<IProps> = ({ orderData, orderDataID, setOrderData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<AttachmentFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("uz-UZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const syncOrderDataAttachments = (attachmentFiles: AttachmentFile[]) => {
    setOrderData((prev) =>
      ({
        ...prev,
        attachment_files: attachmentFiles,
      }) as CreateDocumentType,
    );
  };

  const fetchAttachmentFiles = async () => {
    if (!orderDataID) return;
    try {
      const response = await axiosAPI.get(`document/orders/${orderDataID}/`);
      if (response.status === 200) {
        const attachmentFiles: AttachmentFile[] =
          response.data.attachment_files || [];
        setFiles(attachmentFiles);
        syncOrderDataAttachments(attachmentFiles);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;
    event.target.value = "";

    if (!orderDataID) {
      toast.error("Avval hujjat yaratilishini kuting");
      return;
    }

    setIsUploading(true);
    try {
      await Promise.all(
        selectedFiles.map(async (selectedFile) => {
          const formData = new FormData();
          formData.append("file", selectedFile);
          const response = await axiosAPI.post(
            `document/orders/${orderDataID}/add-attachment/`,
            formData,
          );
          if (response.status !== 200) {
            throw new Error("Upload failed");
          }
        }),
      );

      await fetchAttachmentFiles();
      toast.success("Fayl(lar) muvaffaqiyatli yuklandi");
    } catch (error) {
      console.log(error);
      toast.error("Faylni yuklashda xatolik yuz berdi");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async (id: number) => {
    setProcessingIds((prev) => [...prev, id]);
    try {
      const response = await axiosAPI.delete(`document/orders/attachment/${id}/`);
      if (response.status === 204) {
        const updated = files.filter((item) => item.id !== id);
        setFiles(updated);
        syncOrderDataAttachments(updated);
        toast.success("Fayl muvaffaqiyatli o'chirildi");
      } else {
        toast.error("Faylni o'chirishda xatolik yuz berdi");
      }
    } catch (error) {
      console.log(error);
      toast.error("Faylni o'chirishda xatolik yuz berdi");
    } finally {
      setProcessingIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const getAttachmentUrl = async (id: number) => {
    const response = await axiosAPI.get(`document/orders/attachment/${id}/`);
    if (response.status === 200) {
      return response.data.file_url as string;
    }
    return "";
  };

  const handlePreview = async (id: number) => {
    setProcessingIds((prev) => [...prev, id]);
    try {
      const fileUrl = await getAttachmentUrl(id);
      if (fileUrl) {
        window.open(fileUrl, "_blank", "noopener,noreferrer");
      } else {
        toast.error("Faylni ochib bo'lmadi");
      }
    } catch (error) {
      console.log(error);
      toast.error("Faylni ochishda xatolik yuz berdi");
    } finally {
      setProcessingIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleDownload = async (item: AttachmentFile) => {
    setProcessingIds((prev) => [...prev, item.id]);
    try {
      const fileUrl = await getAttachmentUrl(item.id);
      if (!fileUrl) {
        toast.error("Faylni yuklab olib bo'lmadi");
        return;
      }

      const blobResponse = await fetch(fileUrl);
      const blob = await blobResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = item.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      toast.error("Faylni yuklab olishda xatolik yuz berdi");
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== item.id));
    }
  };

  const fileCardData = useMemo(() => {
    return files.map((item) => {
      const ext = item.file_name.split(".").pop()?.toUpperCase() || "FILE";
      const badgeText = ext.length > 4 ? "FILE" : ext;
      const isPdf = ext === "PDF";

      return {
        ...item,
        badgeText,
        badgeClass: isPdf ? "bg-red-600" : "bg-blue-600",
      };
    });
  }, [files]);

  useEffect(() => {
    fetchAttachmentFiles();
  }, [orderDataID]);

  return (
    <section className="w-full rounded-2xl border border-gray-300 bg-white p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-gray-800">
          Biriktirilgan hujjatlar
        </h3>
        <Button onClick={handleOpenDialog} loading={isUploading} disabled={!orderDataID}>
          <Plus className="w-4 h-4" />
          Fayl qo'shish
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* grid box with response for every devices screen sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {fileCardData.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-gray-300 bg-gray-50 p-4"
          >
            <div className="flex items-end justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <div
                  className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${item.badgeClass}`}
                >
                  {item.badgeText}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-blue-600">
                    {item.file_name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatDate(item.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center pt-1 text-gray-400">
                <Button
                  type="text"
                  onClick={() => handlePreview(item.id)}
                  loading={processingIds.includes(item.id)}
                  className="transition-colors hover:text-gray-600"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  type="text"
                  onClick={() => handleRemove(item.id)}
                  loading={processingIds.includes(item.id)}
                  className="transition-colors hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  type="text"
                  onClick={() => handleDownload(item)}
                  loading={processingIds.includes(item.id)}
                  className="transition-colors hover:text-gray-600"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {!fileCardData.length && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center text-gray-500">
            Fayl qo'shish tugmasi orqali hujjat biriktiring
          </div>
        )}
      </div>
    </section>
  );
};

export default AdditionalFiles;
