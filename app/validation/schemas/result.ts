import { z } from "zod";

export const resultSchema = z.object({
  studentName: z.string().min(3, "Student name is required"),
  examName: z.string().min(2, "exam name  is required"),
  marks:z.number().max(100, "Marks is required"),
  grade: z.enum(["A", "B+", "B", "C+", "C", "D", "F"]),
});

export type ResultFormData = z.infer<typeof resultSchema>;

export const ResultCreateSchema = resultSchema.omit({ studentName: true });
 export type  ResultCreateData = z.infer<typeof ResultCreateSchema>;

