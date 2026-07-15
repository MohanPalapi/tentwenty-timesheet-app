import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { timesheets, generateId } from "@/lib/mockData";
import { TimesheetFormValues, TimesheetStatus } from "@/lib/types";

const VALID_STATUSES: TimesheetStatus[] = [
  "Draft",
  "Submitted",
  "Approved",
  "Rejected",
];

// Validates the shape and values of incoming timesheet data.
// Returns an error message string, or null if the data is valid.
function validateTimesheetInput(body: TimesheetFormValues): string | null {
  if (body.weekNumber === undefined || body.weekNumber === null) {
    return "weekNumber is required.";
  }
  if (!Number.isInteger(body.weekNumber) || body.weekNumber < 1 || body.weekNumber > 53) {
    return "weekNumber must be an integer between 1 and 53.";
  }

  if (!body.date) {
    return "date is required.";
  }
  if (Number.isNaN(Date.parse(body.date))) {
    return "date must be a valid date.";
  }

  if (!body.status) {
    return "status is required.";
  }
  if (!VALID_STATUSES.includes(body.status)) {
    return `status must be one of: ${VALID_STATUSES.join(", ")}.`;
  }

  return null;
}

// GET /api/timesheets — returns the full list
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(timesheets);
}

// POST /api/timesheets — creates a new entry
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: TimesheetFormValues = await request.json();

  const validationError = validateTimesheetInput(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const newEntry = { ...body, id: generateId() };
  timesheets.push(newEntry);

  return NextResponse.json(newEntry, { status: 201 });
}