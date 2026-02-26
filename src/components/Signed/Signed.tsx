import React, { useEffect, useState } from "react";
import {
  FileText,
  CalendarDays,
  User,
  UserCheck,
  Building2,
  FileSignature,
  UserPlus,
  NotebookPenIcon,
  Database,
  Loader2,
} from "lucide-react";
import logo from "@/assets/hudud_logo.png";
import { useParams } from "react-router";
import dayjs from "dayjs";
import axios from "axios";

// Interfaces remain the same...
export interface SigningData {
  from_date: string;
  end_date: string;
  full_name: string;
  name: string;
  surname: string;
  address: string;
  region: string;
  country: string;
  PINFL: string;
  legan_inn: string;
  inn: string;
  email: string;
  title: string;
  organization: string;
  businessCategory: string;
}

export interface KeyData {
  organization: string;
  description: string;
  address: string;
  email: string;
}

export interface DocumentData {
  created_code: string;
  created_user: string;
  created_position: string;
  created_date: string;
  signing_user: string;
  signing_position: string;
  signing_date: string;
  created_link: string;
  file_url: string;
  signing_data: SigningData;
  key_data: KeyData;
}

function btoaUTF8(str: string) {
  return btoa(unescape(encodeURIComponent(str)));
}

const Signed: React.FC = () => {
  const [data, setData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const basicAuth = btoaUTF8("Проверка документов:B3W*li82s!");
        const response = await axios.get<DocumentData>(
          `https://ekomplektasiya.uz/Xaridlar/hs/document-verification/${id}`,
          {
            headers: { Authorization: `Basic ${basicAuth}` },
          }
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";

    const d = dayjs(dateString);
    if (!d.isValid()) return dateString; // noto‘g‘ri bo‘lsa aslini qaytaramiz

    // Varianti 1: 28.11.2025 14:32
    return d.format("DD.MM.YYYY HH:mm");

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
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 group hover:bg-gray-50 px-2 rounded-md transition">
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

  const SectionCard = ({
    title,
    icon: Icon,
    children,
  }: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Icon size={20} className="text-blue-700" />
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="p-2">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      <header className="w-full bg-white shadow-sm border-b border-gray-200 py-4 px-8 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <img
              src={logo}
              alt="logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-sm md:text-xl font-semibold text-gray-800">
            E-KOMPLEKTASIYA
          </h1>
        </div>
        <h1 className="text-sm md:text:xl font-semibold">Hujjat tekshirish</h1>
      </header>

      <main className="flex flex-1 flex-col-reverse md:flex-row min-h-0">
        <aside className="w-full md:w-96 bg-white border-r-2 shadow-2xl border-slate-200 flex-shrink-0 h-screen overflow-y-auto">
          <div className="p-5 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : data ? (
              <>
                <SectionCard title="Yaratuvchi ma'lumotlari" icon={UserPlus}>
                  <InfoItem
                    label="Hujjat kodi"
                    value={data.created_code}
                    icon={Database}
                  />
                  <InfoItem label="FIO" value={data.created_user} icon={User} />
                  <InfoItem
                    label="Lavozimi"
                    value={data.created_position}
                    icon={UserCheck}
                  />
                  <InfoItem
                    label="Yaratilgan sana"
                    value={formatDate(data.created_date)}
                    icon={CalendarDays}
                  />
                </SectionCard>

                <SectionCard
                  title="Imzolovchi ma'lumotlari"
                  icon={NotebookPenIcon}
                >
                  <InfoItem label="FIO" value={data.signing_user} icon={User} />
                  <InfoItem
                    label="Lavozimi"
                    value={data.signing_position}
                    icon={UserCheck}
                  />
                  <InfoItem
                    label="Imzolangan sana"
                    value={formatDate(data.signing_date)}
                    icon={CalendarDays}
                  />
                  <InfoItem
                    label="Havola"
                    value={data.created_link}
                    icon={FileText}
                  />
                </SectionCard>

                <SectionCard title="Kalit sertifikati" icon={Database}>
                  <InfoItem
                    label="Tashkilot"
                    value={data.key_data?.organization}
                    icon={Building2}
                  />
                  <InfoItem
                    label="Ta'rifi"
                    value={data.key_data?.description}
                    icon={FileText}
                  />
                  <InfoItem
                    label="Manzil"
                    value={data.key_data?.address}
                    icon={Building2}
                  />
                  <InfoItem
                    label="Email"
                    value={data.key_data?.email}
                    icon={User}
                  />
                </SectionCard>

                <SectionCard
                  title="Imzolovchi tafsilotlari"
                  icon={FileSignature}
                >
                  <div className="p-3">
                    <div className="bg-blue-50 rounded-lg p-4 mb-3 border-l-4 border-blue-500">
                      <p className="text-sm font-semibold text-gray-900">
                        {data.signing_data?.full_name || "-"}
                      </p>
                    </div>
                    <div className="grid gap-1">
                      <InfoItem
                        label="Ism"
                        value={data.signing_data?.name}
                        icon={User}
                      />
                      <InfoItem
                        label="Familiya"
                        value={data.signing_data?.surname}
                        icon={User}
                      />
                      <InfoItem
                        label="PINFL"
                        value={data.signing_data?.PINFL}
                        icon={Database}
                      />
                      <InfoItem
                        label="INN"
                        value={data.signing_data?.inn}
                        icon={Database}
                      />
                      <InfoItem
                        label="Tashkilot"
                        value={data.signing_data?.organization}
                        icon={Building2}
                      />
                      <InfoItem
                        label="Lavozim"
                        value={data.signing_data?.title}
                        icon={UserCheck}
                      />
                      <InfoItem
                        label="Biznes kategoriyasi"
                        value={data.signing_data?.businessCategory}
                        icon={FileText}
                      />
                      <InfoItem
                        label="Manzil"
                        value={data.signing_data?.address}
                        icon={Building2}
                      />
                      <InfoItem
                        label="Viloyat"
                        value={data.signing_data?.region}
                        icon={Building2}
                      />
                      <InfoItem
                        label="Davlat"
                        value={data.signing_data?.country}
                        icon={Building2}
                      />
                      <InfoItem
                        label="Email"
                        value={data.signing_data?.email}
                        icon={User}
                      />
                    </div>
                  </div>
                </SectionCard>
              </>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-500">Ma'lumot topilmadi</p>
              </div>
            )}
          </div>
        </aside>

        <section className="flex-1 min-h-[60vh] bg-gray-100 flex items-center justify-center p-6">
          <div className="w-full h-full min-h-[60vh] bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
            {data?.file_url ? (
              <iframe
                src={data.file_url}
                className="w-full h-full min-h-[60vh]"
                title="Document"
              />
            ) : (
              <p className="text-gray-500">Hujjat ko'rinishi mavjud emas</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Signed;
