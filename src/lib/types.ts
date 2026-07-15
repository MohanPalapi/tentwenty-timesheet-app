export type TimesheetStatus = "Draft" | "Submitted" | "Approved" | "Rejected";

export interface TimesheetEntry {
  id: string;
  weekNumber: number;
  date: string; // ISO date string, e.g. "2026-07-14"
  status: TimesheetStatus;
  hoursLogged?: number;
  notes?: string;
}

// Shape used by the Add/Edit form before an id is assigned
export type TimesheetFormValues = Omit<TimesheetEntry, "id">;