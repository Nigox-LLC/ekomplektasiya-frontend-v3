import React, { useState } from "react";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Info,
  Link2,
  Package,
  Plus,
  RefreshCw,
  Search,
  UploadCloud,
  Users,
  X,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router";

const CreatePriceAnalysis: React.FC = () => {
  const navigate = useNavigate();

  const [createStep, setCreateStep] = useState<1 | 2 | 3 | 4>(1);

  const [chooseProductsOpen, setChooseProductsOpen] = useState(false);
  const [chooseOffersOpen, setChooseOffersOpen] = useState(false);
  const [uploadOfferOpen, setUploadOfferOpen] = useState(false);
  const [chooseEmployeesOpen, setChooseEmployeesOpen] = useState(false);

  const stepTitles: Record<
    1 | 2 | 3 | 4,
    { title: string; subtitle: string; icon: React.ReactNode }
  > = {
    1: {
      title: "Yangi narx tahlili yaratish",
      subtitle: "Tovarlar - Qadam 1/4",
      icon: <Package className="h-4 w-4" />,
    },
    2: {
      title: "Yangi narx tahlili yaratish",
      subtitle: "Tijoriy takliflar - Qadam 2/4",
      icon: <FileText className="h-4 w-4" />,
    },
    3: {
      title: "Yangi narx tahlili yaratish",
      subtitle: "Imzolovchilar - Qadam 3/4",
      icon: <Users className="h-4 w-4" />,
    },
    4: {
      title: "Yangi narx tahlili yaratish",
      subtitle: "Narx tahlili - Qadam 4/4",
      icon: <FileText className="h-4 w-4" />,
    },
  };

  const nextStep = () =>
    setCreateStep((s) => (s < 4 ? ((s + 1) as 1 | 2 | 3 | 4) : s));
  const prevStep = () =>
    setCreateStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s));

  const closeCreate = () => navigate("/price-analysis");

  const Btn = ({
    children,
    onClick,
    variant = "primary",
    className = "",
    disabled,
    title,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "ghost" | "danger";
    className?: string;
    disabled?: boolean;
    title?: string;
  }) => {
    const base =
      "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants: Record<string, string> = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
      secondary:
        "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
      ghost: "text-slate-700 hover:bg-slate-100",
      danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    };

    return (
      <button
        title={title}
        disabled={disabled}
        onClick={onClick}
        className={`${base} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>
  );

  const ModalShell = ({
    open,
    title,
    onClose,
    children,
    size = "lg",
  }: {
    open: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    size?: "sm" | "lg" | "xl";
  }) => {
    if (!open) return null;
    const width = size === "sm" ? "max-w-xl" : size === "xl" ? "max-w-5xl" : "max-w-3xl";
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className={`w-full ${width} overflow-hidden rounded-xl bg-white shadow-2xl`}>
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <div className="text-sm font-semibold text-slate-800">{title}</div>
              <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto p-5">{children}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">{stepTitles[createStep].icon}</span>
              {stepTitles[createStep].title}
            </div>
            <div className="mt-1 text-sm text-slate-500">{stepTitles[createStep].subtitle}</div>
          </div>
          <button onClick={closeCreate} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-auto bg-slate-50 p-4 md:p-5">
          {/* Step 1: Products */}
          {createStep === 1 && (
            <Card className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-sm font-semibold text-slate-800">Tovarlar</div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative w-full sm:w-80">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm" placeholder="Qidirish (Ctrl+F)" />
                  </div>
                  <Btn variant="primary" onClick={() => setChooseProductsOpen(true)}>
                    <Package className="h-4 w-4" />
                    Tovarlarni to'ldirish
                  </Btn>
                </div>
              </div>

              <div className="mt-4 overflow-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="border-b border-slate-200 px-4 py-3">№</th>
                      <th className="border-b border-slate-200 px-4 py-3">Tovar</th>
                      <th className="border-b border-slate-200 px-4 py-3">Kiruvchi №</th>
                      <th className="border-b border-slate-200 px-4 py-3">Chiquvchi №</th>
                      <th className="border-b border-slate-200 px-4 py-3">Tovar turi</th>
                      <th className="border-b border-slate-200 px-4 py-3">Model</th>
                      <th className="border-b border-slate-200 px-4 py-3">O'lcham</th>
                      <th className="border-b border-slate-200 px-4 py-3">O'lchov birligi</th>
                      <th className="border-b border-slate-200 px-4 py-3">Qoldiq</th>
                      <th className="border-b border-slate-200 px-4 py-3">Yangi miqdor</th>
                      <th className="border-b border-slate-200 px-4 py-3">Izoh</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={11} className="px-4 py-12 text-center text-sm text-slate-500">
                        Hali hech qanday tovar qo'shilmagan. “Tovarlarni to'ldirish" tugmasini bosing.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Step 2: Offers */}
          {createStep === 2 && (
            <Card className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Btn variant="secondary" onClick={() => setUploadOfferOpen(true)}>
                  <UploadCloud className="h-4 w-4" />
                  TK yuklash
                </Btn>
                <Btn variant="secondary" onClick={() => setChooseOffersOpen(true)}>
                  <FileText className="h-4 w-4" />
                  Mavjud TK yuklash
                </Btn>
                <Btn variant="secondary" onClick={() => {}}>
                  <Link2 className="h-4 w-4" />
                  Tovarlarga biriktirish
                </Btn>
              </div>

              <div className="mt-4 overflow-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="w-10 border-b border-slate-200 px-4 py-3">
                        <input type="checkbox" className="h-4 w-4" />
                      </th>
                      <th className="border-b border-slate-200 px-4 py-3">N</th>
                      <th className="border-b border-slate-200 px-4 py-3">Kirish nomer</th>
                      <th className="border-b border-slate-200 px-4 py-3">Kirish sanasi</th>
                      <th className="border-b border-slate-200 px-4 py-3">Tashkilot nomi</th>
                      <th className="border-b border-slate-200 px-4 py-3">INN</th>
                      <th className="border-b border-slate-200 px-4 py-3">TK sanasi</th>
                      <th className="border-b border-slate-200 px-4 py-3">Tijoriy taklif</th>
                      <th className="border-b border-slate-200 px-4 py-3">STAT</th>
                      <th className="border-b border-slate-200 px-4 py-3">Org info</th>
                      <th className="border-b border-slate-200 px-4 py-3">Xodimlar</th>
                      <th className="border-b border-slate-200 px-4 py-3">Yetkazib berish turi</th>
                      <th className="border-b border-slate-200 px-4 py-3">Tovarlarga biriktirish</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={13} className="px-4 py-12 text-center text-sm text-slate-500">
                        Tijoriy takliflar mavjud emas
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Step 3: Signers */}
          {createStep === 3 && (
            <Card className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm" placeholder="Поиск (Ctrl+F)" />
                </div>
                <Btn variant="primary" onClick={() => setChooseEmployeesOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Kiritish
                </Btn>
              </div>

              <div className="mt-4 overflow-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full min-w-[900px]">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="border-b border-slate-200 px-4 py-3">N</th>
                      <th className="border-b border-slate-200 px-4 py-3">IMZOLOVCHI XODIM</th>
                      <th className="border-b border-slate-200 px-4 py-3">LAVOZIM</th>
                      <th className="border-b border-slate-200 px-4 py-3">IMZO</th>
                      <th className="border-b border-slate-200 px-4 py-3">IMZOLANGAN VAQT</th>
                      <th className="border-b border-slate-200 px-4 py-3">HARAKATLAR</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={6} className="px-4 py-14">
                        <div className="mx-auto flex max-w-md flex-col items-center text-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                            <Users className="h-7 w-7" />
                          </div>
                          <div className="mt-4 text-sm font-semibold text-slate-800">Imzolovchilar mavjud emas</div>
                          <div className="mt-1 text-sm text-slate-500">Imzolovchi qo'shish uchun “Kiritish” tugmasini bosing</div>
                          <Btn className="mt-4" variant="primary" onClick={() => setChooseEmployeesOpen(true)}>
                            <Plus className="h-4 w-4" />
                            Imzolovchi qo'shish
                          </Btn>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Step 4: PDF Preview */}
          {createStep === 4 && (
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                <div className="text-sm font-semibold text-slate-800">Narx tahlili fayl</div>
                <div className="flex items-center gap-2">
                  <Btn variant="secondary" onClick={() => {}}>
                    <Download className="h-4 w-4" />
                    Yuklab olish
                  </Btn>
                  <Btn variant="primary" onClick={() => {}}>
                    <RefreshCw className="h-4 w-4" />
                    Yangilash
                  </Btn>
                </div>
              </div>
              <div className="bg-slate-900/5 p-4">
                <div className="h-[68vh] w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <div className="flex h-full items-center justify-center text-slate-500">
                    <div className="max-w-md text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        <FileText className="h-7 w-7" />
                      </div>
                      <div className="mt-3 text-sm font-semibold text-slate-800">PDF preview</div>
                      <div className="mt-1 text-sm text-slate-500">Bu joyda PDF viewer (iframe / pdfjs) turadi. Dizayn rasmdagidek joylab qo'yildi.</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Info className="h-4 w-4" />
            Qadam {createStep}/4
          </div>
          <div className="flex items-center gap-2">
            <Btn variant="secondary" onClick={prevStep} disabled={createStep === 1}>
              <ChevronLeft className="h-4 w-4" />
              Orqaga
            </Btn>
            <Btn variant="primary" onClick={nextStep} disabled={createStep === 4}>
              Davom etish
              <ChevronRight className="h-4 w-4" />
            </Btn>
          </div>
        </div>
      </div>

      {/* Nested small modals (choose products/offers/employees/upload) */}
      <ModalShell open={chooseProductsOpen} title="Tovarlarni tanlang" onClose={() => setChooseProductsOpen(false)} size="xl">
        <div className="relative">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm" placeholder="Tovarlarni qidirish..." />
          </div>

          <div className="mt-4 overflow-auto rounded-lg border border-slate-200">
            <table className="w-full min-w-[1100px] bg-white">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="w-10 border-b border-slate-200 px-4 py-3"><input type="checkbox" className="h-4 w-4" /></th>
                  <th className="border-b border-slate-200 px-4 py-3">Tanlash</th>
                  <th className="border-b border-slate-200 px-4 py-3">Kiruvchi №</th>
                  <th className="border-b border-slate-200 px-4 py-3">Chiquvchi №</th>
                  <th className="border-b border-slate-200 px-4 py-3">Tovar</th>
                  <th className="border-b border-slate-200 px-4 py-3">Tovar turi</th>
                  <th className="border-b border-slate-200 px-4 py-3">Model</th>
                  <th className="border-b border-slate-200 px-4 py-3">O'lcham</th>
                  <th className="border-b border-slate-200 px-4 py-3">O'lchov birligi</th>
                  <th className="border-b border-slate-200 px-4 py-3">Qoldiq</th>
                  <th className="border-b border-slate-200 px-4 py-3">Yangi miqdor</th>
                  <th className="border-b border-slate-200 px-4 py-3">Izoh</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(8)].map((_, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="border-b border-slate-200 px-4 py-3"><input type="checkbox" className="h-4 w-4" /></td>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{i + 1}</td>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">05/3-22</td>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">1-1-12</td>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-800">Elektrod (Uoni-13/55 mm)</td>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">Elektrod</td>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">-</td>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">-</td>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">Kg</td>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">4370</td>
                    <td className="border-b border-slate-200 px-4 py-3"><input className="w-20 rounded-md border border-slate-200 px-2 py-1 text-sm" defaultValue={1} /></td>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
            <div>
              Tanlangan: <span className="font-medium text-slate-800">0</span> ta tovar
            </div>
            <div className="flex items-center gap-2">
              <Btn variant="secondary" onClick={() => setChooseProductsOpen(false)}>Bekor qilish</Btn>
              <Btn variant="primary" onClick={() => setChooseProductsOpen(false)}>Tanlash (0)</Btn>
            </div>
          </div>
        </div>
      </ModalShell>

      <ModalShell open={chooseOffersOpen} title="Mavjud tijoriy takliflar" onClose={() => setChooseOffersOpen(false)} size="xl">
        <div className="flex items-center justify-between gap-2">
          <Btn variant="secondary" onClick={() => {}}><RefreshCw className="h-4 w-4" />Yangilash</Btn>
          <div className="relative w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm" placeholder="Qidirish" />
          </div>
        </div>
        <div className="mt-4 overflow-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[1100px] bg-white">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="w-10 border-b border-slate-200 px-4 py-3"><input type="checkbox" className="h-4 w-4" /></th>
                <th className="border-b border-slate-200 px-4 py-3">№</th>
                <th className="border-b border-slate-200 px-4 py-3">Foydalanuvchi</th>
                <th className="border-b border-slate-200 px-4 py-3">TK sanasi</th>
                <th className="border-b border-slate-200 px-4 py-3">Raqam</th>
                <th className="border-b border-slate-200 px-4 py-3">INN</th>
                <th className="border-b border-slate-200 px-4 py-3">Tashkilot</th>
                <th className="border-b border-slate-200 px-4 py-3">Stat</th>
                <th className="border-b border-slate-200 px-4 py-3">Orginfo</th>
                <th className="border-b border-slate-200 px-4 py-3">Commercial</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, i) => (
                <tr key={i} className={i === 1 ? "bg-blue-50" : "hover:bg-slate-50"}>
                  <td className="border-b border-slate-200 px-4 py-3"><input type="checkbox" className="h-4 w-4" defaultChecked={i === 1} /></td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{i + 1}</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">Zubaydullaeva Adiba</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">212</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">12121</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">yesdt</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">-</td>
                  <td className="border-b border-slate-200 px-4 py-3"><span className="inline-flex rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">АРИЗА.docx</span></td>
                  <td className="border-b border-slate-200 px-4 py-3"><span className="inline-flex rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">АРИЗА.docx</span></td>
                  <td className="border-b border-slate-200 px-4 py-3"><span className="inline-flex rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">images.jfif</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-sm text-slate-600">
          <div>1-19 of 19 items | <span className="font-medium text-slate-800">2 selected</span></div>
          <Btn variant="primary" onClick={() => setChooseOffersOpen(false)}>Tanlash (2)</Btn>
        </div>
      </ModalShell>

      <ModalShell open={uploadOfferOpen} title="Tijoriy taklif yuklash oynasi" onClose={() => setUploadOfferOpen(false)} size="sm">
        <div className="space-y-4">
          <div className="space-y-1"><label className="text-xs font-semibold text-slate-600">Kirish №</label><input className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Kirish raqamini kiriting" /></div>
          <div className="space-y-1"><label className="text-xs font-semibold text-slate-600">Kirish sanasi</label><input className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="DD.MM.YYYY" /></div>
          <div className="space-y-1"><label className="text-xs font-semibold text-slate-600">Tashkilot</label><input className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Tashkilot nomini kiriting" /></div>
          <div className="space-y-1"><label className="text-xs font-semibold text-slate-600">STIR</label><input className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="STIR raqamini kiriting" /></div>
          <div className="space-y-1"><label className="text-xs font-semibold text-slate-600">Yetkazib berish sharti</label><select className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"><option>Tanlang</option></select></div>
          <div className="space-y-1"><label className="text-xs font-semibold text-slate-600">Yetkazib berish muddati</label><input className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Muddatni kiriting" /></div>

          { ["Org info", "STAT", "Tijoriy taklif faylini tanlang"].map((label) => (
            <div key={label} className="space-y-1"><label className="text-xs font-semibold text-slate-600">{label}</label><div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"><span>Faylni bu yerga tashlang yoki tanlang</span><button className="text-blue-600 hover:underline">Fayl tanlash</button></div></div>
          ))}

          <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
            <Btn variant="secondary" onClick={() => setUploadOfferOpen(false)}>Bekor qilish</Btn>
            <Btn variant="primary" onClick={() => setUploadOfferOpen(false)}>Saqlash</Btn>
          </div>
        </div>
      </ModalShell>

      <ModalShell open={chooseEmployeesOpen} title="Barcha xodimlar ro'yxati" onClose={() => setChooseEmployeesOpen(false)} size="xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm" placeholder="Xodimlarni qidirish..." />
        </div>
        <div className="mt-4 overflow-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[900px] bg-white">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="w-10 border-b border-slate-200 px-4 py-3"><input type="checkbox" className="h-4 w-4" /></th>
                <th className="border-b border-slate-200 px-4 py-3">№</th>
                <th className="border-b border-slate-200 px-4 py-3">F.I.Sh</th>
                <th className="border-b border-slate-200 px-4 py-3">Lavozim</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(9)].map((_, i) => (
                <tr key={i} className={i === 0 ? "bg-blue-50" : "hover:bg-slate-50"}>
                  <td className="border-b border-slate-200 px-4 py-3"><input type="checkbox" className="h-4 w-4" defaultChecked={i === 0} /></td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">{i + 1}</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-800">Lutfullayev Utku(r) Talatovich</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">Direktor</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Btn variant="ghost" onClick={() => {}} className="text-slate-500">Tozalash</Btn>
            <div>Tanlanganlar: <span className="font-medium text-slate-800">0</span></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-slate-500">Jami: 54 • 1/3</div>
            <Btn variant="secondary" onClick={() => {}}>Oldingi</Btn>
            <Btn variant="secondary" onClick={() => {}}>Keyingi</Btn>
            <Btn variant="primary" onClick={() => setChooseEmployeesOpen(false)}>Tanlash (0)</Btn>
          </div>
        </div>
      </ModalShell>
    </div>
  );
};

export default CreatePriceAnalysis;
