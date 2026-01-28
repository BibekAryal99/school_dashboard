export interface AttendanceType {
  id: string | number;
  studentName: string;
  date: string;
  status: "Present" | "Absent" | "Late" | "Excused";
}
