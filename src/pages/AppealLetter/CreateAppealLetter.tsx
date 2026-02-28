import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FilePlus2,
  Loader2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { axiosAPI } from "@/service/axiosAPI";

type Step = 1 | 2 | 3;
type SigPurpose = "signatory" | "approver";

interface PriceAnalysisItem {
  id: number;
  number?: string;
  employee_name?: string;
  created_at?: string;
  status?: string;
}

interface Employee {
  id: number;
  full_name: string;
  position?: string;
}

interface AppealItemPayload {
  price_analysis: number;
  quantity: number;
}

interface AppealSigDraft {
  employee: number;
  purpose: SigPurpose | "";
}

interface PaginatedResponse<T> {
  results: T[];
}

const fallbackEmployees: Employee[] = [
  { id: 1, full_name: "Aliyev Jamshid Karimovich", position: "Direktor" },
  { id: 2, full_name: "Karimov Aziz Akbarovich", position: "Menejer" },
  { id: 3, full_name: "Sodiqov Sardor Dilshod o'g'li", position: "Mutaxassis" },
];

const stepTitles: Record<Step, string> = {
  1: "Narx tahlillarini tanlash",
  2: "Xodim va maqsadni tanlash",
  3: "Yakuniy shakllantirish",
};

function CreateAppealLetter() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [items, setItems] = useState<AppealItemPayload[]>([]);
  const [sigs, setSigs] = useState<AppealSigDraft[]>([]);

  const [analysisList, setAnalysisList] = useState<PriceAnalysisItem[]>([]);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const selectedItemIds = useMemo(
    () => new Set(items.map((item) => item.price_analysis)),
    [items],
  );
  const selectedEmployeeIds = useMemo(
    () => new Set(sigs.map((sig) => sig.employee)),
    [sigs],
  );

  useEffect(() => {
    void fetchAnalysisItems();
    void fetchEmployees();
  }, []);

  const fetchAnalysisItems = async () => {
    setAnalysisLoading(true);
    setAnalysisError(null);
    try {
      const response = await axiosAPI.get<
        PriceAnalysisItem[] | PaginatedResponse<PriceAnalysisItem>
      >("document/analysis/items/");

      if (Array.isArray(response.data)) {
        setAnalysisList(response.data);
      } else if (response.data && Array.isArray(response.data.results)) {
        setAnalysisList(response.data.results);
      } else {
        setAnalysisList([]);
      }
    } catch (error) {
      console.error("Failed to fetch analysis items", error);
      setAnalysisList([]);
      setAnalysisError("Narx tahlillari ro'yxatini yuklab bo'lmadi");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const fetchEmployees = async () => {
    setEmployeesLoading(true);
    try {
      const response = await axiosAPI.get<
        Employee[] | PaginatedResponse<Employee>
      >("/staff/by-name/");
      if (Array.isArray(response.data)) {
        setEmployees(response.data);
      } else if (response.data && Array.isArray(response.data.results)) {
        setEmployees(response.data.results);
      } else {
        setEmployees(fallbackEmployees);
      }
    } catch (error) {
      console.error("Failed to fetch employees", error);
      setEmployees(fallbackEmployees);
    } finally {
      setEmployeesLoading(false);
    }
  };

  const toggleAnalysisItem = (analysisId: number, checked: boolean) => {
    setItems((prev) => {
      if (checked) {
        if (prev.some((item) => item.price_analysis === analysisId)) {
          return prev;
        }
        return [...prev, { price_analysis: analysisId, quantity: 1 }];
      }
      return prev.filter((item) => item.price_analysis !== analysisId);
    });
  };

  const updateQuantity = (analysisId: number, quantityValue: string) => {
    const parsed = Number(quantityValue);
    const nextQuantity = Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;

    setItems((prev) =>
      prev.map((item) =>
        item.price_analysis === analysisId
          ? { ...item, quantity: nextQuantity }
          : item,
      ),
    );
  };

  const toggleEmployee = (employeeId: number, checked: boolean) => {
    setSigs((prev) => {
      if (checked) {
        if (prev.some((sig) => sig.employee === employeeId)) {
          return prev;
        }
        return [...prev, { employee: employeeId, purpose: "" }];
      }
      return prev.filter((sig) => sig.employee !== employeeId);
    });
  };

  const updatePurpose = (employeeId: number, purpose: SigPurpose | "") => {
    setSigs((prev) =>
      prev.map((sig) =>
        sig.employee === employeeId ? { ...sig, purpose } : sig,
      ),
    );
  };

  const validateStep = (targetStep: Step) => {
    if (targetStep === 2) {
      if (items.length === 0) {
        toast.error("Kamida 1 ta narx tahlilini tanlang");
        return false;
      }
      if (items.some((item) => item.quantity < 1)) {
        toast.error(
          "Har bir tanlangan element uchun miqdor kamida 1 bo'lishi kerak",
        );
        return false;
      }
    }

    if (targetStep === 3) {
      if (sigs.length === 0) {
        toast.error("Kamida 1 ta xodim tanlanishi kerak");
        return false;
      }
      if (sigs.some((sig) => sig.purpose === "")) {
        toast.error("Har bir tanlangan xodim uchun maqsadni tanlang");
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep(2)) {
      return;
    }
    if (step === 2 && !validateStep(3)) {
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3) as Step);
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      return;
    }

    const payload = {
      items,
      sigs: sigs as { employee: number; purpose: SigPurpose }[],
    };

    setSubmitting(true);
    try {
      await axiosAPI.post("/document/appeal/", payload);
      toast.success("Murojaat xati muvaffaqiyatli shakllantirildi");
      navigate("/appeal-letter");
    } catch (error) {
      console.error("Failed to create appeal letter", error);
      toast.error("Murojaat xatini yaratishda xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const getAnalysisLabel = (analysisId: number) => {
    const found = analysisList.find((item) => item.id === analysisId);
    if (!found) {
      return `ID: ${analysisId}`;
    }

    return found.number || `Tahlil #${found.id}`;
  };

  const getEmployeeLabel = (employeeId: number) => {
    const found = employees.find((employee) => employee.id === employeeId);
    return found?.full_name || `Xodim #${employeeId}`;
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 p-6">
      <div className=" rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <button
            onClick={() => navigate("/appeal-letter")}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="size-4" /> Orqaga
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Murojaat xatini yaratish
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            3 bosqichli shakllantirish jarayoni
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[1, 2, 3].map((item) => {
              const current = item as Step;
              const isDone = current < step;
              const isActive = current === step;
              return (
                <div
                  key={item}
                  className={`rounded-lg border p-3 ${
                    isActive
                      ? "border-blue-500 bg-blue-50"
                      : isDone
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <CheckCircle2 className="size-4 text-green-600" />
                    ) : (
                      <span
                        className={`inline-flex size-5 items-center justify-center rounded-full text-xs font-semibold ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {item}
                      </span>
                    )}
                    <p className="text-sm font-medium text-gray-800">
                      {stepTitles[current]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                1-bosqich: Narx tahlilini tanlang
              </h2>

              {analysisLoading ? (
                <div className="flex items-center justify-center rounded-lg border border-gray-200 py-10">
                  <Loader2 className="size-5 animate-spin text-blue-600" />
                </div>
              ) : analysisList.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
                  <p className="text-sm text-gray-600">
                    Narx tahlillari topilmadi
                  </p>
                  {analysisError ? (
                    <p className="mt-1 text-sm text-red-600">{analysisError}</p>
                  ) : null}
                  <button
                    onClick={() => navigate("/price-analysis")}
                    className="mx-auto mt-4 flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <FilePlus2 className="size-4" /> Narx tahlili yaratish
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {analysisList.map((analysis) => {
                    const isChecked = selectedItemIds.has(analysis.id);
                    return (
                      <label
                        key={analysis.id}
                        className="block rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(event) =>
                                toggleAnalysisItem(
                                  analysis.id,
                                  event.target.checked,
                                )
                              }
                              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
                            />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {analysis.number || `Tahlil #${analysis.id}`}
                              </p>
                              <p className="text-xs text-gray-500">
                                {analysis.employee_name ||
                                  "Xodim ko'rsatilmagan"}
                              </p>
                            </div>
                          </div>

                          {isChecked && (
                            <div className="w-36">
                              <label className="mb-1 block text-xs text-gray-500">
                                Miqdor
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={
                                  items.find(
                                    (item) =>
                                      item.price_analysis === analysis.id,
                                  )?.quantity ?? 1
                                }
                                onChange={(event) =>
                                  updateQuantity(
                                    analysis.id,
                                    event.target.value,
                                  )
                                }
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                              />
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                2-bosqich: Xodimlar va maqsad
              </h2>

              {employeesLoading ? (
                <div className="flex items-center justify-center rounded-lg border border-gray-200 py-10">
                  <Loader2 className="size-5 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="space-y-3">
                  {employees.map((employee) => {
                    const isChecked = selectedEmployeeIds.has(employee.id);
                    const selectedSig = sigs.find(
                      (sig) => sig.employee === employee.id,
                    );

                    return (
                      <div
                        key={employee.id}
                        className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <label className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(event) =>
                                toggleEmployee(
                                  employee.id,
                                  event.target.checked,
                                )
                              }
                              className="h-4 w-4 rounded border-gray-300 text-blue-600"
                            />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {employee.full_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {employee.position || "Lavozim ko'rsatilmagan"}
                              </p>
                            </div>
                          </label>

                          {isChecked && (
                            <select
                              value={selectedSig?.purpose || ""}
                              onChange={(event) =>
                                updatePurpose(
                                  employee.id,
                                  event.target.value as SigPurpose | "",
                                )
                              }
                              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                            >
                              <option value="">Maqsadni tanlang</option>
                              <option value="signatory">signatory</option>
                              <option value="approver">approver</option>
                            </select>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {employees.length === 0 && (
                    <div className="rounded-lg border border-dashed border-gray-300 py-10 text-center text-sm text-gray-500">
                      <Users className="mx-auto mb-2 size-5" />
                      Xodimlar mavjud emas
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">
                3-bosqich: Yakuniy ko'rinish
              </h2>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Tanlangan narx tahlillari
                </h3>
                {items.length === 0 ? (
                  <p className="text-sm text-gray-500">Tanlanmagan</p>
                ) : (
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.price_analysis}
                        className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm"
                      >
                        <span>{getAnalysisLabel(item.price_analysis)}</span>
                        <span className="font-semibold">
                          Miqdor: {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Tanlangan xodimlar
                </h3>
                {sigs.length === 0 ? (
                  <p className="text-sm text-gray-500">Tanlanmagan</p>
                ) : (
                  <div className="space-y-2">
                    {sigs.map((sig) => (
                      <div
                        key={sig.employee}
                        className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm"
                      >
                        <span>{getEmployeeLabel(sig.employee)}</span>
                        <span className="font-semibold">
                          {sig.purpose || "Maqsad tanlanmagan"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Yuborilmoqda..." : "Shakllantirish"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 p-5">
          <button
            onClick={prevStep}
            disabled={step === 1 || submitting}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Orqaga
          </button>

          {step < 3 ? (
            <button
              onClick={nextStep}
              disabled={submitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Keyingi
            </button>
          ) : (
            <div className="text-sm text-gray-500">Yakuniy bosqich</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateAppealLetter;
