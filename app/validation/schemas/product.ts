import { z } from "zod";

const ratingSchema = z.object({
  rate: z.number().min(0).max(5),
  count: z.number().min(0),
});

export const productSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  price: z.number().min(0, "Price must be positive"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["Available", "Out of Stock"]),
  image: z.string().url("Image must be a valid URL"),
  rating: ratingSchema.optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
