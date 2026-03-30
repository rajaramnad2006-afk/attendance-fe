import { AttendanceTable } from "@/components/AttendanceTable";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Attendance History</h1>
        <p className="text-muted-foreground text-sm mt-1">View and filter all attendance records.</p>
      </div>
      <AttendanceTable />
    </div>
  );
}
