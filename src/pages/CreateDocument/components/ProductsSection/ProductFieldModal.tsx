import { axiosAPI } from "@/service/axiosAPI";
import { Button, Table } from "antd";
import React, { useEffect } from "react";
import type { Product } from "../../CreateDocument";

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
  const [selectedValue, setSelectedValue] = React.useState<IDName | null>(() => {
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
  });

  const columns = [
    {
      title: "",
      dataIndex: "select",
      key: "select",
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
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
  ];

  const handleFetchProductFieldTypes = async () => {
    try {
      const response = await axiosAPI.get(
        `directory/${productFieldModal.type}/`,
      );
      if (response.status === 200) setProductFieldTypes(response.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (productFieldModal.type) {
      handleFetchProductFieldTypes();
    }
  }, [productFieldModal.type]);

  return (
    <>
      <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Maydonni tanlang</h2>
          {/* Modal content goes here */}
          <Table dataSource={productFieldTypes} columns={columns} rowKey="id" />

          <div className="flex items-center justify-end">
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
