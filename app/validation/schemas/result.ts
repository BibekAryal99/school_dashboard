import {z} from 'zod'

export const resultSchema = z.object({
  studentName: z.string().min(3, "Student name is required"),
  examName: z.string().min(2, "Exam name is required"),
  marks: z
    .number()
    .min(1, "Marks can be greater than 0")
    .max(100, "Marks cannot be greater than 100"),
  grade: z.enum(["A", "B+", "B", "C+", "C", "D", "F"]),
});

export type ResultFormData = z.infer<typeof resultSchema>;