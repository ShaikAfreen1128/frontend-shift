import React from "react";
import { useLocation } from "react-router-dom";

const ClientSummaryPage = () => {
  const location = useLocation();
  const data = location.state?.data || [];

  const rows = Array.isArray(data) ? data : [data];
  console.log("Received rows:", rows);

  const summary = {};

  rows.forEach((row) => {
    const client = row["Client"] || "Unknown Client";

    if (!summary[client]) {
      summary[client] = {
        employees: 0,
        shiftA: 0,
        shiftB: 0,
        shiftC: 0,
        prime: 0,
        totalAllowances: 0,
      };
    }
    const toNumber = (value) => {
      if (!value) return 0;
      return Number(String(value).replace(/[₹, ]/g, "").trim()) || 0;
    };

    summary[client].employees += 1;
    summary[client].shiftA += toNumber(row["Shift A (09 PM to 06 AM) INR 500"]);
    summary[client].shiftB += toNumber(row["Shift B (04 PM to 01 AM) INR 350"]);
    summary[client].shiftC += toNumber(row["Shift C (06 AM to 03 PM) INR 100"]);
    summary[client].prime += toNumber(row["Prime (12 AM to 09 AM) INR 700"]);
    summary[client].totalAllowances += toNumber(row["TOTAL DAYS Allowances"]);
  });

  const clients = Object.keys(summary);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Client Summary</h2>
      {clients.length === 0 ? (
        <p>No client data available.</p>
      ) : (
        <table className="border-collapse border border-gray-300 w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Client</th>
              <th className="border px-2 py-1">Employees</th>
              <th className="border px-2 py-1">Shift A (09 PM to 06 AM) INR 500</th>
              <th className="border px-2 py-1">Shift B (04 PM to 01 AM) INR 350</th>
              <th className="border px-2 py-1">Shift C (06 AM to 03 PM) INR 100</th>
              <th className="border px-2 py-1">Prime (12 AM to 09 AM) INR 700</th>
              <th className="border px-2 py-1">Total Allowances</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client}>
                <td className="border px-2 py-1">{client}</td>
                <td className="border px-2 py-1">{summary[client].employees}</td>
                <td className="border px-2 py-1">{summary[client].shiftA}</td>
                <td className="border px-2 py-1">{summary[client].shiftB}</td>
                <td className="border px-2 py-1">{summary[client].shiftC}</td>
                <td className="border px-2 py-1">{summary[client].prime}</td>
                <td className="border px-2 py-1">{summary[client].totalAllowances}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClientSummaryPage;
