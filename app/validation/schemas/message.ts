import { z } from "zod";

export const messageSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  sender: z.string().min(2, "Sender name is required"),
  date: z.string().min(1, "Date is required"),
  priority: z.enum(["High", "Medium", "Low"]),
  isRead: z.boolean(),
});

export type MessageFormData = z.infer<typeof messageSchema>;
