import React from "react";
import type { SidebarMenuItem } from "../SidebarNav";
import { useNavigate } from "react-router";
import { ChevronDown } from "lucide-react";
import SubNavItem from "./SubNavItem";

interface IProps {
  item: SidebarMenuItem;
  setExpandedSection: React.Dispatch<React.SetStateAction<string | null>>;
  expandedSection: string | null;
}

const NavItem: React.FC<IProps> = React.memo(({
  item,
  setExpandedSection,
  expandedSection,
}) => {
  const navigate = useNavigate();
  return (
    <div key={item.id} className="mb-2">
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${expandedSection === item.id ? "bg-gray-700" : "hover:bg-gray-800"}`}
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
        {item.subItems && (
          <ChevronDown
            className={`size-4 ml-auto transition-transform ${expandedSection === item.id ? "rotate-180" : ""}`}
          />
        )}
      </div>
      {expandedSection === item.id && item.subItems && (
        <div className="ml-6 mt-2">
          {item.subItems.map((subItem) => (
            <SubNavItem subItem={subItem} itemID={item.id} />
          ))}
        </div>
      )}
    </div>
  );
});

export default NavItem;
