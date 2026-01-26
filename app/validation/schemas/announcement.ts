import {z} from "zod";

export const announcementSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters"),

  category: z.enum([
    "Exam",
    "Event",
    "Holiday",
    "General",
    "Urgent",
  ]),

  publishedDate: z
    .string()
    .min(1, "Date is required"),

  isPinned: z.boolean(),
});

export type AnnouncementFormData = z.infer<typeof announcementSchema>;
