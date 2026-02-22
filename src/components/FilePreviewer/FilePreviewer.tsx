// import { X } from "lucide-react";
// import React from "react";

// interface IProps {
//   selectedFileURL: string | null;
//   setselectedFileURL: React.Dispatch<React.SetStateAction<string | null>>;
// }

// const FilePreviewer: React.FC<IProps> = ({
//   selectedFileURL,
//   setselectedFileURL,
// }) => {
//   return (
//     <>
//       <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
//           {/* Header */}
//           <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-bold text-gray-900">PDF Ko'rish</h2>
//             <button
//               onClick={() => setselectedFileURL(null)}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <X className="size-5 text-gray-600" />
//             </button>
//           </div>

//           {/* PDF Viewer */}
//           <div className="flex-1 overflow-hidden">
//             <iframe
//               src={selectedFileURL || undefined}
//               className="w-full h-full"
//               title="PDF Viewer"
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default FilePreviewer;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import * as XLSX from "xlsx";
import { inferMimeFromExt } from "@/utils/file_preview";

type Props = { file: File; className?: string; style?: React.CSSProperties };

export default function FilePreviewer({ file, className, style }: Props) {
  const [url, setUrl] = useState<string>();
  const [htmlContent, setHtmlContent] = useState<string>("");

  const ext = useMemo(
    () => (file?.name.split(".").pop() || "").toLowerCase(),
    [file?.name]
  );

  /* ===== Blob URL lifecycle ===== */
  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  /* ===== DOCX / DOCM ===== */
  const wordRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!["docx", "docm"].includes(ext) || !wordRef.current) return;

    wordRef.current.innerHTML = "";
    renderAsync(file, wordRef.current, undefined, {
      className: "docx",
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      breakPages: false,
      useBase64URL: true,
      experimental: true,
    }).catch((e) => {
      wordRef.current!.innerHTML = `
        <div style="color:#dc2626;padding:12px">
          Word faylni ochib bo‘lmadi: ${String(e)}
        </div>`;
    });
  }, [file, ext]);

  /* ===== XLS / XLSX ===== */
  const xlsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!xlsRef.current || !["xlsx", "xls"].includes(ext)) return;

    xlsRef.current.innerHTML = "";
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const wb = XLSX.read(new Uint8Array(reader.result as ArrayBuffer), {
          type: "array",
        });
        const first = wb.Sheets[wb.SheetNames[0]];
        const html = XLSX.utils.sheet_to_html(first, { editable: false });
        xlsRef.current!.innerHTML = html;

        xlsRef.current!.querySelectorAll("td,th").forEach((el) => {
          (el as HTMLElement).style.border = "1px solid #e5e7eb";
          (el as HTMLElement).style.padding = "6px 8px";
        });
      } catch (e) {
        xlsRef.current!.innerHTML = `
          <div style="color:#dc2626;padding:12px">
            Excel ochilmadi: ${String(e)}
          </div>`;
      }
    };

    reader.readAsArrayBuffer(file);
  }, [file, ext]);

  /* ===== TEXT (txt, csv, json, md, log) ===== */
  const textRef = useRef<HTMLPreElement>(null);
  useEffect(() => {
    if (!textRef.current) return;
    if (!["txt", "csv", "json", "md", "log"].includes(ext)) return;

    const reader = new FileReader();
    reader.onload = () => {
      textRef.current!.textContent = String(reader.result ?? "");
    };
    reader.readAsText(file);
  }, [file, ext]);

  /* ===== HTML ===== */
  useEffect(() => {
    if (!["html", "htm"].includes(ext)) return;

    const reader = new FileReader();
    reader.onload = () => {
      setHtmlContent(String(reader.result ?? ""));
    };
    reader.readAsText(file);
  }, [file, ext]);

  /* ===================== RENDER ===================== */

  /* PDF */
  if (ext === "pdf" && url) {
    return (
      <iframe
        title={file.name}
        src={url}
        className={className}
        style={{ width: "100%", height: "100%", border: 0, ...style }}
      />
    );
  }

  /* Images */
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext) && url) {
    return (
      <div className={className} style={{ overflow: "auto", ...style }}>
        <img
          src={url}
          alt={file.name}
          style={{ maxWidth: "100%", margin: "0 auto", display: "block" }}
        />
      </div>
    );
  }

  /* HTML */
  if (["html", "htm"].includes(ext)) {
    return (
      <iframe
        title={file.name}
        srcDoc={htmlContent}
        sandbox="allow-same-origin allow-forms allow-popups allow-modals"
        className={className}
        style={{
          width: "100%",
          height: "100%",
          border: "1px solid #e5e7eb",
          background: "white",
          ...style,
        }}
      />
    );
  }

  /* DOCX */
  if (["docx", "docm"].includes(ext)) {
    return (
      <div
        ref={wordRef}
        className={className}
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          background: "white",
          padding: 16,
          ...style,
        }}
      />
    );
  }

  /* Excel */
  if (["xlsx", "xls"].includes(ext)) {
    return (
      <div
        ref={xlsRef}
        className={className}
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          background: "white",
          padding: 16,
          ...style,
        }}
      />
    );
  }

  /* TXT */
  if (["txt", "csv", "json", "md", "log"].includes(ext)) {
    return (
      <pre
        ref={textRef}
        className={className}
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          padding: 16,
          margin: 0,
          background: "white",
          ...style,
        }}
      />
    );
  }

  /* DOC (old) */
  if (ext === "doc") {
    return (
      <div className={className} style={{ padding: 16, ...style }}>
        <p style={{ color: "#b45309" }}>
          .DOC (97–2003) web’da preview qilinmaydi. PDF/DOCX ga konvert qiling.
        </p>
      </div>
    );
  }

  /* Fallback */
  const mime =
    file?.type || inferMimeFromExt(file?.name) || "application/octet-stream";

  return (
    <div className={className} style={{ padding: 16, ...style }}>
      <p>Bu turdagi fayl uchun preview mavjud emas.</p>
      <p style={{ color: "#6b7280" }}>MIME: {mime}</p>
    </div>
  );
}
