export interface Assignment {
  id: string | number;
  title: string;
  course: string;
  dueDate: string;
  points: number;
  status: "Pending" | "Submitted" | "Graded" | "Late";
  createdAt?: string;
}
export type AssignmentFormData = Omit<Assignment, "id" | "createdAt">;
