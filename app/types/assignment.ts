export interface Assignment {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  points: number;
  status: "Pending" | "Submitted" | "Graded" | "Late";
  createdAt?: string;
}
export type AssignmentFormData = Omit<Assignment, "id" | "createdAt">;
