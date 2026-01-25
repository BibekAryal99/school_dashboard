"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AttendanceType } from "@/app/types/attendence";
import { defaultAttendance, inititalStudents } from "@/app/constants/data";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { Student } from "@/app/types/student";

const STUDENT_STORAGE_KEY = "student_data";

const getStudentFromStorage = (): Student[] => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STUDENT_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(inititalStudents));
    return inititalStudents;
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error parsing student from localStorage:", error);
    return [];
  }
};

const getStudentById = (id: number): Student | undefined => {
  const student = getStudentFromStorage();
  return student.find((item) => item.id === id);
};

const updateStudent = (
  id: number,
  studentData: Partial<Omit<Student, "id">>,
): Student | null => {
  const student = getStudentFromStorage();
  const index = student.findIndex((s) => s.id === id);

  if (index === -1) return null;

  student[index] = { ...student[index], ...studentData };
  localStorage.setItem(
    STUDENT_STORAGE_KEY,
    JSON.stringify(STUDENT_STORAGE_KEY),
  );
  return student[index];
};

export default function StudentEditPage() {
  const params = useParams();
  const { toast, ToastContainer } = useToast();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({
    name: "",
    email: "",
    joinDate: new Date().toISOString().split("T")[0],
    grade: "A",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = parseInt(params.id as string);
    const foundStudent = getStudentById(id);

    if (foundStudent) {
      setStudent(foundStudent);
      setFormData({
        name: foundStudent.name || "",
        email: foundStudent.email || "",
        joinDate:
          foundStudent.joinDate || new Date().toISOString().split("T")[0],
        grade: foundStudent.grade || "A",
      });
    }
    setLoading(false);
  }, [params.id]);

  const handleSave = () => {
    if (student) {
      const updatedStudent = updateStudent(student.id, formData);
      if (updatedStudent) {
        toast({
          title: "Student record saved",
          description: "Student Record have been saved successfully",
        });
        setTimeout(() => {
          router.push(`/student/${student.id}`);
        }, 3000);
      }
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!student) {
    return <div className="p-6">Student record not found</div>;
  }

  return (
    <ToastProvider>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Edit Student</h1>
            <p className="text-muted-foreground mt-1">
              Update Student record information
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/students/${student.id}`)}
            >
              Back to Detail
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="studentName" className="text-base">
                Student Name
              </Label>
              <Input
                id="studentName"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter student name"
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter Email"
                  className="h-12 text-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-base">
                    Join Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.joinDate || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, joinDate: e.target.value })
                    }
                    className="h-12 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-base">
                    Grade
                  </Label>
                  <select
                    id="status"
                    value={formData.grade || "A"}
                    onChange={(e) =>
                      setFormData({ ...formData, grade: e.target.value as any })
                    }
                    className="w-full h-12 rounded-md border border-input bg-background px-3 py-2 text-lg"
                  >
                    <option value="A">A</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="C">C+</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-8 border-t mt-8">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="h-12 px-6 text-base"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="h-12 px-6 text-base">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}
