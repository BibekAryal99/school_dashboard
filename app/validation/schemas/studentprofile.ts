import { z } from "zod";

export const studentProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  rollNumber: z.string().min(1, "Roll number is required"),
  className: z.string().min(1, "Class name is required"),
  enrollmentDate: z.string().min(1, "Enrollment date is required"),
  guardianName: z.string().min(2, "Guardian name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type StudentProfileFormData = z.infer<typeof studentProfileSchema>;
