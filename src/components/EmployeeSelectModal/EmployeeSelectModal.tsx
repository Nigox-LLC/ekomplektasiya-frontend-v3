import { axiosAPI } from "@/service/axiosAPI";
import React, { useEffect, useRef, useMemo } from "react";
import { Table, Spin, Button, Checkbox, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Check, X } from "lucide-react";

interface IProps {
  onClose: () => void;
  onSelect: (employees: EmployeeType[]) => void;
  selectionType?: "single" | "multiple";
  selectedEmployeeIds: number[];
  selectingPurpose?: boolean;
}

const EmployeeSelectModal: React.FC<IProps> = ({
  onClose,
  onSelect,
  selectionType = "multiple",
  selectedEmployeeIds,
  selectingPurpose,
}) => {
  const [employeeList, setEmployeeList] = React.useState<EmployeeType[]>([]);
  const [selectedEmployees, setSelectedEmployees] = React.useState<
    EmployeeType[]
  >([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(20);
  const [total, setTotal] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedPurposeById, setSelectedPurposeById] = React.useState<
    Record<number, string>
  >({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  const forPurpose = [
    {
      label: "Ijro uchun",
      value: "executing",
    },
    {
      label: "Imzolash uchun",
      value: "in_signing",
    },
    {
      label: "Kelishish uchun",
      value: "in_approval",
    },
    {
      label: "Ustixat uchun",
      value: "for_above",
    },
    {
      label: "Ma'lumot uchun",
      value: "for_information",
    },
  ];

  // Handle employee selection
  const handleSelectEmployee = (employee: EmployeeType) => {
    setSelectedEmployees((prev) => {
      const isSelected = prev.some((e) => e.id === employee.id);

      if (selectionType === "single") {
        // For single selection, return only the clicked employee
        return isSelected ? [] : [employee];
      }

      // For multiple selection
      if (isSelected) {
        return prev.filter((e) => e.id !== employee.id);
      } else {
        return [...prev, employee];
      }
    });
  };

  // Check if employee is selected
  const isEmployeeSelected = (employee: EmployeeType) => {
    return selectedEmployees.some((e) => e.id === employee.id);
  };

  // Handle confirm selection
  const handleConfirm = () => {
    if (selectingPurpose) {
      const employeesWithPurpose = selectedEmployees.map((employee) => ({
        ...employee,
        purpose: selectedPurposeById[employee.id],
      }));
      onSelect(employeesWithPurpose);
      onClose();
      return;
    }
    onSelect(selectedEmployees);
    onClose();
  };

  // Columns for the table
  const columns: ColumnsType<EmployeeType> = [
    {
      title:
        selectionType === "multiple" ? (
          <Checkbox
            checked={
              selectedEmployees.length === employeeList.length &&
              employeeList.length > 0
            }
            indeterminate={
              selectedEmployees.length > 0 &&
              selectedEmployees.length < employeeList.length
            }
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedEmployees(employeeList);
              } else {
                setSelectedEmployees([]);
              }
            }}
          />
        ) : null,
      key: "checkbox",
      width: selectionType === "multiple" ? 50 : 0,
      render: (_, record) => (
        <Checkbox
          checked={isEmployeeSelected(record)}
          onChange={() => handleSelectEmployee(record)}
        />
      ),
    },
    {
      title: "Ism familiya",
      dataIndex: "full_name",
      key: "full_name",
      width: 200,
    },
    {
      title: "Lavozimi",
      dataIndex: "position_name",
      key: "position_name",
      width: 200,
    },
    // Optional purpose column if selectingPurpose is true. Purpose value for each employee
    ...(selectingPurpose
      ? [
          {
            title: "Maqsadi",
            key: "purpose",
            render: (_, record) => (
              <Select
                style={{ width: 150 }}
                placeholder="Maqsadni tanlang"
                value={selectedPurposeById[record.id]}
                onChange={(value) =>
                  setSelectedPurposeById((prev) => ({
                    ...prev,
                    [record.id]: value,
                  }))
                }
              >
                {forPurpose.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            ),
          },
        ]
      : []),
  ];

  // Check if we can load more data
  const canLoadMore = useMemo(() => {
    return employeeList.length < total && hasMore && !isLoading;
  }, [employeeList.length, total, hasMore, isLoading]);

  // Filter employees based on search query
  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return employeeList;

    return employeeList.filter(
      (employee) =>
        (employee.full_name?.toLowerCase().includes(query) ?? false) ||
        (employee.position_name?.toLowerCase().includes(query) ?? false),
    );
  }, [employeeList, searchQuery]);

  // Fetch employee list from API with pagination (no search parameter)
  const fetchEmployees = async (page: number = 1) => {
    if (isLoading || isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await axiosAPI.get("staff/by-name/", {
        params: {
          page,
          page_size: pageSize,
        },
      });

      if (response.status === 200) {
        const data = response.data;
        const results = Array.isArray(data) ? data : data.results || [];
        const count = data.count || data.length || 0;

        setTotal(count);
        setCurrentPage(page);

        if (page === 1) {
          setEmployeeList(results);
        } else {
          setEmployeeList((prev) => [...prev, ...results]);
        }

        // Check if we've loaded all data
        const totalLoaded = page * pageSize;
        setHasMore(totalLoaded < (count || 0));
      }
    } catch (error) {
      console.log("Error fetching employees:", error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Initial fetch
  useEffect(() => {
    setCurrentPage(1);
    setEmployeeList([]);
    setHasMore(true);
    isFetchingRef.current = false;
    fetchEmployees(1);
  }, []);

  // Set selected employees based on selectedEmployeeIds when employee list changes
  useEffect(() => {
    if (employeeList.length > 0 && selectedEmployeeIds.length > 0) {
      const preSelectedEmployees = employeeList.filter((emp) =>
        selectedEmployeeIds.includes(emp.id),
      );
      setSelectedEmployees(preSelectedEmployees);
    }
    console.log(selectedEmployeeIds);
    console.log(employeeList);
  }, [employeeList, selectedEmployeeIds]);

  // Handle page change for infinite scroll
  useEffect(() => {
    if (currentPage > 1) {
      fetchEmployees(currentPage);
    }
  }, [currentPage]);

  // Handle search - update state only (no API request)
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // Handle scroll event for infinite scroll
  const handleTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;

    // Check if scrolled to bottom (within 50px threshold)
    if (
      scrollHeight - scrollTop - clientHeight < 50 &&
      canLoadMore &&
      !isLoading
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="flex flex-col max-w-175 max-h-125 w-full bg-white rounded-lg">
        {/* Fixed Header */}
        <div className="p-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h2>
              Xodimlar ro'yxati ({employeeList.length} / {total})
            </h2>
            <span className="text-3xl cursor-pointer" onClick={onClose}>
              &times;
            </span>
          </div>
          <Input
            placeholder="Qidirish..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
        </div>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto"
          onScroll={handleTableScroll}
        >
          <Table
            columns={columns}
            dataSource={filteredEmployees}
            rowKey="id"
            pagination={false}
            loading={isLoading && employeeList.length === 0}
            scroll={{ x: 400 }}
            className="employee-select-table"
          />

          {/* Loading indicator for infinite scroll */}
          {isLoading && employeeList.length > 0 && (
            <div className="flex items-center justify-center p-4">
              <Spin size="small" />
              <span className="ml-2 text-gray-600">yuklanmoqda...</span>
            </div>
          )}

          {/* No more data message */}
          {!hasMore && employeeList.length > 0 && (
            <div className="flex items-center justify-center p-4 text-gray-500">
              Barcha ma'lumotlar yuklandi ({employeeList.length}/{total})
            </div>
          )}

          {/* Empty state */}
          {filteredEmployees.length === 0 &&
            employeeList.length > 0 &&
            searchQuery.trim() &&
            !isLoading && (
              <div className="flex items-center justify-center p-8 text-gray-500">
                Xodimlar topilmadi
              </div>
            )}

          {employeeList.length === 0 && !isLoading && (
            <div className="flex items-center justify-center p-8 text-gray-500">
              Xodimlar topilmadi
            </div>
          )}
        </div>

        {/* Footer with info and actions */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectionType === "single"
                ? `Tanlangan: ${selectedEmployees.length === 1 ? selectedEmployees[0]?.full_name : "Hech kim"}`
                : `Tanlangan: ${selectedEmployees.length} | Jami: ${employeeList.length} / ${total}`}
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={onClose} icon={<X className="size-4" />}>
                Orqaga
              </Button>
              <Button
                type="primary"
                onClick={handleConfirm}
                disabled={selectedEmployees.length === 0}
                icon={<Check className="size-4" />}
              >
                Tanlash
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSelectModal;
