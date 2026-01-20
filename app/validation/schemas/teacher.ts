import {z} from "zod";

export const teacherSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  status: z.enum(["Active", "Inactive"]),
  joinDate: z.string().optional(),
});

export type TeacherFormData = z.infer<typeof teacherSchema>;