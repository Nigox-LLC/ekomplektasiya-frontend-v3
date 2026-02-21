import React from "react";
import GenStatistics from "../DashboardStats/GenStatistics";
import EmployeeStatistics from "../Employee/EmployeeStatistics";

const Dashboard: React.FC = () => {
  return (
    <>
      <div className="flex flex-col gap-6">
        <GenStatistics hasAccess={() => true} />
        <EmployeeStatistics hasAccess={() => true} />
      </div>
    </>
  );
};

export default Dashboard;
