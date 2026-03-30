export interface ActiveSession {
  code: string;
  room: string;
  expiry: number; // timestamp
  createdAt: number;
}

export interface AttendanceRecord {
  studentName: string;
  time: string;
  room: string;
  location: [number, number] | null;
  status: "present";
  code: string;
  date: string;
}

const ACTIVE_SESSION_KEY = "activeSession";
const ATTENDANCE_KEY = "attendance";
const USER_KEY = "currentUser";

export function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const prefix = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const suffix = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${prefix}-${suffix}`;
}

export function startSession(room: string): ActiveSession {
  const session: ActiveSession = {
    code: generateCode(),
    room,
    expiry: Date.now() + 2 * 60 * 1000,
    createdAt: Date.now(),
  };
  localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getActiveSession(): ActiveSession | null {
  const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
  if (!raw) return null;
  const session: ActiveSession = JSON.parse(raw);
  if (Date.now() > session.expiry) {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    return null;
  }
  return session;
}

export function endSession(): void {
  localStorage.removeItem(ACTIVE_SESSION_KEY);
}

export function submitAttendance(
  studentName: string,
  code: string,
  location: [number, number] | null
): { success: boolean; message: string } {
  const session = getActiveSession();
  if (!session) return { success: false, message: "No active session or session has expired." };
  if (session.code !== code.toUpperCase().trim()) return { success: false, message: "Invalid attendance code." };

  const records = getAttendanceRecords();
  const alreadyMarked = records.some(
    (r) => r.studentName.toLowerCase() === studentName.toLowerCase() && r.code === code
  );
  if (alreadyMarked) return { success: false, message: "Attendance already marked for this session." };

  const now = new Date();
  const record: AttendanceRecord = {
    studentName,
    time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    room: session.room,
    location,
    status: "present",
    code: session.code,
    date: now.toLocaleDateString("en-US"),
  };
  records.push(record);
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
  return { success: true, message: "Attendance marked successfully!" };
}

export function getAttendanceRecords(): AttendanceRecord[] {
  const raw = localStorage.getItem(ATTENDANCE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getSessionAttendance(code: string): AttendanceRecord[] {
  return getAttendanceRecords().filter((r) => r.code === code);
}

export interface AppUser {
  name: string;
  role: "student" | "teacher";
}

export function setUser(user: AppUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): AppUser | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  localStorage.removeItem(USER_KEY);
}
