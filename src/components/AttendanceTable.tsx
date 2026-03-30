import { useState } from "react";
import { Input } from "@/components/ui/input";
import { getAttendanceRecords, type AttendanceRecord } from "@/utils/attendance";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MapPin, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function AttendanceTable() {
  const records = getAttendanceRecords();
  const [filter, setFilter] = useState("");

  const filtered = records.filter(
    (r) =>
      r.studentName.toLowerCase().includes(filter.toLowerCase()) ||
      r.room.toLowerCase().includes(filter.toLowerCase()) ||
      r.date.includes(filter) ||
      r.code.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, room, date, or code..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-soft">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead>Student</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No attendance records found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r, i) => (
                <TableRow key={i} className="hover:bg-secondary/30 transition-colors">
                  <TableCell className="font-medium">{r.studentName}</TableCell>
                  <TableCell className="font-mono-code text-sm">{r.time}</TableCell>
                  <TableCell className="text-sm">{r.date}</TableCell>
                  <TableCell className="font-semibold">{r.room}</TableCell>
                  <TableCell className="font-mono-code text-xs">{r.code}</TableCell>
                  <TableCell>
                    {r.location ? (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {r.location[0].toFixed(2)}, {r.location[1].toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-success/10 text-success">
                      <CheckCircle2 className="w-3 h-3" />
                      Present
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
