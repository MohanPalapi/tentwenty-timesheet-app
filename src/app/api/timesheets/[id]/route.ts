import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { timesheets } from "@/lib/mockData";
import { TimesheetFormValues, TimesheetStatus } from "@/lib/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const VALID_STATUSES: TimesheetStatus[] = [
  "Draft",
  "Submitted",
  "Approved",
  "Rejected",
];

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

// PUT /api/timesheets/:id — updates an existing entry
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body: TimesheetFormValues = await request.json();

  const validationError = validateTimesheetInput(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const index = timesheets.findIndex((t) => t.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Entry not found." }, { status: 404 });
  }

  timesheets[index] = { ...timesheets[index], ...body };
  return NextResponse.json(timesheets[index]);
}

// DELETE /api/timesheets/:id — removes an entry
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const index = timesheets.findIndex((t) => t.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Entry not found." }, { status: 404 });
  }

  timesheets.splice(index, 1);
  return NextResponse.json({ success: true });
}