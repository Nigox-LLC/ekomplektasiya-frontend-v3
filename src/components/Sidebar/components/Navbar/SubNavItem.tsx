import React from "react";
import type { SidebarMenuItem } from "../SidebarNav";
import { useNavigate } from "react-router";

interface IProps {
  subItem: SidebarMenuItem;
  itemID: string;
}

const SubNavItem: React.FC<IProps> = React.memo(({ subItem, itemID }) => {
  const navigate = useNavigate();
  return (
    <div
      key={subItem.id}
      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800"
      onClick={() => navigate(`${itemID}/${subItem.id}`)}
    >
      {subItem.icon}
      <span>{subItem.label}</span>
    </div>
  );
});

export default SubNavItem;
