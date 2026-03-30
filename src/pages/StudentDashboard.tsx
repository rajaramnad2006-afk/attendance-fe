import { AttendanceForm } from "@/components/AttendanceForm";
import { getUser } from "@/utils/attendance";

export default function StudentDashboard() {
  const user = getUser();

  return (
    <div className="space-y-6 max-w-md">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          Welcome, {user?.name || "Student"} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Enter the code shared by your teacher to mark attendance.
        </p>
      </div>
      <AttendanceForm studentName={user?.name || "Unknown"} />
    </div>
  );
}
