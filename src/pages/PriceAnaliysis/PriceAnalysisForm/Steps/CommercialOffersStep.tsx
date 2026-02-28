// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   X,
//   RefreshCw,
//   Upload,
//   FolderOpen,
//   Paperclip,
//   Hash,
//   Calendar,
//   Building2,
//   Globe,
//   Clock,
//   FileText,
//   Package,
// } from "lucide-react";
// import { axiosAPI } from "@/service/axiosAPI";
// import { toast } from "react-toastify";
// import { Button, Input, InputNumber } from "antd";
// import FileDropZoneSteps from "./FileDropZoneSteps";
// import type { PriceAnalysisFormData, CommercialOffer, Product } from "../PriceAnalysisForm";

// interface CommercialOffersStepProps {
//   formData: PriceAnalysisFormData;
//   setFormData: React.Dispatch<React.SetStateAction<PriceAnalysisFormData>>;
// }

// interface CommercialApiResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: CommercialOffer[];
// }

// interface DeliveryCondition {
//   id: number;
//   name: string;
// }

// /* ─────────────────── Reusable Field Label ─────────────────── */
// const FieldLabel: React.FC<{ icon: React.ReactNode; label: string; required?: boolean }> = ({
//   icon,
//   label,
//   required,
// }) => (
//   <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
//     <span className="text-blue-500">{icon}</span>
//     {label}
//     {required && <span className="text-red-500">*</span>}
//   </label>
// );

// /* ─────────────────── Styled Input ─────────────────── */
// const StyledInput: React.FC<{
//   placeholder?: string;
//   type?: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   icon?: React.ReactNode;
// }> = ({ placeholder, type = "text", value, onChange, icon }) => (
//   <div className="relative">
//     {icon && (
//       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
//         {icon}
//       </span>
//     )}
//     <input
//       type={type}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-white
//         placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
//         transition-all duration-150 ${icon ? "pl-10" : ""}`}
//     />
//   </div>
// );

// /* ─────────────────── Upload Modal ─────────────────── */
// const UploadModal: React.FC<{
//   onClose: () => void;
//   onSubmit: () => void;
//   uploading: boolean;
//   uploadForm: any;
//   setUploadForm: (v: any) => void;
//   deliveryConditions: DeliveryCondition[];
//   orgInfoFile: File | null;
//   setOrgInfoFile: (f: File | null) => void;
//   statFile: File | null;
//   setStatFile: (f: File | null) => void;
//   commercialFile: File | null;
//   setCommercialFile: (f: File | null) => void;
// }> = ({
//   onClose,
//   onSubmit,
//   uploading,
//   uploadForm,
//   setUploadForm,
//   deliveryConditions,
//   orgInfoFile,
//   setOrgInfoFile,
//   statFile,
//   setStatFile,
//   commercialFile,
//   setCommercialFile,
// }) => {
//     return (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//         <div
//           className="bg-white rounded-2xl w-full max-w-[540px] max-h-[95vh] overflow-y-auto shadow-2xl"
//           style={{ scrollbarWidth: "thin" }}
//         >
//           {/* Header */}
//           <div
//             className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
//             style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" }}
//           >
//             <div className="flex items-center gap-3">
//               <div className="bg-white/20 rounded-lg p-2">
//                 <FileText size={18} className="text-white" />
//               </div>
//               <h2 className="text-base font-bold text-white tracking-wide">
//                 Tijoriy taklif yuklash oynasi
//               </h2>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           {/* Body */}
//           <div className="px-6 py-5 space-y-4">
//             {/* Kirish № */}
//             <div>
//               <FieldLabel icon={<Hash size={15} />} label="Kirish №" required />
//               <StyledInput
//                 icon={<Hash size={15} />}
//                 placeholder="Kirish raqamini kiriting"
//                 value={uploadForm.number}
//                 onChange={(e) => setUploadForm({ ...uploadForm, number: e.target.value })}
//               />
//             </div>

//             {/* Kirish sanasi */}
//             <div>
//               <FieldLabel icon={<Calendar size={15} />} label="Kirish sanasi" required />
//               <StyledInput
//                 icon={<Calendar size={15} />}
//                 type="date"
//                 placeholder="ДД.ММ.ГГГГ"
//                 value={uploadForm.date}
//                 onChange={(e) => setUploadForm({ ...uploadForm, date: e.target.value })}
//               />
//             </div>

//             {/* Tashkilot */}
//             <div>
//               <FieldLabel icon={<Building2 size={15} />} label="Tashkilot" required />
//               <StyledInput
//                 icon={<Building2 size={15} />}
//                 placeholder="Tashkilot nomini kiriting"
//                 value={uploadForm.organization}
//                 onChange={(e) => setUploadForm({ ...uploadForm, organization: e.target.value })}
//               />
//             </div>

//             {/* STIR */}
//             <div>
//               <FieldLabel icon={<Hash size={15} />} label="STIR" required />
//               <StyledInput
//                 icon={<Hash size={15} />}
//                 placeholder="STIR raqamini kiriting"
//                 value={uploadForm.stir}
//                 onChange={(e) => setUploadForm({ ...uploadForm, stir: e.target.value })}
//               />
//             </div>

//             {/* Yetkazib berish sharti */}
//             <div>
//               <FieldLabel icon={<Globe size={15} />} label="Yetkazib berish sharti" />
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
//                   <Globe size={15} />
//                 </span>
//                 <select
//                   className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 bg-white
//                   appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
//                   transition-all duration-150"
//                   value={uploadForm.delivery_condition}
//                   onChange={(e) => setUploadForm({ ...uploadForm, delivery_condition: e.target.value })}
//                 >
//                   <option value="">Tanlang</option>
//                   {deliveryConditions.map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.name}
//                     </option>
//                   ))}
//                 </select>
//                 <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <polyline points="6 9 12 15 18 9" />
//                   </svg>
//                 </span>
//               </div>
//             </div>

//             {/* Yetkazib berish muddati */}
//             <div>
//               <FieldLabel icon={<Clock size={15} />} label="Yetkazib berish muddati" required />
//               <StyledInput
//                 icon={<Clock size={15} />}
//                 type="number"
//                 placeholder="Muddatni kiriting"
//                 value={uploadForm.delivery_day}
//                 onChange={(e) => setUploadForm({ ...uploadForm, delivery_day: e.target.value })}
//               />
//             </div>

//             {/* Org Info */}
//             <div>
//               <FieldLabel icon={<FileText size={15} />} label="Org Info" />
//               <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
//                 <FileDropZoneSteps file={orgInfoFile} setFile={setOrgInfoFile} />
//               </div>
//             </div>

//             {/* STAT */}
//             <div>
//               <FieldLabel icon={<FileText size={15} />} label="STAT" />
//               <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
//                 <FileDropZoneSteps file={statFile} setFile={setStatFile} />
//               </div>
//             </div>

