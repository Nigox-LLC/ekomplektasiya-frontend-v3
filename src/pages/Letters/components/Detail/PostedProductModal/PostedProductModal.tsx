import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, message, Spin, DatePicker, Upload, Image } from "antd";
import { Send, X, Calendar, Image as ImageIcon, FileText, UploadCloud, Trash2 } from "lucide-react";
import { axiosAPI } from "@/service/axiosAPI";
import type { UploadFile, UploadProps } from "antd/es/upload";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

interface Category {
  id: string;
  name: string;
}

interface PostedWebsiteData {
  id: number;
  title: string;
  text: string;
  description?: string | null;
  category_id: string;
  category_name: string;
  posted_file_url?: string | null;
  file_pdf?: string | null;
  created_at: string;
}

interface PostedProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productModel?: string;
  orderProductId: number;
  existingPost?: PostedWebsiteData | null; // new prop
  onSuccess?: () => void;
}

export const PostedProductModal: React.FC<PostedProductModalProps> = ({
  isOpen,
  onClose,
  productName,
  productModel,
  orderProductId,
  existingPost,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(false);

  // File states for create mode
  const [imageFile, setImageFile] = useState<UploadFile | null>(null);
  const [pdfFile, setPdfFile] = useState<UploadFile | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);

  const isViewMode = !!existingPost;

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Populate form and previews when existingPost changes
  // useEffect(() => {
  //   if (isOpen) {
  //     if (existingPost) {
  //       // View mode
  //       form.setFieldsValue({
  //         title: existingPost.title,
  //         text: existingPost.text,
  //         description: existingPost.description,
  //         category_id: existingPost.category_id,
  //         posted_date: dayjs(existingPost.created_at),
  //       });
  //       setImagePreview(existingPost.posted_file_url || null);
  //       setPdfUrl(existingPost.file_pdf || null);
  //       setImageFile(null);
  //       setPdfFile(null);
  //     } else {
  //       // Create mode – set default title
  //       form.setFieldsValue({
  //         title: `${productName} ${productModel ? `(${productModel})` : ""}`,
  //         posted_date: dayjs(),
  //       });
  //       setImagePreview(null);
  //       setPdfUrl(null);
  //       setImageFile(null);
  //       setPdfFile(null);
  //     }
  //   }
  // }, [isOpen, existingPost, productName, productModel, form]);

  useEffect(() => {
    if (isOpen && existingPost && categories.length > 0) {
      form.setFieldsValue({
        title: existingPost.title,
        text: existingPost.text,
        description: existingPost.description,
        category_id: existingPost.category_id, // string "1"
        posted_date: dayjs(existingPost.created_at),
      });
  
      setImagePreview(existingPost.posted_file_url || null);
      setPdfUrl(existingPost.file_pdf || null);
    }
  }, [isOpen, existingPost, categories]);
  

  const fetchCategories = async () => {
    setFetchingCategories(true);
    try {
      const response = await axiosAPI.get("https://backend.hits-uk.uz/api/category/");
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Kategoriyalarni yuklashda xatolik yuz berdi");
    } finally {
      setFetchingCategories(false);
    }
  };

  // Image upload props (only used in create mode)
  const imageUploadProps: UploadProps = {
    accept: "image/*",
    maxCount: 1,
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Faqat rasm fayllarini yuklash mumkin!");
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Rasm hajmi 5MB dan kichik bo'lishi kerak!");
        return Upload.LIST_IGNORE;
      }

      setImageFile({
        uid: file.uid,
        name: file.name,
        status: "done",
        originFileObj: file as any,
      });

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      return false; // Prevent auto upload
    },
  };

  // PDF upload props (only used in create mode)
  const pdfUploadProps: UploadProps = {
    accept: ".pdf",
    maxCount: 1,
    showUploadList: false,
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf");
      if (!isPDF) {
        message.error("Faqat PDF fayllarini yuklash mumkin!");
        return Upload.LIST_IGNORE;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("PDF hajmi 10MB dan kichik bo'lishi kerak!");
        return Upload.LIST_IGNORE;
      }

      setPdfFile({
        uid: file.uid,
        name: file.name,
        status: "done",
        originFileObj: file as any,
      });

      return false;
    },
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const removePDF = () => {
    setPdfFile(null);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const selectedCategory = categories.find(
        (cat) => cat.id === values.category_id
      );

      const formData = new FormData();
      formData.append("order_product_id", orderProductId.toString());
      formData.append("title", values.title);
      formData.append("text", values.text);
      formData.append("category_id", values.category_id);
      formData.append("category_name", selectedCategory?.name || "");
      if (values.description) {
        formData.append("description", values.description);
      }
      if (values.posted_date) {
        formData.append("posted_date", values.posted_date.format("YYYY-MM-DD"));
      }
      if (imageFile?.originFileObj) {
        formData.append("file", imageFile.originFileObj);
      }
      if (pdfFile?.originFileObj) {
        formData.append("file_pdf", pdfFile.originFileObj);
      }

      const response = await axiosAPI.post(
        "document/orders/posted/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201 || response.status === 200) {
        message.success("Mahsulot muvaffaqiyatli saytga joylandi!");
        form.resetFields();
        setImageFile(null);
        setPdfFile(null);
        setImagePreview(null);
        setPdfUrl(null);
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      console.error("Error posting product:", error);
      if (error.response?.data) {
        const errors = error.response.data;
        let errorMessage = "Xatolik yuz berdi";
        if (errors.order_product_id) {
          errorMessage = `Order Product ID: ${errors.order_product_id.join(", ")}`;
        } else if (errors.detail) {
          errorMessage = errors.detail;
        } else {
          errorMessage = JSON.stringify(errors);
        }
        message.error(errorMessage);
      } else {
        message.error("Xatolik yuz berdi, qaytadan urinib ko'ring");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImageFile(null);
    setPdfFile(null);
    setImagePreview(null);
    setPdfUrl(null);
    setPdfPreviewVisible(false);
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <Send className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 m-0">
              {isViewMode ? "Saytga joylangan ma'lumot" : "Saytga joylash"}
            </h3>
            <p className="text-sm text-gray-500 m-0">
              {isViewMode
                ? "Mahsulot saytga joylangan ma'lumotlari"
                : "Mahsulotni saytda e'lon qilish"}
            </p>
          </div>
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
      className="posted-product-modal"
      styles={{
        body: { padding: "24px" },
        header: { padding: "16px 24px", borderBottom: "none" },
        content: { borderRadius: "16px", overflow: "hidden" },
      }}
      closeIcon={<X className="w-5 h-5 text-gray-400 hover:text-gray-600" />}
    >
      <Spin spinning={fetchingCategories} tip="Kategoriyalar yuklanmoqda...">
        <Form form={form} layout="vertical" className="space-y-5" onFinish={handleSubmit}>
          {/* Title */}
          <Form.Item
            name="title"
            label={<span className="text-sm font-medium text-gray-700">E'lon sarlavhasi</span>}
            rules={[{ required: true, message: "Sarlavhani kiriting" }, { min: 3 }]}
          >
            <Input
              placeholder="Masalan: Yangi mahsulot e'lon qilindi"
              className="h-11 rounded-lg"
              maxLength={200}
              showCount
              disabled={isViewMode}
            />
          </Form.Item>

          {/* Date and Category */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="posted_date"
              label={<span className="text-sm font-medium text-gray-700">E'lon sanasi</span>}
              rules={[{ required: true, message: "Sanani tanlang" }]}
              className="mb-0"
            >
              <DatePicker
                className="w-full h-11 rounded-lg"
                format="DD.MM.YYYY"
                placeholder="Sanani tanlang"
                suffixIcon={<Calendar className="w-4 h-4 text-gray-400" />}
                disabled={isViewMode}
              />
            </Form.Item>

            <Form.Item
              name="category_id"
              label={<span className="text-sm font-medium text-gray-700">Kategoriya</span>}
              rules={[{ required: true, message: "Kategoriyani tanlang" }]}
              className="mb-0"
            >
              <Select
                placeholder="Kategoriyani tanlang"
                className="h-11"
                loading={fetchingCategories}
                showSearch
                optionFilterProp="children"
                disabled={isViewMode}
                dropdownStyle={{ borderRadius: "8px" }}
              >
                {categories.map((cat) => (
                  <Option key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2 py-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-gray-700">{cat.name}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Description */}
          <Form.Item
            name="text"
            label={<span className="text-sm font-medium text-gray-700">Mahsulot haqida</span>}
            rules={[{ required: true, message: "Ma'lumot kiriting" }, { min: 10 }]}
          >
            <TextArea
              placeholder="Mahsulot tavsifi, xususiyatlari..."
              rows={4}
              className="rounded-lg resize-none"
              maxLength={1000}
              showCount
              disabled={isViewMode}
            />
          </Form.Item>

          {/* Image Section */}
          {isViewMode ? (
            // View mode: show image with preview
            imagePreview && (
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 block mb-2">Rasm</label>
                <Image
                  src={imagePreview}
                  alt="Product"
                  className="rounded-lg border border-gray-200 max-h-64 object-contain"
                  preview={{ mask: 'Katta ko\'rinish' }}
                />
              </div>
            )
          ) : (
            // Create mode: upload controls
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Rasm yuklash</label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <Upload {...imageUploadProps}>
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                      <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Rasm</span>
                    </div>
                  </Upload>
                )}
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Mahsulot rasmini yuklang</p>
                  <p className="text-xs text-gray-400">JPG, PNG, GIF (max 5MB)</p>
                </div>
              </div>
            </div>
          )}

          {/* PDF Section */}
          {isViewMode ? (
            // View mode: show PDF with preview button
            pdfUrl && (
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 block mb-2">PDF hujjat</label>
                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {pdfUrl.split('/').pop() || 'Hujjat.pdf'}
                    </p>
                    <p className="text-xs text-gray-500">PDF fayl</p>
                  </div>
                  <Button
                    type="link"
                    onClick={() => setPdfPreviewVisible(true)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Ko‘rish
                  </Button>
                </div>
              </div>
            )
          ) : (
            // Create mode: PDF upload
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">PDF yuklash</label>
              {pdfFile ? (
                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{pdfFile.name}</p>
                    <p className="text-xs text-gray-500">PDF fayl</p>
                  </div>
                  <button
                    type="button"
                    onClick={removePDF}
                    className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Upload {...pdfUploadProps}>
                  <div className="w-full h-14 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-3 cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all">
                    <UploadCloud className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">PDF faylni tanlang</span>
                    <span className="text-xs text-gray-400">(max 10MB)</span>
                  </div>
                </Upload>
              )}
            </div>
          )}

          {/* PDF Preview Modal */}
          <Modal
            title="PDF hujjat"
            open={pdfPreviewVisible}
            onCancel={() => setPdfPreviewVisible(false)}
            footer={null}
            width={800}
            styles={{ body: { height: '80vh' } }}
          >
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              className="w-full h-full"
              title="PDF preview"
            />
          </Modal>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              onClick={handleCancel}
              className="h-11 px-6 rounded-lg border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 font-medium"
              disabled={submitting}
            >
              {isViewMode ? "Yopish" : "Bekor qilish"}
            </Button>
            {!isViewMode && (
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={submitting}
                className="h-11 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                icon={<Send className="w-4 h-4" />}
              >
                {submitting ? "Yuborilmoqda..." : "Saytga joylash"}
              </Button>
            )}
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default PostedProductModal;