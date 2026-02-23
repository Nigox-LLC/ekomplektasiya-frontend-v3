import React, { useState, useRef, useEffect } from "react";

interface ResizableTableColumnProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  minWidth?: number;
  defaultWidth?: number;
  onWidthChange?: (width: number) => void;
  [key: string]: any;
}

const ResizableTableColumn: React.FC<ResizableTableColumnProps> = ({ children, className = "",  style = {},   minWidth = 100, defaultWidth, onWidthChange, ...props }) => {
  const [width, setWidth] = useState(defaultWidth || minWidth);
  const [isResizing, setIsResizing] = useState(false);
  const thRef = useRef<HTMLTableCellElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  useEffect(() => {
    if (defaultWidth) {
      setWidth(defaultWidth);
    }
  }, [defaultWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const delta = e.clientX - startXRef.current;
      const newWidth = Math.max(minWidth, startWidthRef.current + delta);
      setWidth(newWidth);
      
      if (onWidthChange) {
        onWidthChange(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, minWidth, onWidthChange]);

  return (
    <th
      ref={thRef}
      className={`${className} relative group`}
      style={{ ...style, width: `${width}px`, minWidth: `${width}px` }}
      {...props}
    >
      {children}
      <div
        className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 transition-colors ${
          isResizing ? "bg-blue-500" : "bg-transparent"
        } group-hover:bg-blue-300`}
        onMouseDown={handleMouseDown}
        style={{ userSelect: "none" }}
      />
    </th>
  );
}

export default ResizableTableColumn;