import React, { useState, useEffect } from "react";
import { Search, Plus, Users, Trash2, X, RefreshCw } from "lucide-react";
import { axiosAPI } from "@/service/axiosAPI";
import { Button, Input, Modal } from "antd";
import type { Staff, SelectedSigner, PriceAnalysisFormData } from "../PriceAnalysisForm";

interface SignatoriesStepProps {
  formData: PriceAnalysisFormData;
  setFormData: React.Dispatch<React.SetStateAction<PriceAnalysisFormData>>;
}

interface StaffApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Staff[];
}

const SignatoriesStep: React.FC<SignatoriesStepProps> = ({ formData, setFormData }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffNext, setStaffNext] = useState<string | null>(null);
  const [staffPrev, setStaffPrev] = useState<string | null>(null);
  const [staffTotal, setStaffTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMap, setSelectedMap] = useState<Map<number, Staff>>(new Map());

  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: number; name: string }>({
    open: false,
    id: 0,
    name: "",
  });

  useEffect(() => {
    if (pickerOpen) {
      fetchStaff("/staff/by-name/");
    }
  }, [pickerOpen]);

  const fetchStaff = async (url: string) => {
    setStaffLoading(true);
    try {
      const res = await axiosAPI.get<any>(url); // any qilib qo'ydik, chunki format noma'lum
      console.log("Staff API response:", res.data); // konsolga chiqaramiz

      // API javobi to'g'ridan-to'g'ri massiv bo'lishi mumkin
      if (Array.isArray(res.data)) {
        setStaff(res.data);
        setStaffTotal(res.data.length);
        setStaffNext(null);
        setStaffPrev(null);
      }
      // yoki { results: [...] } ko'rinishida
      else if (res.data && Array.isArray(res.data.results)) {
        setStaff(res.data.results);
        setStaffNext(res.data.next);
        setStaffPrev(res.data.previous);
        setStaffTotal(res.data.count || 0);
      }
      // yana boshqa format
      else {
        console.error("Unexpected API response format:", res.data);
        setStaff([]);
        setStaffNext(null);
        setStaffPrev(null);
        setStaffTotal(0);
      }
    } catch (error) {
      console.error("Failed to load staff", error);
      setStaff([]);
      setStaffNext(null);
      setStaffPrev(null);
      setStaffTotal(0);
    } finally {
      setStaffLoading(false);
    }
  };

  useEffect(() => {
    const map = new Map<number, Staff>();
    formData.executors.forEach((ex) => {
      map.set(ex.id, { id: ex.id, full_name: ex.full_name, position: ex.position });
    });
    setSelectedMap(map);
  }, [formData.executors]);

  const toggleStaff = (person: Staff, checked: boolean) => {
    setSelectedMap((prev) => {
      const newMap = new Map(prev);
      if (checked) newMap.set(person.id, person);
      else newMap.delete(person.id);
      return newMap;
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const newMap = new Map<number, Staff>();
      staff.forEach((s) => newMap.set(s.id, s));
      setSelectedMap(newMap);
    } else {
      setSelectedMap(new Map());
    }
  };

  const handleAddSelected = () => {
    const selected = Array.from(selectedMap.values()).map(
      (s): SelectedSigner => ({ ...s, signed_at: undefined })
    );
    setFormData((prev) => ({ ...prev, executors: selected }));
    setPickerOpen(false);
  };

  const removeSigner = (id: number) => {
    const signer = formData.executors.find((e) => e.id === id);
    if (signer) {
      setDeleteConfirm({ open: true, id, name: signer.full_name });
    }
  };

  const confirmDelete = () => {
    setFormData((prev) => ({
      ...prev,
      executors: prev.executors.filter((e) => e.id !== deleteConfirm.id),
    }));
    setDeleteConfirm({ open: false, id: 0, name: "" });
  };

  const filteredStaff = staff.filter((person) =>
    (person.full_name || "")
      .toLowerCase()
      .includes((searchTerm || "").toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input placeholder="Qidirish (Ctrl+F)" className="pl-9" />
        </div>
        <Button type="primary" icon={<Plus />} onClick={() => setPickerOpen(true)}>
          Kiritish
        </Button>
      </div>

      <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 font-medium">N</th>
              <th className="px-4 py-2 font-medium">IMZOLOVCHI XODIM</th>
              <th className="px-4 py-2 font-medium">LAVOZIM</th>
              <th className="px-4 py-2 font-medium">IMZOLANGAN VAQT</th>
              <th className="px-4 py-2 font-medium">HARAKATLAR</th>
            </tr>
          </thead>
          <tbody>
            {formData.executors.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="mt-4 text-gray-600">Imzolovchilar mavjud emas</p>
                    <Button type="primary" className="mt-2" onClick={() => setPickerOpen(true)}>
                      Imzolovchi qo'shish
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              formData.executors.map((ex, idx) => (
                <tr key={ex.id} className="border-t border-gray-300 text-center">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{ex.full_name}</td>
                  <td className="px-4 py-2">{ex.position_name}</td>
                  <td className="px-4 py-2">{ex.signed_at ? new Date(ex.signed_at).toLocaleString("uz-UZ") : "-"}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => removeSigner(ex.id)} className="text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* {pickerOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[800px] max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Barcha xodimlar ro'yxati</h2>
              <button onClick={() => setPickerOpen(false)}>
                <X />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto">
              <div className="flex justify-between mb-4">
                <Button onClick={() => fetchStaff("/staff/by-name/")} icon={<RefreshCw size={16} />}>
                  Yangilash
                </Button>
                <Input
                  placeholder="Qidirish"
                  prefix={<Search size={16} className="text-gray-400" />}
                  className="w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {staffLoading ? (
                <div className="text-center py-8">Yuklanmoqda...</div>
              ) : staff.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Xodimlar topilmadi</div>
              ) : (
                <>
                  <div className="border rounded overflow-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-2 w-10">
                            <input
                              type="checkbox"
                              checked={staff.length > 0 && selectedMap.size === staff.length}
                              onChange={(e) => toggleSelectAll(e.target.checked)}
                            />
                          </th>
                          <th className="px-4 py-2">№</th>
                          <th className="px-4 py-2">F.I.Sh</th>
                          <th className="px-4 py-2">Lavozim</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStaff.map((person, idx) => {
                          const selected = selectedMap.has(person.id);
                          return (
                            <tr key={person.id} className={selected ? "bg-blue-50" : ""}>
                              <td className="px-4 py-2">
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={(e) => toggleStaff(person, e.target.checked)}
                                />
                              </td>
                              <td className="px-4 py-2">{idx + 1}</td>
                              <td className="px-4 py-2">{person.full_name}</td>
                              <td className="px-4 py-2">{person.position}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      Jami: {staffTotal} ta | Tanlangan: {selectedMap.size}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        disabled={!staffPrev}
                        onClick={() => staffPrev && fetchStaff(staffPrev)}
                      >
                        Oldingi
                      </button>
                      <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        disabled={!staffNext}
                        onClick={() => staffNext && fetchStaff(staffNext)}
                      >
                        Keyingi
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button onClick={() => setPickerOpen(false)} className="px-4 py-2 border rounded">
                Bekor qilish
              </button>
              <button
                onClick={handleAddSelected}
                disabled={selectedMap.size === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Tanlash ({selectedMap.size})
              </button>
            </div>
          </div>
        </div>
      )} */}

      {pickerOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

            {/* ── Header ── */}
            <div
              className="flex items-center justify-between px-6 py-4 shrink-0"
              style={{ background: "linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%)" }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-xl p-2.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-wide">
                    Barcha xodimlar ro'yxati
                  </h2>
                  <p className="text-blue-200 text-xs mt-0.5">
                    Jami: {staffTotal} ta | Tanlangan: {selectedMap.size} ta
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPickerOpen(false)}
                className="text-white/70 hover:text-white hover:bg-white/10 transition-all p-2 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Toolbar ── */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50/80 shrink-0">
              <button
                onClick={() => fetchStaff("/staff/by-name/")}
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-auto px-4 py-3">
              {staffLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-16">
                  <RefreshCw size={36} className="animate-spin mb-3 opacity-40" />
                  <p className="text-sm font-medium">Yuklanmoqda...</p>
                </div>
              ) : filteredStaff.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-16">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-30">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <p className="text-sm font-medium">Xodimlar topilmadi</p>
                </div>
              ) : (
                <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead className="sticky top-0 z-10">
                      <tr style={{ background: "linear-gradient(90deg, #eff6ff 0%, #f0f9ff 100%)" }}>
                        <th className="px-4 py-3 w-12 border-b border-blue-100">
                          <input
                            type="checkbox"
                            checked={staff.length > 0 && selectedMap.size === staff.length}
                            onChange={(e) => toggleSelectAll(e.target.checked)}
                            className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                          />
                        </th>
                        {["№", "F.I.Sh", "Lavozim"].map((h) => (
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
                      {filteredStaff.map((person, idx) => {
                        const selected = selectedMap.has(person.id);
                        const isEven = idx % 2 === 0;
                        // avatar initials
                        const initials = person.full_name
                          ? person.full_name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase()
                          : "?";
                        const avatarColors = [
                          ["#dbeafe", "#1d4ed8"],
                          ["#ede9fe", "#6d28d9"],
                          ["#dcfce7", "#15803d"],
                          ["#fef9c3", "#a16207"],
                          ["#fee2e2", "#b91c1c"],
                        ];
                        const [bg, fg] = avatarColors[idx % avatarColors.length];

                        return (
                          <tr
                            key={person.id}
                            onClick={() => toggleStaff(person, !selected)}
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
                                onChange={(e) => { e.stopPropagation(); toggleStaff(person, e.target.checked); }}
                                className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                              />
                            </td>
                            <td className="px-4 py-3 border-b border-gray-100">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                                {idx + 1}
                              </span>
                            </td>
                            <td className="px-4 py-3 border-b border-gray-100">
                              <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                  style={{ background: bg, color: fg }}
                                >
                                  {initials}
                                </div>
                                <span className="font-semibold text-gray-800 text-sm">{person.full_name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 border-b border-gray-100">
                              {person.position_name ? (
                                <span className="inline-block bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100">
                                  {person.position_name}
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

            {/* ── Footer: pagination + actions ── */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/80 shrink-0">

              {/* Pagination */}
              <div className="flex items-center gap-1">
                <button
                  disabled={!staffPrev}
                  onClick={() => fetchStaff("/staff/by-name/")}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500
              hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30
              disabled:cursor-not-allowed transition-all text-xs font-bold"
                  title="Birinchi sahifa"
                >«</button>
                <button
                  disabled={!staffPrev}
                  onClick={() => staffPrev && fetchStaff(staffPrev)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500
              hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30
              disabled:cursor-not-allowed transition-all text-xs font-bold"
                  title="Oldingi"
                >‹</button>

                {/* dot indicators */}
                <div className="flex items-center gap-1 px-2">
                  {[...Array(Math.min(5, Math.max(1, Math.ceil(staffTotal / 10))))].map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-full transition-all duration-200 ${i === 0
                        ? "w-5 h-2 bg-blue-600"
                        : "w-2 h-2 bg-gray-300"
                        }`}
                    />
                  ))}
                </div>

                <button
                  disabled={!staffNext}
                  onClick={() => staffNext && fetchStaff(staffNext)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500
              hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30
              disabled:cursor-not-allowed transition-all text-xs font-bold"
                  title="Keyingi"
                >›</button>
                <button
                  disabled={!staffNext}
                  onClick={() => staffNext && fetchStaff(staffNext)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500
              hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30
              disabled:cursor-not-allowed transition-all text-xs font-bold"
                  title="Oxirgi sahifa"
                >»</button>

                <span className="ml-2 text-xs text-gray-500 font-medium">{staffTotal} ta</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {selectedMap.size > 0 && (
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100
              px-3 py-1.5 rounded-full text-xs font-semibold">
                    ✓ {selectedMap.size} ta tanlandi
                  </span>
                )}
                <button
                  onClick={() => setPickerOpen(false)}
                  className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600
              hover:bg-gray-100 hover:border-gray-300 transition-all duration-150"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleAddSelected}
                  disabled={selectedMap.size === 0}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md
              hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-150
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)" }}
                >
                  Tanlash ({selectedMap.size})
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <Modal
        title="Imzolovchini o'chirish"
        open={deleteConfirm.open}
        onOk={confirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: 0, name: "" })}
        okText="Ha"
        cancelText="Yo'q"
        okButtonProps={{ danger: true }}
      >
        <p>
          Rostdan ham <strong>"{deleteConfirm.name}"</strong> ni o‘chirmoqchimisiz?
        </p>
      </Modal>
    </div>
  );
};

export default SignatoriesStep;