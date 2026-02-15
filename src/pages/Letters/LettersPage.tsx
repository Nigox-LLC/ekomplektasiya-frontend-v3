import { useState } from "react";
import {
  FileText,
  MapPin,
  Calendar,
  Search,
  Trash2,
  FileCheck,
  ChevronRight,
} from "lucide-react";
import StatusFilter from "./components/StatusFilter";
import { Button, Card, Input } from "antd";
import LetterDetail from "./components/LetterDetail";

interface Letter {
  id: string;
  number: string;
  outgoingNumber: string;
  region: string;
  title: string;
  deadline: string;
  status: "overdue" | "active" | "completed" | "cancelled";
  type: string;
  sentDate: string;
  recipient: string;
}

const LettersPage: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "border-l-red-500";
      case "active":
        return "border-l-yellow-500";
      case "completed":
        return "border-l-green-500";
      case "cancelled":
        return "border-l-gray-500";
      default:
        return "border-l-gray-500";
    }
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

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Status Filters - YUQORIDA, TO'LIQ KENGLIKDA */}
      <StatusFilter />

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
              <p className="text-xs text-gray-500">
                Jami: {90} ta
              </p>
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
                    value={kirish}
                    onChange={(e) => setKirish(e.target.value)}
                    className="w-full"
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Kalit so'zi"
                    value={kalit}
                    onChange={(e) => setKalit(e.target.value)}
                    className="w-full"
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Jo'natuvchi tashkilot"
                    value={jonatuvchi}
                    onChange={(e) => setJonatuvchi(e.target.value)}
                    className="w-full"
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-6">
                <Button onClick={handleSearch} className="gap-2 w-full">
                  <Search className="size-4" />
                  Qidirish
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClear}
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
            className="space-y-3 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 300px)" }}
          >
            {filteredLetters.map((letter) => {
              const borderColor = getStatusColor(letter.status);
              const statusBadge = getStatusBadge(letter.status);

              return (
                <Card
                  key={letter.id}
                  className={`p-2 hover:shadow-lg transition-all cursor-pointer border-l-4 ${borderColor} ${
                    selectedLetter?.id === letter.id
                      ? "bg-blue-200 border-blue-600"
                      : ""
                  }`}
                  onClick={() => setSelectedLetter(letter)}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex-1 min-w-0">
                      {/* Raqam + Sana */}
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-gray-900">
                          {highlightText(letter.number)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {highlightText(letter.sentDate)}
                        </span>
                      </div>

                      {/* Sarlavha */}
                      <h3 className="text-xs font-medium text-gray-900 mb-2 line-clamp-2">
                        {highlightText(letter.title)}
                      </h3>

                      {/* Manzil */}
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="size-3 text-gray-400 flex-shrink-0" />
                        <span className="truncate text-xs">
                          {highlightText(letter.recipient)}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="size-3 text-gray-400 flex-shrink-0" />
                  </div>
                </Card>
              );
            })}
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
            <LetterDetail />
          </div>
        )}
      </div>
    </div>
  );
};

export default LettersPage;
