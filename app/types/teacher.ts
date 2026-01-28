export interface Teacher {
  id: string | number;
  name: string;
  email: string;
  subject: string;
  status: "Active" | "Inactive";
  joinDate: string;
}