export interface Course {
  id: string;
  name: string;
  instructor: string;
  students: number;
  status: "Active" | "Completed";
  joinDate: string;
}

export const courses: Course[] = [];

export type CourseFormData = Omit<Course, "id">;
