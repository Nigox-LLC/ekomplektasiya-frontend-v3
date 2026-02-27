import { CreateAboveModal, FilePreviewer } from "@/components";
import type { OrderData } from "@/pages/Letters/components/Detail/LetterDetail";
import { axiosAPI } from "@/service/axiosAPI";
import { Button, Card, Modal } from "antd";
import {
  Check,
  CheckCircle,
  Download,
  Eye,
  FileText,
  Pencil,
  Plus,
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
}

const MainDocument: React.FC<IProps> = ({ orderDataID, orderData }) => {
  const [fileTemplates, setFileTemplates] = useState<IDName[]>([]);
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

  const newWindowRef = useRef<Window | null>(null);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      // console.log("Parent received message:", e.data);

      if (
        e.data &&
        e.data.status === "ready" &&
        newWindowRef.current &&
        selectedDocument
      ) {
        // console.log("✅ Child window tayyor!");
        const token = localStorage.getItem("v3_ganiwer");

        const data = {
          input_url: selectedDocument.file_url,
          output_url:
            axiosAPI.getUri() + `/document/orders/word/${selectedDocument.id}/`,
          v3_ganiwer: token,
        };

        newWindowRef.current.postMessage(data, "*");
      }

      if (e.data && e.data.status === "loaded") {
        console.log("✅ Hujjat yuklandi:", e.data.url);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [selectedDocument]);

  function openEditor() {
    const url = "https://editor.ekomplektasiya.uz/";
    const features =
      "width=1200,height=800,menubar=no,toolbar=no,location=no,status=no";
    newWindowRef.current = window.open(url, "SuperDocWindow", features);
  }

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
        `document/orders/word/${doc.id}/`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.status === 200) {
        setMainDocument((prev) =>
          prev.map((d) => (d.id === doc.id ? response.data : d)),
        );
        toast.success("Hujjat muvaffaqiyatli yangilandi!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createMainDocByTemplate = async (templateID: number) => {
    try {
      const response = await axiosAPI.post(
        `document/orders/${orderDataID}/add-file/`,
        {
          template_id: templateID,
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
          {mainDocument.map(
            (doc, index) =>
              (doc.word_id || doc.word_file_id) && (
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
                          // fetch(doc.file_url)
                          //   .then((res) => {
                          //     if (!res.ok)
                          //       throw new Error(
                          //         `HTTP error! status: ${res.status}`,
                          //       );
                          //     return res.blob();
                          //   })
                          //   .then((blob) => {
                          //     const fileObj = new File(
                          //       [blob],
                          //       doc.word_file_name,
                          //       {
                          //         type: blob.type,
                          //       },
                          //     );
                          //     if (fileObj) setSelectedFile(fileObj);
                          //   })
                          //   .catch((err) => {
                          //     console.error("Faylni olishda xatolik:", err);
                          //     toast.error("Faylni olishda xatolik yuz berdi!");
                          //   });
                          openEditor();
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
                      >
                        <Download className="w-4 h-4" />
                        Yuklab olish
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
    </>
  );
};

export default MainDocument;
