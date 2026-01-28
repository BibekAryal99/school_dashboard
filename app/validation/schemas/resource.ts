import { z } from "zod";

export const resourceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category is required"),
  fileUrl: z.string().min(1, "File URL is required"),
  uploadDate: z.string().min(1, "Upload date is required"),
  downloadCount: z
    .number()
    .min(0, "Download count must be greater than or equal to 0"),
});
export type ResourceFormData = z.infer<typeof resourceSchema>;
