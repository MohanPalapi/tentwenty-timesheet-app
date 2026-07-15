import { timesheets } from "@/lib/mockData";
import { TimesheetTable } from "@/components/TimesheetTable";

// Server Component: reads data directly (no client-side fetch needed
// for the initial page load — faster first paint, no loading spinner).
export default async function DashboardPage() {
  // In a real app with a real database, this might be:
  // const entries = await db.timesheets.findMany();
  const entries = timesheets;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900">
        Timesheet Entries
      </h1>
      <TimesheetTable initialEntries={entries} />
    </div>
  );
}