import { FileText, MoreVertical } from "lucide-react";
import React, { useState } from "react";

const MainDocument: React.FC = () => {
  return (
    <>
      <div className="flex items-center w-full">
        {/* Main document card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 w-full flex justify-between">
          {/* left side - document icon and title */}
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
              {/* Document icon */}
              <FileText />
            </div>
            <h2 className="text-lg font-semibold">Asosiy hujjat</h2>
          </div>

          {/* Right side - actions (preview, edit,download) three dot menu */}
          <div className="relative group">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreVertical size={20} />
            </button>
            <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button className="w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-50">
                Ko'rish
              </button>
              <button className="w-full text-left px-4 py-2 text-green-500 hover:bg-gray-50">
                Tahrirlash
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-500 hover:bg-gray-50">
                Yuklab olish
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainDocument;
