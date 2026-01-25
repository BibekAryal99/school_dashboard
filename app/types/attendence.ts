export interface AttendanceType {
  id: number;
  studentName: string;
  date: string;
  status: "Present" | "Absent" | "Late" | "Excused";
}
