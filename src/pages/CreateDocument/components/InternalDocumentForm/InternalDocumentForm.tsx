import { Card } from "antd";
import {
  ChevronDown,
  CircleCheck,
  FileText,
  Paperclip,
  Plus,
} from "lucide-react";
import React, { useState, useRef } from "react";
import { toast } from "react-toastify";

interface UploadedFile {
  file: File;
  id: string;
  url: string;
}

const InternalDocumentForm: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documentType, setDocumentType] = useState("Ichki hujjat");
  const [internalDocType, setInternalDocType] = useState("Farmoyish");
  const [permissionJournal, setPermissionJournal] = useState(
    "1-15- Ichki Hujjatlar jurnali",
  );
  const [documentNumber, setDocumentNumber] = useState("");
  const [baseDocument, setBaseDocument] = useState("");
  const [briefContent, setBriefContent] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showDocTypeDropdown, setShowDocTypeDropdown] = useState(false);
  const [showInternalTypeDropdown, setShowInternalTypeDropdown] =
    useState(false);
  const [showJournalDropdown, setShowJournalDropdown] = useState(false);
  const [createWithoutQR, setCreateWithoutQR] = useState(false);
  const [formAgreements, setFormAgreements] = useState(false);
  const [isXDBVDSP, setIsXDBVDSP] = useState(false);
  const [showBriefError, setShowBriefError] = useState(false);

  const documentTypes = ["Ichki hujjat", "Tashqi hujjat"];
  const internalTypes = ["Farmoyish", "Buyruq", "Qaror", "Xat", "Ma'lumotnoma"];
  const journals = [
    "1-15- Ichki Hujjatlar jurnali",
    "16-30- Tashqi Hujjatlar jurnali",
    "31-45- Maxfiy Hujjatlar jurnali",
  ];

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
        file,
        id: `${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
      }));

      setUploadedFiles([...uploadedFiles, ...newFiles]);
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

  const handleSave = () => {
    if (!briefContent.trim()) {
      setShowBriefError(true);
      toast.error("Hujjatning qisqacha mazmunini kiriting!");
      return;
    }
    setShowBriefError(false);

    // Save logic here
    console.log("Saving document:", {
      documentType,
      internalDocType,
      permissionJournal,
      documentNumber,
      baseDocument,
      briefContent,
      uploadedFiles,
      createWithoutQR,
      formAgreements,
      isXDBVDSP,
    });

    toast.success("Hujjat muvaffaqiyatli saqlandi!");
  };

  return (
    <Card className="p-6 shadow-md">
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
              <button
                type="button"
                onClick={() => setShowDocTypeDropdown(!showDocTypeDropdown)}
                className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
              >
                <span className="text-gray-900">{documentType}</span>
                <ChevronDown className="size-4 text-gray-500" />
              </button>
              {showDocTypeDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {documentTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setDocumentType(type);
                        setShowDocTypeDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ichki hujjat turi */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ichki hujjat turi<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowInternalTypeDropdown(!showInternalTypeDropdown)
                }
                className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
              >
                <span className="text-gray-900">{internalDocType}</span>
                <ChevronDown className="size-4 text-gray-500" />
              </button>
              {showInternalTypeDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {internalTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setInternalDocType(type);
                        setShowInternalTypeDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ruxsatga olish jurnali */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ruxsatga olish jurnali<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowJournalDropdown(!showJournalDropdown)}
                className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
              >
                <span className="text-gray-900 text-sm">
                  {permissionJournal}
                </span>
                <ChevronDown className="size-4 text-gray-500" />
              </button>
              {showJournalDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {journals.map((journal) => (
                    <button
                      key={journal}
                      onClick={() => {
                        setPermissionJournal(journal);
                        setShowJournalDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors text-sm"
                    >
                      {journal}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hujjat raqami */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hujjat raqami
            </label>
            <input
              type="text"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
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
          <input
            type="text"
            value={baseDocument}
            onChange={(e) => setBaseDocument(e.target.value)}
            placeholder="Asos hujjat raqami"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Brief Content */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-gray-400" />
              <span className="text-sm text-red-500">Qisqacha mazmuni</span>
            </div>
          </label>
          <div className="relative">
            <textarea
              value={briefContent}
              onChange={(e) => {
                setBriefContent(e.target.value);
                setShowBriefError(false);
              }}
              placeholder="Qisqacha mazmun"
              rows={6}
              className={`w-full p-3 bg-white border ${
                showBriefError ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 resize-none`}
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
          <div className="flex items-center gap-2 mb-2 w-full border-2 border-dashed border-gray-400 rounded-md p-4 h-24 justify-center">
            <label className="text-sm font-medium text-gray-700">
              Asosiy hujjat
            </label>
            <button
              type="button"
              onClick={handleFileUpload}
              className="size-8 flex items-center justify-center rounded-full border-2 border-dashed border-gray-400 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              title="Fayl yuklash"
            >
              <Plus className="size-4 text-gray-600" />
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileChange}
          />

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
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
                    <span className="text-sm">×</span>
                  </button>
                </div>
              ))}
            </div>
          )}
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
                onClick={handleFileUpload}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <Paperclip className="size-4" />
                Fayl biriktirish
              </button>

              <button
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
              </button>

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
    </Card>
  );
};

export default InternalDocumentForm;
