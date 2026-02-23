import React from "react";
import { Modal } from "antd";
import FilePreviewer from "@/components/FilePreviewer/FilePreviewer";

interface FileItem {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
}

interface FilePreviewModalProps {
  open: boolean;
  file: FileItem | null;
  onClose: () => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  open,
  file,
  onClose,
}) => {
  if (!file || !open) {
    return null;
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      title={file.name}
      centered
      bodyStyle={{ padding: 0, height: "65vh" }}
    >
      <PreviewContent fileUrl={file.url} fileName={file.name} />
    </Modal>
  );
};

interface PreviewContentProps {
  fileUrl: string;
  fileName: string;
}

const PreviewContent: React.FC<PreviewContentProps> = ({
  fileUrl,
  fileName,
}) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadFile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const blob = await response.blob();
        const fileObj = new File([blob], fileName, { type: blob.type });
        setFile(fileObj);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load file preview"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadFile();
  }, [fileUrl, fileName]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-600">
        Loading preview...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-600 p-4">
        <div className="text-center">
          <p className="font-medium">Error loading preview</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-600">
        No file available
      </div>
    );
  }

  return (
    <FilePreviewer
      file={file}
      className="w-full h-full"
      style={{ padding: 0 }}
    />
  );
};

export default FilePreviewModal;
