import { useState, useEffect, useRef } from "react";
import ProductsBalanceReportModal from "../components/ProductsBalanceReportModal";
import ConfirmDialog from "../components/ConfirmDialog";
import ResizableTableColumn from "../components/ResizableTableColumn";
import TableLoadingSpinner from "../components/TableLoadingSpinner";
import SuccessNotification from "../components/SuccessNotification";
import {
  Search,
  Filter,
  Download,
  Plus,
  Calendar,
  MapPin,
  Building2,
  User,
  ChevronDown,
  ChevronUp,
  FileText,
  Warehouse,
  X,
  Edit,
  TrendingUp,
  Package,
  Sheet,
  File,
  Clock,
  FileCheck,
  FileWarning,
  ArrowUpDown,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge, Button, Card, Input } from "antd";
import { useNavigate } from 'react-router';


interface ProductBalance {
  id: string;
  number: string;
  date: string;
  region: string;
  district: string;
  warehouse: string;
  responsiblePerson: string;
  user: string;
  totalItems: number;
  totalAmount: number;
  status: "active" | "archived";
  confirmStatus: "saved" | "confirmed";
  returnType?: "warehouse" | "supplier"; // Qaytarish turi
  outcomeDocNumber?: string; // Chiqim hujjat raqami (omborga qaytarish uchun)
  incomeDocNumber?: string; // Kirim hujjat raqami (etkazib beruvchidan qaytarish uchun)
}

interface Product {
  id: string;
  barcode: string;
  name: string;
  type: string;
  model: string;
  size: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
}

// Mock ma'lumotlar (50 ta - infinite scroll uchun)
const generateMockBalances = (): ProductBalance[] => {
  const regions = [
    {
      name: "Buxoro viloyati",
      districts: [
        "Buxoro shahri",
        "Kogon tumani",
        "G'ijduvon tumani",
      ],
    },
    {
      name: "Namangan viloyati",
      districts: [
        "Namangan shahri",
        "Pop tumani",
        "Uychi tumani",
      ],
    },
    {
      name: "Toshkent shahar",
      districts: [
        "Yunusobod tumani",
        "Chilonzor tumani",
        "Mirobod tumani",
      ],
    },
    {
      name: "Farg'ona viloyati",
      districts: [
        "Farg'ona shahri",
        "Qo'qon shahri",
        "Marg'ilon shahri",
      ],
    },
  ];

  const warehouses: { [key: string]: string[] } = {
    "Buxoro viloyati": ["Buxoro ombori №1", "Kogon ombori №2"],
    "Namangan viloyati": [
      "Namangan ombori №1",
      "Pop ombori №2",
    ],
    "Toshkent shahar": [
      "Markaziy ombor №1",
      "Yunusobod ombori №2",
      "Chilonzor ombori №3",
    ],
    "Farg'ona viloyati": [
      "Farg'ona ombori №1",
      "Qo'qon ombori №2",
    ],
  };

  const responsiblePersons: { [key: string]: string[] } = {
    "Buxoro ombori №1": [
      "Nazarov Dilshod Muzaffarovich",
      "Sultonova Madina Rustamovna",
    ],
    "Kogon ombori №2": [
      "Abdullayev Jamshid Akramovich",
      "Xolmatova Zilola Toxirovna",
    ],
    "Namangan ombori №1": [
      "Rahimov Otabek Shavkatovich",
      "Qodirova Sevara Ilhomovna",
    ],
    "Pop ombori №2": [
      "Nazarov Dilshod Muzaffarovich",
      "Azimova Gulnora Anvarovna",
    ],
    "Markaziy ombor №1": [
      "Karimov Jasur Akmalovich",
      "Alieva Nodira Shavkatovna",
    ],
    "Yunusobod ombori №2": [
      "Tursunov Aziz Bakhtiyorovich",
      "Yusupova Malika Rustamovna",
    ],
    "Chilonzor ombori №3": [
      "Rahimov Otabek Shavkatovich",
      "Nazarova Dilnoza Akramovna",
    ],
    "Farg'ona ombori №1": [
      "Tursunov Aziz Bakhtiyorovich",
      "Rahmonova Dildora Fazliddinovna",
    ],
    "Qo'qon ombori №2": [
      "Yuldashev Sardor Ulug'bekovich",
      "Karimova Feruza Toxirovna",
    ],
  };

  const users = [
    "admin",
    "operator1",
    "operator2",
    "warehouse_manager",
    "manager1",
    "manager2",
  ];
  const statuses: ("active" | "archived")[] = [
    "active",
    "active",
    "active",
    "active",
    "archived",
  ];
  const confirmStatuses: ("saved" | "confirmed")[] = [
    "saved",
    "confirmed",
  ];

  const balances: ProductBalance[] = [];

  for (let i = 0; i < 50; i++) {
    const regionData =
      regions[Math.floor(Math.random() * regions.length)];
    const region = regionData.name;
    const district =
      regionData.districts[
      Math.floor(Math.random() * regionData.districts.length)
      ];
    const warehouseList = warehouses[region];
    const warehouse =
      warehouseList[
      Math.floor(Math.random() * warehouseList.length)
      ];
    const responsibleList = responsiblePersons[warehouse];
    const responsiblePerson =
      responsibleList[
      Math.floor(Math.random() * responsibleList.length)
      ];

    const day = String(
      Math.floor(Math.random() * 28) + 1,
    ).padStart(2, "0");
    const month = String(
      Math.floor(Math.random() * 2) + 1,
    ).padStart(2, "0");

    balances.push({
      id: String(i + 1),
      number: `QLD-2026-${String(i + 1).padStart(3, "0")}`,
      date: `${day}.${month}.2026`,
      region,
      district,
      warehouse,
      responsiblePerson,
      user: users[Math.floor(Math.random() * users.length)],
      totalItems: Math.floor(Math.random() * 300) + 50,
      totalAmount:
        (Math.floor(Math.random() * 500) + 50) * 1000000,
      status:
        statuses[Math.floor(Math.random() * statuses.length)],
      confirmStatus:
        i < 3 ? "confirmed" : confirmStatuses[
          Math.floor(Math.random() * confirmStatuses.length)
        ],
    });
  }

  return balances.sort(
    (a, b) =>
      parseInt(b.number.split("-")[2]) -
      parseInt(a.number.split("-")[2]),
  );
};

// Mock ma'lumotlar - Chiqimlar uchun
const generateMockOutcomes = (): ProductBalance[] => {
  const regions = [
    {
      name: "Buxoro viloyati",
      districts: [
        "Buxoro shahri",
        "Kogon tumani",
        "G'ijduvon tumani",
      ],
    },
    {
      name: "Namangan viloyati",
      districts: [
        "Namangan shahri",
        "Pop tumani",
        "Uychi tumani",
      ],
    },
    {
      name: "Toshkent shahar",
      districts: [
        "Yunusobod tumani",
        "Chilonzor tumani",
        "Mirobod tumani",
      ],
    },
    {
      name: "Farg'ona viloyati",
      districts: [
        "Farg'ona shahri",
        "Qo'qon shahri",
        "Marg'ilon shahri",
      ],
    },
  ];

  const warehouses: { [key: string]: string[] } = {
    "Buxoro viloyati": ["Buxoro ombori №1", "Kogon ombori №2"],
    "Namangan viloyati": [
      "Namangan ombori №1",
      "Pop ombori №2",
    ],
    "Toshkent shahar": [
      "Markaziy ombor №1",
      "Yunusobod ombori №2",
      "Chilonzor ombori №3",
    ],
    "Farg'ona viloyati": [
      "Farg'ona ombori №1",
      "Qo'qon ombori №2",
    ],
  };

  const responsiblePersons: { [key: string]: string[] } = {
    "Buxoro ombori №1": [
      "Nazarov Dilshod Muzaffarovich",
      "Sultonova Madina Rustamovna",
    ],
    "Kogon ombori №2": [
      "Abdullayev Jamshid Akramovich",
      "Xolmatova Zilola Toxirovna",
    ],
    "Namangan ombori №1": [
      "Rahimov Otabek Shavkatovich",
      "Qodirova Sevara Ilhomovna",
    ],
    "Pop ombori №2": [
      "Nazarov Dilshod Muzaffarovich",
      "Azimova Gulnora Anvarovna",
    ],
    "Markaziy ombor №1": [
      "Karimov Jasur Akmalovich",
      "Alieva Nodira Shavkatovna",
    ],
    "Yunusobod ombori №2": [
      "Tursunov Aziz Bakhtiyorovich",
      "Yusupova Malika Rustamovna",
    ],
    "Chilonzor ombori №3": [
      "Rahimov Otabek Shavkatovich",
      "Nazarova Dilnoza Akramovna",
    ],
    "Farg'ona ombori №1": [
      "Tursunov Aziz Bakhtiyorovich",
      "Rahmonova Dildora Fazliddinovna",
    ],
    "Qo'qon ombori №2": [
      "Yuldashev Sardor Ulug'bekovich",
      "Karimova Feruza Toxirovna",
    ],
  };

  const users = [
    "admin",
    "operator1",
    "operator2",
    "warehouse_manager",
    "manager1",
    "manager2",
  ];
  const statuses: ("active" | "archived")[] = [
    "active",
    "active",
    "active",
    "active",
    "archived",
  ];
  const confirmStatuses: ("saved" | "confirmed")[] = [
    "saved",
    "confirmed",
  ];

  const outcomes: ProductBalance[] = [];

  for (let i = 0; i < 50; i++) {
    const regionData =
      regions[Math.floor(Math.random() * regions.length)];
    const region = regionData.name;
    const district =
      regionData.districts[
      Math.floor(Math.random() * regionData.districts.length)
      ];
    const warehouseList = warehouses[region];
    const warehouse =
      warehouseList[
      Math.floor(Math.random() * warehouseList.length)
      ];
    const responsibleList = responsiblePersons[warehouse];
    const responsiblePerson =
      responsibleList[
      Math.floor(Math.random() * responsibleList.length)
      ];

    const day = String(
      Math.floor(Math.random() * 28) + 1,
    ).padStart(2, "0");
    const month = String(
      Math.floor(Math.random() * 2) + 1,
    ).padStart(2, "0");

    outcomes.push({
      id: String(i + 1),
      number: `CHQ-2026-${String(i + 1).padStart(3, "0")}`,
      date: `${day}.${month}.2026`,
      region,
      district,
      warehouse,
      responsiblePerson,
      user: users[Math.floor(Math.random() * users.length)],
      totalItems: Math.floor(Math.random() * 200) + 30,
      totalAmount:
        (Math.floor(Math.random() * 300) + 30) * 1000000,
      status:
        statuses[Math.floor(Math.random() * statuses.length)],
      confirmStatus:
        confirmStatuses[
        Math.floor(Math.random() * confirmStatuses.length)
        ],
    });
  }

  return outcomes.sort(
    (a, b) =>
      parseInt(b.number.split("-")[2]) -
      parseInt(a.number.split("-")[2]),
  );
};

// Mock products for report
const generateMockProducts = (): Product[] => {
  const baseProducts = [
    {
      name: "Stol",
      type: "Mebel",
      model: "Standart-2024",
      size: "120x80",
      unit: "dona",
    },
    {
      name: "Stul",
      type: "Mebel",
      model: "Ofis-Pro",
      size: "50x50",
      unit: "dona",
    },
    {
      name: "Shkaf",
      type: "Mebel",
      model: "Premium-X",
      size: "200x100",
      unit: "dona",
    },
    {
      name: "Kompyuter",
      type: "Texnika",
      model: "Dell-5500",
      size: "-",
      unit: "dona",
    },
    {
      name: "Printer",
      type: "Texnika",
      model: "HP-3050",
      size: "-",
      unit: "dona",
    },
    {
      name: "Qog'oz A4",
      type: "Kanstovar",
      model: "Double A",
      size: "A4",
      unit: "paket",
    },
    {
      name: "Ruchka",
      type: "Kanstovar",
      model: "Pilot",
      size: "-",
      unit: "dona",
    },
    {
      name: "Monitor",
      type: "Texnika",
      model: 'Samsung 24"',
      size: "24 dyuym",
      unit: "dona",
    },
    {
      name: "Klaviatura",
      type: "Texnika",
      model: "Logitech K120",
      size: "-",
      unit: "dona",
    },
    {
      name: "Sichqoncha",
      type: "Texnika",
      model: "Logitech M90",
      size: "-",
      unit: "dona",
    },
    {
      name: "Daftar",
      type: "Kanstovar",
      model: "A4 100 varaq",
      size: "A4",
      unit: "dona",
    },
    {
      name: "Qalam",
      type: "Kanstovar",
      model: "Faber Castell",
      size: "-",
      unit: "dona",
    },
    {
      name: "Stiker",
      type: "Kanstovar",
      model: "Post-it",
      size: "76x76",
      unit: "paket",
    },
    {
      name: "Papka",
      type: "Kanstovar",
      model: "Plastik",
      size: "A4",
      unit: "dona",
    },
    {
      name: "Noutbuk",
      type: "Texnika",
      model: "HP ProBook",
      size: '15.6"',
      unit: "dona",
    },
    {
      name: "Projektor",
      type: "Texnika",
      model: "Epson EB-X41",
      size: "-",
      unit: "dona",
    },
    {
      name: "Skaner",
      type: "Texnika",
      model: "Canon LiDE",
      size: "-",
      unit: "dona",
    },
    {
      name: "Telefon",
      type: "Texnika",
      model: "Panasonic KX",
      size: "-",
      unit: "dona",
    },
    {
      name: "Kreslo",
      type: "Mebel",
      model: "Ofis Premium",
      size: "-",
      unit: "dona",
    },
    {
      name: "Polka",
      type: "Mebel",
      model: "Metall",
      size: "180x90",
      unit: "dona",
    },
  ];

  const products: Product[] = [];

  // Har bir mahsulotdan 3 ta variant yaratamiz (turli narxlar bilan)
  baseProducts.forEach((base, idx) => {
    for (let i = 0; i < 3; i++) {
      const index = products.length;
      const quantity = Math.floor(Math.random() * 500) + 10;
      const basePrice =
        [
          850000, 250000, 1500000, 4500000, 1200000, 35000,
          3000, 2000000, 450000, 180000, 12000, 5000, 25000,
          8000, 6500000, 3200000, 850000, 320000, 750000,
          950000,
        ][idx] || 100000;
      const price = basePrice + i * basePrice * 0.2;

      products.push({
        id: String(index + 1),
        barcode: `2026${String(index + 1).padStart(8, "0")}`,
        name: base.name,
        type: base.type,
        model: base.model,
        size: base.size,
        unit: base.unit,
        quantity: quantity,
        price: Math.floor(price),
        total: quantity * Math.floor(price),
      });
    }
  });

  return products;
};

// Mock ma'lumotlar - Qaytarishlar uchun
const generateMockReturns = (): ProductBalance[] => {
  const regions = [
    { name: "Namangan viloyati", districts: ["Namangan shahri", "Pop tumani", "Uychi tumani"] },
    { name: "Toshkent shahar", districts: ["Yunusobod tumani", "Chilonzor tumani", "Mirobod tumani"] },
    { name: "Farg'ona viloyati", districts: ["Farg'ona shahri", "Qo'qon shahri", "Marg'ilon shahri"] },
  ];

  const warehouses: { [key: string]: string[] } = {
    "Namangan viloyati": ["Namangan ombori №1", "Pop ombori №2"],
    "Toshkent shahar": ["Markaziy ombor №1", "Yunusobod ombori №2"],
    "Farg'ona viloyati": ["Farg'ona ombori №1", "Qo'qon ombori №2"],
  };

  const responsiblePersons: { [key: string]: string[] } = {
    "Namangan ombori №1": ["Rahimov Otabek Shavkatovich", "Qodirova Sevara Ilhomovna"],
    "Pop ombori №2": ["Nazarov Dilshod Muzaffarovich", "Azimova Gulnora Anvarovna"],
    "Markaziy ombor №1": ["Karimov Jasur Akmalovich", "Alieva Nodira Shavkatovna"],
    "Yunusobod ombori №2": ["Tursunov Aziz Bakhtiyorovich", "Yusupova Malika Rustamovna"],
    "Farg'ona ombori №1": ["Tursunov Aziz Bakhtiyorovich", "Rahmonova Dildora Fazliddinovna"],
    "Qo'qon ombori №2": ["Yuldashev Sardor Ulug'bekovich", "Karimova Feruza Toxirovna"],
  };

  const users = ["admin", "operator1", "operator2", "warehouse_manager"];
  const statuses: ("active" | "archived")[] = ["active", "active", "active", "archived"];
  const confirmStatuses: ("saved" | "confirmed")[] = ["saved", "confirmed"];
  const returnTypes: ("warehouse" | "supplier")[] = ["warehouse", "supplier"];

  const returns: ProductBalance[] = [];

  for (let i = 0; i < 50; i++) {
    const regionData = regions[Math.floor(Math.random() * regions.length)];
    const region = regionData.name;
    const district = regionData.districts[Math.floor(Math.random() * regionData.districts.length)];
    const warehouseList = warehouses[region];
    const warehouse = warehouseList[Math.floor(Math.random() * warehouseList.length)];
    const responsibleList = responsiblePersons[warehouse];
    const responsiblePerson = responsibleList[Math.floor(Math.random() * responsibleList.length)];

    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
    const month = String(Math.floor(Math.random() * 2) + 1).padStart(2, "0");

    const returnType = returnTypes[Math.floor(Math.random() * returnTypes.length)];

    returns.push({
      id: String(i + 1),
      number: `QYT-2026-${String(i + 1).padStart(3, "0")}`,
      date: `${day}.${month}.2026`,
      region,
      district,
      warehouse,
      responsiblePerson,
      user: users[Math.floor(Math.random() * users.length)],
      totalItems: Math.floor(Math.random() * 150) + 20,
      totalAmount: (Math.floor(Math.random() * 200) + 20) * 1000000,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      confirmStatus: confirmStatuses[Math.floor(Math.random() * confirmStatuses.length)],
      returnType: returnType,
      outcomeDocNumber: returnType === "warehouse" ? `CHQ-2026-${String(Math.floor(Math.random() * 50) + 1).padStart(3, "0")}` : undefined,
      incomeDocNumber: returnType === "supplier" ? `KRM-2026-${String(Math.floor(Math.random() * 50) + 1).padStart(3, "0")}` : undefined,
    });
  }

  return returns.sort((a, b) => parseInt(b.number.split("-")[2]) - parseInt(a.number.split("-")[2]));
};

// Mock ma'lumotlar - Ombordan omborga o'tkazish uchun
const generateMockTransfers = (): ProductBalance[] => {
  const regions = [
    { name: "Namangan viloyati", districts: ["Namangan shahri", "Pop tumani", "Uychi tumani"] },
    { name: "Toshkent shahar", districts: ["Yunusobod tumani", "Chilonzor tumani", "Mirobod tumani"] },
    { name: "Farg'ona viloyati", districts: ["Farg'ona shahri", "Qo'qon shahri", "Marg'ilon shahri"] },
  ];

  const warehouses: { [key: string]: string[] } = {
    "Namangan viloyati": ["Namangan ombori №1", "Pop ombori №2"],
    "Toshkent shahar": ["Markaziy ombor №1", "Yunusobod ombori №2", "Chilonzor ombori №3"],
    "Farg'ona viloyati": ["Farg'ona ombori №1", "Qo'qon ombori №2"],
  };

  const responsiblePersons: { [key: string]: string[] } = {
    "Namangan ombori №1": ["Rahimov Otabek Shavkatovich", "Qodirova Sevara Ilhomovna"],
    "Pop ombori №2": ["Nazarov Dilshod Muzaffarovich", "Azimova Gulnora Anvarovna"],
    "Markaziy ombor №1": ["Karimov Jasur Akmalovich", "Alieva Nodira Shavkatovna"],
    "Yunusobod ombori №2": ["Tursunov Aziz Bakhtiyorovich", "Yusupova Malika Rustamovna"],
    "Chilonzor ombori №3": ["Rahimov Otabek Shavkatovich", "Nazarova Dilnoza Akramovna"],
    "Farg'ona ombori №1": ["Tursunov Aziz Bakhtiyorovich", "Rahmonova Dildora Fazliddinovna"],
    "Qo'qon ombori №2": ["Yuldashev Sardor Ulug'bekovich", "Karimova Feruza Toxirovna"],
  };

  const users = ["admin", "operator1", "operator2", "warehouse_manager", "manager1"];
  const statuses: ("active" | "archived")[] = ["active", "active", "active", "active", "archived"];
  const confirmStatuses: ("saved" | "confirmed")[] = ["saved", "saved", "confirmed"];

  const transfers: ProductBalance[] = [];

  for (let i = 0; i < 50; i++) {
    const regionData = regions[Math.floor(Math.random() * regions.length)];
    const region = regionData.name;
    const district = regionData.districts[Math.floor(Math.random() * regionData.districts.length)];
    const warehouseList = warehouses[region];
    const warehouse = warehouseList[Math.floor(Math.random() * warehouseList.length)];
    const responsibleList = responsiblePersons[warehouse];
    const responsiblePerson = responsibleList[Math.floor(Math.random() * responsibleList.length)];

    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
    const month = String(Math.floor(Math.random() * 2) + 1).padStart(2, "0");

    transfers.push({
      id: String(i + 1),
      number: `OTK-2026-${String(i + 1).padStart(3, "0")}`,
      date: `${day}.${month}.2026`,
      region,
      district,
      warehouse,
      responsiblePerson,
      user: users[Math.floor(Math.random() * users.length)],
      totalItems: Math.floor(Math.random() * 250) + 40,
      totalAmount: (Math.floor(Math.random() * 350) + 50) * 1000000,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      confirmStatus: confirmStatuses[Math.floor(Math.random() * confirmStatuses.length)],
    });
  }

  return transfers.sort((a, b) => parseInt(b.number.split("-")[2]) - parseInt(a.number.split("-")[2]));
};

// Mock ma'lumotlar - Qoldig'ni to'g'irlash uchun
const generateMockCorrections = (): ProductBalance[] => {
  const regions = [
    { name: "Namangan viloyati", districts: ["Namangan shahri", "Pop tumani", "Uychi tumani"] },
    { name: "Toshkent shahar", districts: ["Yunusobod tumani", "Chilonzor tumani", "Mirobod tumani"] },
    { name: "Farg'ona viloyati", districts: ["Farg'ona shahri", "Qo'qon shahri", "Marg'ilon shahri"] },
    { name: "Buxoro viloyati", districts: ["Buxoro shahri", "Kogon tumani", "G'ijduvon tumani"] },
  ];

  const warehouses: { [key: string]: string[] } = {
    "Namangan viloyati": ["Namangan ombori №1", "Pop ombori №2"],
    "Toshkent shahar": ["Markaziy ombor №1", "Yunusobod ombori №2"],
    "Farg'ona viloyati": ["Farg'ona ombori №1", "Qo'qon ombori №2"],
    "Buxoro viloyati": ["Buxoro ombori №1", "Kogon ombori №2"],
  };

  const responsiblePersons: { [key: string]: string[] } = {
    "Namangan ombori №1": ["Rahimov Otabek Shavkatovich", "Qodirova Sevara Ilhomovna"],
    "Pop ombori №2": ["Nazarov Dilshod Muzaffarovich", "Azimova Gulnora Anvarovna"],
    "Markaziy ombor №1": ["Karimov Jasur Akmalovich", "Alieva Nodira Shavkatovna"],
    "Yunusobod ombori №2": ["Tursunov Aziz Bakhtiyorovich", "Yusupova Malika Rustamovna"],
    "Farg'ona ombori №1": ["Tursunov Aziz Bakhtiyorovich", "Rahmonova Dildora Fazliddinovna"],
    "Qo'qon ombori №2": ["Yuldashev Sardor Ulug'bekovich", "Karimova Feruza Toxirovna"],
    "Buxoro ombori №1": ["Nazarov Dilshod Muzaffarovich", "Sultonova Madina Rustamovna"],
    "Kogon ombori №2": ["Abdullayev Jamshid Akramovich", "Xolmatova Zilola Toxirovna"],
  };

  const users = ["admin", "operator1", "warehouse_manager", "manager1"];
  const statuses: ("active" | "archived")[] = ["active", "active", "active", "archived"];
  const confirmStatuses: ("saved" | "confirmed")[] = ["saved", "confirmed"];

  const corrections: ProductBalance[] = [];

  for (let i = 0; i < 50; i++) {
    const regionData = regions[Math.floor(Math.random() * regions.length)];
    const region = regionData.name;
    const district = regionData.districts[Math.floor(Math.random() * regionData.districts.length)];
    const warehouseList = warehouses[region];
    const warehouse = warehouseList[Math.floor(Math.random() * warehouseList.length)];
    const responsibleList = responsiblePersons[warehouse];
    const responsiblePerson = responsibleList[Math.floor(Math.random() * responsibleList.length)];

    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
    const month = String(Math.floor(Math.random() * 2) + 1).padStart(2, "0");

    corrections.push({
      id: String(i + 1),
      number: `TGR-2026-${String(i + 1).padStart(3, "0")}`,
      date: `${day}.${month}.2026`,
      region,
      district,
      warehouse,
      responsiblePerson,
      user: users[Math.floor(Math.random() * users.length)],
      totalItems: Math.floor(Math.random() * 100) + 15,
      totalAmount: (Math.floor(Math.random() * 180) + 25) * 1000000,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      confirmStatus: confirmStatuses[Math.floor(Math.random() * confirmStatuses.length)],
    });
  }

  return corrections.sort((a, b) => parseInt(b.number.split("-")[2]) - parseInt(a.number.split("-")[2]));
};

const mockBalances = generateMockBalances();
const mockOutcomes = generateMockOutcomes();
const mockReturns = generateMockReturns();
const mockTransfers = generateMockTransfers();
const mockCorrections = generateMockCorrections();
const mockProducts = generateMockProducts();

// Viloyatga qarab omborlarni olish
const getWarehousesByRegions = (
  regions: string[],
): string[] => {
  if (regions.length === 0) return [];

  const warehouses: { [key: string]: string[] } = {
    "Buxoro viloyati": ["Buxoro ombori №1", "Kogon ombori №2"],
    "Namangan viloyati": [
      "Namangan ombori №1",
      "Pop ombori №2",
    ],
    "Toshkent shahar": [
      "Markaziy ombor №1",
      "Yunusobod ombori №2",
      "Chilonzor ombori №3",
    ],
    "Farg'ona viloyati": [
      "Farg'ona ombori №1",
      "Qo'qon ombori №2",
    ],
  };

  const result: string[] = [];
  regions.forEach((region) => {
    if (warehouses[region]) {
      result.push(...warehouses[region]);
    }
  });

  return result;
};

// Omborga qarab javobgar shaxslarni olish
const getResponsiblesByWarehouses = (
  warehouses: string[],
): string[] => {
  if (warehouses.length === 0) return [];

  const responsiblePersons: { [key: string]: string[] } = {
    "Buxoro ombori №1": [
      "Nazarov Dilshod Muzaffarovich",
      "Sultonova Madina Rustamovna",
    ],
    "Kogon ombori №2": [
      "Abdullayev Jamshid Akramovich",
      "Xolmatova Zilola Toxirovna",
    ],
    "Namangan ombori №1": [
      "Rahimov Otabek Shavkatovich",
      "Qodirova Sevara Ilhomovna",
    ],
    "Pop ombori №2": [
      "Nazarov Dilshod Muzaffarovich",
      "Azimova Gulnora Anvarovna",
    ],
    "Markaziy ombor №1": [
      "Karimov Jasur Akmalovich",
      "Alieva Nodira Shavkatovna",
    ],
    "Yunusobod ombori №2": [
      "Tursunov Aziz Bakhtiyorovich",
      "Yusupova Malika Rustamovna",
    ],
    "Chilonzor ombori №3": [
      "Rahimov Otabek Shavkatovich",
      "Nazarova Dilnoza Akramovna",
    ],
    "Farg'ona ombori №1": [
      "Tursunov Aziz Bakhtiyorovich",
      "Rahmonova Dildora Fazliddinovna",
    ],
    "Qo'qon ombori №2": [
      "Yuldashev Sardor Ulug'bekovich",
      "Karimova Feruza Toxirovna",
    ],
  };

  const result: string[] = [];
  warehouses.forEach((warehouse) => {
    if (responsiblePersons[warehouse]) {
      result.push(...responsiblePersons[warehouse]);
    }
  });

  return [...new Set(result)]; // Unique values
};

interface ProductsBalanceViewProps {
  title?: string;
  reportTitle?: string;
}

