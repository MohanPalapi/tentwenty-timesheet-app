"use client";

import { useState } from "react";
import { TimesheetEntry, TimesheetFormValues } from "@/lib/types";
import { TimesheetModal } from "./TimesheetModal";

interface TimesheetTableProps {
  initialEntries: TimesheetEntry[];
}

const statusStyles: Record<string, string> = {
  Draft: "bg-gray-100 text-gray-700",
  Submitted: "bg-blue-100 text-blue-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

export function TimesheetTable({ initialEntries }: TimesheetTableProps) {
  const [entries, setEntries] = useState<TimesheetEntry[]>(initialEntries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | null>(null);

  function openAddModal() {
    setEditingEntry(null);
    setIsModalOpen(true);
  }

  function openEditModal(entry: TimesheetEntry) {
    setEditingEntry(entry);
    setIsModalOpen(true);
  }

  async function handleSave(values: TimesheetFormValues) {
    if (editingEntry) {
      // Editing an existing entry
      const res = await fetch(`/api/timesheets/${editingEntry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const updated = await res.json();
      setEntries((prev) =>
        prev.map((e) => (e.id === updated.id ? updated : e))
      );
    } else {
      // Creating a new entry
      const res = await fetch("/api/timesheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const created = await res.json();
      setEntries((prev) => [...prev, created]);
    }
    setIsModalOpen(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this timesheet entry?")) return;

    await fetch(`/api/timesheets/${id}`, { method: "DELETE" });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={openAddModal}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Entry
        </button>
      </div>

      {/* Table view on larger screens */}
      <div className="hidden overflow-hidden rounded-lg border bg-white sm:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Week #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {entry.weekNumber}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {entry.date}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[entry.status]}`}
                  >
                    {entry.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <button
                    onClick={() => openEditModal(entry)}
                    className="mr-3 text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                  No timesheet entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card view on small screens */}
      <div className="space-y-3 sm:hidden">
        {entries.map((entry) => (
          <div key={entry.id} className="rounded-lg border bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-gray-900">
                Week {entry.weekNumber}
              </span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[entry.status]}`}
              >
                {entry.status}
              </span>
            </div>
            <p className="mb-3 text-sm text-gray-600">{entry.date}</p>
            <div className="flex gap-4 text-sm">
              <button onClick={() => openEditModal(entry)} className="text-blue-600">
                Edit
              </button>
              <button onClick={() => handleDelete(entry.id)} className="text-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <TimesheetModal
          initialValues={editingEntry ?? undefined}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}