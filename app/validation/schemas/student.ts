import {z} from "zod";

export const studentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  grade: z.string().min(1, "Grade is required"),
  joinDate:z.string().optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;