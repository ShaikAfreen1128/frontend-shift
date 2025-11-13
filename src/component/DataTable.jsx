import React, { useState, useEffect, useMemo } from "react";
import EmployeeModal from "./EmployeModel";
import { useNavigate } from "react-router-dom";

const DataTable = ({ headers, rows }) => {
  const [originalRows, setOriginalRows] = useState([]);
  const [displayedRows, setDisplayedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [sortState, setSortState] = useState({ header: null, direction: null });
  const [modelOpen, setModelOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const navigate = useNavigate();

  const totalPages = Math.ceil(displayedRows.length / limit);
  const skip = (page - 1) * limit;
  const paginatedRows = useMemo(() => displayedRows.slice(skip, skip + limit), [displayedRows, skip, limit]);

  const getUniqueRows = (rows) => {
    const seen = new Set();
    return rows.filter((row) => {
      const key = `${row["Emp ID"]}-${row["Emp Name"]}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  useEffect(() => {
    const uniqueRows = getUniqueRows(rows);
    setOriginalRows(uniqueRows);
    setDisplayedRows(uniqueRows.map((r) => ({ ...r, _isMatch: false })));
  }, [rows]);

  const sortRows = (data, header, direction) => {
    if (!direction || direction === "reset") return [...data];

    return [...data].sort((a, b) => {
      const aVal = ((a[header] || "") + "").toLowerCase().trim();
      const bVal = ((b[header] || "") + "").toLowerCase().trim();
      if (direction === "asc") return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      if (direction === "desc") return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      return 0;
    });
  };

  const moveMatchesToTop = (data, query) => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return data.map((row) => ({ ...row, _isMatch: false }));

    const matched = [];
    const unmatched = [];

    data.forEach((row) => {
      const isMatch = headers.some((header) =>
        (row[header] || "").toString().toLowerCase().includes(lowerQuery)
      );
      if (isMatch) matched.push({ ...row, _isMatch: true });
      else unmatched.push({ ...row, _isMatch: false });
    });

    return [...matched, ...unmatched];
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);

    let rowsToDisplay =
      sortState.header && sortState.direction && sortState.direction !== "reset"
        ? sortRows([...originalRows], sortState.header, sortState.direction)
        : [...originalRows];

    rowsToDisplay = moveMatchesToTop(rowsToDisplay, query);

    const hasMatch = rowsToDisplay.some((row) => row._isMatch);
    setDisplayedRows(query && !hasMatch ? [] : rowsToDisplay);
  };

  const handleSort = (header, direction) => {
    setSortState({ header, direction });
    let rowsToDisplay =
      direction === "reset"
        ? [...originalRows]
        : sortRows([...originalRows], header, direction);

    const lowerQuery = searchQuery.toLowerCase().trim();
    rowsToDisplay = rowsToDisplay.map((row) => ({
      ...row,
      _isMatch: lowerQuery
        ? headers.some((h) =>
            (row[h] || "").toString().toLowerCase().includes(lowerQuery)
          )
        : false,
    }));

    setDisplayedRows(rowsToDisplay);
    setActiveMenu(null);
  };

  const handleIndividualEmployee = (employee) => {
    setSelectedEmployee(employee);
    setModelOpen(true);
  };

  const sortableHeaders = ["Emp ID", "Emp Name"];

  return (
    <div className="relative max-h-[500px] overflow-y-auto overflow-x-hidden border border-gray-300 rounded-lg shadow-sm p-4">

      {/* Header + Summary Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Employee Data</h1>
        <button
          onClick={() => navigate("/summary", { state: { data: displayedRows } })}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Summary
        </button>
      </div>
      
    {/* Search - only visible after file upload */}
{rows && rows.length > 0 && (
  <div className="mb-4 flex items-center gap-3">
    <input
      type="text"
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => handleSearch(e.target.value)}
      className="w-1/3 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
    />
  </div>
)}

    {/* Table */}
      <table className="w-full border-collapse text-sm text-gray-800">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap relative"
              >
                <div className="flex justify-between items-center">
                  <span>{header}</span>
                  {sortableHeaders.includes(header) && (
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setActiveMenu(activeMenu === header ? null : header)
                        }
                        className="px-1 py-0.5 text-gray-500 hover:text-gray-700 font-bold"
                      >
                        ⋮
                      </button>
                      {activeMenu === header && (
                        <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-300 rounded shadow-lg z-20">
                          <ul className="text-sm">
                            <li
                              className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSort(header, "asc")}
                            >
                              A-Z
                            </li>
                            <li
                              className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSort(header, "desc")}
                            >
                              Z-A
                            </li>
                            <li
                              className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSort(header, "reset")}
                            >
                              Reset
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedRows.length > 0 ? (
            paginatedRows.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => {
                  handleIndividualEmployee(row)
                  console.log(row)
                }}
                className={`transition-colors duration-150 cursor-pointer ${
                  row._isMatch ? "bg-green-100 border-l-4 border-green-500" : ""
                }`}
              >
                {headers.map((header) => (
                  <td
                    key={header}
                    className="border border-gray-200 px-4 py-2 text-gray-700 max-w-[180px] truncate"
                    title={row[header]}
                  >
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center py-4 text-gray-500 italic">
                No matching records found for "{searchQuery}"
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2 border-t bg-gray-50 sticky bottom-0">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Rows per page:</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:ring-1 focus:ring-blue-400"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2 py-1 text-sm text-gray-700 border rounded-md disabled:opacity-50 hover:bg-gray-100"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="px-2 py-1 text-sm text-gray-700 border rounded-md disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {modelOpen && (
        <EmployeeModal
          employee={selectedEmployee}
          headers={selectedEmployee ? Object.keys(selectedEmployee) : headers}
          onClose={() => setModelOpen(false)}
        />
      )}
    </div>
  );
};

export default DataTable;
