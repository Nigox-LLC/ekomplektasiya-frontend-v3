import React, { useEffect, useRef, useState } from "react";
import { Input, Select } from "antd";
import { axiosAPI } from "@/service/axiosAPI";
import {
  CircleCheck,
  Download,
  Eye,
  FileText,
  Paperclip,
  Trash2,
} from "lucide-react";
import {
  FaFileAlt,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";
import TextArea from "antd/es/input/TextArea";
import { toast } from "react-toastify";
import MainDocument from "../components/MainDocument/MainDocument";
import FilePreviewModal from "@/components/FilePreviewModal/FilePreviewModal";

interface FileItem {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
}

const getFileExtension = (name: string) =>
  name.split(".").pop()?.toLowerCase() || "";

const isImageFile = (ext: string) =>
  ["jpg", "jpeg", "png", "webp"].includes(ext);

const isPdfFile = (ext: string) => ext === "pdf";

const isWordFile = (ext: string) => ["doc", "docx"].includes(ext);

const isExcelFile = (ext: string) => ["xls", "xlsx"].includes(ext);

const isPowerPointFile = (ext: string) => ["ppt", "pptx"].includes(ext);

const getFileIcon = (name: string) => {
  const ext = getFileExtension(name);

  if (isImageFile(ext)) {
    return <FaFileImage className="size-5 text-emerald-600" />;
  }

  if (isPdfFile(ext)) {
    return <FaFilePdf className="size-5 text-red-600" />;
  }

  if (isWordFile(ext)) {
    return <FaFileWord className="size-5 text-blue-600" />;
  }

  if (isExcelFile(ext)) {
    return <FaFileExcel className="size-5 text-green-600" />;
  }

  if (isPowerPointFile(ext)) {
    return <FaFilePowerpoint className="size-5 text-orange-500" />;
  }

  return <FaFileAlt className="size-5 text-gray-500" />;
};

const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }

  const units = ["KB", "MB", "GB", "TB"];
  let value = size / 1024;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`;
};

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

interface FileCardProps {
  file: FileItem;
  onPreview: (file: FileItem) => void;
  onDownload: (file: FileItem) => void;
  onRemove: (id: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  onPreview,
  onDownload,
  onRemove,
}) => (
  <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
    <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0">{getFileIcon(file.name)}</div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPreview(file)}
          className="rounded-md p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
          aria-label="Preview"
        >
          <Eye className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onDownload(file)}
          className="rounded-md p-1 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
          aria-label="Download"
        >
          <Download className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(file.id)}
          className="rounded-md p-1 text-gray-500 hover:text-red-600 hover:bg-red-50"
          aria-label="Remove"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
    <div className="px-4 py-3 text-sm text-gray-600 space-y-1">
      <div className="flex items-center justify-between">
        <span>Hajmi</span>
        <span className="font-medium text-gray-800">
          {formatFileSize(file.size)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span>Yuklangan sana</span>
        <span className="font-medium text-gray-800">
          {formatDate(file.uploadedAt)}
        </span>
      </div>
    </div>
  </div>
);

export interface InternalCreateFormData {
  document_type: IDName;
  inner_document_type: IDName;
  registration_journal: IDName;
  document_number: string;
  basic_document_number: string;
  comment: string;
  letter_number: string;
}

const InternalCreate: React.FC = () => {
  // States
  const [orderData, setOrderData] = useState<InternalCreateFormData>({
    document_type: { id: 0, name: "" },
    inner_document_type: { id: 0, name: "" },
    registration_journal: { id: 0, name: "" },
    document_number: "",
    basic_document_number: "",
    comment: "",
    letter_number: "",
  });
  const [orderID, setOrderID] = useState<number | null>(null);
  // references data
  const [documentTypes, setDocumentTypes] = useState<IDName[]>([]);
  const [subDoocumentTypes, setSubDocumentTypes] = useState<IDName[]>([]);
  const [permissionJournals, setPermissionJournals] = useState<IDName[]>([]);

  // File states
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);
  const [mainDocument, setMainDocument] = useState<FileItem | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  // extra options states
  const [isXDBVDSP, setIsXDBVDSP] = useState(false);
  const [formAgreements, setFormAgreements] = useState(false);
  const [createWithoutQR, setCreateWithoutQR] = useState(false);

  // error handling states
  const [showBriefError, setShowBriefError] = useState(false);
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    docType: "main" | "additional",
  ) => {
    const files = event.target.files;
    if (files) {
      const newFiles: FileItem[] = Array.from(files).map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        uploadedAt: new Date().toISOString(),
      }));

      if (docType === "main") {
        setMainDocument(newFiles[0]);
      } else {
        setUploadedFiles([...uploadedFiles, ...newFiles]);
      }
      toast.success(`${files.length} ta fayl yuklandi`);
    }
  };

  const handleRemoveFile = (id: string) => {
    const fileToRemove = uploadedFiles.find((f) => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== id));
  };

  const handlePreviewFile = (file: FileItem) => {
    setPreviewFile(file);
  };

  const handleDownloadFile = (file: FileItem) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // fetch document types
  const fetchDocumentTypes = async () => {
    try {
      const response = await axiosAPI.get(
        "directory/internal/document-types/by-name/",
      );
      if (response.status === 200) setDocumentTypes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // fetch sub document types
  const fetchSubDocumentTypes = async (document_id: number) => {
    try {
      const response = await axiosAPI.get(
        `directory/internal/internal/by-name/?document_type=${document_id}`,
      );

      if (response.status === 200) setSubDocumentTypes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // fetch permission journals
  const fetchPermissionJournals = async (document_id: number) => {
    try {
      const response = await axiosAPI.get(
        `directory/internal/journals/by-name/?document_type=${document_id}`,
      );
      if (response.status === 200) setPermissionJournals(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // handle file attaching
  // const handleAttachFile = async () => {
  //   try {
  //     const response = await axiosAPI.post(
  //       `/document/orders/${orderID}/add-attachment/`,
  //       {
  //         file:
  //       }
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleSave = async () => {
    try {
      const response = await axiosAPI.patch(`/document/orders/${orderID}/`, {
        document_type: orderData.document_type.id,
        inner_document_type: orderData.inner_document_type.id,
        registration_journal: orderData.registration_journal.id,
        document_number: orderData.document_number,
        basic_document_number: orderData.basic_document_number,
        comment: orderData.comment,
        letter_number: orderData.letter_number,
        is_xdbvdsp: isXDBVDSP,
        form_agreements: formAgreements,
        create_without_qr: createWithoutQR,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDocumentTypes();

    // create order document on component mount
    const createOrderDocument = async () => {
      try {
        const response = await axiosAPI.post("document/orders/", {
          order_type: "internal",
        });

        if (response.status === 201) setOrderID(response.data.id);
      } catch (error) {
        console.log(error);
      }
    };

    createOrderDocument();
  }, []);

  return (
    <>
      <div className="space-y-4">
        {/* Form Header */}
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Ichki hujjat yaratish
          </h2>
        </div>

        {/* Form Fields Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hujjat turi */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hujjat turi<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Select
                value={orderData.document_type.id || null}
                placeholder="Hujjat turini tanlang"
                className="w-full"
                onChange={(value) => {
                  setOrderData((prev) => ({
                    ...prev,
                    document_type: documentTypes.find(
                      (type) => type.id === value,
                    ) || { id: 0, name: "" },
                    inner_document_type: { id: 0, name: "" },
                  }));
                  fetchSubDocumentTypes(value);
                  fetchPermissionJournals(value);
                }}
              >
                {documentTypes.map((type) => (
                  <Select.Option key={type.id} value={type.id}>
                    {type.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>

          {/* Ichki hujjat turi */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ichki hujjat turi<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Select
                disabled={!orderData.document_type.id}
                className="w-full"
                value={orderData.inner_document_type.id || null}
                placeholder="Ichki hujjat turini tanlang"
                onChange={(value) => {
                  setOrderData((prev) => ({
                    ...prev,
                    inner_document_type: subDoocumentTypes.find(
                      (type) => type.id === value,
                    ) || { id: 0, name: "" },
                  }));
                }}
              >
                {subDoocumentTypes.map((type) => (
                  <Select.Option key={type.id} value={type.id}>
                    {type.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>

          {/* Ro'yxatga olish jurnali */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ro'yxatga olish jurnali<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Select
                className="w-full"
                disabled={!orderData.document_type.id}
                value={orderData.registration_journal?.id || null}
                placeholder="Ro'yxatga olish jurnalini tanlang"
                onChange={(value) => {
                  setOrderData((prev) => ({
                    ...prev,
                    registration_journal: permissionJournals.find(
                      (journal) => journal.id === value,
                    ) || { id: 0, name: "" },
                  }));
                }}
              >
                {permissionJournals.map((journal) => (
                  <Select.Option key={journal.id} value={journal.id}>
                    {journal.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>

          {/* Hujjat raqami */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hujjat raqami
            </label>
            <Input
              value={orderData.document_number}
              onChange={(e) =>
                setOrderData({
                  ...orderData,
                  document_number: e.target.value,
                })
              }
              placeholder="Hujjat raqami"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Form Fields Row 2 */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asos hujjat raqami
          </label>
          <Input
            value={orderData.basic_document_number}
            onChange={(e) =>
              setOrderData({
                ...orderData,
                basic_document_number: e.target.value,
              })
            }
            placeholder="Asos hujjat raqami"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Brief Content */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-gray-400" />
              <span className="text-sm">Qisqacha izoh</span>
            </div>
          </label>
          <div className="relative">
            <TextArea
              id="content"
              value={orderData.comment}
              onChange={(e) =>
                setOrderData({ ...orderData, comment: e.target.value })
              }
              className="w-full rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 resize-none!"
              placeholder="Qisqacha izoh kiriting..."
              rows={4}
            />
          </div>
          {showBriefError && (
            <p className="mt-1 text-sm text-red-500">
              Hujjatning qisqacha mazmunini kiriting!
            </p>
          )}
        </div>

        {/* Hujjat yorliqlari (Document Attachments) */}
        <div>
          <MainDocument orderDataID={orderID} />

          {/* Uploaded Files List */}
          <div className="my-4 flex flex-col gap-2">
            <h2>Biriktirilgan hujjatlar</h2>
            {uploadedFiles.length > 0 ? (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {uploadedFiles.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onPreview={handlePreviewFile}
                    onDownload={handleDownloadFile}
                    onRemove={handleRemoveFile}
                  />
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 rounded-md shadow-md border border-gray-200 mt-2 flex items-center justify-center">
                <p className="text-xl text-gray-500 text-center">
                  Biriktirilgan hujjat yo'q
                </p>
              </div>
            )}
          </div>
        </div>

        <FilePreviewModal
          open={Boolean(previewFile)}
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />

        {/* Bottom Section - Checkboxes and Buttons */}
        <div className="border-t pt-4 mt-6">
          <div className="flex items-center justify-between">
            {/* Left Side - Checkboxes */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isXDBVDSP}
                  onChange={(e) => setIsXDBVDSP(e.target.checked)}
                  className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">ХДБV / ДСП</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createWithoutQR}
                  onChange={(e) => setCreateWithoutQR(e.target.checked)}
                  className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  QR kodsiz yaratish
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formAgreements}
                  onChange={(e) => setFormAgreements(e.target.checked)}
                  className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Imzodan so'ng kelishuvchilar ruxsatini shakllantirish
                </span>
              </label>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <Paperclip className="size-4" />
                Fayl biriktirish
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e, "additional")}
                className="hidden"
                multiple
              />

              {/* <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FileText className="size-4" />
                Ilovalar
              </button>

              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <FileText className="size-4" />
                Aloqador hujjatlar
              </button> */}

              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <CircleCheck className="size-4" />
                Saqlash
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InternalCreate;