//             {/* Tijoriy taklif faylini tanlang */}
//             <div>
//               <FieldLabel icon={<FileText size={15} />} label="Tijoriy taklif faylini tanlang" required />
//               <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
//                 <FileDropZoneSteps file={commercialFile} setFile={setCommercialFile} />
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="flex justify-end gap-3 px-6 pb-6">
//             <button
//               onClick={onClose}
//               className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600
//               hover:bg-gray-50 transition-colors"
//             >
//               Bekor qilish
//             </button>
//             <button
//               onClick={onSubmit}
//               disabled={uploading}
//               className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150
//               disabled:opacity-50 disabled:cursor-not-allowed"
//               style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" }}
//             >
//               {uploading ? "Yuklanmoqda..." : "Saqlash"}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

// /* ─────────────────── Main Component ─────────────────── */
// const CommercialOffersStep: React.FC<CommercialOffersStepProps> = ({ formData, setFormData }) => {
//   const [showSelectModal, setShowSelectModal] = useState(false);
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [showAttachModal, setShowAttachModal] = useState(false);
//   const [currentAttachOfferId, setCurrentAttachOfferId] = useState<number | null>(null);

//   const [offers, setOffers] = useState<CommercialOffer[]>([]);
//   const [offersLoading, setOffersLoading] = useState(false);
//   const [offersNext, setOffersNext] = useState<string | null>(null);
//   const [offersPrev, setOffersPrev] = useState<string | null>(null);
//   const [offersTotal, setOffersTotal] = useState(0);
//   const [selectSearch, setSelectSearch] = useState("");
//   const [selectedOffersMap, setSelectedOffersMap] = useState<Map<number, CommercialOffer>>(new Map());

//   const [deliveryConditions, setDeliveryConditions] = useState<DeliveryCondition[]>([]);
//   const [uploadForm, setUploadForm] = useState({
//     number: "",
//     date: "",
//     organization: "",
//     stir: "",
//     delivery_condition: "",
//     delivery_day: "",
//     description: "",
//   });
//   const [orgInfoFile, setOrgInfoFile] = useState<File | null>(null);
//   const [statFile, setStatFile] = useState<File | null>(null);
//   const [commercialFile, setCommercialFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);

//   const [attachPrices, setAttachPrices] = useState<Record<number, number>>({});

//   useEffect(() => {
//     if (showSelectModal) fetchOffers("/document/analysis/commercial/");
//   }, [showSelectModal]);

//   useEffect(() => {
//     if (showUploadModal) fetchDeliveryConditions();
//   }, [showUploadModal]);

//   useEffect(() => {
//     const map = new Map<number, CommercialOffer>();
//     formData.commercials.forEach((off) => map.set(off.id, off));
//     setSelectedOffersMap(map);
//   }, [formData.commercials]);

//   useEffect(() => {
//     if (showAttachModal && currentAttachOfferId) {
//       const existing = formData.attachments[currentAttachOfferId] || [];
//       const prices: Record<number, number> = {};
//       existing.forEach((item) => { prices[item.productId] = item.price; });
//       setAttachPrices(prices);
//     }
//   }, [showAttachModal, currentAttachOfferId, formData.attachments]);

//   const fetchOffers = async (url: string) => {
//     setOffersLoading(true);
//     try {
//       const res = await axiosAPI.get<CommercialApiResponse>(url);
//       setOffers(res.data.results);
//       setOffersNext(res.data.next);
//       setOffersPrev(res.data.previous);
//       setOffersTotal(res.data.count);
//     } catch {
//       toast.error("Tijoriy takliflarni yuklashda xatolik");
//     } finally {
//       setOffersLoading(false);
//     }
//   };

//   const fetchDeliveryConditions = async () => {
//     try {
//       const res = await axiosAPI.get<any>("/directory/delivery/");
//       if (Array.isArray(res.data)) setDeliveryConditions(res.data);
//       else if (res.data.results) setDeliveryConditions(res.data.results);
//       else setDeliveryConditions([]);
//     } catch {
//       console.error("Failed to load delivery conditions");
//     }
//   };

//   const toggleOfferSelection = (offer: CommercialOffer, checked: boolean) => {
//     setSelectedOffersMap((prev) => {
//       const newMap = new Map(prev);
//       if (checked) newMap.set(offer.id, offer);
//       else newMap.delete(offer.id);
//       return newMap;
//     });
//   };

//   const toggleSelectAllOffers = (checked: boolean) => {
//     if (checked) {
//       const newMap = new Map<number, CommercialOffer>();
//       offers.forEach((o) => newMap.set(o.id, o));
//       setSelectedOffersMap(newMap);
//     } else {
//       setSelectedOffersMap(new Map());
//     }
//   };

//   const handleAddSelectedOffers = () => {
//     setFormData((prev) => ({ ...prev, commercials: Array.from(selectedOffersMap.values()) }));
//     setShowSelectModal(false);
//   };

//   const handleUploadSubmit = async () => {
//     if (!uploadForm.number || !uploadForm.date || !uploadForm.organization || !uploadForm.stir || !uploadForm.delivery_day) {
//       toast.warning("Barcha majburiy maydonlarni to'ldiring");
//       return;
//     }
//     if (!commercialFile) {
//       toast.warning("Tijoriy taklif fayli majburiy");
//       return;
//     }
//     const formDataObj = new FormData();
//     formDataObj.append("number", uploadForm.number);
//     formDataObj.append("date", uploadForm.date);
//     formDataObj.append("organization", uploadForm.organization);
//     formDataObj.append("stir", uploadForm.stir);
//     formDataObj.append("delivery_day", uploadForm.delivery_day);
//     if (uploadForm.delivery_condition) formDataObj.append("delivery_condition", uploadForm.delivery_condition);
//     formDataObj.append("description", uploadForm.description);
//     if (orgInfoFile) formDataObj.append("org_info", orgInfoFile);
//     if (statFile) formDataObj.append("stat", statFile);
//     formDataObj.append("file", commercialFile);

//     setUploading(true);
//     try {
//       const res = await axiosAPI.post("/document/analysis/commercial/", formDataObj, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setFormData((prev) => ({ ...prev, commercials: [...prev.commercials, res.data] }));
//       setShowUploadModal(false);
//       toast.success("Tijoriy taklif yuklandi");
//       setUploadForm({ number: "", date: "", organization: "", stir: "", delivery_condition: "", delivery_day: "", description: "" });
//       setOrgInfoFile(null);
//       setStatFile(null);
//       setCommercialFile(null);
//     } catch {
//       toast.error("Yuklashda xatolik");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const openAttachModal = (offerId: number) => {
//     if (formData.products.length === 0) {
//       toast.warning("Avval tovarlarni tanlang");
//       return;
//     }
//     setCurrentAttachOfferId(offerId);
//     setShowAttachModal(true);
//   };

