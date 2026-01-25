export interface Teacher {
  id: number;
  name: string;
  email: string;
  subject: string;
  status: "Active" | "Inactive";
  joinDate: string;
}