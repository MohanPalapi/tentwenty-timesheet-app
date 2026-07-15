import { TimesheetEntry } from "./types";

// In-memory store. In a real app this would live in a database.
// Module-level array persists for the lifetime of the server process
// (resets on server restart — acceptable for a mock/demo).
export const timesheets: TimesheetEntry[] = [
  {
    id: "1",
    weekNumber: 28,
    date: "2026-07-06",
    status: "Approved",
    hoursLogged: 40,
    notes: "Regular sprint work",
  },
  {
    id: "2",
    weekNumber: 29,
    date: "2026-07-13",
    status: "Submitted",
    hoursLogged: 38,
    notes: "",
  },
  {
    id: "3",
    weekNumber: 30,
    date: "2026-07-20",
    status: "Draft",
    hoursLogged: 0,
    notes: "",
  },
];

// Simple id generator for new entries
export function generateId(): string {
  return (Math.max(0, ...timesheets.map((t) => Number(t.id))) + 1).toString();
}