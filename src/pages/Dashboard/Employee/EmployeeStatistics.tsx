import axios from "axios";
import {
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Eye,
  FileText,
  Mail,
  UserIcon,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface DashboardViewProps {
  hasAccess: (section: string) => boolean;
  initialView?: "general" | "employees";
}

interface TimelineStep {
  id: number;
  date: string;
  time: string;
  action: string;
  performer: string;
  status: "completed" | "pending" | "delayed";
  comment?: string;
}

interface Letter {
  id: string;
  number: string;
  title: string;
  status: "completed" | "pending" | "delayed";
  receivedDate: string;
  deadline: string;
  timeline: TimelineStep[];
}

interface Employee {
  id: number;
  name: string;
  position: string;
  completed: number;
  notCompleted: number;
  delayed: number;
  total: number;
  letters: Letter[];
}

const EmployeeStatistics: React.FC<DashboardViewProps> = ({
  hasAccess,
  initialView,
}) => {
  const [selectedView, setSelectedView] = useState<"general" | "employees">(
    initialView || "employees",
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [expandedEmployee, setExpandedEmployee] = useState<number | null>(null);
  const [expandedLetter, setExpandedLetter] = useState<string | null>(null);
  const [employeesData, setEmployeesData] = useState<Employee[]>([]);

  // initialView o'zgarganda selectedView ni yangilash
  useEffect(() => {
    if (initialView) {
      setSelectedView(initialView);
    }
  }, [initialView]);

  const employeesPerPage = 3;
  const totalPages = Math.ceil(employeesData.length / employeesPerPage);

  const handlePrevEmployee = () => {
    setIsAutoPlay(false);
    setCurrentPageIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNextEmployee = () => {
    setIsAutoPlay(false);
    setCurrentPageIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  // fetch employees data API request
  useEffect(() => {
    const fetchEmployeesData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/employee_statistics",
        );
        if (response.status === 200) setEmployeesData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmployeesData();
  }, []);

  return (
    <div className="space-y-6">
      {/* XODIMLAR STATISTIKASI - faqat ruxsat bor bo'lsa */}
      {selectedView === "employees" &&
        hasAccess("dashboard-employee-stats") && (
          <div className="bg-white rounded-xl shadow-xl border-2 border-gray-200 p-8">
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Navigation buttons */}
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-900 text-right">
                  Ijro statistikasi
                </h4>
              </div>

              {/* Xodimlar - 3 ta gorizontal */}
              {employeesData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-start">
                  {employeesData.map((employee) => {
                    const completionRate = (
                      (employee.completed / employee.total) *
                      100
                    ).toFixed(1);
                    return (
                      <div
                        key={employee.id}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200"
                      >
                        {/* Avatar va FIO */}
                        <div className="flex flex-col items-center mb-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl mb-3">
                            <span className="text-2xl font-bold text-white">
                              {employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 text-center">
                            {employee.name}
                          </h4>
                          <p className="text-sm text-gray-600 text-center">
                            {employee.position}
                          </p>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-700">
                              Bajarish
                            </span>
                            <span className="text-sm font-bold text-purple-600">
                              {completionRate}%
                            </span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-1000"
                              style={{ width: `${completionRate}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Filterlar - VERTIKAL */}
                        <div className="space-y-2">
                          <div className="bg-white p-3 rounded-lg border-2 flex items-center justify-between border-blue-200">
                            <div className="flex items-center gap-2 mb-1">
                              <Mail className="size-4 text-blue-600" />
                              <p className="text-xs font-semibold text-blue-700">
                                Jami xatlar
                              </p>
                            </div>
                            <p className="text-2xl font-bold text-blue-900">
                              {employee.total}
                            </p>
                          </div>

                          <div className="bg-white p-3 rounded-lg border-2 flex items-center justify-between border-green-200">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle className="size-4 text-green-600" />
                              <p className="text-xs font-semibold text-green-700">
                                Bajarilgan
                              </p>
                            </div>
                            <p className="text-2xl font-bold text-green-900">
                              {employee.completed}
                            </p>
                          </div>

                          <div className="bg-white p-3 rounded-lg border-2 flex items-center justify-between border-orange-200">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="size-4 text-orange-600" />
                              <p className="text-xs font-semibold text-orange-700">
                                Bajarilmagan
                              </p>
                            </div>
                            <p className="text-2xl font-bold text-orange-900">
                              {employee.notCompleted}
                            </p>
                          </div>

                          <div className="bg-white p-3 rounded-lg border-2 flex items-center justify-between border-red-200">
                            <div className="flex items-center gap-2 mb-1">
                              <XCircle className="size-4 text-red-600" />
                              <p className="text-xs font-semibold text-red-700">
                                Kechiktirilgan
                              </p>
                            </div>
                            <p className="text-2xl font-bold text-red-900">
                              {employee.delayed}
                            </p>
                          </div>
                        </div>

                        {/* Batafsil ko'rish tugmasi */}
                        {employee.letters.length > 0 && (
                          <button
                            onClick={() =>
                              setExpandedEmployee(
                                expandedEmployee === employee.id
                                  ? null
                                  : employee.id,
                              )
                            }
                            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition-all shadow-md"
                          >
                            <Eye className="size-4" />
                            <span className="text-sm font-semibold">
                              {expandedEmployee === employee.id
                                ? "Yashirish"
                                : "Batafsil ko'rish"}
                            </span>
                            {expandedEmployee === employee.id ? (
                              <ChevronUp className="size-4" />
                            ) : (
                              <ChevronDown className="size-4" />
                            )}
                          </button>
                        )}

                        {/* Xodim xatlari ro'yxati */}
                        {expandedEmployee === employee.id &&
                          employee.letters.length > 0 && (
                            <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                              <div className="border-t-2 border-purple-200 pt-4">
                                <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                  <FileText className="size-4 text-purple-600" />
                                  Oxirgi xatlar ({employee.letters.length} ta)
                                </h5>
                                {employee.letters.map((letter) => (
                                  <div
                                    key={letter.id}
                                    className="mb-3 bg-white rounded-lg border-2 border-gray-200 overflow-hidden"
                                  >
                                    {/* Xat sarlavhasi */}
                                    <button
                                      onClick={() =>
                                        setExpandedLetter(
                                          expandedLetter === letter.id
                                            ? null
                                            : letter.id,
                                        )
                                      }
                                      className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                    >
                                      <div className="flex-1 text-left">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span
                                            className={`px-2 py-0.5 text-xs font-bold rounded ${
                                              letter.status === "completed"
                                                ? "bg-green-100 text-green-700"
                                                : letter.status === "pending"
                                                  ? "bg-blue-100 text-blue-700"
                                                  : "bg-red-100 text-red-700"
                                            }`}
                                          >
                                            {letter.number}
                                          </span>
                                        </div>
                                        <p className="text-xs font-semibold text-gray-900">
                                          {letter.title}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1">
                                          <span className="text-xs text-gray-500">
                                            Qabul: {letter.receivedDate}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            Muddat: {letter.deadline}
                                          </span>
                                        </div>
                                      </div>
                                      {expandedLetter === letter.id ? (
                                        <ChevronUp className="size-4 text-gray-400" />
                                      ) : (
                                        <ChevronDown className="size-4 text-gray-400" />
                                      )}
                                    </button>

                                    {/* Timeline - Ijro qadamlari */}
                                    {expandedLetter === letter.id && (
                                      <div className="px-3 pb-3 bg-gray-50 animate-in slide-in-from-top-1 duration-200">
                                        <div className="border-l-2 border-indigo-300 pl-4 py-2 space-y-3">
                                          {letter.timeline.map(
                                            (step, index) => (
                                              <div
                                                key={step.id}
                                                className="relative"
                                              >
                                                {/* Timeline dot */}
                                                <div
                                                  className={`absolute -left-[22px] w-4 h-4 rounded-full border-2 ${
                                                    step.status === "completed"
                                                      ? "bg-green-500 border-green-600"
                                                      : step.status ===
                                                          "pending"
                                                        ? "bg-blue-500 border-blue-600"
                                                        : "bg-red-500 border-red-600"
                                                  }`}
                                                ></div>

                                                {/* Step ma'lumotlari */}
                                                <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                                                  <div className="flex items-start justify-between mb-1">
                                                    <div className="flex-1">
                                                      <p
                                                        className={`text-xs font-bold ${
                                                          step.status ===
                                                          "completed"
                                                            ? "text-green-700"
                                                            : step.status ===
                                                                "pending"
                                                              ? "text-blue-700"
                                                              : "text-red-700"
                                                        }`}
                                                      >
                                                        {step.action}
                                                      </p>
                                                      <div className="flex items-center gap-2 mt-1">
                                                        <UserIcon className="size-3 text-gray-500" />
                                                        <span className="text-xs text-gray-600">
                                                          {step.performer}
                                                        </span>
                                                      </div>
                                                    </div>
                                                    <div className="text-right">
                                                      <p className="text-xs text-gray-500">
                                                        {step.date}
                                                      </p>
                                                      <p className="text-xs text-gray-400">
                                                        {step.time}
                                                      </p>
                                                    </div>
                                                  </div>
                                                  {step.comment && (
                                                    <p className="text-xs text-gray-600 italic mt-1 bg-gray-50 p-1 rounded">
                                                      💬 {step.comment}
                                                    </p>
                                                  )}
                                                </div>
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-10">
                  <p className="text-sm text-gray-500">
                    Hozircha xodimlar haqida ma'lumot mavjud emas.
                  </p>
                </div>
              )}

              {/* Avtomatik almashinish indikatori */}
              {isAutoPlay && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500"></div>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default EmployeeStatistics;
