import React from "react";

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
  MessageCircle,
  Package,
  PenTool,
  Send,
  User,
} from "lucide-react";
import NavItem from "./Navbar/NavItem";

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

  const navItems: SidebarMenuItem[] = [
    {
      id: "dashboard",
      label: "Bosh sahifa",
      icon: <Home className="size-5" />,
      subItems: [
        {
          id: "dashboard-main",
          label: "Dashboard",
          icon: null,
        },
        {
          id: "dashboard-stats",
          label: "Umumiy statistika",
          icon: null,
        },
        {
          id: "employee-statistics",
          label: "Xodimlar statistikasi",
          icon: null,
        },
      ],
    },
    {
      id: "calendar",
      label: "Taqvim",
      icon: <Calendar className="size-5" />,
    },
    {
      id: "sent",
      label: "Yuborilgan",
      icon: <Send className="size-5" />,
      subItems: [
        {
          id: "sent-all",
          label: "Barchasi",
          icon: null,
        },
        {
          id: "sent-instructions",
          label: "Ma'lumot uchun",
          icon: null,
        },
        {
          id: "sent-approval",
          label: "Kelishish uchun",
          icon: <CheckCircle className="size-4" />,
        },
        {
          id: "sent-for-signing",
          label: "Imzolash uchun",
          icon: <PenTool className="size-4" />,
        },
        {
          id: "sent-for-above",
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
          id: "incoming-all",
          label: "Barchasi",
          icon: null,
        },
        {
          id: "incoming-info",
          label: "Ma'lumot uchun",
          icon: null,
        },
        {
          id: "incoming-approval",
          label: "Kelishish uchun",
          icon: <CheckCircle className="size-4" />,
        },
        {
          id: "incoming-for-signing",
          label: "Imzolash uchun",
          icon: <PenTool className="size-4" />,
        },
        {
          id: "incoming-backup",
          label: "Ustixat uchun",
          icon: <Briefcase className="size-4" />,
        },
      ],
    },
    {
      id: "my-documents",
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
    {
      id: "chat",
      label: "Muloqot",
      icon: <MessageCircle className="size-5" />,
    },
    {
      id: "users-management",
      label: "Foydalanuvchilar boshqaruvsi",
      icon: <User className="size-5" />,
    },
    {
      id: "goods-management",
      label: "Maxsulotlar boshqaruvsi",
      icon: <Package className="size-5" />,
    },
  ];

  return (
    <nav className="flex-1 p-4 overflow-y-auto">
      {/* Navigation items */}
      {navItems.map((item) => (
        <NavItem
          key={item.id}
          item={item}
          setExpandedSection={setExpandedSection}
          expandedSection={expandedSection}
        />
      ))}
    </nav>
  );
});

export default SidebarNav;
