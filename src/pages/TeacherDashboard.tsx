import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Square, Users, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodeDisplay } from "@/components/CodeDisplay";
import { Timer } from "@/components/Timer";
import {
  startSession,
  endSession,
  getActiveSession,
  getSessionAttendance,
  type ActiveSession,
  type AttendanceRecord,
} from "@/utils/attendance";
import { useToast } from "@/hooks/use-toast";

export default function TeacherDashboard() {
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState("");
  const [students, setStudents] = useState<AttendanceRecord[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function init() {
      const active = await getActiveSession();
      setSession(active);
      if (active) {
        const records = await getSessionAttendance(active.code);
        setStudents(records);
      }
      setLoading(false);
    }
    init();
  }, []);

  const handleStart = async () => {
    if (!room.trim()) {
      toast({ title: "Enter a room number", variant: "destructive" });
      return;
    }
    const s = await startSession(room.trim());
    if (s) {
      setSession(s);
      setStudents([]);
      toast({ title: "Session started!", description: `Code: ${s.code}` });
    }
  };

  const handleEnd = async () => {
    if (session) {
      const records = await getSessionAttendance(session.code);
      setStudents(records);
    }
    await endSession();
    setSession(null);
    toast({ title: "Session ended" });
  };

  const handleExpire = useCallback(async () => {
    if (session) {
      const records = await getSessionAttendance(session.code);
      setStudents(records);
    }
    await endSession();
    setSession(null);
    toast({ title: "Session expired", variant: "destructive" });
  }, [session, toast]);

  const refreshStudents = async () => {
    if (session) {
      const records = await getSessionAttendance(session.code);
      setStudents(records);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Teacher Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage attendance sessions</p>
      </div>

      {!session ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 shadow-soft border border-border space-y-4 max-w-md"
        >
          <h2 className="font-heading font-semibold text-card-foreground flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-primary" />
            Start New Session
          </h2>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Room Number</label>
            <Input placeholder="e.g. A101" value={room} onChange={(e) => setRoom(e.target.value)} className="h-11" />
          </div>
          <Button
            onClick={handleStart}
            disabled={!room.trim()}
            className="w-full h-11 gradient-primary text-primary-foreground font-semibold shadow-glow-primary hover:opacity-90"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Attendance
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <CodeDisplay code={session.code} room={session.room} />
          <Timer expiry={new Date(session.expiry).getTime()} onExpire={handleExpire} />

          <div className="flex flex-wrap gap-3">
            <Button
              variant="destructive"
              onClick={handleEnd}
              className="h-11 px-6 font-semibold"
            >
              <Square className="w-4 h-4 mr-2" />
              End Session
            </Button>
            <Button variant="outline" onClick={refreshStudents} className="h-11">
              <Users className="w-4 h-4 mr-2" />
              Refresh ({students.length})
            </Button>
          </div>

          {students.length > 0 && (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="bg-card rounded-2xl p-5 shadow-soft border border-border"
            >
              <h3 className="font-heading font-semibold text-card-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-success" />
                Present Students ({students.length})
              </h3>
              <div className="space-y-2">
                {students.map((s, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-secondary/50 rounded-xl">
                    <span className="font-medium text-sm text-foreground">{s.studentName}</span>
                    <span className="font-mono-code text-xs text-muted-foreground">{s.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
