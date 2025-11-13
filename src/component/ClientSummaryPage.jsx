import React, { useEffect, useState } from "react";

const ClientSummaryPage = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch("http://localhost:8000/summary/client-shift-summary");

        if (!response.ok) {
          throw new Error("Failed to fetch summary data");
        }

        const data = await response.json();

        const transformed = data.map((item) => ({
          client: item.client,
          employees: item.total_employees,
          shiftA: item.shift_a_days,
          shiftB: item.shift_b_days,
          shiftC: item.shift_c_days,
          prime: item.prime_days,
        }));

        setSummaryData(transformed);
      } catch (err) {
        setError("Unable to fetch summary data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Client Summary</h2>

      {loading ? (
        <p>Loading summary data...</p>
      ) : (
        <table className="border-collapse border border-gray-300 w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Client</th>
              <th className="border px-2 py-1">Employees</th>
              <th className="border px-2 py-1">Shift A (09 PM to 06 AM)</th>
              <th className="border px-2 py-1">Shift B (04 PM to 01 AM)</th>
              <th className="border px-2 py-1">Shift C (06 AM to 03 PM)</th>
              <th className="border px-2 py-1">Prime (12 AM to 09 AM)</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan="7" className="text-center text-red-500 py-6 font-medium">
                  {error}
                </td>
              </tr>
            ) : summaryData.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500 font-medium">
                  No summary data available.
                </td>
              </tr>
            ) : (
              summaryData.map((item, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">{item.client}</td>
                  <td className="border px-2 py-1">{item.employees}</td>
                  <td className="border px-2 py-1">{item.shiftA}</td>
                  <td className="border px-2 py-1">{item.shiftB}</td>
                  <td className="border px-2 py-1">{item.shiftC}</td>
                  <td className="border px-2 py-1">{item.prime}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClientSummaryPage;
