import React from "react";
import type { SidebarMenuItem } from "../SidebarNav";
import { useNavigate, useLocation } from "react-router";
import { ChevronDown } from "lucide-react";
import SubNavItem from "./SubNavItem";

interface IProps {
  item: SidebarMenuItem;
  setExpandedSection: React.Dispatch<React.SetStateAction<string | null>>;
  expandedSection: string | null;
  counts: SidebarCounts | null;
}

const NavItem: React.FC<IProps> = React.memo(
  ({ item, setExpandedSection, expandedSection, counts }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = () => {
      const pathname = location.pathname.split("/").pop() || "";
      return (
        pathname === item.id.replace("/", "") ||
        (location.pathname === "/" && item.id === "/")
      );
    };

    const itemCounts = () => {
      if (!counts) return null;

      switch (item.id) {
        case "outgoing":
          return counts.out.all_count;
        case "incoming":
          return counts.in.all_count;
        case "my_letter":
          return counts.my_letter;
        default:
          return null;
      }
    };

    return (
      <div key={item.id} className="mb-2">
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            isActive()
              ? "bg-blue-600 text-white"
              : expandedSection === item.id
                ? "bg-gray-700"
                : "hover:bg-gray-800"
          }`}
          onClick={() => {
            if (item.subItems) {
              setExpandedSection(expandedSection === item.id ? null : item.id);
            } else {
              navigate(`${item.id}`);
            }
          }}
        >
          {item.icon}
          <span>{item.label}</span>
          {item.subItems ? (
            <ChevronDown
              className={`size-4 ml-auto transition-transform ${expandedSection === item.id ? "rotate-180" : ""}`}
            />
          ) : (
            itemCounts() && (
              <span className="ml-auto bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {itemCounts()}
              </span>
            )
          )}
        </div>
        {expandedSection === item.id && item.subItems && (
          <div className="ml-6 mt-2">
            {item.subItems.map((subItem) => (
              <SubNavItem
                key={subItem.id}
                subItem={subItem}
                itemID={item.id}
                counts={counts}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

export default NavItem;
