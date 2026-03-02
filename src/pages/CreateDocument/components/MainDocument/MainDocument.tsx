import { CreateAboveModal, FilePreviewer } from "@/components";
import type { OrderData } from "@/pages/Letters/components/Detail/LetterDetail";
import { axiosAPI } from "@/service/axiosAPI";
import { useAppDispatch } from "@/store/hooks/hooks";
import { setEditorView } from "@/store/slices/lettersSlice";
import { Button, Card, Modal } from "antd";
import {
  CheckCircle,
  Download,
  Eye,
  FileText,
  Plus,
  Upload,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import SigningModal from "@/pages/Letters/components/Detail/SigningModal";

interface IProps {
  orderDataID: number | null;
  orderData: OrderData | null;
}

export interface MainDocument {
  id: number;
  file_name: string;
  file_url: string;
  word_id?: number;
  word_file_id?: number;
  word_file_name?: string;
  file_pdf_id?: number;
  is_main?: boolean;
}

const MainDocument: React.FC<IProps> = ({ orderDataID, orderData }) => {
  const dispatch = useAppDispatch();
  const [fileTemplates, setFileTemplates] = useState<
    Array<IDName & { is_fishka?: boolean }>
  >([]);
  const [showTemplatesList, setShowTemplatesList] = useState(false);

  const [mainDocument, setMainDocument] = useState<MainDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<MainDocument | null>(
    null,
  );
  const documentInputRef = useRef<HTMLInputElement>(null);
  const [isFishka, setIsFishka] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOrderFileID, setSelectedOrderFileID] = useState<number | null>(
    null,
  );
  const [orderNumber, setOrderNumber] = useState("");
  const [showInputNumberModal, setShowInputNumberModal] = useState<{
    id: number;
    name: string;
    is_fishka?: boolean;
  } | null>(null);

  const handleOpenEditor = (doc: MainDocument) => {
    const wordFileId = doc.word_id || doc.word_file_id || null;
    const outputUrl = wordFileId
      ? `${axiosAPI.getUri()}/document/orders/word/${wordFileId}/`
      : "";

    dispatch(
      setEditorView({
        isOpen: true,
        url: "https://editor.ekomplektasiya.uz/",
        documentId: orderDataID,
        wordFileId,
        inputUrl: doc.file_url,
        outputUrl,
      }),
    );
  };

  const createMainDocument = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append("file", file, "new_document.docx");
      const response = await axiosAPI.post(
        `document/orders/${orderDataID}/add-file/`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        setMainDocument((prev) => [...prev, response.data]);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Hujjat yaratishda xatolik yuz berdi!",
      );
    }
  };

  const handleUpdateDocument = async (file: File, doc: MainDocument) => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const response = await axiosAPI.put(
        `document/orders/word/${doc.word_id || doc.word_file_id}/`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.status === 200) {
        setMainDocument((prev) =>
          prev.map((d) =>
            d.id === doc.id
              ? {
                  ...d,
                  file_url: response.data.file,
                  word_file_name: file.name,
                }
              : d,
          ),
        );
        toast.success("Hujjat muvaffaqiyatli yangilandi!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createMainDocByTemplate = async (templateID: number) => {
    try {
      const payload = {
        template_id: templateID,
      };
      if (showInputNumberModal) {
        payload.outgoing_number = orderNumber;
      }
      const response = await axiosAPI.post(
        `document/orders/${orderDataID}/add-file/`,
        payload,
      );

      if (response.status === 200) {
        setMainDocument((prev) => [...prev, response.data]);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Hujjat yaratishda xatolik yuz berdi!",
      );
    }
  };

  useEffect(() => {
    async function fetchFileTemplates() {
      try {
        const response = await axiosAPI.get("directory/template/by-name/");
        if (response.status === 200) setFileTemplates(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchFileTemplates();
  }, []);

  useEffect(() => {
    if (orderData?.movement_files?.length) {
      setMainDocument(orderData.movement_files);
    } else {
      setMainDocument([]);
    }
  }, [orderData]);

  return (
    <>
      {mainDocument.length > 0 ? (
        <>
          {mainDocument.map((doc, index) =>
            doc.is_main ? (
              <Card
                key={index}
                className="border-2 border-blue-200 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-50 to-indigo-50"
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 flex items-center gap-2">
                        {doc.word_file_name}
                        {doc.file_pdf_id && (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Imzolangan
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">Asosiy hujjat</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 border-none"
                      onClick={() => {
                        if (doc.file_pdf_id) {
                          // ===============================
                          async function fetchAndOpenFile() {
                            try {
                              const response = await axiosAPI.get(
                                `document/orders/attachment/${doc.file_pdf_id}/`,
                              );
                              if (response.status === 200)
                                return response.data.file_url;
                            } catch (error) {
                              console.log(error);
                              toast.error(
                                "Faylni yuklab olishda xatolik yuz berdi",
                              );
                            }
                          }

                          fetchAndOpenFile().then((url) => {
                            if (url) {
                              fetch(url)
                                .then((res) => {
                                  if (!res.ok)
                                    throw new Error(
                                      `HTTP error! status: ${res.status}`,
                                    );
                                  return res.blob();
                                })
                                .then((blob) => {
                                  const fileObj: File = new File(
                                    [blob],
                                    doc.file_pdf_name,
                                    { type: blob.type },
                                  );
                                  setSelectedFile(fileObj);
                                })
                                .catch((error) => {
                                  console.log(error);
                                  toast.error(
                                    "Faylni ochib bo'lmadi. Iltimos, qayta urinib ko'ring.",
                                  );
                                });
                            } else
                              toast.error(
                                "Faylni ochib bo'lmadi. Iltimos, qayta urinib ko'ring.",
                              );
                          });
                          // ===============================
                        } else {
                          handleOpenEditor(doc);
                        }
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      Ko'rish
                    </Button>

                    {/* <Button
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 border-none text-white"
                        onClick={() => {
                          setSelectedDocument(doc);
                          documentInputRef.current?.click();
                          // openEditor();
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                        Tahrirlash
                      </Button> */}
                    <Button
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 border-none text-white"
                      onClick={() => {
                        setSelectedOrderFileID(doc.id);
                      }}
                      disabled={!!doc.file_pdf_id}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Imzolash
                    </Button>

                    {/* Download button */}
                    <Button
                      href={doc.file_url}
                      target="_blank"
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 border-none text-white"
                      onClick={() => {
                        console.log(doc);
                      }}
                    >
                      <Download className="w-4 h-4" />
                      Yuklab olish
                    </Button>

                    {/* Upload changed file */}
                    <Button
                      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 border-none text-white"
                      onClick={() => {
                        setSelectedDocument(doc);
                        documentInputRef.current?.click();
                      }}
                    >
                      <Upload className="w-4 h-4" />
                      Qayta yuklash
                    </Button>
                  </div>

                  <input
                    type="file"
                    ref={documentInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && selectedDocument) {
                        handleUpdateDocument(file, selectedDocument);
                      }
                    }}
                  />
                </div>
              </Card>
            ) : (
              <div className="flex flex-col items-start gap-2 my-6">
                <div className="flex items-center gap-1 relative">
                  <p>Asosiy fayl qo'shish</p>
                  <p
                    className="text-blue-500 underline cursor-pointer hover:text-blue-700"
                    onClick={() => setShowTemplatesList((prev) => !prev)}
                  >
                    (shablonlardan tanlash) fwe
                  </p>
                  {showTemplatesList && (
                    <div className="absolute top-0 left-full w-full z-50 bg-white border-2 border-slate-200 rounded-md shadow-md">
                      {fileTemplates.map((template, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer w-full text-start text-black!"
                          onClick={() => {
                            if (template.is_fishka) {
                              setIsFishka(true);
                              setShowTemplatesList(false);
                            } else {
                              createMainDocByTemplate(template.id);
                            }
                          }}
                        >
                          <p>
                            <span>{index + 1}.</span> {template.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => {
                    documentInputRef.current?.click();
                  }}
                  className="ml-[50%] translate-x-[-50%]"
                >
                  Fayl yuklash
                  <Plus className="w-4 h-4" />
                  <input
                    type="file"
                    ref={documentInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        createMainDocument(file);
                      }
                    }}
                  />
                </Button>
              </div>
            ),
          )}
        </>
      ) : (
        <div className="flex flex-col items-start gap-2 my-6">
          <div className="flex items-center gap-1 relative">
            <p>Asosiy fayl qo'shish</p>
            <p
              className="text-blue-500 underline cursor-pointer hover:text-blue-700"
              onClick={() => setShowTemplatesList((prev) => !prev)}
            >
              (shablonlardan tanlash)
            </p>
            {showTemplatesList && (
              <div className="absolute top-0 left-full w-full z-50 bg-white border-2 border-slate-200 rounded-md shadow-md">
                {fileTemplates.map((template, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer w-full text-start text-black!"
                    onClick={() => {
                      if (template.is_fishka) {
                        setIsFishka(true);
                        setShowTemplatesList(false);
                      } else if (template.is_order) {
                        setShowInputNumberModal(template);
                      } else {
                        createMainDocByTemplate(template.id);
                      }
                    }}
                  >
                    <p>
                      <span>{index + 1}.</span> {template.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button
            onClick={() => {
              documentInputRef.current?.click();
            }}
            className="ml-[50%] translate-x-[-50%]"
          >
            Fayl yuklash
            <Plus className="w-4 h-4" />
            <input
              type="file"
              ref={documentInputRef}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  createMainDocument(file);
                }
              }}
            />
          </Button>
        </div>
      )}

      {isFishka && orderDataID && (
        <CreateAboveModal
          setShowCreateAboveModal={setIsFishka}
          orderDataID={orderDataID}
          templateID={fileTemplates.find((t) => t.is_fishka)?.id || 0}
        />
      )}

      {selectedFile && (
        <Modal
          open={!!selectedFile}
          onCancel={() => setSelectedFile(null)}
          footer={null}
          width={1400}
          centered
          bodyStyle={{ padding: 0, height: "75vh", width: "100%" }}
        >
          <FilePreviewer file={selectedFile} />
        </Modal>
      )}

      {selectedOrderFileID && (
        <SigningModal
          orderFileID={selectedOrderFileID}
          isOpen={!!selectedOrderFileID}
          onClose={() => setSelectedOrderFileID(null)}
          documentId={orderDataID + ""}
        />
      )}
      <Modal
        open={!!showInputNumberModal}
        onCancel={() => setShowInputNumberModal(null)}
        centered
        footer={null}
      >
        <div className="flex flex-col items-start gap-4">
          <p>Hujjat raqamini kiriting</p>
          <input
            type="text"
            className="border-2 border-gray-300 rounded-md px-4 py-2 w-full"
            placeholder="Buyurtma raqami"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700 border-none text-white"
            onClick={() => {
              if (showInputNumberModal) {
                createMainDocByTemplate(showInputNumberModal.id);
                setShowInputNumberModal(null);
              }
            }}
          >
            Yaratish
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default MainDocument;
