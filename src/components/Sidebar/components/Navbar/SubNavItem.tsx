import React from "react";
import type { SidebarMenuItem } from "../SidebarNav";
import { useNavigate, useLocation } from "react-router";

interface IProps {
  subItem: SidebarMenuItem;
  itemID: string;
  counts: SidebarCounts | null;
}

const SubNavItem: React.FC<IProps> = React.memo(
  ({ subItem, itemID, counts }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = () => {
      const pathname = location.pathname;
      return pathname.includes(`${itemID}/${subItem.id}`) || pathname.endsWith(`/${subItem.id}`);
    };

    const subItemCounts = () => {
      if (!counts) return null;

      switch (subItem.id) {
        case "all_count":
          return counts[`${itemID === "outgoing" ? "out" : "in"}`].all_count;
        case "executing":
          return counts[`${itemID === "outgoing" ? "out" : "in"}`].executing;
        case "for_above":
          return counts[`${itemID === "outgoing" ? "out" : "in"}`].for_above;
        case "for_information":
          return counts[`${itemID === "outgoing" ? "out" : "in"}`]
            .for_information;
        case "in_approval":
          return counts[`${itemID === "outgoing" ? "out" : "in"}`].in_approval;
        case "in_signing":
          return counts[`${itemID === "outgoing" ? "out" : "in"}`].in_signing;
        default:
          return null;
      }
    };

    return (
      <div
        key={subItem.id}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
          isActive() ? "bg-blue-600 text-white" : "hover:bg-gray-800"
        }`}
        onClick={() => navigate(`${itemID}/${subItem.id}`)}
      >
        {subItem.icon}
        <span>{subItem.label}</span>

        {typeof subItemCounts() === "number" && (
          <span className="ml-auto bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            {subItemCounts()}
          </span>
        )}
      </div>
    );
  },
);

export default SubNavItem;
