import { z } from "zod";

export const analyticsSchema = z.object({
  subject: z.string().min(2, "Subject is required"),
  averageScore: z.number().min(0).max(100, "Score must be between 0 and 100"),
  strength: z.string().min(5, "Strength description is required"),
  weakness: z.string().min(5, "Weakness description is required"),
  overallPerformance: z.enum(["Excellent", "Good", "Average", "Below Average"]),
  date: z.string().min(1, "Date is required"),
});

export type AnalyticsFormData = z.infer<typeof analyticsSchema>;
