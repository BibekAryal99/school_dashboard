import { Course } from "@/app/types/course";
import { AttendanceType } from "@/app/types/attendence";
import { Assignment } from "@/app/types/assignment";
import { Result } from "@/app/types/result";
import { Student } from "../types/student";

export const initialCourses: Course[] = [
  {
    id: 1,
    name: "Mathematics",
    instructor: "Mr. Anderson",
    students: 120,
    status: "Active",
    joinDate: "2026-01-05",
  },
];

export const inititalStudents: Student[] = [
  {
    id:1,
    name:"Bibek Aryal",
    email:"xyz@gmail.com",
    grade:"A",
    joinDate:"2026-01-25",
  }
];

export const defaultResults: Result[] = [
  {
    id: 1,
    studentName: "Jane Smith",
    subject: "Science",
    score: 30,
    totalMarks: 100,
    examName: "1st terminal examination",
    grade: "A",
    date: "2026-01-12",
  },
  {
    id: Date.now(),
    studentName: "John Doe",
    subject: "Science",
    score: 40,
    totalMarks: 100,
    examName: "Science exam",
    date: "2023-05-15",
    grade: "A",
  },
  {
    id: Date.now() + 1,
    studentName: "Jane Smith",
    subject: "Math",
    score: 46,
    totalMarks: 100,
    examName: "Math exam",
    date: "2023-05-16",
    grade: "B+",
  },
  {
    id: Date.now() + 2,
    studentName: "Robert Johnson",
    subject: "EHP",
    score: 34,
    totalMarks: 100,
    examName: "ehp exam",
    date: "2023-05-17",
    grade: "B",
  },
];

export const defaultAttendance: AttendanceType[] = [
  {
    id: Date.now(),
    studentName: "John Doe",
    date: "2023-05-15",
    status: "Present",
  },
  {
    id: Date.now() + 1,
    studentName: "Jane Smith",
    date: "2023-05-16",
    status: "Absent",
  },
  {
    id: Date.now() + 2,
    studentName: "Robert Johnson",
    date: "2023-05-17",
    status: "Late",
  },
];
export const initialAssignments: Assignment[] = [
  {
    id: 1,
    title: "Algebra Homework",
    course: "csit",
    dueDate: "2024-02-15",
    points: 100,
    status: "Pending",
  },
  {
    id: 2,
    title: "Physics Lab Report",
    course: "BCA",
    dueDate: "2024-02-18",
    points: 80,
    status: "Graded",
  },
];
export const stats = [
  {
    title: "Total Students",
    value: "1,234",
    change: "+12%",
    color: "bg-blue-500",
  },
  {
    title: "Total Teachers",
    value: "89",
    change: "+5%",
    color: "bg-green-500",
  },
  {
    title: "Active Courses",
    value: "24",
    change: "+2%",
    color: "bg-purple-500",
  },
  {
    title: "Attendance Rate",
    value: "94.2%",
    change: "+3.1%",
    color: "bg-orange-500",
  },
];

export const recentActivity = [
  {
    id: 1,
    name: "John Smith",
    action: "Enrolled in Math 101",
    time: "10 mins ago",
  },
  {
    id: 2,
    name: "Emma Johnson",
    action: "Submitted Assignment",
    time: "25 mins ago",
  },
  {
    id: 3,
    name: "Michael Brown",
    action: "Received Grade Update",
    time: "1 hour ago",
  },
  {
    id: 4,
    name: "Sarah Davis",
    action: "Attended Physics Lecture",
    time: "2 hours ago",
  },
];

export const upcomingEvents = [
  {
    title: "Midterm Examinations",
    date: "March 15-22, 2023",
    description: "All students are required to attend.",
    color: "bg-blue-100",
    dotColor: "bg-blue-600",
  },
  {
    title: "Parent-Teacher Meeting",
    date: "March 25-27, 2023",
    description: "Schedule meetings to discuss student progress.",
    color: "bg-green-100",
    dotColor: "bg-green-600",
  },
  {
    title: "Science Fair",
    date: "April 5, 2023",
    description: "Students will present their science projects.",
    color: "bg-purple-100",
    dotColor: "bg-purple-600",
  },
];

export const announcement = {
  id: Date.now(),
  title: "Mid-Term Exams",
  message: "Mid-term exams will start from Feb 10. Check the timetable.",
  category: "Exam",
  publishedDate: "2026-02-10",
  isPinned: true,
};

