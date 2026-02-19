import { X } from "lucide-react";
import React from "react";

interface IProps {
  selectedFileURL: string | null;
  setselectedFileURL: React.Dispatch<React.SetStateAction<string | null>>;
}

const FilePreviewer: React.FC<IProps> = ({
  selectedFileURL,
  setselectedFileURL,
}) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">PDF Ko'rish</h2>
            <button
              onClick={() => setselectedFileURL(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="size-5 text-gray-600" />
            </button>
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 overflow-hidden">
            <iframe
              src={selectedFileURL || undefined}
              className="w-full h-full"
              title="PDF Viewer"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FilePreviewer;
