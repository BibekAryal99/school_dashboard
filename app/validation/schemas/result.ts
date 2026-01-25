import { z } from "zod";

export const resultSchema = z.object({
  studentName: z.string().min(3, "Student name is required"),
  subject: z.string().min(3, "Subject is required"),
  score: z.number().min(0, "Score is required"),
  totalMarks: z.number().min(0, "Total marks is required"),
  examName: z.string().min(2, "exam name  is required"),
  grade: z.enum(["A", "B+", "B", "C+", "C", "D", "F"]),
  date: z.string().optional(),
});

export type ResultFormData = z.infer<typeof resultSchema>;
