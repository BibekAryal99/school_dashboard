import { z } from "zod";

export const attendanceSchema = z.object({
  studentName: z.string().min(2, "Name is required"),
  date: z.string().min(8, "Date is required"),
  status: z.enum(["Present", "Absent", "Late"]),
});

export type AttendanceFormData = z.infer<typeof attendanceSchema>;