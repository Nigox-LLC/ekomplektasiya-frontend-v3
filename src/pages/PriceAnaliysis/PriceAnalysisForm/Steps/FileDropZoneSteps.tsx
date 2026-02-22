import React, { useId, useState, type DragEvent, type ChangeEvent } from "react";
import { Trash2 } from "lucide-react";

interface FileDropZoneStepsProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const FileDropZoneSteps: React.FC<FileDropZoneStepsProps> = ({ file, setFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputId = useId();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <p className="text-gray-600">
            Faylni bu yerga tashlang yoki{" "}
            <label htmlFor={inputId} className="text-blue-500 underline cursor-pointer">
              tanlang
            </label>
          </p>
          <input type="file" id={inputId} onChange={handleFileChange} className="hidden" />
        </div>
      ) : (
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded border">
          <span className="text-sm truncate">{file.name}</span>
          <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700">
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileDropZoneSteps;