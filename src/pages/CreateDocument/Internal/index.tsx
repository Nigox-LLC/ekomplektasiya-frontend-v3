import React, { useEffect, useRef, useState } from "react";
import { Input, Select } from "antd";
import { axiosAPI } from "@/service/axiosAPI";
import { CircleCheck, FileText, Paperclip, Plus, Trash2 } from "lucide-react";
import TextArea from "antd/es/input/TextArea";
import { toast } from "react-toastify";

interface UploadedFile {
  file: File;
  id: string;
  url: string;
}

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
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [mainDocument, setMainDocument] = useState<UploadedFile | null>(null);

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
      const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
        file,
        id: `${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
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

  const handleSave = () => {
    if (!orderData.comment.trim()) {
      setShowBriefError(true);
      toast.error("Hujjatning qisqacha mazmunini kiriting!");
      return;
    }
    setShowBriefError(false);

    toast.success("Hujjat muvaffaqiyatli saqlandi!");
  };

  useEffect(() => {
    fetchDocumentTypes();
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
          {mainDocument ? (
            <div className="flex flex-col gap-2">
              <h2>Asosiy hujjat</h2>
              <div className="flex justify-between items-center gap-2 mb-2 rounded-md shadow-md border border-gray-200 p-4">
                <p className="flex items-center gap-2">
                  <span>{mainDocument.file.name.split(".").pop()}</span>
                  <span className="text-sm text-gray-700">
                    {mainDocument.file.name}
                  </span>
                </p>

                <button
                  onClick={() => setMainDocument(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <span className="text-sm">
                    <Trash2 className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>
          ) : (
            // className="flex items-center gap-2 mb-2 w-full border-2 border-dashed border-gray-400 rounded-md p-4 h-24 justify-center"
            <button
              type="button"
              onClick={() => mainFileInputRef.current?.click()}
              className="w-full h-24 size-8 flex items-center justify-center rounded-md border-2 border-dashed border-gray-400 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              title="Fayl yuklash"
            >
              <label className="text-sm font-medium text-gray-700">
                Asosiy hujjat
              </label>
              <Plus className="size-4 text-gray-600" />
            </button>
          )}
          <input
            type="file"
            ref={mainFileInputRef}
            className="hidden"
            multiple
            onChange={(event) => handleFileChange(event, "main")}
          />

          {/* Uploaded Files List */}
          <div className="my-4 flex flex-col gap-2">
            <h2>Biriktirilgan hujjatlar</h2>
            {uploadedFiles.length > 0 ? (
              <div className="space-y-2 mt-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-gray-600" />
                      <span className="text-sm text-gray-700">
                        {file.file.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <span className="text-sm">
                        <Trash2 className="w-4 h-4" />
                      </span>
                    </button>
                  </div>
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
