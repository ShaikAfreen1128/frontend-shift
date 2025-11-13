import React, { useState } from "react";

const EmployeeModal = ({ employee, headers, onClose, onSave }) => {
  if (!employee) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({ ...employee });

  const handleChange = (header, value) => {
    setEditableData({ ...editableData, [header]: value });
  };

  const handleSave = () => {
    onSave && onSave(editableData); 
    setIsEditing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEditing ? "Edit Employee – " : "Employee Details – "}
            {employee["Emp Name"] || "N/A"}
          </h2>
          <button
            onClick={() => {
              if (isEditing) {
                setIsEditing(false);
                setEditableData({ ...employee }); 
              } else {
                onClose();
              }
            }}
            className="text-gray-500 hover:text-gray-700 font-bold text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
          {/* {headers.map((header) => { */}
          {headers
             .filter((header) => header !== "_isMatch").map((header) => {

            const isReadonly = header === "Emp ID" || header === "Emp Name" || header === "Department" || header === "Project" || header === "Project Code" || header === "Account Manager" || header === "Current Status(e)" || header === "Client" || header === "Practice Lead/ Head" || header === "Delivery/ Project Manager" || header === "Duration Month" || header === "Payroll Month" || header === "# Shift Types(e)" || header === "TOTAL DAYS" || header === "Timesheet Billable Days" || header === "Timesheet Non Billable Days" || header === "Diff" || header === "Grade" || header === "Final Total Days" || header === "Billability Status" || header === "Practice Remarks" || header === "RMG Comments" || header === "Amar Approval" || header === "Shift A Allowances" || header === "Shift B Allowances"||header==="Shift C Allowances" || header === "Prime Allowances" || header ==="TOTAL DAYS Allowances" ||header === "AM Email Attempt(e)" || header === "AM Approval Status(e)" || header === "error" || header === "_isMatch";

            return (
              <div key={header} className="flex flex-col">
                <p className="text-xs text-gray-500 font-medium">{header}</p>

                {isEditing && !isReadonly ? (
                  <input
                    type="text"
                    value={editableData[header] || ""}
                    onChange={(e) => handleChange(header, e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                  />
                ) : (
                  <p
                    className="text-sm text-gray-800 truncate"
                    title={editableData[header] || ""}
                  >
                    {editableData[header] || "-"}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditableData({ ...employee }); 
                }}
                className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
