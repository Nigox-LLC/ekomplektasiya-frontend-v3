import { axiosAPI } from "@/service/axiosAPI";
import { Button, Card } from "antd";
import { FileText, Pencil, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IProps {
  orderDataID: number | null;
}

export interface MainDocument {
  id: number;
  file_name: string;
  file_url: string;
}

const MainDocument: React.FC<IProps> = ({ orderDataID }) => {
  const [fileTemplates, setFileTemplates] = useState<IDName[]>([]);
  const [showTemplatesList, setShowTemplatesList] = useState(false);

  const [mainDocument, setMainDocument] = useState<MainDocument | null>(null);

  var newWindow: Window | null = null;

  window.addEventListener("message", (e) => {
    // console.log("Parent received message:", e.data);

    if (e.data && e.data.status === "ready" && newWindow && mainDocument) {
      // console.log("✅ Child window tayyor!");
      const token = localStorage.getItem("v3_ganiwer");

      var data = {
        input_url: mainDocument.file_url,
        output_url:
          axiosAPI.getUri() + `/document/orders/word/${mainDocument.id}/`,
        v3_ganiwer: token,
      };

      newWindow.postMessage(data, "*");
    }

    if (e.data && e.data.status === "loaded") {
      console.log("✅ Hujjat yuklandi:", e.data.url);
    }
  });

  function openEditor() {
    const url = "https://editor.ekomplektasiya.uz/";
    const features =
      "width=1200,height=800,menubar=no,toolbar=no,location=no,status=no";
    newWindow = window.open(url, "SuperDocWindow", features);
  }

  const createMainDocByTemplate = async (templateID: number) => {
    try {
      const response = await axiosAPI.post(
        `document/orders/${orderDataID}/add-file/`,
        {
          template_id: templateID,
        },
      );

      if (response.status === 200) setMainDocument(response.data);
    } catch (error) {
      console.log(error);
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

  return (
    <>
      {mainDocument ? (
        <>
          <Card className="border-2 border-blue-200 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{mainDocument?.file_name}</p>
                  <p className="text-xs text-gray-500">Asosiy hujjat</p>
                </div>
              </div>

              <Button
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 border-none text-white"
                onClick={() => openEditor()}
              >
                <Pencil className="w-4 h-4" />
                Tahrirlash
              </Button>
            </div>
          </Card>
        </>
      ) : (
        <div className="flex flex-col items-start gap-2 my-6">
          <p>Asosiy fayl qo'shish</p>
          <Button
            onClick={() => {
              if (fileTemplates.length > 0) {
                setShowTemplatesList(true);
              } else {
                toast.error("Shablonlar mavjud emas!");
              }
            }}
            className="ml-[50%] translate-x-[-50%]"
          >
            Asosiy fayl
            <Plus className="w-4 h-4" />
            {showTemplatesList && (
              <div className="absolute top-0 left-full bg-white border-2 border-slate-200 rounded-md shadow-md">
                {fileTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer w-full text-start text-black!"
                    onClick={() => createMainDocByTemplate(template.id)}
                  >
                    <p>{template.name}</p>
                  </div>
                ))}
              </div>
            )}
          </Button>
        </div>
      )}
    </>
  );
};

export default MainDocument;