//   const handleSaveAttachments = () => {
//     if (!currentAttachOfferId) return;
//     const attachments = Object.entries(attachPrices)
//       .filter(([_, price]) => price > 0)
//       .map(([productId, price]) => ({ productId: Number(productId), price }));
//     setFormData((prev) => ({
//       ...prev,
//       attachments: { ...prev.attachments, [currentAttachOfferId!]: attachments },
//     }));
//     setShowAttachModal(false);
//     toast.success("Biriktirish saqlandi");
//   };

//   const filteredOffers = offers.filter(
//     (o) =>
//       o.number.toLowerCase().includes(selectSearch.toLowerCase()) ||
//       o.organization.toLowerCase().includes(selectSearch.toLowerCase())
//   );

//   return (
//     <div>
//       <div className="flex flex-wrap gap-2 mb-4">
//         <Button icon={<Upload size={16} />} onClick={() => setShowUploadModal(true)}>
//           TK yuklash
//         </Button>
//         <Button icon={<FolderOpen size={16} />} onClick={() => setShowSelectModal(true)}>
//           Mavjud TK yuklash
//         </Button>
//       </div>

//       {/* Main table */}
//       <div className="border border-gray-200 rounded-md overflow-x-auto">
//         <table className="w-full border-collapse text-sm">
//           <thead className="bg-slate-50">
//             <tr>
//               {["N", "Kirish nomer", "Kirish sanasi", "Tashkilot nomi", "INN", "TK sanasi", "Tijoriy taklif", "STAT", "Org info", "Xodimlar", "Yetkazib berish turi", "Tovarlarga biriktirish"].map((h) => (
//                 <th key={h} className="px-4 py-2 font-medium text-left">{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {formData.commercials.length === 0 ? (
//               <tr>
//                 <td colSpan={12} className="text-center py-8 text-gray-500">
//                   Tijoriy takliflar mavjud emas
//                 </td>
//               </tr>
//             ) : (
//               formData.commercials.map((offer, idx) => (
//                 <tr key={offer.id} className="border-t border-gray-200">
//                   <td className="px-4 py-2">{idx + 1}</td>
//                   <td className="px-4 py-2">{offer.number}</td>
//                   <td className="px-4 py-2">{new Date(offer.date).toLocaleDateString("uz-UZ")}</td>
//                   <td className="px-4 py-2">{offer.organization}</td>
//                   <td className="px-4 py-2">{offer.stir}</td>
//                   <td className="px-4 py-2">{new Date(offer.date).toLocaleDateString("uz-UZ")}</td>
//                   <td className="px-4 py-2">{offer.file_name ? <span className="text-xs bg-gray-100 px-2 py-1 rounded">{offer.file_name}</span> : '-'}</td>
//                   <td className="px-4 py-2">{offer.stat_name ? <span className="text-xs bg-gray-100 px-2 py-1 rounded">{offer.stat_name}</span> : '-'}</td>
//                   <td className="px-4 py-2">{offer.org_info_name ? <span className="text-xs bg-gray-100 px-2 py-1 rounded">{offer.org_info_name}</span> : '-'}</td>
//                   <td className="px-4 py-2">{offer.employee_name || '-'}</td>
//                   <td className="px-4 py-2">{offer.delivery_condition_name || '-'}</td>
//                   <td className="px-4 py-2">
//                     <button onClick={() => openAttachModal(offer.id)} className="text-blue-600 hover:underline flex items-center gap-1">
//                       <Paperclip size={16} />
//                       {formData.attachments[offer.id]?.length ? (
//                         <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
//                           {formData.attachments[offer.id].length}
//                         </span>
//                       ) : "Biriktirish"}
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Select Modal */}
//       {showSelectModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg w-[95%] h-[90%] flex flex-col">
//             <div className="flex justify-between items-center p-4 border-b">
//               <h2 className="text-lg font-semibold">Mavjud tijoriy takliflar</h2>
//               <button onClick={() => setShowSelectModal(false)}><X /></button>
//             </div>
//             <div className="p-4 flex-1 overflow-auto">
//               <div className="flex justify-between mb-4">
//                 <Button onClick={() => fetchOffers("/document/analysis/commercial/")} icon={<RefreshCw size={16} />}>
//                   Yangilash
//                 </Button>
//                 <Input
//                   placeholder="Qidirish"
//                   prefix={<Search size={16} className="text-gray-400" />}
//                   className="w-64"
//                   value={selectSearch}
//                   onChange={(e) => setSelectSearch(e.target.value)}
//                 />
//               </div>
//               {offersLoading ? (
//                 <div className="text-center py-8">Yuklanmoqda...</div>
//               ) : (
//                 <>
//                   <div className="rounded overflow-auto">
//                     <table className="w-full min-w-[1100px]">
//                       <thead className="bg-slate-50 sticky top-0">
//                         <tr>
//                           <th className="px-4 py-2 w-10">
//                             <input type="checkbox"
//                               checked={offers.length > 0 && selectedOffersMap.size === offers.length}
//                               onChange={(e) => toggleSelectAllOffers(e.target.checked)}
//                             />
//                           </th>
//                           {["№", "Kirish nomer", "Kirish sanasi", "Tashkilot nomi", "INjhN", "TK sanasi", "Tijoriy taklif", "STAT", "Org info", "Xodimlar", "Yetkazib berish turi"].map((h) => (
//                             <th key={h} className="px-4 py-2 text-left">{h}</th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredOffers.map((offer, idx) => {
//                           const selected = selectedOffersMap.has(offer.id);
//                           return (
//                             <tr key={offer.id} className={selected ? "bg-blue-50" : ""}>
//                               <td className="px-4 py-2">
//                                 <input type="checkbox" checked={selected}
//                                   onChange={(e) => toggleOfferSelection(offer, e.target.checked)}
//                                 />
//                               </td>
//                               <td className="px-4 py-2">{idx + 1}</td>
//                               <td className="px-4 py-2">{offer.number}</td>
//                               <td className="px-4 py-2">{new Date(offer.date).toLocaleDateString("uz-UZ")}</td>
//                               <td className="px-4 py-2">{offer.organization}</td>
//                               <td className="px-4 py-2">{offer.stir}</td>
//                               <td className="px-4 py-2">{new Date(offer.date).toLocaleDateString("uz-UZ")}</td>
//                               <td className="px-4 py-2">{offer.file_name || '-'}</td>
//                               <td className="px-4 py-2">{offer.stat_name || '-'}</td>
//                               <td className="px-4 py-2">{offer.org_info_name || '-'}</td>
//                               <td className="px-4 py-2">{offer.employee_name || '-'}</td>
//                               <td className="px-4 py-2">{offer.delivery_condition_name || '-'}</td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                   <div className="flex justify-between items-center mt-4">
//                     <div>Jami: {offersTotal} ta | Tanlangan: {selectedOffersMap.size}</div>
//                     <div className="flex gap-2">
//                       <button className="px-3 py-1 border rounded disabled:opacity-50" disabled={!offersPrev}
//                         onClick={() => offersPrev && fetchOffers(offersPrev)}>Oldingi</button>
//                       <button className="px-3 py-1 border rounded disabled:opacity-50" disabled={!offersNext}
//                         onClick={() => offersNext && fetchOffers(offersNext)}>Keyingi</button>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//             <div className="flex justify-end gap-2 p-4 border-t">
//               <button onClick={() => setShowSelectModal(false)} className="px-4 py-2 border rounded">Bekor qilish</button>
//               <button onClick={handleAddSelectedOffers} disabled={selectedOffersMap.size === 0}
//                 className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
//                 Tanlash ({selectedOffersMap.size})
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Upload Modal */}
//       {showUploadModal && (
//         <UploadModal
//           onClose={() => setShowUploadModal(false)}
//           onSubmit={handleUploadSubmit}
//           uploading={uploading}
//           uploadForm={uploadForm}
//           setUploadForm={setUploadForm}
//           deliveryConditions={deliveryConditions}
//           orgInfoFile={orgInfoFile}
//           setOrgInfoFile={setOrgInfoFile}
//           statFile={statFile}
//           setStatFile={setStatFile}
//           commercialFile={commercialFile}
//           setCommercialFile={setCommercialFile}
//         />
//       )}

