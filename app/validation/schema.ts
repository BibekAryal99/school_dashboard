import { z } from "zod";

export const courseSchema = z.object({
  name: z.string().min(3, "Course name must be at least 3 characters"),
  instructor: z.string().min(3, "Instructor name is required"),
  students: z
    .number()
    .min(1, "Students must be a number")
    .min(1, "At least 1 student is required"),
  status: z.enum(["Active", "Completed"]),
});

export type CourseFormData = z.infer<typeof courseSchema>;

export const teacherSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(2, "Subject required"),
  status: z.enum(["Active", "Inactive"]),
});

export type TeacherFormData = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  grade: z.string().min(1, "Grade is required"),
});

export type StudentFormData = z.infer<typeof studentSchema>;

export const attendanceSchema = z.object({
  studentName: z.string().min(2, "Name is required"),
  date: z.string().min(10, "Date is required"),
  status: z.enum(["Present", "Absent", "Late"]),
});

export type AttendanceFormData = z.infer<typeof attendanceSchema>;

export const resultSchema = z.object({
  studentName: z.string().min(3, "Student name is required"),
  examName: z.string().min(2, "Exam name is required"),
  marks: z
    .number()
    .min(1, "Marks can be greater than 0")
    .max(100, "Marks cannot be greater than 100"),
  grade: z.enum(["A", "B+", "B", "C+", "C", "D", "F"]),
});

export type ResultFormData = z.infer<typeof resultSchema>;

export const assignmentSchema = z.object({
  title: z.string().min(3, "Title is required"),
  subject: z.string().min(2, "Subject is required"),
  dueDate: z.string().min(1, "Due date is required"),
});

export type AssignmentForm = z.infer<typeof assignmentSchema>;

export const productSchema = z.object({
  title: z.string().min(2, "Name must be at least 2 characters"),
  price: z
    .number()
    .min(200, "price cannot be less than 200.")
    .max(10000, "price cannot be greater than 10000."),
  category: z.string().min(2, "Category must be at least 2 characters"),
  status: z.enum(["Available", "Out of Stock"]),
  image:z.string().url("Must be a valid image URL"),
});

export type ProductFormData = z.infer<typeof productSchema>;
