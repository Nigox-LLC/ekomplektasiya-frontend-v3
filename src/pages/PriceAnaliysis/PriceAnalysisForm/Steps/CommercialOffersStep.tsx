import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Paperclip,
  FileText,
  Clock,
  Package,
  Hash,
  Building2,
  Calendar,
  Upload,
  FolderOpen,
  LinkIcon,
  RefreshCw,
} from "lucide-react";
import { axiosAPI } from "@/service/axiosAPI";
import { toast } from "react-toastify";
import { Button, Input, InputNumber } from "antd";
import FileDropZoneSteps from "./FileDropZoneSteps";
import type { PriceAnalysisFormData, CommercialOffer, Product } from "../PriceAnalysisForm";

interface CommercialOffersStepProps {
  formData: PriceAnalysisFormData;
  setFormData: React.Dispatch<React.SetStateAction<PriceAnalysisFormData>>;
}

// API response for commercial list
interface CommercialApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CommercialOffer[];
}

// Delivery condition (for upload form)
interface DeliveryCondition {
  id: number;
  name: string;
}

const CommercialOffersStep: React.FC<CommercialOffersStepProps> = ({ formData, setFormData }) => {
  // Modals state
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [currentAttachOfferId, setCurrentAttachOfferId] = useState<number | null>(null);

  // Data for select modal
  const [offers, setOffers] = useState<CommercialOffer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offersNext, setOffersNext] = useState<string | null>(null);
  const [offersPrev, setOffersPrev] = useState<string | null>(null);
  const [offersTotal, setOffersTotal] = useState(0);
  const [selectSearch, setSelectSearch] = useState("");
  const [selectedOffersMap, setSelectedOffersMap] = useState<Map<number, CommercialOffer>>(new Map());

  // Upload form state
  const [deliveryConditions, setDeliveryConditions] = useState<DeliveryCondition[]>([]);
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

  // Attach modal state
  const [attachPrices, setAttachPrices] = useState<Record<number, number>>({}); // productId -> price

  // Fetch commercial offers when select modal opens
  useEffect(() => {
    if (showSelectModal) {
      fetchOffers("/document/analysis/commercial/");
    }
  }, [showSelectModal]);

  // Fetch delivery conditions when upload modal opens
  useEffect(() => {
    if (showUploadModal) {
      fetchDeliveryConditions();
    }
  }, [showUploadModal]);

  // Pre-fill selected offers map from formData
  useEffect(() => {
    const map = new Map<number, CommercialOffer>();
    formData.commercials.forEach((off) => map.set(off.id, off));
    setSelectedOffersMap(map);
  }, [formData.commercials]);

  // When attach modal opens for an offer, pre-fill prices from existing attachments
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
    } catch (error) {
      toast.error("Tijoriy takliflarni yuklashda xatolik");
    } finally {
      setOffersLoading(false);
    }
  };

  const fetchDeliveryConditions = async () => {
    try {
      const res = await axiosAPI.get<any>("/directory/delivery/");
      if (Array.isArray(res.data)) {
        setDeliveryConditions(res.data);
      } else if (res.data.results) {
        setDeliveryConditions(res.data.results);
      } else {
        setDeliveryConditions([]);
      }
    } catch (error) {
      console.error("Failed to load delivery conditions", error);
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
    const selected = Array.from(selectedOffersMap.values());
    setFormData((prev) => ({ ...prev, commercials: selected }));
    setShowSelectModal(false);
  };

  const handleUploadSubmit = async () => {
    if (!uploadForm.number || !uploadForm.date || !uploadForm.organization || !uploadForm.stir || !uploadForm.delivery_day) {
      toast.warning("Barcha majburiy maydonlarni to‘ldiring");
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
    if (uploadForm.delivery_condition) {
      formDataObj.append("delivery_condition", uploadForm.delivery_condition);
    }
    formDataObj.append("description", uploadForm.description);
    if (orgInfoFile) formDataObj.append("org_info", orgInfoFile);
    if (statFile) formDataObj.append("stat", statFile);
    formDataObj.append("file", commercialFile);

    setUploading(true);
    try {
      const res = await axiosAPI.post("/document/analysis/commercial/", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newOffer: CommercialOffer = res.data; // API returns the created offer
      // Add to main list
      setFormData((prev) => ({
        ...prev,
        commercials: [...prev.commercials, newOffer],
      }));
      setShowUploadModal(false);
      toast.success("Tijoriy taklif yuklandi");
      // Reset form
      setUploadForm({ number: "", date: "", organization: "", stir: "", delivery_condition: "", delivery_day: "", description: "" });
      setOrgInfoFile(null);
      setStatFile(null);
      setCommercialFile(null);
    } catch (error) {
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

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <Button icon={<Upload />} onClick={() => setShowUploadModal(true)}>
          TK yuklash
        </Button>
        <Button icon={<FolderOpen />} onClick={() => setShowSelectModal(true)}>
          Mavjud TK yuklash
        </Button>
      </div>

      {/* Main table of selected commercial offers */}
      <div className="border rounded-lg overflow-auto">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left">N</th>
              <th className="px-4 py-2 text-left">Kirish nomer</th>
              <th className="px-4 py-2 text-left">Kirish sanasi</th>
              <th className="px-4 py-2 text-left">Tashkilot nomi</th>
              <th className="px-4 py-2 text-left">INN</th>
              <th className="px-4 py-2 text-left">TK sanasi</th>
              <th className="px-4 py-2 text-left">Tijoriy taklif</th>
              <th className="px-4 py-2 text-left">STAT</th>
              <th className="px-4 py-2 text-left">Org info</th>
              <th className="px-4 py-2 text-left">Xodimlar</th>
              <th className="px-4 py-2 text-left">Yetkazib berish turi</th>
              <th className="px-4 py-2 text-left">Tovarlarga biriktirish</th>
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
                <tr key={offer.id} className="border-t">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{offer.number}</td>
                  <td className="px-4 py-2">{new Date(offer.date).toLocaleDateString("uz-UZ")}</td>
                  <td className="px-4 py-2">{offer.organization}</td>
                  <td className="px-4 py-2">{offer.stir}</td>
                  <td className="px-4 py-2">{new Date(offer.date).toLocaleDateString("uz-UZ")}</td>
                  <td className="px-4 py-2">
                    {offer.file_name ? (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{offer.file_name}</span>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-2">
                    {offer.stat_name ? <span className="text-xs bg-gray-100 px-2 py-1 rounded">{offer.stat_name}</span> : '-'}
                  </td>
                  <td className="px-4 py-2">
                    {offer.org_info_name ? <span className="text-xs bg-gray-100 px-2 py-1 rounded">{offer.org_info_name}</span> : '-'}
                  </td>
                  <td className="px-4 py-2">{offer.employee_name || '-'}</td>
                  <td className="px-4 py-2">{offer.delivery_condition_name || '-'}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
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
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL: Select existing offers */}
      {showSelectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[95%] h-[90%] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Mavjud tijoriy takliflar</h2>
              <button onClick={() => setShowSelectModal(false)}>
                <X />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto">
              <div className="flex justify-between mb-4">
                <Button onClick={() => fetchOffers("/document/analysis/commercial/")} icon={<RefreshCw size={16} />}>
                  Yangilash
                </Button>
                <Input
                  placeholder="Qidirish"
                  prefix={<Search size={16} className="text-gray-400" />}
                  className="w-64"
                  value={selectSearch}
                  onChange={(e) => setSelectSearch(e.target.value)}
                />
              </div>
              {offersLoading ? (
                <div className="text-center py-8">Yuklanmoqda...</div>
              ) : (
                <>
                  <div className="border rounded overflow-auto">
                    <table className="w-full min-w-[1100px]">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 w-10">
                            <input
                              type="checkbox"
                              checked={offers.length > 0 && selectedOffersMap.size === offers.length}
                              onChange={(e) => toggleSelectAllOffers(e.target.checked)}
                            />
                          </th>
                          <th className="px-4 py-2">№</th>
                          <th className="px-4 py-2">Kirish nomer</th>
                          <th className="px-4 py-2">Kirish sanasi</th>
                          <th className="px-4 py-2">Tashkilot nomi</th>
                          <th className="px-4 py-2">INN</th>
                          <th className="px-4 py-2">TK sanasi</th>
                          <th className="px-4 py-2">Tijoriy taklif</th>
                          <th className="px-4 py-2">STAT</th>
                          <th className="px-4 py-2">Org info</th>
                          <th className="px-4 py-2">Xodimlar</th>
                          <th className="px-4 py-2">Yetkazib berish turi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOffers.map((offer, idx) => {
                          const selected = selectedOffersMap.has(offer.id);
                          return (
                            <tr key={offer.id} className={selected ? "bg-blue-50" : ""}>
                              <td className="px-4 py-2">
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={(e) => toggleOfferSelection(offer, e.target.checked)}
                                />
                              </td>
                              <td className="px-4 py-2">{idx + 1}</td>
                              <td className="px-4 py-2">{offer.number}</td>
                              <td className="px-4 py-2">{new Date(offer.date).toLocaleDateString("uz-UZ")}</td>
                              <td className="px-4 py-2">{offer.organization}</td>
                              <td className="px-4 py-2">{offer.stir}</td>
                              <td className="px-4 py-2">{new Date(offer.date).toLocaleDateString("uz-UZ")}</td>
                              <td className="px-4 py-2">{offer.file_name || '-'}</td>
                              <td className="px-4 py-2">{offer.stat_name || '-'}</td>
                              <td className="px-4 py-2">{offer.org_info_name || '-'}</td>
                              <td className="px-4 py-2">{offer.employee_name || '-'}</td>
                              <td className="px-4 py-2">{offer.delivery_condition_name || '-'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination */}
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      Jami: {offersTotal} ta | Tanlangan: {selectedOffersMap.size}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        disabled={!offersPrev}
                        onClick={() => offersPrev && fetchOffers(offersPrev)}
                      >
                        Oldingi
                      </button>
                      <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        disabled={!offersNext}
                        onClick={() => offersNext && fetchOffers(offersNext)}
                      >
                        Keyingi
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button onClick={() => setShowSelectModal(false)} className="px-4 py-2 border rounded">
                Bekor qilish
              </button>
              <button
                onClick={handleAddSelectedOffers}
                disabled={selectedOffersMap.size === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Tanlash ({selectedOffersMap.size})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Upload new offer */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Tijoriy taklif yuklash</h2>
              <button onClick={() => setShowUploadModal(false)}>
                <X />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Kirish № *</label>
                <Input
                  value={uploadForm.number}
                  onChange={(e) => setUploadForm({ ...uploadForm, number: e.target.value })}
                  placeholder="0001"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Kirish sanasi *</label>
                <Input
                  type="date"
                  value={uploadForm.date}
                  onChange={(e) => setUploadForm({ ...uploadForm, date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tashkilot nomi *</label>
                <Input
                  value={uploadForm.organization}
                  onChange={(e) => setUploadForm({ ...uploadForm, organization: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">STIR *</label>
                <Input
                  value={uploadForm.stir}
                  onChange={(e) => setUploadForm({ ...uploadForm, stir: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Yetkazib berish sharti</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={uploadForm.delivery_condition}
                  onChange={(e) => setUploadForm({ ...uploadForm, delivery_condition: e.target.value })}
                >
                  <option value="">Tanlang</option>
                  {deliveryConditions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Yetkazib berish muddati (kun) *</label>
                <Input
                  type="number"
                  min={1}
                  value={uploadForm.delivery_day}
                  onChange={(e) => setUploadForm({ ...uploadForm, delivery_day: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Org info (fayl)</label>
                <FileDropZoneSteps file={orgInfoFile} setFile={setOrgInfoFile} />
              </div>
              <div>
                <label className="text-sm font-medium">STAT (fayl)</label>
                <FileDropZoneSteps file={statFile} setFile={setStatFile} />
              </div>
              <div>
                <label className="text-sm font-medium">Tijoriy taklif fayli *</label>
                <FileDropZoneSteps file={commercialFile} setFile={setCommercialFile} />
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button onClick={() => setShowUploadModal(false)} className="px-4 py-2 border rounded">
                Bekor qilish
              </button>
              <button
                onClick={handleUploadSubmit}
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {uploading ? "Yuklanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Attach products to offer */}
      {showAttachModal && currentAttachOfferId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[800px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Tovarlarni biriktirish</h2>
              <button onClick={() => setShowAttachModal(false)}>
                <X />
              </button>
            </div>
            <div className="p-4">
              {formData.products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Avval tovarlarni tanlang</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Tovar</th>
                      <th className="px-4 py-2 text-left">Miqdor</th>
                      <th className="px-4 py-2 text-left">Narx</th>
                      <th className="px-4 py-2 text-left">Summa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.products.map((prod) => {
                      const price = attachPrices[prod.id] || 0;
                      const total = price * prod.selectedQuantity;
                      return (
                        <tr key={prod.id} className="border-t">
                          <td className="px-4 py-2">{prod.product_name}</td>
                          <td className="px-4 py-2">{prod.selectedQuantity}</td>
                          <td className="px-4 py-2">
                            <InputNumber
                              value={price}
                              onChange={(val) =>
                                setAttachPrices((prev) => ({ ...prev, [prod.id]: val || 0 }))
                              }
                              min={0}
                              step={0.01}
                              className="w-32"
                            />
                          </td>
                          <td className="px-4 py-2 font-medium">
                            {total.toLocaleString("uz-UZ")} so‘m
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button onClick={() => setShowAttachModal(false)} className="px-4 py-2 border rounded">
                Bekor qilish
              </button>
              <button
                onClick={handleSaveAttachments}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommercialOffersStep;