import { useState } from 'react';
import {
  Search,
  Filter,
  Send,
  Printer,
  Download,
  ChevronDown,
  X
} from 'lucide-react';
import { Badge, Button, Input } from 'antd';

interface ReportItem {
  id: number;
  contractorName: string;
  orderName: string;
  total: string;
  orderNumber: string;
  orderDate: string;
  currentOutput: string;
  responsible: string;
  orderRequest: string;
  financingMethod: string;
  orderNameNumberDate: string;
  managementCommittee: string;
  manufacturer: string;
  country: string;
  orderMethod: string;
  orderTypeNumberDate: string;
  packagePermissionNumberDate: string;
  orderDistrict: string;
  financed: string;
  agreed: string;
  additional: string;
  orderStatus: string;
  orderPriceUSD: string;
  electronicStatus: string;
  orderPriceSum: string;
}

const ReportTableOne: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'tovar' | 'model' | 'olcham' | null>(null);
  const [selectedTovar, setSelectedTovar] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedOlcham, setSelectedOlcham] = useState('');

  // Mock data for modals
  const tovarData = [
    { id: 1, kod: 'T-001', nomi: 'Kompyuter texnikasi', kategoriya: 'Texnika' },
    { id: 2, kod: 'T-002', nomi: 'Ofis mebellari', kategoriya: 'Mebel' },
    { id: 3, kod: 'T-003', nomi: 'Dasturiy ta\'minot', kategoriya: 'Software' },
    { id: 4, kod: 'T-004', nomi: 'Printer va skanner', kategoriya: 'Texnika' },
    { id: 5, kod: 'T-005', nomi: 'Monitor', kategoriya: 'Texnika' },
  ];

  const modelData = [
    { id: 1, kod: 'M-001', nomi: 'Dell Latitude 5420', brend: 'Dell' },
    { id: 2, kod: 'M-002', nomi: 'HP ProDesk 400', brend: 'HP' },
    { id: 3, kod: 'M-003', nomi: 'Lenovo ThinkPad X1', brend: 'Lenovo' },
    { id: 4, kod: 'M-004', nomi: 'ASUS VivoBook', brend: 'ASUS' },
    { id: 5, kod: 'M-005', nomi: 'Acer Aspire 5', brend: 'Acer' },
  ];

  const olchamData = [
    { id: 1, kod: 'O-001', nomi: 'Dona', qisqartma: 'dona' },
    { id: 2, kod: 'O-002', nomi: 'Kilogramm', qisqartma: 'kg' },
    { id: 3, kod: 'O-003', nomi: 'Metr', qisqartma: 'm' },
    { id: 4, kod: 'O-004', nomi: 'Litr', qisqartma: 'l' },
    { id: 5, kod: 'O-005', nomi: 'Komplekt', qisqartma: 'kpl' },
  ];

  const openModal = (type: 'tovar' | 'model' | 'olcham') => {
    setModalType(type);
    setShowModal(true);
  };

  const selectItem = (item: any) => {
    if (modalType === 'tovar') {
      setSelectedTovar(item.nomi);
    } else if (modalType === 'model') {
      setSelectedModel(item.nomi);
    } else if (modalType === 'olcham') {
      setSelectedOlcham(item.nomi);
    }
    setShowModal(false);
  };

  const getModalTitle = () => {
    if (modalType === 'tovar') return 'Tovar turini tanlang';
    if (modalType === 'model') return 'Modelni tanlang';
    if (modalType === 'olcham') return 'O\'lchov birligini tanlang';
    return '';
  };

  const getModalData = () => {
    if (modalType === 'tovar') return tovarData;
    if (modalType === 'model') return modelData;
    if (modalType === 'olcham') return olchamData;
    return [];
  };

  // Mock data
  const mockData: ReportItem[] = [
    {
      id: 1,
      contractorName: 'O\'zbekiston Respublikasi Moliya vazirligi',
      orderName: 'Kompyuter texnikasi',
      total: '150 000 000',
      orderNumber: 'B-2020-001',
      orderDate: '15.02.2020',
      currentOutput: '100%',
      responsible: 'Karimov A.R.',
      orderRequest: 'Tasdiqlandi',
      financingMethod: 'Davlat byudjeti',
      orderNameNumberDate: 'Buyurtma №001, 15.02.2020',
      managementCommittee: 'Boshqaruv qo\'mitasi',
      manufacturer: 'Dell Inc.',
      country: 'AQSh',
      orderMethod: 'Tender',
      orderTypeNumberDate: 'Ochiq tender №T-001, 10.02.2020',
      packagePermissionNumberDate: 'Paket №P-001, 08.02.2020',
      orderDistrict: 'Toshkent shahar',
      financed: 'To\'liq',
      agreed: 'Ha',
      additional: 'Qo\'shimcha ma\'lumot yo\'q',
      orderStatus: 'Bajarildi',
      orderPriceUSD: '50 000',
      electronicStatus: 'Imzolangan',
      orderPriceSum: '150 000 000'
    },
    {
      id: 2,
      contractorName: 'Xorazm viloyati hokimligi',
      orderName: 'Ofis mebellari',
      total: '75 000 000',
      orderNumber: 'B-2020-002',
      orderDate: '20.03.2020',
      currentOutput: '85%',
      responsible: 'Nazarov B.A.',
      orderRequest: 'Jarayonda',
      financingMethod: 'Mahalliy byudjet',
      orderNameNumberDate: 'Buyurtma №002, 20.03.2020',
      managementCommittee: 'Hokimlik',
      manufacturer: 'MebelPro LLC',
      country: 'O\'zbekiston',
      orderMethod: 'Tender',
      orderTypeNumberDate: 'Ochiq tender №T-002, 15.03.2020',
      packagePermissionNumberDate: 'Paket №P-002, 12.03.2020',
      orderDistrict: 'Xorazm viloyati',
      financed: 'Qisman',
      agreed: 'Ha',
      additional: '',
      orderStatus: 'Jarayonda',
      orderPriceUSD: '25 000',
      electronicStatus: 'Kutilmoqda',
      orderPriceSum: '75 000 000'
    },
    {
      id: 3,
      contractorName: 'Samarqand viloyati hokimligi',
      orderName: 'Dasturiy ta\'minot',
      total: '200 000 000',
      orderNumber: 'B-2020-003',
      orderDate: '05.05.2020',
      currentOutput: '100%',
      responsible: 'Aliyev J.N.',
      orderRequest: 'Tasdiqlandi',
      financingMethod: 'Davlat byudjeti',
      orderNameNumberDate: 'Buyurtma №003, 05.05.2020',
      managementCommittee: 'IT komissiya',
      manufacturer: 'Microsoft Corp.',
      country: 'AQSh',
      orderMethod: 'To\'g\'ridan-to\'g\'ri',
      orderTypeNumberDate: 'To\'g\'ridan-to\'g\'ri №D-001, 01.05.2020',
      packagePermissionNumberDate: 'Paket №P-003, 28.04.2020',
      orderDistrict: 'Samarqand viloyati',
      financed: 'To\'liq',
      agreed: 'Ha',
      additional: 'Litsenziya 1 yilga',
      orderStatus: 'Bajarildi',
      orderPriceUSD: '67 000',
      electronicStatus: 'Imzolangan',
      orderPriceSum: '200 000 000'
    }
  ];

  const [reportData] = useState<ReportItem[]>(mockData);

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="size-4 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filter</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            <ChevronDown className={`size-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Sana</label>
            <Input
              type="datetime-local"
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Tovar turi</label>
            <Input
              type="text"
              placeholder="Tanlang"
              className="text-sm"
              onClick={() => openModal('tovar')}
              value={selectedTovar}
              readOnly
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Model</label>
            <Input
              type="text"
              placeholder="Tanlang"
              className="text-sm"
              onClick={() => openModal('model')}
              value={selectedModel}
              readOnly
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">O'lchov</label>
            <Input
              type="text"
              placeholder="Tanlang"
              className="text-sm"
              onClick={() => openModal('olcham')}
              value={selectedOlcham}
              readOnly
            />
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 mt-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Nomi turi</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Tanlang</option>
                <option>Kompyuter texnikasi</option>
                <option>Ofis mebellari</option>
                <option>Dasturiy ta'minot</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Modeli</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Tanlang</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">O'lchami</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Tanlang</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mt-4">
          <Button variant="outlined" className="gap-2">
            <Printer className="size-4" />
            Chop etish
          </Button>
          <Button variant="outlined" className="gap-2">
            <Download className="size-4" />
            Yuklat xlsx
          </Button>
        </div>
      </div>

      {/* Wide Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Т/р</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Konragent nomi</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Buyirtma nomi</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Jami</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Buyirtma raqami, Sana</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Hozir chiq</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Mas'ul</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Buyirtma istagati</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Moliyalashtirish usuli</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Buyruq nomi, raqami, sana</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Boshqaruv qo'mita</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Ishlab chiqaruvchi</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Mamlakat</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Buyirtma usuli</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Buyirtma tugi, raqami, sana</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Paket yo'l berguvchi, raqami, sana</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Buyirtma tumon</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Moliyalashdi</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Kelishildi</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Qo'shimcha</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Buyirtma status/bajarish holati</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Buyirtma narxi (USD)</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200">Elektron holat</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Buyirtma narxi (so'm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3 text-gray-900 border-r border-gray-200">{index + 1}</td>
                  <td className="px-3 py-3 text-gray-900 border-r border-gray-200 whitespace-nowrap">{item.contractorName}</td>
                  <td className="px-3 py-3 text-gray-900 border-r border-gray-200 whitespace-nowrap">{item.orderName}</td>
                  <td className="px-3 py-3 text-gray-900 font-semibold border-r border-gray-200 whitespace-nowrap">{item.total}</td>
                  <td className="px-3 py-3 text-gray-900 border-r border-gray-200 whitespace-nowrap">{item.orderNumber}, {item.orderDate}</td>
                  <td className="px-3 py-3 text-gray-900 border-r border-gray-200 whitespace-nowrap">{item.currentOutput}</td>
                  <td className="px-3 py-3 text-gray-900 border-r border-gray-200 whitespace-nowrap">{item.responsible}</td>
                  <td className="px-3 py-3 border-r border-gray-200 whitespace-nowrap">
                    <Badge className={item.orderRequest === 'Tasdiqlandi' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-yellow-100 text-yellow-700 border-yellow-300'}>
                      {item.orderRequest}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-gray-900 border-r border-gray-200 whitespace-nowrap">{item.financingMethod}</td>
                  <td className="px-3 py-3 text-gray-900 border-r border-gray-200 whitespace-nowrap">{item.orderNameNumberDate}</td>
                  <td className="px-3 py-3 text-gray-900 border-r border-gray-200 whitespace-nowrap">{item.managementCommittee}</td>
                  <td className="px-3 py-3 text-gray-900 border-r border-gray-200 whitespace-nowrap">{item.manufacturer}</td>
                  <td className="px-3 py-3 text-gray-900 border-r border-gray-200 whitespace-nowrap">{item.country}</td>
                  <td className="px-3 py-3 text-gray-900 border-r border-gray-200 whitespace-nowrap">{item.orderMethod}</td>
                  <td className="px-3 py-3 text-gray-900 border-r border-gray-200 whitespace-nowrap">{item.orderTypeNumberDate}</td>
                  <td className="px-3 py-3 text-gray-900 border-r border-gray-200 whitespace-nowrap">{item.packagePermissionNumberDate}</td>
                  <td className="px-3 py-3 text-gray-900 border-r border-gray-200 whitespace-nowrap">{item.orderDistrict}</td>
                  <td className="px-3 py-3 border-r border-gray-200 whitespace-nowrap">
                    <Badge className={item.financed === 'To\'liq' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-orange-100 text-orange-700 border-orange-300'}>
                      {item.financed}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-gray-900 border-r border-gray-200 whitespace-nowrap">{item.agreed}</td>
                  <td className="px-3 py-3 text-gray-600 border-r border-gray-200 whitespace-nowrap">{item.additional || '-'}</td>
                  <td className="px-3 py-3 border-r border-gray-200 whitespace-nowrap">
                    <Badge className={item.orderStatus === 'Bajarildi' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-100 text-blue-700 border-blue-300'}>
                      {item.orderStatus}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-gray-900 font-semibold border-r border-gray-200 whitespace-nowrap">${item.orderPriceUSD}</td>
                  <td className="px-3 py-3 border-r border-gray-200 whitespace-nowrap">
                    <Badge className={item.electronicStatus === 'Imzolangan' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-yellow-100 text-yellow-700 border-yellow-300'}>
                      {item.electronicStatus}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-gray-900 font-semibold whitespace-nowrap">{item.orderPriceSum} so'm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer text */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-600 italic">
            Muassasa faoliyati uchun materiallar moliyalastirilgan bo'lsa "Dushanbevittimi" tugmasi bosing
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">{getModalTitle()}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b-2 border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">№</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kod</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nomi</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      {modalType === 'tovar' ? 'Kategoriya' : modalType === 'model' ? 'Brend' : 'Qisqartma'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getModalData().map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => selectItem(item)}
                    >
                      <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{item.kod}</td>
                      <td className="px-4 py-3 text-gray-900">{item.nomi}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {'brend' in item ? item.brend : 'kategoriya' in item ? item.kategoriya : item.qisqartma}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <Button
                variant="outlined"
                onClick={() => setShowModal(false)}
              >
                Bekor qilish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportTableOne;