import React from "react";
import { useEmployeeData } from "../hooks/useEmployeeData";
import ClientSummaryPage from "../component/ClientSummaryPage";

const SummaryPage = () => {
  const { rows, UI_HEADERS } = useEmployeeData();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Client Summary</h1>
      <ClientSummaryPage rows={rows} clientHeader="Client" />
    </div>
  );
};

export default SummaryPage;
