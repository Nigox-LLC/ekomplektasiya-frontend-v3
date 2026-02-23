import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  FileText,
  MapPin,
} from "lucide-react";
import DocumentDetailView from "./components/DocumentDetailView";
import SettingsMenu from "./components/SettingsMenu";
import SuccessModal from "./components/SuccessModal";
import { Badge, Button, Card, Checkbox, Select } from "antd";
import { axiosAPI } from "@/service/axiosAPI";

interface Letter {
  id: string;
  number: string;
  region: string;
  title: string;
  status: "overdue" | "active" | "cancelled";
  type: "incoming" | "outgoing";
  day: number;
  month: number; // 0 = Yanvar, 1 = Fevral, etc.
  year: number;
}

interface Movement {
  id: number;
  is_done: boolean;
  direction: "IN" | "OUT";
  created_at: string;
  movement_type: string;
  sender_name: string | null;
  receiver_name: string | null;
  date: string; // YYYY-MM-DD
}

type CalendarResponse = Record<string, Movement[]>;

const CalendarView: React.FC = () => {
  // Bugungi kunni avtomatik aniqlash
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth(); // 0 = Yanvar, 1 = Fevral
  const todayYear = today.getFullYear();

  const [selectedDay, setSelectedDay] = useState<number | null>(todayDay); // Avtomatik bugungi kun
  const [showOnlyMyTasks, setShowOnlyMyTasks] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(todayMonth); // Avtomatik joriy oy
  const [currentYear, setCurrentYear] = useState(todayYear); // Avtomatik joriy yil
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null); // Tanlangan xat
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [calendarData, setCalendarData] = useState<CalendarResponse>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Ref for scrolling to selected letter details
  const letterDetailsRef = useRef<HTMLDivElement>(null);

  // Scroll to letter details when a letter is selected
  useEffect(() => {
    if (selectedLetter && letterDetailsRef.current) {
      setTimeout(() => {
        letterDetailsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [selectedLetter]);

  // Clear selected letter when day changes
  useEffect(() => {
    setSelectedLetter(null);
  }, [selectedDay]);

  // Scroll to letters panel when day is selected (for calendar cell click)
  useEffect(() => {
    if (selectedDay !== null && letterDetailsRef.current) {
      setTimeout(() => {
        letterDetailsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    }
  }, [selectedDay]);

  // Oylar nomlari
  const monthNames = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];

  // Har oy uchun kunlar soni
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  // fetch calendar statistics from API
  const fetchCalendarStatistics = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const pad = (value: number) => String(value).padStart(2, "0");
    const startDate = `${currentYear}-${pad(currentMonth + 1)}-01`;
    const endDate = `${currentYear}-${pad(currentMonth + 1)}-${pad(
      daysInMonth,
    )}`;

    try {
      const response = await axiosAPI.get("document/orders/calendar/", {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });

      setCalendarData((response.data || {}) as CalendarResponse);
    } catch (error) {
      console.log(error);
      setCalendarData({});
      setErrorMessage("Ma'lumotlarni yuklashda xatolik yuz berdi.");
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth, currentYear, daysInMonth]);

  useEffect(() => {
    fetchCalendarStatistics();
  }, [fetchCalendarStatistics]);

  // Hafta kunlari
  const weekDays = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

  // Oy boshlanish kuni (0 = Yakshanba, 1 = Dushanba, ..., 6 = Shanba)
  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    // Convert to our format: 0=Dushanba, 1=Seshanba, ..., 6=Yakshanba
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const firstDayOfWeek = getFirstDayOfMonth(currentMonth, currentYear);

  // Bo'sh kunlar
  const emptyDays = Array(firstDayOfWeek).fill(null);

  // Barcha kunlar
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Har bir kun uchun hafta kunini aniqlash (0-Dushanba, 1-Seshanba, ..., 5-Shanba, 6-Yakshanba)
  const getDayOfWeek = (day: number): number => {
    return (firstDayOfWeek + day - 1) % 7;
  };

  // Oldingi oyga o'tish
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  // Keyingi oyga o'tish
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  // Bugungi kunga qaytish
  const goToToday = () => {
    setCurrentMonth(todayMonth);
    setCurrentYear(todayYear);
    setSelectedDay(null);
  };

  const allLetters = useMemo<Letter[]>(() => {
    const letters: Letter[] = [];

    Object.entries(calendarData).forEach(([dateKey, movements]) => {
      const [year, month, day] = dateKey.split("-").map(Number);
      if (!year || !month || !day) return;

      movements.forEach((movement) => {
        const counterparty =
          movement.direction === "IN"
            ? movement.sender_name
            : movement.receiver_name;
        const status = movement.is_done ? "cancelled" : "active";

        letters.push({
          id: String(movement.id),
          number: movement.movement_type || `#${movement.id}`,
          title: movement.movement_type,
          region: counterparty || "-",
          status,
          type: movement.direction === "IN" ? "incoming" : "outgoing",
          day,
          month: month - 1,
          year,
        });
      });
    });

    return letters;
  }, [calendarData]);

  // Filter letters by current month and year
  const filteredLetters = useMemo(() => {
    return allLetters.filter((letter) => {
      if (letter.month !== currentMonth || letter.year !== currentYear)
        return false;
      if (showOnlyMyTasks && letter.status !== "active") return false;
      return true;
    });
  }, [allLetters, currentMonth, currentYear, showOnlyMyTasks]);

  // Total letters count in current month
  const totalMonthLetters = filteredLetters.length;

  const lettersByDay = useMemo(() => {
    const map: Record<number, Letter[]> = {};
    filteredLetters.forEach((letter) => {
      if (!map[letter.day]) {
        map[letter.day] = [];
      }
      map[letter.day].push(letter);
    });
    return map;
  }, [filteredLetters]);

  const getLettersForDay = useCallback(
    (day: number) => {
      const letters = lettersByDay[day] || [];

      // Agar bugungi oyda bo'lsak va kun bugundan oldin bo'lsa
      if (
        currentMonth === todayMonth &&
        currentYear === todayYear &&
        day < todayDay
      ) {
        // Ko'k nuqtalarni (active) qizil (overdue) ga o'zgartirish
        return letters.map((letter) => {
          if (letter.status === "active") {
            return { ...letter, status: "overdue" as const };
          }
          return letter;
        });
      }

      // Agar kelajak oy bo'lsa yoki kelajak yil bo'lsa - hammasi active qoladi
      if (
        currentYear > todayYear ||
        (currentYear === todayYear && currentMonth > todayMonth)
      ) {
        return letters;
      }

      // Agar o'tgan oy yoki o'tgan yil bo'lsa - hammasi overdue
      if (
        currentYear < todayYear ||
        (currentYear === todayYear && currentMonth < todayMonth)
      ) {
        return letters.map((letter) => {
          if (letter.status === "active") {
            return { ...letter, status: "overdue" as const };
          }
          return letter;
        });
      }

      return letters;
    },
    [lettersByDay, currentMonth, currentYear, todayMonth, todayYear, todayDay],
  );

  // Calculate today's statistics
  const overdueCount = filteredLetters.filter(
    (l) => l.status === "overdue",
  ).length;
  const activeCount = filteredLetters.filter(
    (l) => l.status === "active",
  ).length;
  const completedCount = filteredLetters.filter(
    (l) => l.status === "cancelled",
  ).length;

  const getBadgeColor = () => {
    if (overdueCount > 0) return "bg-red-100 text-red-800 border-red-300";
    if (activeCount > 0)
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-green-100 text-green-800 border-green-300";
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <Badge className="bg-blue-100 text-blue-700 text-base px-3 py-1">
              {totalMonthLetters} ta
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="my-tasks"
                checked={showOnlyMyTasks}
                onChange={(e) => setShowOnlyMyTasks(e.target.checked)}
              />
              <label
                htmlFor="my-tasks"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Men masul bo'lgan topshiriqlar
              </label>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                size="small"
                onClick={goToPreviousMonth}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="outlined" size="small" onClick={goToToday}>
                <Calendar className="size-4" />
              </Button>
              <Button variant="outlined" size="small" onClick={goToNextMonth}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
        {isLoading && (
          <div className="text-sm text-gray-500 mb-4">
            Ma'lumotlar yuklanmoqda...
          </div>
        )}
        {errorMessage && (
          <div className="text-sm text-red-600 mb-4">{errorMessage}</div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Viloyat
                </label>
                <Select
                  value={selectedRegion}
                  onChange={(value) => setSelectedRegion(value)}
                >
                  {/* <SelectTrigger>
                    <SelectValue placeholder="Barcha viloyatlar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha viloyatlar</SelectItem>
                    <SelectItem value="Toshkent sh.">Toshkent sh.</SelectItem>
                    <SelectItem value="Samarqand v.">Samarqand v.</SelectItem>
                    <SelectItem value="Buxoro v.">Buxoro v.</SelectItem>
                    <SelectItem value="Andijon v.">Andijon v.</SelectItem>
                    <SelectItem value="Fargona v.">Fargona v.</SelectItem>
                  </SelectContent> */}
                  <Select.Option>Barcha viloyatlar</Select.Option>
                  <Select.Option>Toshkent sh.</Select.Option>
                  <Select.Option>Samarqand v.</Select.Option>
                  <Select.Option>Buxoro v.</Select.Option>
                  <Select.Option>Andijon v.</Select.Option>
                  <Select.Option>Fargona v.</Select.Option>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Holati
                </label>
                <Select
                  value={selectedStatus}
                  onChange={(value) => setSelectedStatus(value)}
                >
                  <Select.Option>Barcha holatlar</Select.Option>
                  <Select.Option>Muddati o'tgan</Select.Option>
                  <Select.Option>Faol</Select.Option>
                  <Select.Option>Bajarilgan</Select.Option>

                  {/* <SelectTrigger>
                    <SelectValue placeholder="Barcha holatlar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha holatlar</SelectItem>
                    <SelectItem value="overdue">Muddati o'tgan</SelectItem>
                    <SelectItem value="active">Faol</SelectItem>
                    <SelectItem value="cancelled">Bajarilgan</SelectItem>
                  </SelectContent> */}
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Turi
                </label>
                <Select
                  value={selectedType}
                  onChange={(value) => setSelectedType(value)}
                >
                  {/* <SelectTrigger>
                    <SelectValue placeholder="Barcha turlar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha turlar</SelectItem>
                    <SelectItem value="incoming">Kiruvchi</SelectItem>
                    <SelectItem value="outgoing">Chiquvchi</SelectItem>
                  </SelectContent> */}
                  <Select.Option>Barcha turlar</Select.Option>
                  <Select.Option>Kiruvchi</Select.Option>
                  <Select.Option>Chiquvchi</Select.Option>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setSelectedRegion("all");
                    setSelectedStatus("all");
                    setSelectedType("all");
                  }}
                  className="w-full"
                >
                  <X className="size-4 mr-2" />
                  Tozalash
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Grid */}
        <div>
          {/* Week Header */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells */}
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"></div>
            ))}

            {/* Days */}
            {calendarDays.map((day) => {
              const dayLetters = getLettersForDay(day);
              const isToday =
                day === todayDay &&
                currentMonth === todayMonth &&
                currentYear === todayYear;
              const dayOfWeek = getDayOfWeek(day);
              const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Shanba (5) VA Yakshanba (6)
              const overdueLetters = dayLetters.filter(
                (l) => l.status === "overdue",
              );
              const activeLetters = dayLetters.filter(
                (l) => l.status === "active",
              );
              const cancelledLetters = dayLetters.filter(
                (l) => l.status === "cancelled",
              );

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-2 relative transition-all hover:shadow-md cursor-pointer ${
                    isToday
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  } ${
                    selectedDay === day
                      ? "ring-4 ring-blue-400 ring-offset-2 shadow-lg"
                      : ""
                  }`}
                  title={`${day} ${monthNames[currentMonth]} - ${dayLetters.length} ta xat`}
                  onClick={() =>
                    setSelectedDay(selectedDay === day ? null : day)
                  }
                >
                  {/* Chap tomon - Jami xatlar soni */}
                  {dayLetters.length > 0 && (
                    <div className="absolute top-1 left-1">
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {dayLetters.length}
                      </span>
                    </div>
                  )}

                  {/* O'ng tomon - Kun raqami */}
                  <div
                    className={`absolute top-1 right-1 ${
                      isToday
                        ? "text-blue-600 font-extrabold text-lg"
                        : isWeekend
                          ? "text-red-600 font-medium text-sm"
                          : "text-gray-900 font-medium text-sm"
                    }`}
                  >
                    {day}
                  </div>

                  {/* Letter Dots - bajarilgan xatlar ham ko'rinadi */}
                  {dayLetters.length > 0 && (
                    <div className="absolute bottom-2 left-2 right-2 flex gap-1 flex-wrap">
                      {/* Qizil - Bajarilmagan (muddati o'tgan) */}
                      {overdueLetters.map((letter) => (
                        <div
                          key={`overdue-${letter.id}`}
                          className="w-2 h-2 rounded-full bg-red-500 cursor-pointer hover:scale-125 transition-transform relative group"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDay(day);
                            setSelectedLetter(letter);
                          }}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
                            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                              <div className="font-semibold">
                                {letter.number}
                              </div>
                              <div className="text-gray-300">
                                {letter.title}
                              </div>
                              <div className="text-gray-400 text-[10px] mt-1">
                                {letter.region}
                              </div>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* Ko'k - Kelib tushgan (faol) */}
                      {activeLetters.map((letter) => (
                        <div
                          key={`active-${letter.id}`}
                          className="w-2 h-2 rounded-full bg-blue-500 cursor-pointer hover:scale-125 transition-transform relative group"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDay(day);
                            setSelectedLetter(letter);
                          }}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
                            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                              <div className="font-semibold">
                                {letter.number}
                              </div>
                              <div className="text-gray-300">
                                {letter.title}
                              </div>
                              <div className="text-gray-400 text-[10px] mt-1">
                                {letter.region}
                              </div>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* Qora - Bajarilgan (har doim ko'rinadi) */}
                      {cancelledLetters.map((letter) => (
                        <div
                          key={`cancelled-${letter.id}`}
                          className="w-2 h-2 rounded-full bg-gray-900 cursor-pointer hover:scale-125 transition-transform relative group"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDay(day);
                            setSelectedLetter(letter);
                          }}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
                            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                              <div className="font-semibold">
                                {letter.number}
                              </div>
                              <div className="text-gray-300">
                                {letter.title}
                              </div>
                              <div className="text-gray-400 text-[10px] mt-1">
                                {letter.region}
                              </div>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Selected Day Letters List - SPLIT LAYOUT 25% / 75% */}
      {selectedDay !== null && getLettersForDay(selectedDay).length > 0 && (
        <div className="flex gap-6" ref={letterDetailsRef}>
          {/* CHAP PANEL - Xatlar ro'yxati (25%) */}
          <div className="w-[25%] bg-white rounded-lg shadow border border-gray-200 flex flex-col h-[800px]">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
              <h3 className="text-base font-semibold text-gray-900">
                {selectedDay} {monthNames[currentMonth]} (
                {getLettersForDay(selectedDay).length})
              </h3>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setSelectedDay(null);
                  setSelectedLetter(null);
                }}
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* Xatlar ro'yxati - scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {getLettersForDay(selectedDay).map((letter) => {
                const borderColor =
                  letter.status === "overdue"
                    ? "border-l-red-500"
                    : letter.status === "active"
                      ? "border-l-blue-500"
                      : "border-l-gray-400";

                const isSelected = selectedLetter?.id === letter.id;

                return (
                  <div
                    key={letter.id}
                    className={`relative bg-white border rounded-lg p-3 cursor-pointer transition-all border-l-4 ${borderColor} ${
                      isSelected
                        ? "ring-2 ring-blue-500 shadow-md bg-blue-50"
                        : "hover:shadow-md hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedLetter(letter)}
                  >
                    <div className="flex items-start gap-2">
                      <FileText className="size-4 text-gray-400 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900 mb-1">
                          {letter.number}
                        </div>
                        <h4 className="text-xs text-gray-700 mb-2 line-clamp-2 leading-relaxed">
                          {letter.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="size-3 shrink-0" />
                          <span className="truncate">{letter.region}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* O'NG PANEL - To'liq DocumentDetailView (75%) */}
          <div className="flex-1 bg-white rounded-lg shadow border border-gray-200 h-[800px] overflow-y-auto">
            {selectedLetter ? (
              <DocumentDetailView
                document={{
                  id: selectedLetter.id,
                  number: selectedLetter.number,
                  title: selectedLetter.title,
                  category:
                    selectedLetter.type === "incoming" ? "reply" : "outgoing",
                  date: `${selectedDay} ${monthNames[currentMonth]} ${currentYear}`,
                  isRead: selectedLetter.status !== "active",
                  isReceived: selectedLetter.type === "incoming",
                  hasAttachment: true,
                }}
                onClose={() => setSelectedLetter(null)}
                onSuccess={(message) => {
                  setSuccessMessage(message);
                  setShowSuccess(true);
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="size-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Xatni tanlang
                  </h3>
                  <p className="text-gray-500">
                    Tafsilotlarini ko'rish uchun chap tarafdan xatni tanlang
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <SettingsMenu
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      {/* <LanguageMenu isOpen={showLanguage} onClose={() => setShowLanguage(false)} /> */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message={successMessage}
      />
    </div>
  );
};

export default CalendarView;
