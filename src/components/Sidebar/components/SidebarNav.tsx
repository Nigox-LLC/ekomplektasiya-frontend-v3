import React, { useEffect } from "react";

import {
  Archive,
  BarChart3,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  DollarSign,
  FileText,
  Home,
  Inbox,
  Mail,
  Package,
  PenTool,
  Send,
  User,
} from "lucide-react";
import NavItem from "./Navbar/NavItem";
import { axiosAPI } from "@/service/axiosAPI";

export type SidebarMenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  subItems?: SidebarMenuItem[];
};

const SidebarNav: React.FC = React.memo(() => {
  const [expandedSection, setExpandedSection] = React.useState<string | null>(
    null,
  );

  const [counts, setCounts] = React.useState<SidebarCounts | null>(null);

  const navItems: SidebarMenuItem[] = [
    {
      id: "/",
      label: "Bosh sahifa",
      icon: <Home className="size-5" />,
    },
    {
      id: "calendar",
      label: "Taqvim",
      icon: <Calendar className="size-5" />,
    },
    {
      id: "outgoing",
      label: "Yuborilgan",
      icon: <Send className="size-5" />,
      subItems: [
        {
          id: "all_count",
          label: "Barchasi",
          icon: null,
        },
        {
          id: "for_information",
          label: "Ma'lumot uchun",
          icon: null,
        },
        {
          id: "executing",
          label: "Ijro uchun",
          icon: null,
        },
        {
          id: "in_approval",
          label: "Kelishish uchun",
          icon: <CheckCircle className="size-4" />,
        },
        {
          id: "in_signing",
          label: "Imzolash uchun",
          icon: <PenTool className="size-4" />,
        },
        {
          id: "for_above",
          label: "Ustixat uchun",
          icon: <Briefcase className="size-4" />,
        },
      ],
    },
    {
      id: "incoming",
      label: "Kelib tushgan",
      icon: <Inbox className="size-5" />,
      subItems: [
        {
          id: "all_count",
          label: "Barchasi",
          icon: null,
        },
        {
          id: "for_information",
          label: "Ma'lumot uchun",
          icon: null,
        },
        {
          id: "executing",
          label: "Ijro uchun",
          icon: null,
        },
        {
          id: "in_approval",
          label: "Kelishish uchun",
          icon: <CheckCircle className="size-4" />,
        },
        {
          id: "in_signing",
          label: "Imzolash uchun",
          icon: <PenTool className="size-4" />,
        },
        {
          id: "for_above",
          label: "Ustixat uchun",
          icon: <Briefcase className="size-4" />,
        },
      ],
    },
    {
      id: "my_letter",
      label: "Mening hujjatlarim",
      icon: <FileText className="size-5" />,
    },
    {
      id: "appeal-letter",
      label: "Murojaat xati",
      icon: <Mail className="size-5" />,
    },
    {
      id: "price-analysis",
      label: "Narx tahlil",
      icon: <DollarSign className="size-5" />,
    },
    {
      id: "management",
      label: "Maxsulotlar boshqaruvi",
      icon: <Package className="size-5" />,
      subItems: [
        {
          id: "products-balance",
          label: "Maxsulotlar qoldig'i",
          icon: null,
        },
        {
          id: "products-income",
          label: "Maxsulotlar kirimi",
          icon: null,
        },
        {
          id: "products-outcome",
          label: "Maxsulotlar chiqimi",
          icon: null,
        },
        {
          id: "products-return",
          label: "Maxsulotlarni qaytarish",
          icon: null,
        },
        {
          id: "products-warehouse-transfer",
          label: "Ombordan omborga o'tkazish",
          icon: null,
        },
        {
          id: "products-balance-correction",
          label: "Qoldiqni to'g'irlash",
          icon: null,
        },
      ],
    },
    {
      id: "reference",
      label: "Ma'lumotnoma",
      icon: <BookOpen className="size-5" />,
      subItems: [
        {
          id: "reference-requisites",
          label: "Rekvizitlar",
          icon: null,
        },
        {
          id: "reference-bank",
          label: "Banklar",
          icon: null,
        },
        {
          id: "reference-contracts",
          label: "Shartnomalar",
          icon: null,
        },
        {
          id: "reference-goods-in",
          label: "Tovarlar kirimi",
          icon: null,
        },
        {
          id: "reference-goods-out",
          label: "Tovarlar chiqimi",
          icon: null,
        },
        {
          id: "reference-warehouse-transfer",
          label: "Ombor o'tkazmalar",
          icon: null,
        },
        {
          id: "reference-year-plan",
          label: "Yillik reja",
          icon: null,
        },
      ],
    },
    {
      id: "statistics",
      label: "Statistika",
      icon: <BarChart3 className="size-5" />,
      subItems: [
        {
          id: "statistics-employee",
          label: "Xodimlar statistikasi",
          icon: null,
        },
      ],
    },
    {
      id: "reports",
      label: "Hisobotlar",
      icon: <BarChart3 className="size-5" />,
      subItems: [
        {
          id: "reports-turnover",
          label: "Tovar aylanma hisoboti",
          icon: <Package className="size-4" />,
        },
        {
          id: "reports-goods-balance",
          label: "Tovar va materiallar qoldigi",
          icon: <Archive className="size-4" />,
        },
        {
          id: "reports-table1",
          label: "Hisobot(1-jadval)",
          icon: <Archive className="size-4" />,
        },
        {
          id: "reports-table2",
          label: "Hisobot(2-jadval)",
          icon: <Archive className="size-4" />,
        },
        {
          id: "reports-table3",
          label: "Hisobot(3-jadval)",
          icon: <Archive className="size-4" />,
        },
      ],
    },
    // {
    //   id: "chat",
    //   label: "Muloqot",
    //   icon: <MessageCircle className="size-5" />,
    // },
    {
      id: "users-management",
      label: "Foydalanuvchilar boshqaruvsi",
      icon: <User className="size-5" />,
    },
  ];

  // fetch sidebar counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axiosAPI.get("document/orders/totals/");
        if (response.status === 200) {
          setCounts(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <nav className="flex-1 p-4 overflow-y-auto">
      {/* Navigation items */}
      {navItems.map((item) => (
        <NavItem
          key={item.id}
          item={item}
          setExpandedSection={setExpandedSection}
          expandedSection={expandedSection}
          counts={counts}
        />
      ))}
    </nav>
  );
});

export default SidebarNav;