//       {/* Attach Modal */}
//       {showAttachModal && currentAttachOfferId && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

//             {/* ── Header ── */}
//             <div
//               className="flex items-center justify-between px-6 py-4 shrink-0"
//               style={{ background: "linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%)" }}
//             >
//               <div className="flex items-center gap-3">
//                 <div className="bg-white/20 rounded-xl p-2.5">
//                   <Paperclip size={20} className="text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-base font-bold text-white tracking-wide">Tovarlarni biriktirish</h2>
//                   <p className="text-blue-200 text-xs mt-0.5">
//                     {formData.products.length} ta tovar mavjud
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowAttachModal(false)}
//                 className="text-white/70 hover:text-white hover:bg-white/10 transition-all p-2 rounded-xl"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* ── Body ── */}
//             <div className="flex-1 overflow-auto p-6">
//               {formData.products.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-16 text-gray-400">
//                   <Package size={48} className="mb-3 opacity-30" />
//                   <p className="text-base font-medium">Avval tovarlarni tanlang</p>
//                 </div>
//               ) : (
//                 <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
//                   <table className="w-full">
//                     <thead>
//                       <tr style={{ background: "linear-gradient(90deg, #eff6ff 0%, #f0f9ff 100%)" }}>
//                         <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
//                           #
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
//                           Tovar
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
//                           Tovar turi
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
//                           Model
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
//                           O'lcham
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
//                           O'lchov birligi
//                         </th>
//                         <th className="px-4 py-3 text-center text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
//                           Miqdor
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
//                           Narx (so'm)
//                         </th>
//                         <th className="px-4 py-3 text-right text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
//                           Summa
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {formData.products.map((prod, idx) => {
//                         const price = attachPrices[prod.id] || 0;
//                         const total = price * prod.selectedQuantity;
//                         const isEven = idx % 2 === 0;
//                         return (
//                           <tr
//                             key={prod.id}
//                             className={`transition-colors hover:bg-blue-50/60 ${isEven ? "bg-white" : "bg-slate-50/50"}`}
//                           >
//                             {/* # */}
//                             <td className="px-4 py-3.5 border-b border-gray-100">
//                               <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
//                                 {idx + 1}
//                               </span>
//                             </td>
//                             {/* Tovar */}
//                             <td className="px-4 py-3.5 border-b border-gray-100">
//                               <span className="font-semibold text-gray-800 text-sm">{prod.product_name}</span>
//                             </td>
//                             {/* Tovar turi */}
//                             <td className="px-4 py-3.5 border-b border-gray-100">
//                               <span className="inline-block bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100">
//                                 {prod.product_type?.name || "—"}
//                               </span>
//                             </td>
//                             {/* Model */}
//                             <td className="px-4 py-3.5 border-b border-gray-100">
//                               <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100">
//                                 {prod.product_model?.name || "—"}
//                               </span>
//                             </td>
//                             {/* O'lcham */}
//                             <td className="px-4 py-3.5 border-b border-gray-100 text-sm text-gray-600">
//                               {prod.size?.name || "—"}
//                             </td>
//                             {/* O'lchov birligi */}
//                             <td className="px-4 py-3.5 border-b border-gray-100">
//                               <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-100">
//                                 {prod.unit?.name || "—"}
//                               </span>
//                             </td>
//                             {/* Miqdor */}
//                             <td className="px-4 py-3.5 border-b border-gray-100 text-center">
//                               <span className="inline-flex items-center justify-center min-w-[2rem] h-7 bg-blue-600 text-white text-xs font-bold px-2 rounded-lg">
//                                 {prod.selectedQuantity}
//                               </span>
//                             </td>
//                             {/* Narx */}
//                             <td className="px-4 py-3.5 border-b border-gray-100">
//                               <InputNumber
//                                 value={price}
//                                 onChange={(val) =>
//                                   setAttachPrices((prev) => ({ ...prev, [prod.id]: val || 0 }))
//                                 }
//                                 min={0}
//                                 step={0.01}
//                                 className="w-36"
//                                 style={{
//                                   borderRadius: "10px",
//                                   border: "1.5px solid #e2e8f0",
//                                 }}
//                                 placeholder="0.00"
//                               />
//                             </td>
//                             {/* Summa */}
//                             <td className="px-4 py-3.5 border-b border-gray-100 text-right">
//                               {total > 0 ? (
//                                 <span className="font-bold text-emerald-600 text-sm">
//                                   {total.toLocaleString("uz-UZ")} so'm
//                                 </span>
//                               ) : (
//                                 <span className="text-gray-400 text-sm font-medium">0 so'm</span>
//                               )}
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>

//                     {/* ── Total footer row ── */}
//                     <tfoot>
//                       <tr style={{ background: "linear-gradient(90deg, #eff6ff 0%, #f0f9ff 100%)" }}>
//                         <td colSpan={8} className="px-4 py-3 text-right text-sm font-bold text-gray-700 border-t-2 border-blue-100">
//                           Umumiy summa:
//                         </td>
//                         <td className="px-4 py-3 text-right border-t-2 border-blue-100">
//                           <span className="text-base font-extrabold text-blue-700">
//                             {formData.products
//                               .reduce((sum, prod) => sum + (attachPrices[prod.id] || 0) * prod.selectedQuantity, 0)
//                               .toLocaleString("uz-UZ")}{" "}
//                             so'm
//                           </span>
//                         </td>
//                       </tr>
//                     </tfoot>
//                   </table>
//                 </div>
//               )}
//             </div>

//             {/* ── Footer ── */}
//             <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/80 shrink-0">
//               <p className="text-xs text-gray-400">
//                 Narxlarni kiriting va saqlash tugmasini bosing
//               </p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setShowAttachModal(false)}
//                   className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600
//               hover:bg-gray-100 hover:border-gray-300 transition-all duration-150"
//                 >
//                   Bekor qilish
//                 </button>
//                 <button
//                   onClick={handleSaveAttachments}
//                   className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md
//               hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
//                   style={{ background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)" }}
//                 >
//                   Saqlash
//                 </button>
//               </div>
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CommercialOffersStep;

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  RefreshCw,
  Upload,
  FolderOpen,
  Paperclip,
  Hash,
  Calendar,
  Building2,
  Globe,
  Clock,
  FileText,
  Package,
  Eye,
} from "lucide-react";
import { axiosAPI } from "@/service/axiosAPI";
import { toast } from "react-toastify";
import { Button, Input, InputNumber, Modal } from "antd";
import FileDropZoneSteps from "./FileDropZoneSteps";
import FilePreviewer from "@/components/FilePreviewer/FilePreviewer"; // <-- pathni to'g'rila
import type {
  PriceAnalysisFormData,
  CommercialOffer,
  Product,
} from "../PriceAnalysisForm";

interface CommercialOffersStepProps {
  formData: PriceAnalysisFormData;
  setFormData: React.Dispatch<React.SetStateAction<PriceAnalysisFormData>>;
}

interface CommercialApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CommercialOffer[];
}

interface DeliveryCondition {
  id: number;
  name: string;
}

/* ─────────────────── Reusable Field Label ─────────────────── */
const FieldLabel: React.FC<{
  icon: React.ReactNode;
  label: string;
  required?: boolean;
}> = ({ icon, label, required }) => (
  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
    <span className="text-blue-500">{icon}</span>
    {label}
    {required && <span className="text-red-500">*</span>}
  </label>
);

/* ─────────────────── Styled Input ─────────────────── */
const StyledInput: React.FC<{
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
}> = ({ placeholder, type = "text", value, onChange, icon }) => (
  <div className="relative">
    {icon && (
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        {icon}
      </span>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-white
        placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
        transition-all duration-150 ${icon ? "pl-10" : ""}`}
    />
  </div>
);

/* ─────────────────── Upload Modal ─────────────────── */
const UploadModal: React.FC<{
  onClose: () => void;
  onSubmit: () => void;
  uploading: boolean;
  uploadForm: any;
  setUploadForm: (v: any) => void;
  deliveryConditions: DeliveryCondition[];
  orgInfoFile: File | null;
  setOrgInfoFile: (f: File | null) => void;
  statFile: File | null;
  setStatFile: (f: File | null) => void;
  commercialFile: File | null;
  setCommercialFile: (f: File | null) => void;
}> = ({
  onClose,
  onSubmit,
  uploading,
  uploadForm,
  setUploadForm,
  deliveryConditions,
  orgInfoFile,
  setOrgInfoFile,
  statFile,
  setStatFile,
  commercialFile,
  setCommercialFile,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl w-full max-w-[540px] max-h-[95vh] overflow-y-auto shadow-2xl"
        style={{ scrollbarWidth: "thin" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
          style={{
            background:
              "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-lg p-2">
              <FileText size={18} className="text-white" />
            </div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Tijoriy taklif yuklash oynasi
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <FieldLabel icon={<Hash size={15} />} label="Kirish №" required />
            <StyledInput
              icon={<Hash size={15} />}
              placeholder="Kirish raqamini kiriting"
              value={uploadForm.number}
              onChange={(e) =>
                setUploadForm({ ...uploadForm, number: e.target.value })
              }
            />
          </div>

          <div>
            <FieldLabel
              icon={<Calendar size={15} />}
              label="Kirish sanasi"
              required
            />
            <StyledInput
              icon={<Calendar size={15} />}
              type="date"
              value={uploadForm.date}
              onChange={(e) =>
                setUploadForm({ ...uploadForm, date: e.target.value })
              }
            />
          </div>

          <div>
            <FieldLabel
              icon={<Building2 size={15} />}
              label="Tashkilot"
              required
            />
            <StyledInput
              icon={<Building2 size={15} />}
              placeholder="Tashkilot nomini kiriting"
              value={uploadForm.organization}
              onChange={(e) =>
                setUploadForm({ ...uploadForm, organization: e.target.value })
              }
            />
          </div>

          <div>
            <FieldLabel icon={<Hash size={15} />} label="STIR" required />
            <StyledInput
              icon={<Hash size={15} />}
              placeholder="STIR raqamini kiriting"
              value={uploadForm.stir}
              onChange={(e) =>
                setUploadForm({ ...uploadForm, stir: e.target.value })
              }
            />
          </div>

          <div>
            <FieldLabel icon={<Globe size={15} />} label="Yetkazib berish sharti" />
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Globe size={15} />
              </span>
              <select
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 bg-white
                appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                transition-all duration-150"
                value={uploadForm.delivery_condition}
                onChange={(e) =>
                  setUploadForm({
                    ...uploadForm,
                    delivery_condition: e.target.value,
                  })
                }
              >
                <option value="">Tanlang</option>
                {deliveryConditions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <FieldLabel
              icon={<Clock size={15} />}
              label="Yetkazib berish muddati"
              required
            />
            <StyledInput
              icon={<Clock size={15} />}
              type="number"
              placeholder="Muddatni kiriting"
              value={uploadForm.delivery_day}
              onChange={(e) =>
                setUploadForm({ ...uploadForm, delivery_day: e.target.value })
              }
            />
          </div>

          <div>
            <FieldLabel icon={<FileText size={15} />} label="Org Info" />
            <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
              <FileDropZoneSteps file={orgInfoFile} setFile={setOrgInfoFile} />
            </div>
          </div>

          <div>
            <FieldLabel icon={<FileText size={15} />} label="STAT" />
            <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
              <FileDropZoneSteps file={statFile} setFile={setStatFile} />
            </div>
          </div>

          <div>
            <FieldLabel
              icon={<FileText size={15} />}
              label="Tijoriy taklif faylini tanlang"
              required
            />
            <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
              <FileDropZoneSteps
                file={commercialFile}
                setFile={setCommercialFile}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600
            hover:bg-gray-50 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            onClick={onSubmit}
            disabled={uploading}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background:
                "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            }}
          >
            {uploading ? "Yuklanmoqda..." : "Saqlash"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────── Main Component ─────────────────── */
const CommercialOffersStep: React.FC<CommercialOffersStepProps> = ({
  formData,
  setFormData,
}) => {
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [currentAttachOfferId, setCurrentAttachOfferId] = useState<number | null>(
    null
  );

  const [offers, setOffers] = useState<CommercialOffer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offersNext, setOffersNext] = useState<string | null>(null);
  const [offersPrev, setOffersPrev] = useState<string | null>(null);
  const [offersTotal, setOffersTotal] = useState(0);
  const [selectSearch, setSelectSearch] = useState("");
  const [selectedOffersMap, setSelectedOffersMap] = useState<
    Map<number, CommercialOffer>
  >(new Map());

  const [deliveryConditions, setDeliveryConditions] = useState<
    DeliveryCondition[]
  >([]);
  const [uploadForm, setUploadForm] = useState({
    number: "",
    date: "",
    organization: "",
    stir: "",
    delivery_condition: "",
    delivery_day: "",
    description: "",
  });
  const [orgInfoFile, setOrgInfoFile] = useState<File | null>(null);
  const [statFile, setStatFile] = useState<File | null>(null);
  const [commercialFile, setCommercialFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [attachPrices, setAttachPrices] = useState<Record<number, number>>({});

  // ✅ PREVIEW STATE
  const [preview, setPreview] = useState<{
    open: boolean;
    url?: string;
    name?: string;
  }>({ open: false });

  const openPreview = (url?: string | null, name?: string | null) => {
    if (!url) return;
    const safeName = name || url.split("/").pop() || "Fayl";
    setPreview({ open: true, url, name: safeName });
  };

  const closePreview = () => setPreview({ open: false, url: undefined, name: undefined });

  useEffect(() => {
    if (showSelectModal) fetchOffers("/document/analysis/commercial/");
  }, [showSelectModal]);

  useEffect(() => {
    if (showUploadModal) fetchDeliveryConditions();
  }, [showUploadModal]);

  useEffect(() => {
    const map = new Map<number, CommercialOffer>();
    formData.commercials.forEach((off) => map.set(off.id, off));
    setSelectedOffersMap(map);
  }, [formData.commercials]);

  useEffect(() => {
    if (showAttachModal && currentAttachOfferId) {
      const existing = formData.attachments[currentAttachOfferId] || [];
      const prices: Record<number, number> = {};
      existing.forEach((item) => {
        prices[item.productId] = item.price;
      });
      setAttachPrices(prices);
    }
  }, [showAttachModal, currentAttachOfferId, formData.attachments]);

  const fetchOffers = async (url: string) => {
    setOffersLoading(true);
    try {
      const res = await axiosAPI.get<CommercialApiResponse>(url);
      setOffers(res.data.results);
      setOffersNext(res.data.next);
      setOffersPrev(res.data.previous);
      setOffersTotal(res.data.count);
    } catch {
      toast.error("Tijoriy takliflarni yuklashda xatolik");
    } finally {
      setOffersLoading(false);
    }
  };

  const fetchDeliveryConditions = async () => {
    try {
      const res = await axiosAPI.get<any>("/directory/delivery/");
      if (Array.isArray(res.data)) setDeliveryConditions(res.data);
      else if (res.data.results) setDeliveryConditions(res.data.results);
      else setDeliveryConditions([]);
    } catch {
      console.error("Failed to load delivery conditions");
    }
  };

  const toggleOfferSelection = (offer: CommercialOffer, checked: boolean) => {
    setSelectedOffersMap((prev) => {
      const newMap = new Map(prev);
      if (checked) newMap.set(offer.id, offer);
      else newMap.delete(offer.id);
      return newMap;
    });
  };

  const toggleSelectAllOffers = (checked: boolean) => {
    if (checked) {
      const newMap = new Map<number, CommercialOffer>();
      offers.forEach((o) => newMap.set(o.id, o));
      setSelectedOffersMap(newMap);
    } else {
      setSelectedOffersMap(new Map());
    }
  };

  const handleAddSelectedOffers = () => {
    setFormData((prev) => ({
      ...prev,
      commercials: Array.from(selectedOffersMap.values()),
    }));
    setShowSelectModal(false);
  };

  const handleUploadSubmit = async () => {
    if (
      !uploadForm.number ||
      !uploadForm.date ||
      !uploadForm.organization ||
      !uploadForm.stir ||
      !uploadForm.delivery_day
    ) {
      toast.warning("Barcha majburiy maydonlarni to'ldiring");
      return;
    }
    if (!commercialFile) {
      toast.warning("Tijoriy taklif fayli majburiy");
      return;
    }
    const formDataObj = new FormData();
    formDataObj.append("number", uploadForm.number);
    formDataObj.append("date", uploadForm.date);
    formDataObj.append("organization", uploadForm.organization);
    formDataObj.append("stir", uploadForm.stir);
    formDataObj.append("delivery_day", uploadForm.delivery_day);
    if (uploadForm.delivery_condition)
      formDataObj.append("delivery_condition", uploadForm.delivery_condition);
    formDataObj.append("description", uploadForm.description);
    if (orgInfoFile) formDataObj.append("org_info", orgInfoFile);
    if (statFile) formDataObj.append("stat", statFile);
    formDataObj.append("file", commercialFile);

    setUploading(true);
    try {
      const res = await axiosAPI.post("/document/analysis/commercial/", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, commercials: [...prev.commercials, res.data] }));
      setShowUploadModal(false);
      toast.success("Tijoriy taklif yuklandi");
      setUploadForm({
        number: "",
        date: "",
        organization: "",
        stir: "",
        delivery_condition: "",
        delivery_day: "",
        description: "",
      });
      setOrgInfoFile(null);
      setStatFile(null);
      setCommercialFile(null);
    } catch {
      toast.error("Yuklashda xatolik");
    } finally {
      setUploading(false);
    }
  };

  const openAttachModal = (offerId: number) => {
    if (formData.products.length === 0) {
      toast.warning("Avval tovarlarni tanlang");
      return;
    }
    setCurrentAttachOfferId(offerId);
    setShowAttachModal(true);
  };

  const handleSaveAttachments = () => {
    if (!currentAttachOfferId) return;
    const attachments = Object.entries(attachPrices)
      .filter(([_, price]) => price > 0)
      .map(([productId, price]) => ({ productId: Number(productId), price }));
    setFormData((prev) => ({
      ...prev,
      attachments: { ...prev.attachments, [currentAttachOfferId!]: attachments },
    }));
    setShowAttachModal(false);
    toast.success("Biriktirish saqlandi");
  };

  const filteredOffers = offers.filter(
    (o) =>
      o.number.toLowerCase().includes(selectSearch.toLowerCase()) ||
      o.organization.toLowerCase().includes(selectSearch.toLowerCase())
  );

  // ✅ Link UI
  const FileLink: React.FC<{
    label?: string | null;
    url?: string | null;
  }> = ({ label, url }) => {
    if (!url) return <span className="text-slate-400">-</span>;
    const fileName = label || url.split("/").pop() || "Fayl";
    return (
      <button
        type="button"
        onClick={() => openPreview(url, fileName)}
        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline underline-offset-2 max-w-[240px] truncate text-left"
        title={fileName}
      >
        <Eye size={14} />
        <span className="truncate">{fileName}</span>
      </button>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <Button icon={<Upload size={16} />} onClick={() => setShowUploadModal(true)}>
          TK yuklash
        </Button>
        <Button icon={<FolderOpen size={16} />} onClick={() => setShowSelectModal(true)}>
          Mavjud TK yuklash
        </Button>
      </div>

      {/* Main table */}
      <div className="border border-gray-200 rounded-md overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-50">
            <tr>
              {[
                "N",
                "Kirish nomer",
                "Kirish sanasi",
                "Tashkilot nomi",
                "INN",
                "TK sanasi",
                "Tijoriy taklif",
                "STAT",
                "Org info",
                "Xodimlar",
                "Yetkazib berish turi",
                "Tovarlarga biriktirish",
              ].map((h) => (
                <th key={h} className="px-4 py-2 font-medium text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {formData.commercials.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center py-8 text-gray-500">
                  Tijoriy takliflar mavjud emas
                </td>
              </tr>
            ) : (
              formData.commercials.map((offer, idx) => (
                <tr key={offer.id} className="border-t border-gray-200">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{offer.number}</td>
                  <td className="px-4 py-2">
                    {new Date(offer.date).toLocaleDateString("uz-UZ")}
                  </td>
                  <td className="px-4 py-2">{offer.organization}</td>
                  <td className="px-4 py-2">{offer.stir}</td>
                  <td className="px-4 py-2">
                    {new Date(offer.date).toLocaleDateString("uz-UZ")}
                  </td>

                  {/* ✅ Preview links */}
                  <td className="px-4 py-2">
                    <FileLink label={(offer as any).file_name} url={(offer as any).file_url} />
                  </td>
                  <td className="px-4 py-2">
                    <FileLink label={(offer as any).stat_name} url={(offer as any).stat_url} />
                  </td>
                  <td className="px-4 py-2">
                    <FileLink
                      label={(offer as any).org_info_name}
                      url={(offer as any).org_info_url}
                    />
                  </td>

                  <td className="px-4 py-2">{(offer as any).employee_name || "-"}</td>
                  <td className="px-4 py-2">{(offer as any).delivery_condition_name || "-"}</td>

                  <td className="px-4 py-2">
                    <button
                      onClick={() => openAttachModal(offer.id)}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Paperclip size={16} />
                      {formData.attachments[offer.id]?.length ? (
                        <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                          {formData.attachments[offer.id].length}
                        </span>
                      ) : (
                        "Biriktirish"
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Preview Modal */}
      <Modal
        open={preview.open}
        onCancel={closePreview}
        footer={null}
        width="90vw"
        style={{ top: 20 }}
        title={preview.name || "Faylni ko‘rish"}
        destroyOnClose
      >
        <div style={{ height: "78vh" }}>
          <FilePreviewer file_url={preview.url} className="w-full h-full" />
        </div>
      </Modal>

      {/* Select Modal */}

      {showSelectModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl w-[96%] h-[92vh] flex flex-col shadow-2xl overflow-hidden">

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        style={{ background: "linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-xl p-2.5">
            <FolderOpen size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Mavjud tijoriy takliflar
            </h2>
            <p className="text-blue-200 text-xs mt-0.5">
              Jami: {offersTotal} ta | Tanlangan: {selectedOffersMap.size} ta
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSelectModal(false)}
          className="text-white/70 hover:text-white hover:bg-white/10 transition-all p-2 rounded-xl"
        >
          <X size={20} />
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50/80 shrink-0">
        <button
          onClick={() => fetchOffers("/document/analysis/commercial/")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold
            text-gray-600 hover:bg-white hover:border-blue-300 hover:text-blue-600 transition-all duration-150"
        >
          <RefreshCw size={15} />
          Yangilash
        </button>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            placeholder="Qidirish..."
            className="pl-9 pr-4 py-2 rounded-xl border-2 border-gray-200 text-sm text-gray-700 bg-white w-64
              focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent placeholder:text-gray-400
              transition-all duration-150"
            value={selectSearch}
            onChange={(e) => setSelectSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto px-4 py-3">
        {offersLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <RefreshCw size={36} className="animate-spin mb-3 opacity-40" />
            <p className="text-sm font-medium">Yuklanmoqda...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FolderOpen size={48} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">Ma'lumot topilmadi</p>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full min-w-[1200px]">
              <thead className="sticky top-0 z-10">
                <tr style={{ background: "linear-gradient(90deg, #eff6ff 0%, #f0f9ff 100%)" }}>
                  <th className="px-4 py-3 w-12 border-b border-blue-100">
                    <input
                      type="checkbox"
                      checked={offers.length > 0 && selectedOffersMap.size === offers.length}
                      onChange={(e) => toggleSelectAllOffers(e.target.checked)}
                      className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                    />
                  </th>
                  {[
                    "№",
                    "Kirish nomer",
                    "Kirish sanasi",
                    "Tashkilot nomi",
                    "INN",
                    "TK sanasi",
                    "Tijoriy taklif",
                    "STAT",
                    "Org info",
                    "Xodimlar",
                    "Yetkazib berish turi",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer, idx) => {
                  const selected = selectedOffersMap.has(offer.id);
                  const isEven = idx % 2 === 0;
                  return (
                    <tr
                      key={offer.id}
                      onClick={() => toggleOfferSelection(offer, !selected)}
                      className={`cursor-pointer transition-colors
                        ${selected
                          ? "bg-blue-50 hover:bg-blue-100"
                          : isEven
                          ? "bg-white hover:bg-slate-50"
                          : "bg-slate-50/50 hover:bg-slate-100/60"
                        }`}
                    >
                      <td className="px-4 py-3 border-b border-gray-100">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleOfferSelection(offer, e.target.checked);
                          }}
                          className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        <span className="font-semibold text-gray-800 text-sm">{offer.number}</span>
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-600">
                        {new Date(offer.date).toLocaleDateString("uz-UZ")}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-800 text-sm">{offer.organization}</span>
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100">
                          {offer.stir}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-600">
                        {new Date(offer.date).toLocaleDateString("uz-UZ")}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        <FileLink label={(offer as any).file_name} url={(offer as any).file_url} />
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        <FileLink label={(offer as any).stat_name} url={(offer as any).stat_url} />
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        <FileLink label={(offer as any).org_info_name} url={(offer as any).org_info_url} />
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        {(offer as any).employee_name ? (
                          <span className="inline-block bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100">
                            {(offer as any).employee_name}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        {(offer as any).delivery_condition_name ? (
                          <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-100">
                            {(offer as any).delivery_condition_name}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination (scroll style) + Footer ── */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/80 shrink-0">
        {/* Pagination */}
        <div className="flex items-center gap-1">
          {/* First */}
          <button
            disabled={!offersPrev}
            onClick={() => fetchOffers("/document/analysis/commercial/")}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500
              hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30
              disabled:cursor-not-allowed transition-all duration-150 text-xs font-bold"
            title="Birinchi sahifa"
          >
            «
          </button>
          {/* Prev */}
          <button
            disabled={!offersPrev}
            onClick={() => offersPrev && fetchOffers(offersPrev)}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500
              hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30
              disabled:cursor-not-allowed transition-all duration-150 text-xs font-bold"
            title="Oldingi"
          >
            ‹
          </button>

          {/* Page dots (visual indicator) */}
          <div className="flex items-center gap-1 px-2">
            {[...Array(Math.min(5, Math.ceil(offersTotal / 10)))].map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-200 ${
                  i === (offersPrev ? 1 : 0)
                    ? "w-6 h-2 bg-blue-600"
                    : "w-2 h-2 bg-gray-300 hover:bg-blue-300 cursor-pointer"
                }`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            disabled={!offersNext}
            onClick={() => offersNext && fetchOffers(offersNext)}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500
              hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30
              disabled:cursor-not-allowed transition-all duration-150 text-xs font-bold"
            title="Keyingi"
          >
            ›
          </button>
          {/* Last */}
          <button
            disabled={!offersNext}
            onClick={() => {
              // jump to approximate last — fetch next until null (or just go next)
              offersNext && fetchOffers(offersNext);
            }}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500
              hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30
              disabled:cursor-not-allowed transition-all duration-150 text-xs font-bold"
            title="Oxirgi sahifa"
          >
            »
          </button>

          <span className="ml-3 text-xs text-gray-500 font-medium">
            {offersTotal} ta natija
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {selectedOffersMap.size > 0 && (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100
                px-3 py-1.5 rounded-full font-semibold">
                ✓ {selectedOffersMap.size} ta tanlandi
              </span>
            )}
          </span>
          <button
            onClick={() => setShowSelectModal(false)}
            className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600
              hover:bg-gray-100 hover:border-gray-300 transition-all duration-150"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleAddSelectedOffers}
            disabled={selectedOffersMap.size === 0}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md
              hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-150
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
            style={{ background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)" }}
          >
            Tanlash ({selectedOffersMap.size})
          </button>
        </div>
      </div>

    </div>
  </div>
)}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSubmit={handleUploadSubmit}
          uploading={uploading}
          uploadForm={uploadForm}
          setUploadForm={setUploadForm}
          deliveryConditions={deliveryConditions}
          orgInfoFile={orgInfoFile}
          setOrgInfoFile={setOrgInfoFile}
          statFile={statFile}
          setStatFile={setStatFile}
          commercialFile={commercialFile}
          setCommercialFile={setCommercialFile}
        />
      )}

      {/* Attach Modal (seniki o'zgarmaydi) */}
      {showAttachModal && currentAttachOfferId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {/* ... sen yozgan attach modal kodini o'zgartirmadim ... */}
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-xl p-2.5">
                  <Paperclip size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-wide">
                    Tovarlarni biriktirish
                  </h2>
                  <p className="text-blue-200 text-xs mt-0.5">
                    {formData.products.length} ta tovar mavjud
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAttachModal(false)}
                className="text-white/70 hover:text-white hover:bg-white/10 transition-all p-2 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto p-6">
              {formData.products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <Package size={48} className="mb-3 opacity-30" />
                  <p className="text-base font-medium">Avval tovarlarni tanlang</p>
                </div>
              ) : (
                <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr
                        style={{
                          background:
                            "linear-gradient(90deg, #eff6ff 0%, #f0f9ff 100%)",
                        }}
                      >
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
                          Tovar
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
                          Tovar turi
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
                          Model
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
                          O'lcham
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
                          O'lchov birligi
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
                          Miqdor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
                          Narx (so'm)
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">
                          Summa
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.products.map((prod, idx) => {
                        const price = attachPrices[prod.id] || 0;
                        const total = price * prod.selectedQuantity;
                        const isEven = idx % 2 === 0;
                        return (
                          <tr
                            key={prod.id}
                            className={`transition-colors hover:bg-blue-50/60 ${
                              isEven ? "bg-white" : "bg-slate-50/50"
                            }`}
                          >
                            <td className="px-4 py-3.5 border-b border-gray-100">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                                {idx + 1}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 border-b border-gray-100">
                              <span className="font-semibold text-gray-800 text-sm">
                                {prod.product_name}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 border-b border-gray-100">
                              <span className="inline-block bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100">
                                {prod.product_type?.name || "—"}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 border-b border-gray-100">
                              <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100">
                                {prod.product_model?.name || "—"}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 border-b border-gray-100 text-sm text-gray-600">
                              {prod.size?.name || "—"}
                            </td>
                            <td className="px-4 py-3.5 border-b border-gray-100">
                              <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-100">
                                {prod.unit?.name || "—"}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 border-b border-gray-100 text-center">
                              <span className="inline-flex items-center justify-center min-w-[2rem] h-7 bg-blue-600 text-white text-xs font-bold px-2 rounded-lg">
                                {prod.selectedQuantity}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 border-b border-gray-100">
                              <InputNumber
                                value={price}
                                onChange={(val) =>
                                  setAttachPrices((prev) => ({
                                    ...prev,
                                    [prod.id]: val ?? 0,
                                  }))
                                }
                                min={0}
                                step={0.01}
                                className="w-36"
                                style={{
                                  borderRadius: "10px",
                                  border: "1.5px solid #e2e8f0",
                                }}
                                placeholder="0.00"
                              />
                            </td>
                            <td className="px-4 py-3.5 border-b border-gray-100 text-right">
                              {total > 0 ? (
                                <span className="font-bold text-emerald-600 text-sm">
                                  {total.toLocaleString("uz-UZ")} so'm
                                </span>
                              ) : (
                                <span className="text-gray-400 text-sm font-medium">
                                  0 so'm
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr
                        style={{
                          background:
                            "linear-gradient(90deg, #eff6ff 0%, #f0f9ff 100%)",
                        }}
                      >
                        <td
                          colSpan={8}
                          className="px-4 py-3 text-right text-sm font-bold text-gray-700 border-t-2 border-blue-100"
                        >
                          Umumiy summa:
                        </td>
                        <td className="px-4 py-3 text-right border-t-2 border-blue-100">
                          <span className="text-base font-extrabold text-blue-700">
                            {formData.products
                              .reduce(
                                (sum, prod) =>
                                  sum +
                                  (attachPrices[prod.id] || 0) *
                                    prod.selectedQuantity,
                                0
                              )
                              .toLocaleString("uz-UZ")}{" "}
                            so'm
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/80 shrink-0">
              <p className="text-xs text-gray-400">
                Narxlarni kiriting va saqlash tugmasini bosing
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAttachModal(false)}
                  className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600
                  hover:bg-gray-100 hover:border-gray-300 transition-all duration-150"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleSaveAttachments}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md
                  hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
                  style={{
                    background:
                      "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
                  }}
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommercialOffersStep;