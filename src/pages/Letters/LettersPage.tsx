import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Search, Trash2, ChevronRight, Building2 } from "lucide-react";
import StatusFilter from "./components/StatusFilter";
import { Button, Card, Input } from "antd";
import LetterDetail from "./components/Detail/LetterDetail";
import { useAppSelector } from "@/store/hooks/hooks";
import { axiosAPI } from "@/service/axiosAPI";
import { useLocation, useParams } from "react-router";

export interface Letter {
  created_at: string;
  id: number;
  incoming_number: string;
  is_accepted: boolean;
  is_send: boolean;
  outgoing_number: string;
  receiver_name: string;
  send_date: string;
  sender_name: string;
  department_name: string;
  region_name: string;
}

const LettersPage: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [letters, setLetters] = useState<Letter[]>([]);
  // Pagination states
  const [page, setPage] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastTriggeredPageRef = useRef<number>(1);

  const { showFilters } = useAppSelector((state) => state.letters);
  const { status } = useParams();
  const location = useLocation();

  const getStatusColor = (is_accepted: boolean) => {
    return is_accepted ? "border-l-green-500" : "border-l-red-500";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "overdue":
        return { text: "Muddati o'tgan", class: "bg-red-100 text-red-700" };
      case "active":
        return { text: "Faol", class: "bg-yellow-100 text-yellow-700" };
      case "completed":
        return { text: "Bajarilgan", class: "bg-green-100 text-green-700" };
      case "cancelled":
        return { text: "Bekor qilingan", class: "bg-gray-100 text-gray-700" };
      default:
        return { text: "Noma'lum", class: "bg-gray-100 text-gray-700" };
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {};

  // Highlight funksiyasi - qidiruv so'zlarini ajratib ko'rsatish
  const highlightText = (text: string) => {
    const searchTerms: string[] = [];

    // if (kirish.trim()) searchTerms.push(kirish.trim());
    // if (chiqish.trim()) searchTerms.push(chiqish.trim());
    // if (kalit.trim()) searchTerms.push(kalit.trim());
    // if (mazmun.trim()) searchTerms.push(mazmun.trim());
    // if (sana.trim()) searchTerms.push(sana.trim());
    // if (jonatuvchi.trim()) searchTerms.push(jonatuvchi.trim());

    if (searchTerms.length === 0) {
      return text;
    }

    const pattern = searchTerms
      .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");
    const regex = new RegExp(`(${pattern})`, "gi");

    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) => {
          const isMatch = searchTerms.some(
            (term) => part.toLowerCase() === term.toLowerCase(),
          );

          if (isMatch) {
            return (
              <mark
                key={index}
                className="bg-yellow-200 text-gray-900 font-semibold px-1 rounded"
              >
                {part}
              </mark>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  };

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
    setLetters([]);
    setHasMore(true);
    lastTriggeredPageRef.current = 1;
  }, [status, location.pathname]);

  // Fetch letters when page changes
  useEffect(() => {
    const fetchLetters = async () => {
      // Prevent duplicate requests
      if (isLoading) return;

      // Don't fetch if we know there's no more data (except for initial page)
      if (page > 1 && !hasMore) return;

      setIsLoading(true);
      try {
        let direction = location.pathname.includes("IN")
          ? "IN"
          : location.pathname.includes("OUT")
            ? "OUT"
            : false;
        const params: any = {
          page: page,
        };
        const isPathMyLetter = location.pathname.includes("my_letter");
        if(isPathMyLetter) params.status = "my_letter";
        if (direction) params.direction = direction;
        if (status && status !== "all_count") {
          params.status = status;
        }

        const response = await axiosAPI.get("document/orders/", { params });
        if (response.status === 200) {
          const newLetters = response.data.results;
          const total = response.data.count;

          setTotalDocuments(total);

          // Append or replace based on page number
          if (page === 1) {
            setLetters(newLetters);
            // Check if we have more data to load
            setHasMore(newLetters.length < total);
          } else {
            setLetters((prev) => {
              const updatedLetters = [...prev, ...newLetters];
              // Check if we've loaded all data
              const allDataLoaded =
                updatedLetters.length >= total || newLetters.length === 0;
              setHasMore(!allDataLoaded);
              return updatedLetters;
            });
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLetters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  // Scroll handler for infinite scroll
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    // Check if scrolled to bottom (with 50px threshold)
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      // Only trigger if we haven't already triggered the next page
      const nextPage = page + 1;
      if (lastTriggeredPageRef.current < nextPage) {
        lastTriggeredPageRef.current = nextPage;
        setPage(nextPage);
      }
    }
  }, [isLoading, hasMore, page]);

  // Attach scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Status Filters - YUQORIDA, TO'LIQ KENGLIKDA */}
      <StatusFilter letters={letters} totalCount={totalDocuments} />

      {/* Main Content */}
      <div className="flex gap-6 flex-1">
        {/* Left Side - Letters List - DOIM 1/4 KENGLIKDA */}
        <div className="w-1/4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {/* {filter === "all" && "Yuborilgan xatlar"}
                {filter === "execution" && "Ijro uchun"}
                {filter === "info" && "Ma'lumot uchun"}
                {filter === "instructions" && "Ko'rsatma xatlar"} */}
              </h2>
              <p className="text-xs text-gray-500">Jami: {totalDocuments} ta</p>
            </div>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <Card className="p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                QIDIRISH
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Input
                    placeholder="Kirish raqami"
                    // value={kirish}
                    // onChange={(e) => setKirish(e.target.value)}
                    className="w-full"
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Kalit so'zi"
                    // value={kalit}
                    // onChange={(e) => setKalit(e.target.value)}
                    className="w-full"
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Jo'natuvchi tashkilot"
                    // value={jonatuvchi}
                    // onChange={(e) => setJonatuvchi(e.target.value)}
                    className="w-full"
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-6">
                <Button
                  onClick={() => {
                    // search logic here
                  }}
                  className="gap-2 w-full"
                >
                  <Search className="size-4" />
                  Qidirish
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    // setKirish("");
                    // setKalit("");
                    // setJonatuvchi("");
                  }}
                  className="gap-2 w-full"
                >
                  <Trash2 className="size-4" />
                  Tozalash
                </Button>
              </div>
            </Card>
          )}

          {/* Letters List */}
          <div
            ref={scrollContainerRef}
            className="flex flex-col gap-2 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 300px)" }}
          >
            {letters.map((letter) => {
              const borderColor = getStatusColor(letter.is_accepted);

              return (
                <Card
                  key={letter.id}
                  className={`p-2 hover:shadow-lg transition-all cursor-pointer border-l-4 ${borderColor} ${
                    selectedLetter?.id === letter.id
                      ? "bg-blue-200! border-blue-600!"
                      : ""
                  }`}
                  onClick={() => setSelectedLetter(letter)}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex-1 min-w-0">
                      {/* Raqam + Sana */}
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-gray-900">
                          №:{" "}
                          {letter.old_number
                            ? highlightText(letter.old_number)
                            : highlightText(letter.incoming_number)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {highlightText(letter.send_date)}
                        </span>
                      </div>

                      {/* Sarlavha */}
                      <h3 className="text-xs font-medium text-gray-900 mb-2 line-clamp-2">
                        Xodim: {highlightText(letter.receiver_name)}
                      </h3>

                      <div className="flex items-start justify-between">
                        {/* Manzil */}
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <MapPin className="size-3 text-gray-400 shrink-0" />
                          <span
                            className="truncate text-xs max-w-62.5"
                            title={letter.region_name}
                          >
                            {highlightText(letter.region_name)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="size-3 text-gray-400 shrink-0" />
                  </div>
                </Card>
              );
            })}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* End of list message */}
            {!hasMore && letters.length > 0 && (
              <div className="text-center py-4 text-sm text-gray-500">
                Barcha xatlar yuklandi
              </div>
            )}

            {/* Empty state */}
            {!isLoading && letters.length === 0 && (
              <div className="text-center py-8 text-sm text-gray-500">
                Xatlar topilmadi
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Document Detail */}
        {selectedLetter && (
          <div
            className="w-3/4 border-l border-gray-200 pl-6 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            {/* <DocumentDetailView
              document={{
                id: selectedLetter.id,
                number: selectedLetter.outgoingNumber,
                title: selectedLetter.title,
                category: 'outgoing',
                date: selectedLetter.sentDate,
                tags: [],
                isRead: true,
                isReceived: false,
              }}
              onBack={() => setSelectedLetter(null)}
            /> */}
            <LetterDetail
              document={{
                id: selectedLetter.id,
                number: selectedLetter.outgoing_number,
                title: selectedLetter.department_name,
                category: "outgoing",
                date: selectedLetter.send_date,
                tags: [],
                isRead: true,
                isReceived: false,
              }}
              onBack={() => setSelectedLetter(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LettersPage;
