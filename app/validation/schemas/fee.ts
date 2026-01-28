import { z } from "zod";

export const feeSchema = z.object({
  studentName: z.string().min(3, "Student name is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  amount: z.number().min(0, "Amount must be greater than 0"),
  dueDate: z.string().min(1, "Due date is required"),
  paymentStatus: z.enum(["Paid", "Pending", "Overdue"]),
  paymentDate: z.string().optional(),
  description: z.string().min(5, "Description is required"),
});
export type FeeFormData = z.infer<typeof feeSchema>;
