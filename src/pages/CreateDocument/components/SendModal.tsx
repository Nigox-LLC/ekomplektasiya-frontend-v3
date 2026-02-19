import { axiosAPI } from "@/service/axiosAPI";
import { Button, Checkbox, Select } from "antd";
import { Building2, Check, Send, User } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

interface SendModalProps {
  setIsSendModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  orderDataID: number | null;
}

const SendModal: React.FC<SendModalProps> = ({
  setIsSendModalOpen,
  orderDataID,
}) => {
  const [departments, setDepartments] = React.useState<IDName[]>([]);
  const [selectedDepartment, setSelectedDepartment] = React.useState<
    number | null
  >(null);
  const [subDepartments, setSubDepartments] = React.useState<IDName[]>([]);
  const [selectedSubDepartment, setSelectedSubDepartment] = React.useState<
    number | null
  >(null);
  const [employees, setEmployees] = React.useState<EmployeeType[]>([]);
  const [selectedEmployee, setSelectedEmployee] = React.useState<number | null>(
    null,
  );
  const [movementType, setMovementType] = React.useState<string>("");

  // fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await axiosAPI.get("directory/organization/department/");
      if (response.status === 200) setDepartments(response.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  // fetch sub-departments when department is selected
  const fetchSubDepartments = async (departmentId: number) => {
    try {
      const response = await axiosAPI.get(
        "/directory/organization/sub-department/",
        {
          params: { department: departmentId },
        },
      );

      if (response.status === 200) setSubDepartments(response.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  // fetch employees when sub-department is selected
  const fetchEmployees = async (subDepartmentId: number) => {
    try {
      const params = {
        department: selectedDepartment,
        // sub_department: subDepartmentId,
      };
      const response = await axiosAPI.get("/staff/", {
        params: params,
      });
      if (response.status === 200) setEmployees(response.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  // handle send document
  const handleSend = async () => {
    try {
      const response = await axiosAPI.post(
        `document/orders/${orderDataID}/send/`,
        {
          department: selectedDepartment,
          // sub_department: selectedSubDepartment,
          receiver: selectedEmployee,
          movement_type: movementType,
        },
      );
      if (response.status === 200) {
        toast.success("Hujjat muvaffaqiyatli yuborildi!");
        setIsSendModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 text-black!">
        <div className="bg-white rounded-lg p-6 w-full max-w-162.5">
          <div className="flex items-center justify-between gap-6">
            <h2 className="text-xl font-bold mb-4">Hujjatni yuborish</h2>
            <span
              className="text-3xl"
              onClick={() => setIsSendModalOpen(false)}
            >
              &times;
            </span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            {/* Department section */}
            <div className="w-full">
              <p className="mb-2 font-semibold">Bo'lim</p>
              <Select
                value={selectedDepartment}
                onChange={(value) => {
                  setSelectedDepartment(value);
                  fetchSubDepartments(value);
                }}
                className="w-full mb-4"
                placeholder="Bo'limni tanlang"
              >
                {departments.map((dept) => (
                  <Select.Option key={dept.id} value={dept.id}>
                    {dept.name}
                  </Select.Option>
                ))}
              </Select>
            </div>

            {/* Sub-department section */}
            <div className="w-full">
              <p className="mb-2 font-semibold">Quyi bo'lim</p>
              <Select
                value={selectedSubDepartment}
                onChange={(value) => {
                  setSelectedSubDepartment(value);
                  fetchEmployees(value);
                }}
                className="w-full mb-4"
                placeholder="Quyi bo'limni tanlang"
              >
                {subDepartments.map((subDept) => (
                  <Select.Option key={subDept.id} value={subDept.id}>
                    {subDept.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
          {/* Movement type section */}
          <div className="mb-6">
            <p className="mb-2 font-semibold">Yuborish maqsadi</p>
            <Select
              className="w-full mb-4"
              placeholder="Yuborish maqsadini tanlang"
              value={movementType || undefined}
              onChange={(value) => setMovementType(value)}
            >
              <Select.Option value="for_information">
                Ma'lumot uchun
              </Select.Option>
              <Select.Option value="in_signing">Imzolash uchun</Select.Option>
              <Select.Option value="in_approval">
                Tasdiqlash uchun
              </Select.Option>
              <Select.Option value="for_above">Usti xat uchun</Select.Option>
            </Select>
          </div>

          {/* Employees table */}
          <div className="text-black! mb-4">
            <p className="mb-2 font-semibold">Xodimlar</p>
            <div className="max-h-48 overflow-y-auto border border-gray-300 rounded">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  className={`p-2 cursor-pointer hover:bg-gray-100 flex gap-4 ${selectedEmployee === emp.id ? "bg-gray-200" : ""}`}
                  onClick={() => setSelectedEmployee(emp.id)}
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                    <User className="size-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900">
                      {emp.full_name}
                    </h4>
                    <p className="text-sm text-gray-600">{emp.position.name}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Building2 className="size-3" />
                      <span>{emp.department.name}</span>
                    </div>
                  </div>
                  {selectedEmployee === emp.id && (
                    <div className="shrink-0">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Button
              type="primary"
              onClick={() => {
                handleSend();
              }}
              className="gap-2 bg-blue-600 text-white hover:bg-blue-700 font-semibold"
            >
              <Send className="size-5" />
              Yuborish
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SendModal;
