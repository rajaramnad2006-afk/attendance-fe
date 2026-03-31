import axios from 'axios';

export interface ActiveSession {
  code: string;
  room: string;
  expiry: string | number; // Date string or timestamp
  createdAt: string | number;
}

export interface AttendanceRecord {
  studentName: string;
  time: string;
  room: string;
  location: [number, number] | null;
  status: "present";
  code: string;
  date: string;
  photo?: string | null;
}

const USER_KEY = "currentUser";

// Helper to interact with the backend API
const api = axios.create({
  // Use VITE_API_URL for production, or fallback to relative for proxy in dev
  baseURL: import.meta.env.VITE_API_URL || '',
});

export async function startSession(room: string): Promise<ActiveSession> {
  const response = await api.post('/api/sessions', { room });
  return response.data.session;
}

export async function getActiveSession(): Promise<ActiveSession | null> {
  try {
    const response = await api.get('/api/sessions/active');
    return response.data.session || null;
  } catch (error) {
    return null;
  }
}

export async function endSession(): Promise<void> {
  try {
    await api.delete('/api/sessions/active');
  } catch (error) {
    console.error('Failed to end session', error);
  }
}

export async function submitAttendance(
  studentName: string,
  code: string,
  location: [number, number] | null,
  photo: string | null = null
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post('/api/attendance', { studentName, code, location, photo });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Server error occurred' };
  }
}

export async function getSessionAttendance(code: string): Promise<AttendanceRecord[]> {
  try {
    const response = await api.get(`/api/attendance/${code}`);
    return response.data.records || [];
  } catch (error) {
    console.error('Failed to get attendance records', error);
    return [];
  }
}

export async function getAttendanceRecords(): Promise<AttendanceRecord[]> {
  try {
    const response = await api.get('/api/attendance');
    return response.data.records || [];
  } catch (error) {
    console.error('Failed to get all attendance records', error);
    return [];
  }
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
