import React, { useEffect, useState } from "react";
import {
  FileText,
  CalendarDays,
  User,
  Building2,
  Loader2,
  ArrowRightLeft,
  Folder,
  CheckCircle,
} from "lucide-react";
import logo from "@/assets/hudud_logo.png";
import { useParams } from "react-router";
import dayjs from "dayjs";
import axios from "axios";

interface DocumentData {
  incoming: string;
  outgoing: string;
  department: string;
  sub_department: string;
  sender: string;
  receiver: string;
  create_at: string;
  done_date: string;
  who_signed: string;
  file_pdf_url: string;
}

const Signed: React.FC = () => {
  const [data, setData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const response = await axios.get<DocumentData>(
          `https://v3.ekomplektasiya.uz/api/document/orders/qr-code/${id}/`
        );
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch document:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDocument();
  }, [id]);

  const formatDate = (date?: string) => {
    if (!date) return "-";
    const d = dayjs(date);
    return d.isValid() ? d.format("DD.MM.YYYY HH:mm") : date;
  };

  const InfoItem = ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value?: string;
    icon: React.ElementType;
  }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded-md transition">
      <div className="mt-0.5 text-blue-600 flex-shrink-0">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-sm text-gray-900 font-medium break-words">
          {value || "-"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="w-full bg-white shadow-sm border-b border-gray-200 py-4 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
          <h1 className="text-lg font-semibold text-gray-800">
            E-KOMPLEKTASIYA
          </h1>
        </div>
        <h1 className="text-lg font-semibold">Hujjat tekshirish</h1>
      </header>

      <main className="flex flex-1 flex-col md:flex-row">
        {/* LEFT SIDE INFO */}
        <aside className="w-full md:w-96 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-5 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : data ? (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-blue-50 px-4 py-3 border-b">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Hujjat ma'lumotlari
                    </h3>
                  </div>

                  <div className="p-2">
                    <InfoItem
                      label="Incoming raqam"
                      value={data.incoming}
                      icon={ArrowRightLeft}
                    />
                    <InfoItem
                      label="Outgoing raqam"
                      value={data.outgoing}
                      icon={ArrowRightLeft}
                    />
                    <InfoItem
                      label="Bo‘lim"
                      value={data.department}
                      icon={Building2}
                    />
                    <InfoItem
                      label="Sub bo‘lim"
                      value={data.sub_department}
                      icon={Folder}
                    />
                    <InfoItem
                      label="Yuboruvchi"
                      value={data.sender}
                      icon={User}
                    />
                    <InfoItem
                      label="Qabul qiluvchi"
                      value={data.receiver}
                      icon={User}
                    />
                    <InfoItem
                      label="Yaratilgan sana"
                      value={formatDate(data.create_at)}
                      icon={CalendarDays}
                    />
                    <InfoItem
                      label="Bajarilgan sana"
                      value={formatDate(data.done_date)}
                      icon={CalendarDays}
                    />
                    <InfoItem
                      label="Imzolagan shaxs"
                      value={data.who_signed}
                      icon={CheckCircle}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                Ma'lumot topilmadi
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT SIDE PDF */}
        <section className="flex-1 bg-gray-100 p-6 flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-200">
            {data?.file_pdf_url ? (
              <iframe
                src={data.file_pdf_url}
                title="PDF"
                className="w-full h-[85vh] rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Hujjat PDF mavjud emas
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Signed;