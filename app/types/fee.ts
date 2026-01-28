export interface Fee {
  id: number;
  studentName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  paymentStatus: "Paid" | "Pending" | "Overdue";
  paymentDate?: string;
  description: string;
}
