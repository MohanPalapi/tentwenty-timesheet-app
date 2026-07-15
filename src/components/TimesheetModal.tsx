"use client";

import { useState, FormEvent } from "react";
import { TimesheetEntry, TimesheetFormValues, TimesheetStatus } from "@/lib/types";

interface TimesheetModalProps {
  initialValues?: TimesheetEntry;
  onClose: () => void;
  onSave: (values: TimesheetFormValues) => Promise<void>;
}

const STATUS_OPTIONS: TimesheetStatus[] = [
  "Draft",
  "Submitted",
  "Approved",
  "Rejected",
];

export function TimesheetModal({
  initialValues,
  onClose,
  onSave,
}: TimesheetModalProps) {
  const isEditing = Boolean(initialValues);

  const [weekNumber, setWeekNumber] = useState(
    initialValues?.weekNumber?.toString() ?? ""
  );
  const [date, setDate] = useState(initialValues?.date ?? "");
  const [status, setStatus] = useState<TimesheetStatus>(
    initialValues?.status ?? "Draft"
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  function validate(): Record<string, string> {
    const newErrors: Record<string, string> = {};
    const weekNum = Number(weekNumber);

    if (!weekNumber) {
      newErrors.weekNumber = "Week number is required.";
    } else if (weekNum < 1 || weekNum > 53) {
      newErrors.weekNumber = "Week number must be between 1 and 53.";
    }

    if (!date) {
      newErrors.date = "Date is required.";
    }

    return newErrors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    await onSave({ weekNumber: Number(weekNumber), date, status });
    setIsSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isEditing ? "Edit Timesheet Entry" : "Add Timesheet Entry"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Week Number
            </label>
            <input
              type="number"
              min={1}
              max={53}
              value={weekNumber}
              onChange={(e) => setWeekNumber(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
            />
            {errors.weekNumber && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.weekNumber}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
            />
            {errors.date && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.date}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TimesheetStatus)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}