const ProductsBalanceView: React.FC<ProductsBalanceViewProps> = ({ title, reportTitle }) => {
  // Title ga qarab kerakli ma'lumotlarni tanlash
  const isOutcome = title?.includes("chiqimi");
  const isReturn = title?.includes("qaytarish");
  const isTransfer = title?.includes("o'tkazish");
  const isCorrection = title?.includes("to'g'irlash");
  const navigate = useNavigate();

  const getInitialData = () => {
    if (isOutcome) return mockOutcomes;
    if (isReturn) return mockReturns;
    if (isTransfer) return mockTransfers;
    if (isCorrection) return mockCorrections;
    return mockBalances;
  };

  const initialData = getInitialData();
  const [balances, setBalances] = useState<ProductBalance[]>(initialData);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<
    string[]
  >([]);
  const [selectedWarehouses, setSelectedWarehouses] = useState<
    string[]
  >([]);
  const [selectedResponsibles, setSelectedResponsibles] =
    useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showReturnTypeMenu, setShowReturnTypeMenu] = useState(false);
  const [selectedBalance, setSelectedBalance] =
    useState<ProductBalance | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [viewingBalance, setViewingBalance] = useState<ProductBalance | null>(null);

  // Confirm dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "delete" | "confirm" | "unconfirm";
    balance: ProductBalance | null;
  }>({ isOpen: false, type: "delete", balance: null });

  // Dropdown states
  const [openRegionDropdown, setOpenRegionDropdown] =
    useState(false);
  const [openWarehouseDropdown, setOpenWarehouseDropdown] =
    useState(false);
  const [openResponsibleDropdown, setOpenResponsibleDropdown] =
    useState(false);

  // Search states for dropdowns
  const [regionSearch, setRegionSearch] = useState("");
  const [warehouseSearch, setWarehouseSearch] = useState("");
  const [responsibleSearch, setResponsibleSearch] =
    useState("");

  // Infinite scroll states
  const [displayedItems, setDisplayedItems] = useState(10);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sort states
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Loading states
  const [filterLoading, setFilterLoading] = useState(false);
  const [sortLoading, setSortLoading] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "danger";
  }>({ show: false, message: "", type: "success" });

  // Unique regions
  const allRegions = Array.from(
    new Set(balances.map((b) => b.region)),
  );

  // Viloyatga qarab omborlar
  const availableWarehouses =
    getWarehousesByRegions(selectedRegions);

  // Omborga qarab javobgar shaxslar
  const availableResponsibles = getResponsiblesByWarehouses(
    selectedWarehouses,
  );

  const handleEdit = (balance: ProductBalance) => {
    let detailPath = '';
    if (isOutcome) detailPath = 'products-outcome-detail';
    else if (isReturn) detailPath = 'products-return-detail';
    else if (isTransfer) detailPath = 'products-warehouse-transfer-detail';
    else if (isCorrection) detailPath = 'products-balance-correction-detail';
    else detailPath = 'products-balance-detail';

    navigate(`/management/${detailPath}/${balance.id}`, { state: balance });
  };

  const handleNewDocument = () => {
    let detailPath = '';
    if (isOutcome) detailPath = 'products-outcome-detail';
    else if (isReturn) detailPath = 'products-return-detail';
    else if (isTransfer) detailPath = 'products-warehouse-transfer-detail';
    else if (isCorrection) detailPath = 'products-balance-correction-detail';
    else detailPath = 'products-balance-detail';

    navigate(`/management/${detailPath}/new`);
  };

  // Highlight text function
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={index}
              className="bg-red-200 text-gray-900 px-0.5 rounded font-semibold"
            >
              {part}
            </mark>
          ) : (
            part
          ),
        )}
      </>
    );
  };

  // Date conversion helper
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split(".");
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
    );
  };

  // Filtrlash
  const filteredBalances = balances.filter((balance) => {
    const matchesSearch =
      balance.number
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      balance.responsiblePerson
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      balance.warehouse
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      balance.district
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesRegion =
      selectedRegions.length === 0 ||
      selectedRegions.includes(balance.region);
    const matchesWarehouse =
      selectedWarehouses.length === 0 ||
      selectedWarehouses.includes(balance.warehouse);
    const matchesResponsible =
      selectedResponsibles.length === 0 ||
      selectedResponsibles.includes(balance.responsiblePerson);

    // Date filtering
    let matchesDate = true;
    const balanceDate = parseDate(balance.date);

    if (dateFrom && balanceDate) {
      const fromDate = new Date(dateFrom);
      if (balanceDate < fromDate) matchesDate = false;
    }

    if (dateTo && balanceDate) {
      const toDate = new Date(dateTo);
      if (balanceDate > toDate) matchesDate = false;
    }

    return (
      matchesSearch &&
      matchesRegion &&
      matchesWarehouse &&
      matchesResponsible &&
      matchesDate
    );
  });

  // Sort function
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Sort filtered data
  const sortedBalances = [...filteredBalances].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue: any = a[sortColumn as keyof ProductBalance];
    let bValue: any = b[sortColumn as keyof ProductBalance];

    // Handle date sorting
    if (sortColumn === 'date') {
      const aDate = parseDate(a.date);
      const bDate = parseDate(b.date);
      if (!aDate || !bDate) return 0;
      return sortDirection === 'asc'
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    }

    // Handle number sorting
    if (sortColumn === 'totalAmount' || sortColumn === 'totalItems') {
      return sortDirection === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    }

    // Handle status sorting
    if (sortColumn === 'confirmStatus') {
      const statusOrder = { 'confirmed': 1, 'saved': 2 };
      const aOrder = statusOrder[a.confirmStatus as keyof typeof statusOrder] || 999;
      const bOrder = statusOrder[b.confirmStatus as keyof typeof statusOrder] || 999;
      return sortDirection === 'asc'
        ? aOrder - bOrder
        : bOrder - aOrder;
    }

    // Handle string sorting
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue, 'uz')
        : bValue.localeCompare(aValue, 'uz');
    }

    return 0;
  });

  // Infinite scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } =
      e.currentTarget;

    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      if (displayedItems < sortedBalances.length) {
        setDisplayedItems((prev) =>
          Math.min(prev + 10, sortedBalances.length),
        );
      }
    }
  };

  // Initial loading - title o'zgarganda qayta loading
  useEffect(() => {
    setInitialLoading(true);

    // Darhol yangi data ni yuklash
    const newData = getInitialData();
    setBalances(newData);
    setDisplayedItems(10);
    setSearchQuery("");
    setSelectedRegions([]);
    setSelectedWarehouses([]);
    setSelectedResponsibles([]);
    setDateFrom("");
    setDateTo("");
    setSortColumn(null);
    setSortDirection('asc');

    // Spinner ko'rsatish uchun kechikish
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [title]);

  // Reset displayed items when filters change
  useEffect(() => {
    setDisplayedItems(10);

    // Filter loading
    if (searchQuery || selectedRegions.length > 0 || selectedWarehouses.length > 0 || selectedResponsibles.length > 0 || dateFrom || dateTo) {
      setFilterLoading(true);
      const timer = setTimeout(() => {
        setFilterLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [
    searchQuery,
    selectedRegions,
    selectedWarehouses,
    selectedResponsibles,
    dateFrom,
    dateTo,
  ]);

  // Sort loading
  useEffect(() => {
    if (sortColumn) {
      setSortLoading(true);
      const timer = setTimeout(() => {
        setSortLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [sortColumn, sortDirection]);

  // Multiselect toggle
  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region],
    );
    if (!selectedRegions.includes(region)) {
      setSelectedWarehouses([]);
      setSelectedResponsibles([]);
    }
  };

  const toggleWarehouse = (warehouse: string) => {
    setSelectedWarehouses((prev) =>
      prev.includes(warehouse)
        ? prev.filter((w) => w !== warehouse)
        : [...prev, warehouse],
    );
    if (!selectedWarehouses.includes(warehouse)) {
      setSelectedResponsibles([]);
    }
  };

  const toggleResponsible = (responsible: string) => {
    setSelectedResponsibles((prev) =>
      prev.includes(responsible)
        ? prev.filter((r) => r !== responsible)
        : [...prev, responsible],
    );
  };

  // Remove single filter
  const removeRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.filter((r) => r !== region),
    );
    setSelectedWarehouses([]);
    setSelectedResponsibles([]);
  };

  const removeWarehouse = (warehouse: string) => {
    setSelectedWarehouses((prev) =>
      prev.filter((w) => w !== warehouse),
    );
    setSelectedResponsibles([]);
  };

  const removeResponsible = (responsible: string) => {
    setSelectedResponsibles((prev) =>
      prev.filter((r) => r !== responsible),
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedRegions([]);
    setSelectedWarehouses([]);
    setSelectedResponsibles([]);
    setDateFrom("");
    setDateTo("");
  };

  // Row selection function
  const handleRowClick = (balanceId: string) => {
    setSelectedRowId(prev => prev === balanceId ? null : balanceId);
  };

  const handleViewProducts = (balance: ProductBalance) => {
    setViewingBalance(balance);
    setShowProductsModal(true);
  };

  const handleConfirm = (balance: ProductBalance) => {
    if (balance.confirmStatus === "confirmed") {
      // Agar tasdiqlangan bo'lsa, bekor qilishni so'raymiz
      setConfirmDialog({
        isOpen: true,
        type: "unconfirm",
        balance: balance,
      });
    } else {
      // Agar saqlangan bo'lsa, tasdiqlashni so'raymiz
      setConfirmDialog({
        isOpen: true,
        type: "confirm",
        balance: balance,
      });
    }
  };

  const handleDelete = (balance: ProductBalance) => {
    setConfirmDialog({
      isOpen: true,
      type: "delete",
      balance: balance,
    });
  };

  const handleConfirmAction = () => {
    if (!confirmDialog.balance) return;

    const docNumber = confirmDialog.balance.number;

    if (confirmDialog.type === "confirm") {
      setBalances(prev => prev.map(b =>
        b.id === confirmDialog.balance!.id
          ? { ...b, confirmStatus: 'confirmed' as const }
          : b
      ));
      setNotification({
        show: true,
        message: `${docNumber} raqamli hujjatni tasdiqladingiz`,
        type: "success"
      });
    } else if (confirmDialog.type === "unconfirm") {
      setBalances(prev => prev.map(b =>
        b.id === confirmDialog.balance!.id
          ? { ...b, confirmStatus: 'saved' as const }
          : b
      ));
      setNotification({
        show: true,
        message: `${docNumber} raqamli hujjat tasdiqlashdan bekor qilindi`,
        type: "danger"
      });
    } else if (confirmDialog.type === "delete") {
      setBalances(prev => prev.filter(b => b.id !== confirmDialog.balance!.id));
      setNotification({
        show: true,
        message: `${docNumber} raqamli hujjat o'chirildi`,
        type: "danger"
      });
    }
  };

  // const handleEdit = (balance: ProductBalance) => {
  //   setSelectedBalance(balance);
  //   // Navigate to detail view with document data
  //   let detailView = 'products-balance-detail';
  //   if (isOutcome) detailView = 'products-outcome-detail';
  //   else if (isReturn) detailView = 'products-return-detail';
  //   else if (isTransfer) detailView = 'products-warehouse-transfer-detail';
  //   else if (isCorrection) detailView = 'products-balance-correction-detail';

  //   onNavigate?.(detailView, balance.id.toString(), {
  //     number: balance.number,
  //     date: balance.date,
  //     region: balance.region,
  //     district: balance.district,
  //     warehouse: balance.warehouse,
  //     responsiblePerson: balance.responsiblePerson,
  //     confirmStatus: balance.confirmStatus,
  //     returnType: balance.returnType
  //   });
  // };

  // Formatlar
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("uz-UZ").format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("UZS", "so'm");
  };

  return (
    <>
      {/* Notification */}
      {notification.show && (
        <SuccessNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: "", type: "success" })}
        />
      )}

      <div className="flex flex-col h-full overflow-hidden">
        {/* Sticky Header */}
        <div className="flex-shrink-0 bg-gray-50 pb-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {title || "Maxsulotlar qoldig'i ro'yxati"}
              </h2>

            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="size-4 mr-2" />
                {showFilters
                  ? "Filtrlarni yashirish"
                  : "Filtrlarni ko'rsatish"}
              </Button>
              <Button variant="outlined" size="small">
                <Download className="size-4 mr-2" />
                Excel
              </Button>

              {/* Yangi hujjat tugmasi - agar qaytarish bo'lsa dropdown, aks holda oddiy tugma */}
              {isReturn ? (
                <div className="relative">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="small"
                    onClick={() => setShowReturnTypeMenu(!showReturnTypeMenu)}
                  >
                    <Plus className="size-4 mr-2" />
                    Yangi qaytarish
                    <ChevronDown className="size-4 ml-1" />
                  </Button>

                  {showReturnTypeMenu && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowReturnTypeMenu(false)}
                      />

                      {/* Dropdown menu */}
                      <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                        <button
                          onClick={() => {
                            setShowReturnTypeMenu(false);
                            onNavigate?.('products-return-detail', 'new', { returnType: 'warehouse' });
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2 border-b border-gray-100"
                        >
                          <Warehouse className="size-4 text-blue-600" />
                          <span>Omborga qaytarish</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowReturnTypeMenu(false);
                            onNavigate?.('products-return-detail', 'new', { returnType: 'supplier' });
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-green-50 transition-colors flex items-center gap-2"
                        >
                          <TrendingUp className="size-4 text-green-600" />
                          <span>Etkazib beruvchiga qaytarish</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="small"
                  onClick={handleNewDocument}
                >
                  <Plus className="size-4 mr-2" />
                  {isOutcome ? 'Yangi chiqim' : isTransfer ? 'Yangi o\'tkazish' : isCorrection ? 'Yangi to\'g\'irlash' : 'Yangi qoldiq'}
                </Button>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Jami hujjatlar */}
            <Card className="p-3 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Jami hujjatlar
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatNumber(filteredBalances.length)}
                  </p>
                </div>
                <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="size-5 text-blue-600" />
                </div>
              </div>
            </Card>

            {/* Jami tovarlar */}
            <Card
              className="p-3 bg-white border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setShowReportModal(true)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Jami maxsulotlar
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatNumber(
                      filteredBalances.reduce(
                        (sum, b) => sum + b.totalItems,
                        0,
                      ),
                    )}{" "}
                    ta
                  </p>
                </div>
                <div className="size-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="size-5 text-green-600" />
                </div>
              </div>
            </Card>

            {/* Umumiy summa */}
            <Card className="p-3 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Umumiy summa
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(
                      filteredBalances.reduce(
                        (sum, b) => sum + b.totalAmount,
                        0,
                      ),
                    )}
                  </p>
                </div>
                <div className="size-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="size-5 text-yellow-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card className="p-4 bg-gray-50 border border-gray-200 bg-[#ededed]">
              <div className="space-y-3">
                {/* Search and Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qidirish
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Hujjat raqam..."
                        className="pl-9 pr-9 bg-white"
                        value={searchQuery}
                        onChange={(e) =>
                          setSearchQuery(e.target.value)
                        }
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Date From */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sanadan
                    </label>
                    <div className="relative">
                      <Input
                        type="date"
                        className="bg-white pr-9"
                        value={dateFrom}
                        onChange={(e) =>
                          setDateFrom(e.target.value)
                        }
                        max={dateTo || undefined}
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Date To */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sanagacha
                    </label>
                    <div className="relative">
                      <Input
                        type="date"
                        className="bg-white pr-9"
                        value={dateTo}
                        onChange={(e) =>
                          setDateTo(e.target.value)
                        }
                        min={dateFrom || undefined}
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Dropdown Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Regions Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Viloyatlar
                    </label>
                    <button
                      onClick={() => {
                        setOpenRegionDropdown(
                          !openRegionDropdown,
                        );
                        setOpenWarehouseDropdown(false);
                        setOpenResponsibleDropdown(false);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                    >
                      <span className="text-gray-500">
                        {selectedRegions.length > 0
                          ? `${selectedRegions.length} ta tanlandi`
                          : "Avval viloyatni tanlang"}
                      </span>
                      <ChevronDown className="size-4 text-gray-400" />
                    </button>

                    {openRegionDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-hidden flex flex-col">
                        <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                          <Input
                            type="text"
                            placeholder="Qidirish..."
                            className="text-xs h-7 flex-1 mr-2"
                            value={regionSearch}
                            onChange={(e) =>
                              setRegionSearch(e.target.value)
                            }
                          />
                          {selectedRegions.length > 0 && (
                            <button
                              onClick={() => {
                                setSelectedRegions([]);
                                setSelectedWarehouses([]);
                                setSelectedResponsibles([]);
                              }}
                              className="text-gray-500 hover:text-red-600 p-1"
                              title="Hammasini o'chirish"
                            >
                              <X className="size-4" />
                            </button>
                          )}
                        </div>
                        <div className="overflow-y-auto max-h-48">
                          {allRegions
                            .filter((region) =>
                              region
                                .toLowerCase()
                                .includes(
                                  regionSearch.toLowerCase(),
                                ),
                            )
                            .map((region) => (
                              <label
                                key={region}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedRegions.includes(
                                    region,
                                  )}
                                  onChange={() =>
                                    toggleRegion(region)
                                  }
                                  className="size-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                  {region}
                                </span>
                              </label>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Selected regions badges */}
                    {selectedRegions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedRegions.map((region) => (
                          <Badge
                            key={region}
                            variant="outline"
                            className="bg-white text-gray-700 border-gray-300"
                          >
                            {region}
                            <button
                              onClick={() => removeRegion(region)}
                              className="ml-1 hover:text-gray-900"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Warehouses Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Omborlar
                    </label>
                    <button
                      onClick={() => {
                        if (availableWarehouses.length > 0) {
                          setOpenWarehouseDropdown(
                            !openWarehouseDropdown,
                          );
                          setOpenRegionDropdown(false);
                          setOpenResponsibleDropdown(false);
                        }
                      }}
                      disabled={availableWarehouses.length === 0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <span className="text-gray-500">
                        {availableWarehouses.length === 0
                          ? "Avval viloyatni tanlang"
                          : selectedWarehouses.length > 0
                            ? `${selectedWarehouses.length} ta tanlandi`
                            : "Avval omborni tanlang"}
                      </span>
                      <ChevronDown className="size-4 text-gray-400" />
                    </button>

                    {openWarehouseDropdown &&
                      availableWarehouses.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-hidden flex flex-col">
                          <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                            <Input
                              type="text"
                              placeholder="Qidirish..."
                              className="text-xs h-7 flex-1 mr-2"
                              value={warehouseSearch}
                              onChange={(e) =>
                                setWarehouseSearch(e.target.value)
                              }
                            />
                            {selectedWarehouses.length > 0 && (
                              <button
                                onClick={() => {
                                  setSelectedWarehouses([]);
                                  setSelectedResponsibles([]);
                                }}
                                className="text-gray-500 hover:text-red-600 p-1"
                                title="Hammasini o'chirish"
                              >
                                <X className="size-4" />
                              </button>
                            )}
                          </div>
                          <div className="overflow-y-auto max-h-48">
                            {availableWarehouses
                              .filter((warehouse) =>
                                warehouse
                                  .toLowerCase()
                                  .includes(
                                    warehouseSearch.toLowerCase(),
                                  ),
                              )
                              .map((warehouse) => (
                                <label
                                  key={warehouse}
                                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedWarehouses.includes(
                                      warehouse,
                                    )}
                                    onChange={() =>
                                      toggleWarehouse(warehouse)
                                    }
                                    className="size-4 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">
                                    {warehouse}
                                  </span>
                                </label>
                              ))}
                          </div>
                        </div>
                      )}

                    {/* Selected warehouses badges */}
                    {selectedWarehouses.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedWarehouses.map((warehouse) => (
                          <Badge
                            key={warehouse}
                            variant="outline"
                            className="bg-white text-gray-700 border-gray-300"
                          >
                            {warehouse}
                            <button
                              onClick={() =>
                                removeWarehouse(warehouse)
                              }
                              className="ml-1 hover:text-gray-900"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Responsible persons Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Moddiy javobgar shaxs
                    </label>
                    <button
                      onClick={() => {
                        if (availableResponsibles.length > 0) {
                          setOpenResponsibleDropdown(
                            !openResponsibleDropdown,
                          );
                          setOpenRegionDropdown(false);
                          setOpenWarehouseDropdown(false);
                        }
                      }}
                      disabled={
                        availableResponsibles.length === 0
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <span className="text-gray-500">
                        {availableResponsibles.length === 0
                          ? "Avval omborni tanlang"
                          : selectedResponsibles.length > 0
                            ? `${selectedResponsibles.length} ta tanlandi`
                            : "Tanlang"}
                      </span>
                      <ChevronDown className="size-4 text-gray-400" />
                    </button>

                    {openResponsibleDropdown &&
                      availableResponsibles.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-hidden flex flex-col">
                          <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                            <Input
                              type="text"
                              placeholder="Qidirish..."
                              className="text-xs h-7 flex-1 mr-2"
                              value={responsibleSearch}
                              onChange={(e) =>
                                setResponsibleSearch(
                                  e.target.value,
                                )
                              }
                            />
                            {selectedResponsibles.length > 0 && (
                              <button
                                onClick={() =>
                                  setSelectedResponsibles([])
                                }
                                className="text-gray-500 hover:text-red-600 p-1"
                                title="Hammasini o'chirish"
                              >
                                <X className="size-4" />
                              </button>
                            )}
                          </div>
                          <div className="overflow-y-auto max-h-48">
                            {availableResponsibles
                              .filter((responsible) =>
                                responsible
                                  .toLowerCase()
                                  .includes(
                                    responsibleSearch.toLowerCase(),
                                  ),
                              )
                              .map((responsible) => (
                                <label
                                  key={responsible}
                                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedResponsibles.includes(
                                      responsible,
                                    )}
                                    onChange={() =>
                                      toggleResponsible(
                                        responsible,
                                      )
                                    }
                                    className="size-4 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">
                                    {responsible}
                                  </span>
                                </label>
                              ))}
                          </div>
                        </div>
                      )}

                    {/* Selected responsibles badges */}
                    {selectedResponsibles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedResponsibles.map(
                          (responsible) => (
                            <Badge
                              key={responsible}
                              variant="outline"
                              className="bg-white text-gray-700 border-gray-300"
                            >
                              {responsible}
                              <button
                                onClick={() =>
                                  removeResponsible(responsible)
                                }
                                className="ml-1 hover:text-gray-900"
                              >
                                <X className="size-3" />
                              </button>
                            </Badge>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Clear All Filters Button */}
                {(searchQuery ||
                  selectedRegions.length > 0 ||
                  selectedWarehouses.length > 0 ||
                  selectedResponsibles.length > 0 ||
                  dateFrom ||
                  dateTo) && (
                    <div className="flex justify-end">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={clearAllFilters}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="size-4 mr-2" />
                        Barcha filtrlarni tozalash
                      </Button>
                    </div>
                  )}
              </div>
            </Card>
          )}
        </div>

        {/* Scrollable Table */}
        <div
          className="flex-1 overflow-auto"
          onScroll={handleScroll}
          ref={scrollRef}
        >
          <div className="bg-white rounded-lg border border-gray-200">
            <table
              className="w-full border-collapse"
              style={{ minWidth: "1800px" }}
            >
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <ResizableTableColumn
                    className="px-2 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10"
                    defaultWidth={60}
                    minWidth={50}
                  >
                    №
                  </ResizableTableColumn>
                  <ResizableTableColumn
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10 cursor-pointer hover:bg-gray-200 transition-colors"
                    defaultWidth={200}
                    minWidth={120}
                    onClick={() => handleSort('number')}
                  >
                    <div className="flex items-center gap-2">
                      <span>Hujjat raqami</span>
                      {sortColumn === 'number' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-gray-400" />
                      )}
                    </div>
                  </ResizableTableColumn>
                  <ResizableTableColumn
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10 cursor-pointer hover:bg-gray-200 transition-colors"
                    defaultWidth={150}
                    minWidth={100}
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-2">
                      <span>Sana</span>
                      {sortColumn === 'date' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-gray-400" />
                      )}
                    </div>
                  </ResizableTableColumn>
                  <ResizableTableColumn
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10 cursor-pointer hover:bg-gray-200 transition-colors"
                    defaultWidth={250}
                    minWidth={120}
                    onClick={() => handleSort('region')}
                  >
                    <div className="flex items-center gap-2">
                      <span>Viloyat</span>
                      {sortColumn === 'region' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-gray-400" />
                      )}
                    </div>
                  </ResizableTableColumn>
                  <ResizableTableColumn
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10 cursor-pointer hover:bg-gray-200 transition-colors"
                    defaultWidth={300}
                    minWidth={150}
                    onClick={() => handleSort('warehouse')}
                  >
                    <div className="flex items-center gap-2">
                      <span>Ombor</span>
                      {sortColumn === 'warehouse' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-gray-400" />
                      )}
                    </div>
                  </ResizableTableColumn>
                  <ResizableTableColumn
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10 cursor-pointer hover:bg-gray-200 transition-colors"
                    defaultWidth={350}
                    minWidth={150}
                    onClick={() => handleSort('responsiblePerson')}
                  >
                    <div className="flex items-center gap-2">
                      <span>Javobgar shaxs</span>
                      {sortColumn === 'responsiblePerson' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-gray-400" />
                      )}
                    </div>
                  </ResizableTableColumn>
                  {isReturn && (
                    <>
                      <ResizableTableColumn
                        className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10"
                        defaultWidth={180}
                        minWidth={120}
                      >
                        <span>Qaytarish turi</span>
                      </ResizableTableColumn>
                      <ResizableTableColumn
                        className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10"
                        defaultWidth={200}
                        minWidth={120}
                      >
                        <span>Manba hujjat</span>
                      </ResizableTableColumn>
                    </>
                  )}
                  <ResizableTableColumn
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky top-0 bg-gray-100 z-10 cursor-pointer hover:bg-gray-200 transition-colors"
                    defaultWidth={200}
                    minWidth={120}
                    onClick={() => handleSort('totalAmount')}
                  >
                    <div className="flex items-center gap-2 justify-end">
                      <span>Jami</span>
                      {sortColumn === 'totalAmount' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-gray-400" />
                      )}
                    </div>
                  </ResizableTableColumn>
                  <th
                    className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 sticky right-[110px] top-0 bg-gray-100 z-20 cursor-pointer hover:bg-gray-200 transition-colors shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)]"
                    style={{ width: "150px" }}
                    onClick={() => handleSort('confirmStatus')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>Status</span>
                      {sortColumn === 'confirmStatus' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider sticky right-0 top-0 bg-gray-100 z-20"
                    style={{ width: "110px" }}
                  >
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {initialLoading || filterLoading || sortLoading ? (
                  <tr>
                    <td colSpan={isReturn ? 11 : 9} className="p-0">
                      <TableLoadingSpinner
                        message={
                          initialLoading
                            ? "Ma'lumotlar yuklanmoqda..."
                            : filterLoading
                              ? "Filtrlanmoqda..."
                              : "Tartiblashmoqda..."
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  sortedBalances
                    .slice(0, displayedItems)
                    .map((balance, index) => (
                      <tr
                        key={balance.id}
                        className={`transition-colors ${selectedRowId === balance.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                      >
                        <td
                          className={`px-2 py-2 whitespace-nowrap text-xs text-gray-500 border-r border-gray-200 ${selectedRowId === balance.id ? 'bg-blue-50' : 'bg-white'}`}
                          style={{ width: "60px" }}
                        >
                          {index + 1}
                        </td>
                        <td
                          className={`px-3 py-2 whitespace-nowrap border-r border-gray-200 cursor-pointer ${selectedRowId === balance.id ? 'bg-blue-50' : 'bg-white'}`}
                          style={{ width: "200px" }}
                          onClick={() => handleRowClick(balance.id)}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`size-6 rounded flex items-center justify-center flex-shrink-0 ${balance.confirmStatus ===
                                  "confirmed"
                                  ? "bg-blue-100"
                                  : "bg-yellow-100"
                                }`}
                            >
                              <FileCheck
                                className={`size-3.5 ${balance.confirmStatus ===
                                    "confirmed"
                                    ? "text-blue-600"
                                    : "text-yellow-600"
                                  }`}
                              />
                            </div>
                            <span
                              className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline decoration-blue-600 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(balance);
                              }}
                            >
                              {highlightText(
                                balance.number,
                                searchQuery,
                              )}
                            </span>
                          </div>
                        </td>
                        <td
                          className="px-3 py-2 whitespace-nowrap text-xs text-gray-700 border-r border-gray-200 cursor-pointer"
                          style={{ width: "150px" }}
                          onClick={() => handleRowClick(balance.id)}
                        >
                          {balance.date}
                        </td>
                        <td
                          className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200 cursor-pointer"
                          style={{ width: "250px" }}
                          onClick={() => handleRowClick(balance.id)}
                        >
                          {balance.region}
                        </td>
                        <td
                          className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200 cursor-pointer"
                          style={{ width: "300px" }}
                          onClick={() => handleRowClick(balance.id)}
                        >
                          {balance.warehouse}
                        </td>
                        <td
                          className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200 cursor-pointer"
                          style={{ width: "350px" }}
                          onClick={() => handleRowClick(balance.id)}
                        >
                          {balance.responsiblePerson}
                        </td>
                        {isReturn && (
                          <>
                            <td
                              className="px-3 py-2 text-xs border-r border-gray-200 cursor-pointer"
                              style={{ width: "180px" }}
                              onClick={() => handleRowClick(balance.id)}
                            >
                              <Badge
                                className={
                                  balance.returnType === "warehouse"
                                    ? "bg-green-100 text-green-700 border-0 px-2 py-0.5 text-xs"
                                    : "bg-purple-100 text-purple-700 border-0 px-2 py-0.5 text-xs"
                                }
                              >
                                {balance.returnType === "warehouse"
                                  ? "Omborga"
                                  : "Etkazib beruvchiga"}
                              </Badge>
                            </td>
                            <td
                              className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200 cursor-pointer"
                              style={{ width: "200px" }}
                              onClick={() => handleRowClick(balance.id)}
                            >
                              {balance.returnType === "warehouse"
                                ? balance.outcomeDocNumber
                                : balance.incomeDocNumber}
                            </td>
                          </>
                        )}
                        <td
                          className="px-3 py-2 whitespace-nowrap text-xs text-right border-r border-gray-200 cursor-pointer"
                          style={{ width: "200px" }}
                          onClick={() => handleRowClick(balance.id)}
                        >
                          <div className="font-bold text-green-600">
                            {formatCurrency(balance.totalAmount)}
                          </div>
                        </td>
                        <td
                          className={`px-3 py-2 whitespace-nowrap text-center border-r border-gray-200 sticky right-[110px] z-10 cursor-pointer shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)] ${selectedRowId === balance.id ? 'bg-blue-50' : 'bg-white'}`}
                          style={{ width: "150px" }}
                          onClick={() => handleRowClick(balance.id)}
                        >
                          <Badge
                            className={
                              balance.confirmStatus === "confirmed"
                                ? "bg-blue-100 text-blue-700 border-0 px-2 py-0.5 text-xs"
                                : "bg-yellow-100 text-yellow-700 border-0 px-2 py-0.5 text-xs"
                            }
                          >
                            {balance.confirmStatus === "confirmed"
                              ? "Tasdiqlangan"
                              : "Saqlangan"}
                          </Badge>
                        </td>
                        <td
                          className={`px-3 py-2 whitespace-nowrap text-center sticky right-0 z-10 ${selectedRowId === balance.id ? 'bg-blue-50' : 'bg-white'}`}
                          style={{ width: "110px" }}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="solid"
                              size="small"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-7 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewProducts(balance);
                              }}
                              title="Ko'rish"
                            >
                              <Eye className="size-3.5" />
                            </Button>
                            <Button
                              variant="solid"
                              size="small"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(balance);
                              }}
                              title="O'chirish"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                            <Button
                              variant="solid"
                              size="small"
                              className={
                                balance.confirmStatus === "confirmed"
                                  ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50 h-7 px-2"
                                  : "text-green-600 hover:text-green-700 hover:bg-green-50 h-7 px-2"
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfirm(balance);
                              }}
                              title={
                                balance.confirmStatus === "confirmed"
                                  ? "Bekor qilish"
                                  : "Tasdiqlash"
                              }
                            >
                              {balance.confirmStatus === "confirmed" ? (
                                <XCircle className="size-3.5" />
                              ) : (
                                <CheckCircle className="size-3.5" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>

            {/* Loading more indicator */}
            {displayedItems < sortedBalances.length && (
              <div className="text-center py-4 text-gray-500 text-xs border-t border-gray-200">
                Yuklanmoqda... ({displayedItems} /{" "}
                {sortedBalances.length})
              </div>
            )}

            {/* Empty state */}
            {!initialLoading && !filterLoading && !sortLoading && filteredBalances.length === 0 && (
              <div className="text-center py-12">
                <Package className="size-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Hech qanday ma'lumot topilmadi
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Report Modal */}
        <ProductsBalanceReportModal
          isOpen={showReportModal}
          products={mockProducts}
          onClose={() => setShowReportModal(false)}
          title={reportTitle}
          initialBarcodeFilter={searchQuery}
        />

        {/* Products View Modal */}
        {showProductsModal && viewingBalance && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
            onClick={() => setShowProductsModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Package className="size-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{viewingBalance.number}</h2>
                    <p className="text-sm text-blue-100">Hujjat raqamiga tegishli maxsulotlar ro'yxati</p>
                  </div>
                </div>
                <Button
                  variant="solid"
                  size="small"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowProductsModal(false)}
                >
                  <X className="size-5" />
                </Button>
              </div>

              {/* Products Table */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-white rounded-lg border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200" style={{ width: "60px" }}>
                          №
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200" style={{ width: "150px" }}>
                          Shtrix kod
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200" style={{ width: "200px" }}>
                          Tovar turi
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200" style={{ width: "150px" }}>
                          Model
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200" style={{ width: "120px" }}>
                          O'lcham
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200" style={{ width: "120px" }}>
                          O'lchov birligi
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200" style={{ width: "100px" }}>
                          Soni
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200" style={{ width: "150px" }}>
                          Narxi
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ width: "180px" }}>
                          Summasi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockProducts.slice(0, 15).map((product, index) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-xs text-gray-500 border-r border-gray-200">
                            {index + 1}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 font-mono border-r border-gray-200">
                            {product.barcode}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-900 border-r border-gray-200">
                            {product.name}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                            {product.model}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                            {product.size}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                            {product.unit}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-900 text-right font-semibold border-r border-gray-200">
                            {formatNumber(product.quantity)}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-900 text-right font-semibold border-r border-gray-200">
                            {formatCurrency(product.price)}
                          </td>
                          <td className="px-3 py-2 text-xs text-green-600 text-right font-bold">
                            {formatCurrency(product.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                      <tr>
                        <td colSpan={6} className="px-3 py-3 text-sm font-bold text-gray-900 text-right">
                          Jami:
                        </td>
                        <td className="px-3 py-3 text-sm font-bold text-gray-900 text-right border-r border-gray-200">
                          {formatNumber(mockProducts.slice(0, 15).reduce((sum, p) => sum + p.quantity, 0))}
                        </td>
                        <td className="px-3 py-3 text-sm font-bold text-gray-900 text-right border-r border-gray-200">
                          -
                        </td>
                        <td className="px-3 py-3 text-sm font-bold text-green-600 text-right">
                          {formatCurrency(mockProducts.slice(0, 15).reduce((sum, p) => sum + p.total, 0))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end">
                <Button variant="outlined" onClick={() => setShowProductsModal(false)}>
                  Yopish
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedBalance && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <FileText className="size-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {selectedBalance.number}
                    </h2>
                    <p className="text-sm text-blue-100">
                      Maxsulotlar qoldig'i ma'lumotlari
                    </p>
                  </div>
                </div>
                <Button
                  variant="solid"
                  size="small"
                  className="text-white hover:bg-white/20"
                  onClick={() => setSelectedBalance(null)}
                >
                  <X className="size-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Sana
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedBalance.date}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Viloyat
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedBalance.region}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Tuman
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedBalance.district}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Ombor
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedBalance.warehouse}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Moddiy javobgar shaxs
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedBalance.responsiblePerson}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Foydalanuvchi
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedBalance.user}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Status
                    </label>
                    <Badge
                      className={
                        selectedBalance.confirmStatus ===
                          "confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {selectedBalance.confirmStatus ===
                        "confirmed"
                        ? "Tasdiqlangan"
                        : "Saqlangan"}
                    </Badge>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Jami maxsulotlar
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {formatNumber(selectedBalance.totalItems)}{" "}
                      ta
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Jami summa
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {formatCurrency(
                        selectedBalance.totalAmount,
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                <Button
                  variant="outlined"
                  onClick={() => setSelectedBalance(null)}
                >
                  Yopish
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="size-4 mr-2" />
                  Yuklab olish
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() =>
            setConfirmDialog({ isOpen: false, type: "delete", balance: null })
          }
          onConfirm={handleConfirmAction}
          title={
            confirmDialog.type === "delete"
              ? "Hujjatni o'chirish"
              : confirmDialog.type === "unconfirm"
                ? "Tasdiqlashni bekor qilish"
                : "Hujjatni tasdiqlash"
          }
          message={
            confirmDialog.type === "delete"
              ? `"${confirmDialog.balance?.number}" hujjatini o'chirmoqchimisiz?`
              : confirmDialog.type === "unconfirm"
                ? `"${confirmDialog.balance?.number}" hujjatini tasdiqlashni bekor qilmoqchimisiz?`
                : `"${confirmDialog.balance?.number}" hujjatini tasdiqlashni xohlaysizmi?`
          }
          confirmText="Ha"
          cancelText="Yo'q"
          type={confirmDialog.type === "delete" ? "danger" : "info"}
        />
      </div>
    </>
  );
}
export default ProductsBalanceView;