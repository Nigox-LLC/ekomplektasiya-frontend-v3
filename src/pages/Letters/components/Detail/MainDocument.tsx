import { axiosAPI } from "@/service/axiosAPI";
import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import type { OrderData } from "./LetterDetail";
import { FaFileWord } from "react-icons/fa6";
import { Download, Eye, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import FilePreviewer from "@/components/FilePreviewer/FilePreviewer";
import { CreateAboveModal } from "@/components";
import type { IDname } from "@/pages/PriceAnaliysis/PriceAnalysisForm/PriceAnalysisForm";
import OrderMainDocumentCreate from "@/pages/CreateDocument/components/MainDocument/MainDocument";

type MainDocumentType = {
  id: number;
  word_file_name: string;
  word_file_id: string;
  file_pdf_name: any;
  file_pdf_id: any;
  employee_name: string;
  created_at: string;
  qr_data: QrData;
  order_number: string;
  is_approved: boolean;
};

type QrData = {};

const MainDocument: React.FC<{ orderData: OrderData | null }> = ({
  orderData,
}) => {
  const [mainDocuments, setMainDocuments] = useState<MainDocumentType[]>([]);
  const [showCreateAboveModal, setShowCreateAboveModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // templates
  const [templates, setTemplates] = useState<IDname[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);

  const userType: "order" | "above" = "order";

  let newWindow: Window | null = null;

  const createMainDocByTemplate = async (templateID: number) => {
    try {
      const response = await axiosAPI.post(
        `document/orders/${orderData?.id}/add-file/`,
        {
          template_id: templateID,
        },
      );

      // if (response.status === 200) setMainDocument(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  function openEditor() {
    const url = "https://editor.ekomplektasiya.uz/";
    const features =
      "width=1200,height=800,menubar=no,toolbar=no,location=no,status=no";
    newWindow = window.open(url, "SuperDocWindow", features);
  }

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axiosAPI.get("directory/template/by-name/");
        if (response.status === 200) setTemplates(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    if (orderData?.movement_files?.length) {
      setMainDocuments(orderData.movement_files);
    }
  }, [orderData]);

  if (userType === "order") {
    return (
      <>
        <OrderMainDocumentCreate
          orderDataID={orderData?.id!}
          orderData={orderData}
        />
      </>
    );
  }

  return (
    <>
      {mainDocuments.length > 0 ? (
        <div className="flex flex-col gap-4">
          {mainDocuments.map((doc, index) => (
            <div key={index} className="flex items-center w-full">
              {/* Main document card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 w-full flex justify-between">
                {/* left side - document icon and title */}
                <div className="flex flex-col gap-4 items-start">
                  <div className="flex items-center justify-center mr-4 gap-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {/* Document icon */}
                      <FaFileWord size={24} className="text-blue-500" />
                    </div>
                    <h2 className="text-lg font-semibold">
                      {doc.word_file_name} - Usti hat
                    </h2>
                  </div>
                  <div>
                    <p className="text-xl">{doc.employee_name}</p>
                    <p className="text-xs text-blue-600">
                      {doc.created_at.split("T")[0] +
                        " " +
                        doc.created_at.split("T")[1].split(".")[0]}
                    </p>
                  </div>
                </div>

                {/* Right side - actions (preview, edit,download) three dot menu */}
                <div className="relative group flex flex-col items-end gap-2">
                  <button
                    className="flex gap-2 items-center text-end w-full px-4 py-2 text-blue-500 hover:bg-gray-300 bg-gray-200 rounded-md"
                    onClick={() => {
                      async function fetchAndOpenFile() {
                        try {
                          const response = await axiosAPI.get(
                            `document/orders/word/${doc.word_file_id}/`,
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
                                doc.word_file_name,
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
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    Ko'rish
                  </button>
                  <button
                    className="flex gap-2 items-center text-end w-full px-4 py-2 text-green-500 hover:bg-gray-300 bg-gray-200 rounded-md"
                    onClick={() => openEditor()}
                  >
                    <Pencil className="w-4 h-4" /> Tahrirlash
                  </button>
                  <button className="flex gap-2 items-center text-end w-full px-4 py-2 text-gray-500 hover:bg-gray-300 bg-gray-200 rounded-md">
                    <Download className="w-4 h-4" /> Yuklab olish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 my-6">
          <p className="w-full">Asosiy fayl qo'shish</p>
          <Button
            onClick={() => {
              setShowCreateAboveModal(true);
            }}
          >
            + Asosiy fayl
          </Button>
          <div className="absolute top-0 left-full bg-white border-2 border-slate-200 rounded-md shadow-md">
            {showCreateAboveModal && (
              <CreateAboveModal
                setShowCreateAboveModal={setShowCreateAboveModal}
              />
            )}
          </div>
        </div>
      )}

      <Modal
        open={!!selectedFile}
        onCancel={() => setSelectedFile(null)}
        footer={null}
        width={900}
        centered
        bodyStyle={{ padding: 0, height: "65vh" }}
      >
        <FilePreviewer file={selectedFile!} />
      </Modal>
    </>
  );
};

export default MainDocument;
