export interface AttendanceType {
  id: number;
  studentName: string;
  date: string;
  status: "Present" | "Absent" | "Late" | "Excused";
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  subject: string;
  status: "Active" | "Inactive";
  joinDate: string;
}
export interface Result {
  id: number;
  studentName: string;
  examName: string;
  marks: number;
  grade: string;
}

export interface Course {
  id: number;
  name: string;
  instructor: string;
  students: number;
  status: "Active" | "Completed";
  joinDate: string;
}
export const courses: Course[] = [];

export interface Assignment {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  points: number;
  status: "Pending" | "Submitted" | "Graded" | "Late";
  createdAt?: string;
}

export type CourseFormData = Omit<Course, "id">;
export type AssignmentFormData = Omit<Assignment, "id" | "createdAt">;

export interface Student {
  id: number;
  name: string;
  email: string;
  grade: string;
  joinDate: string;
}

export type SummaryCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
};

export type Props = {
  data: SummaryCardProps[];
};

export interface Product {
  id?: number;
  title: string;
  price: number;
  description: string;
  category: string;
  status: "Available" | "Out of Stock";
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
  colors?: string[];
  sizes?: string[];
}

export interface Params {
  params: {
    id: string;
  };
}

export interface Item {
  id: number;
}
