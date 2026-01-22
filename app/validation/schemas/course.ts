import { z } from "zod";

export const courseSchema = z.object({
  id: z.number(),
  name: z.string().min(3, "Course name must be at least 3 characters"),
  instructor: z.string().min(3, "Instructor name is required"),
  students: z
    .number()
    .min(1, "Students must be a number")
    .min(1, "At least 1 student is required"),
  status: z.enum(["Active", "Completed"]),
});

export type CourseFormData = z.infer<typeof courseSchema>;


 export const courseCreateSchema = courseSchema.omit({ id: true });
 export type  CourseCreateData = z.infer<typeof courseCreateSchema>;
