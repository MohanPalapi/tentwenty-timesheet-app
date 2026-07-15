interface TimesheetEntry {
  id: string;
  weekNumber: number;
  date: string;
  status: TimesheetStatus;
}

interface TimesheetFormValues {
  weekNumber: number;
  date: string;
  status: TimesheetStatus;
}
