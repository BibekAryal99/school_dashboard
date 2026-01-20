import {z} from "zod";

export const assignmentSchema = z.object({
  title: z.string().min(3, "Title is required"),
  subject: z.string().min(2, "Subject is required"),
  dueDate: z.string().min(1, "Due date is required"),
});

export type AssignmentForm = z.infer<typeof assignmentSchema>;