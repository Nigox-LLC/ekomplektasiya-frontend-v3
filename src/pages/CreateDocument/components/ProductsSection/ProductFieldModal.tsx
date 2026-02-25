import { axiosAPI } from "@/service/axiosAPI";
import { Button, Input, Table } from "antd";
import React, { useEffect, useRef } from "react";
import type { Product } from "../../External";

interface IProps {
  productFieldModal: {
    type:
      | "product/type"
      | "measurement/size"
      | "measurement/unit"
      | "product/model"
      | null;
    index: number;
  };
  onCancel: () => void;
  onSelect: (value: any) => void;
  products: Product[];
}

const ProductFieldModal: React.FC<IProps> = ({
  productFieldModal,
  onCancel,
  onSelect,
  products,
}) => {
  type ProductFieldKey =
    | "product_type"
    | "measurement_size"
    | "measurement_unit"
    | "product_model";

  const [productFieldTypes, setProductFieldTypes] = React.useState<
    { id: number; name: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState<IDName | null>(
    () => {
      const fieldKey: ProductFieldKey | undefined =
        productFieldModal.type === "product/type"
          ? "product_type"
          : productFieldModal.type === "measurement/size"
            ? "measurement_size"
            : productFieldModal.type === "measurement/unit"
              ? "measurement_unit"
              : productFieldModal.type === "product/model"
                ? "product_model"
                : undefined;

      if (!fieldKey) return null;

      const currentProduct = products[productFieldModal.index] as
        | Partial<Record<ProductFieldKey, IDName | null>>
        | undefined;

      return currentProduct?.[fieldKey] ?? null;
    },
  );

  // Pagination states
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(20);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const columns = [
    {
      title: "",
      dataIndex: "select",
      key: "select",
      width: 80,
      render: (_: any, record: { id: number; name: string }) => (
        <input
          type="radio"
          checked={selectedValue?.id === record.id}
          onChange={() =>
            setSelectedValue({
              id: record.id,
              name: record.name,
            })
          }
        />
      ),
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
  ];

  const handleFetchProductFieldTypes = async (
    page: number = 1,
    search: string = "",
  ) => {
    if (isLoading || isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await axiosAPI.get(
        `directory/${productFieldModal.type}/`,
        {
          params: {
            page: page,
            page_size: pageSize,
            ...(search && { search: search }),
          },
        },
      );

      if (response.status === 200) {
        const { results, count } = response.data;

        if (page === 1) {
          setProductFieldTypes(results);
        } else {
          setProductFieldTypes((prev) => [...prev, ...results]);
        }

        // Check if we have more data to fetch
        const totalLoaded = page * pageSize;
        setHasMore(totalLoaded < (count || 0));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Initial fetch when component mounts or type changes
  useEffect(() => {
    if (productFieldModal.type) {
      setCurrentPage(1);
      setProductFieldTypes([]);
      setHasMore(true);
      isFetchingRef.current = false;
      handleFetchProductFieldTypes(1, searchQuery);
    }
  }, [productFieldModal.type]);

  // Handle scroll event for infinite loading
  useEffect(() => {
    const tableElement = tableScrollRef.current?.querySelector(
      ".ant-table-body",
    ) as HTMLElement;

    if (!tableElement) return;

    const handleScroll = () => {
      const scrollTop = tableElement.scrollTop;
      const scrollHeight = tableElement.scrollHeight;
      const clientHeight = tableElement.clientHeight;

      // Trigger load more when user is near the bottom (within 50px)
      if (
        scrollHeight - (scrollTop + clientHeight) < 50 &&
        hasMore &&
        !isLoading
      ) {
        setCurrentPage((prev) => prev + 1);
      }
    };

    tableElement.addEventListener("scroll", handleScroll);

    return () => {
      tableElement.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, isLoading]);

  // Handle page change for infinite scroll
  useEffect(() => {
    if (currentPage > 1 && productFieldModal.type) {
      handleFetchProductFieldTypes(currentPage, searchQuery);
    }
  }, [currentPage]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Handle search - reset to first page with debounce
  const handleSearch = (value: string) => {
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout - wait 300ms after user stops typing
    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      setProductFieldTypes([]);
      setHasMore(true);
      isFetchingRef.current = false;
      handleFetchProductFieldTypes(1, value);
    }, 300);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-175">
          <h2 className="text-xl font-semibold mb-4">
            Kerakli{" "}
            {productFieldModal.type === "product/type"
              ? "tovar turi"
              : productFieldModal.type === "measurement/size"
                ? "o'lcham"
                : productFieldModal.type === "measurement/unit"
                  ? "o'lchov birligi"
                  : productFieldModal.type === "product/model"
                    ? "model"
                    : ""}
            ni tanlang
          </h2>
          <div className="mb-3">
            <Input
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </div>
          <div ref={tableScrollRef}>
            <Table
              dataSource={productFieldTypes}
              columns={columns}
              rowKey="id"
              pagination={false}
              scroll={{ y: 320 }}
              loading={isLoading && currentPage === 1}
              locale={{
                emptyText:
                  productFieldTypes.length === 0 && !isLoading
                    ? "Ma'lumot topilmadi"
                    : "",
              }}
            />
          </div>
          {isLoading && currentPage > 1 && (
            <div className="text-center py-2 text-sm text-gray-500">
              Yuklanmoqda...
            </div>
          )}
          {!hasMore && productFieldTypes.length > 0 && (
            <div className="text-center py-2 text-sm text-gray-400">
              Barcha ma'lumotlar yuklandi
            </div>
          )}

          <div className="flex items-center justify-end mt-4">
            <Button type="primary" onClick={() => onSelect(selectedValue)}>
              Tanlash
            </Button>
            <Button className="ml-2" onClick={onCancel}>
              Bekor qilish
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFieldModal;
