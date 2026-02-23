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

  const filteredStaff = (staff || []).filter(
    (s) =>
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.position.toLowerCase().includes(searchTerm.toLowerCase())
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

      <div className="border rounded-lg overflow-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left">N</th>
              <th className="px-4 py-2 text-left">IMZOLOVCHI XODIM</th>
              <th className="px-4 py-2 text-left">LAVOZIM</th>
              <th className="px-4 py-2 text-left">IMZO</th>
              <th className="px-4 py-2 text-left">IMZOLANGAN VAQT</th>
              <th className="px-4 py-2 text-left">HARAKATLAR</th>
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
                <tr key={ex.id} className="border-t">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{ex.full_name}</td>
                  <td className="px-4 py-2">{ex.position}</td>
                  <td className="px-4 py-2">-</td>
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

      {pickerOpen && (
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