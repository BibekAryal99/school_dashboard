export interface Attendance  {
  id: number;
  studentName: string;
  date: string;
  status: "Present" | "Absent" | "Late";
};

export interface  Teacher  {
  id: number;
  name: string;
  email: string;
  subject: string;
  status: "Active" | "Inactive";
};

export interface Result  {
  id: number;
  studentName: string;
  examName: string;
  marks: number;
  grade: "A" | "B+" | "B" | "C+" | "C" | "D" | "F";
};

export interface Course  {
  id: number;
  name: string;
  instructor: string;
  students: number;
  status: "Active" | "Completed";
};

export interface AssignmentForm {
  title: string;
  description: string;
  dueDate: string; 
  subject: string;
}
export interface Assignment extends AssignmentForm {
  id: number;
}
export interface Student  {
  id: number;
  name: string;
  email: string;
  grade: string;
};
interface SummaryCard {
  title: string;
  value: string | number;
}

interface Props {
  data: SummaryCard[];
}


