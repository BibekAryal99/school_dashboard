"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { inititalStudents } from "@/app/constants/data";
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
  localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(student));
  return student[index];
};

const deleteStudent = (id: number): boolean => {
  const student = getStudentFromStorage();
  const initialLength = student.length;
  const filteredStudent = student.filter((s) => s.id !== id);

  if (filteredStudent.length === initialLength) {
    return false;
  }

  localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(filteredStudent));
  return true;
};

export default function StudentDetailPage() {
  const { toast, ToastContainer } = useToast();
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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
        setStudent(updatedStudent);
        setIsEditing(false);
        toast({
          title: "Student saved",
          description: "Student Record have been saved successfully",
        });
      }
    }
  };

  const handleDelete = () => {
    if (
      student &&
      confirm("Are you sure you want to delete this student record?")
    ) {
      const deleted = deleteStudent(student.id);
      if (deleted) {
        toast({
          title: "Student deleted",
          description: "Student Record deleted successfully",
        });
        setTimeout(() => {
          router.push("/students");
        });
      }
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!student) {
    return <div className="p-6">Student record not found</div>;
  }
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "A":
        return "bg-green-500";
      case "B+":
        return "bg-red-500";
      case "B":
        return "bg-yellow-500";
      case "C+":
        return "bg-blue-500";
      case "C":
        return "bg-green-400";
      case "D":
        return "bg-yellow-800";
      case "F":
        return "bg-orange-400";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <ToastProvider>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Student Details</h1>
            <p className="text-muted-foreground mt-1">
              View and manage Student information
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => router.push("/students")}>
              Back to Student
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {isEditing ? (
            <div className="p-8 space-y-8">
              <div className="border-b pb-6">
                <h2 className="text-2xl font-bold text-primary">
                  Edit Student
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Update Student information below
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: student.name || "",
                      email: student.email || "",
                      joinDate:
                        student.joinDate ||
                        new Date().toISOString().split("T")[0],
                      grade: student.grade || "A",
                    });
                  }}
                  className="h-12 px-6 text-base"
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} className="h-12 px-6 text-base">
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8 space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-primary">
                    {student.name}
                  </h2>
                  <p className="text-muted-foreground text-lg mt-1">
                    Student Details
                  </p>
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2 min-w-30 text-center">
                  <p className="text-xs font-medium text-gray-600">
                    Student ID
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    #{student.id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-sm font-medium text-black-700 mb-1">
                    Student Name
                  </h3>
                  <p className="text-2xl font-bold text-black-900">
                    {student.name || "N/A"}
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-sm font-medium text-black-700 mb-1">
                    Email
                  </h3>
                  <p className="text-2xl font-bold text-black-900">
                    {student.email || "N/A"}
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-sm font-medium text-black-700 mb-1">
                    Join Date
                  </h3>
                  <p className="text-2xl font-bold text-black-900">
                    {student.joinDate || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl p-6 border">
                  <h3 className="text-sm font-medium mb-1">Grade</h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(student.grade || "A")}`}
                  >
                    {student.grade || "N/A"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-card rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">
                      Student Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Student Name
                        </h4>
                        <p className="text-lg font-medium">
                          {student.name || "N/A"}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Email
                        </h4>
                        <p className="text-lg font-medium">
                          {student.email || "N/A"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Join Date
                        </h4>
                        <p className="text-lg font-medium">
                          {student.joinDate || "N/A"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Grade
                        </h4>
                        <p className="text-lg font-medium">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(student.grade || "A")}`}
                          >
                            {student.grade || "N/A"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-card rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">
                      Additional Info
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Record ID
                        </h4>
                        <p className="text-2xl font-bold text-primary">
                          #{student.id}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Grade
                        </h4>
                        <p className="text-lg font-medium capitalize">
                          {student.grade?.toLowerCase() || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/students/${student.id}/edit`)}
                  className="h-12 px-6 text-base"
                >
                  Edit Page
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="h-12 px-6 text-base"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}
