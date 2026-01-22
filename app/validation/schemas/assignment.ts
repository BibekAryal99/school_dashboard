import { z } from "zod";

export const assignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  course: z.string().min(1, "Course name is required"),
  dueDate: z.string().min(1, "Due date is required"),
  points: z.number().min(0).max(100, "Points must be between 0 and 100"),
  status: z.enum(["Pending", "Submitted", "Graded", "Late"]),
});

export type AssignmentForm = z.infer<typeof assignmentSchema>;
