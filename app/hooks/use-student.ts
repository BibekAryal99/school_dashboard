"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Student } from "../types/student";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudentFormData, studentSchema } from "../validation/schemas/student";

const defaultValues = {
  name: "",
  email: "",
  grade: "A",
  joinDate: "",
};

const useStudent = () => {
  const router = useRouter();

  const [records, setRecords] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);

  // Calculate summary data
  const summaryData = [
    { title: "Total Students", value: records.length.toString(), change: "+12%" },
    { title: "Active Students", value: records.filter(r => r.grade !== 'F').length.toString(), change: "+5%" },
    { title: "Average Grade", value: "B+", change: "+2%" },
  ];

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await fetch("https://schooldashboard-production-04e3.up.railway.app/students");
        if (!response.ok) throw new Error("Failed to fetch students");
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error loading students:", error);
      }
    };
    loadStudents();
  }, []);

  const handleSubmit = async (data: StudentFormData) => {
    try {
      if (editing) {
        const response = await fetch(
          `https://schooldashboard-production-04e3.up.railway.app/students/${editing.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          },
        );
        if (!response.ok) throw new Error("Failed to update");
        const updated = await response.json();
        setRecords((prev) =>
          prev.map((r) => (r.id === editing.id ? updated : r)),
        );
      } else {
        const response = await fetch("https://schooldashboard-production-04e3.up.railway.app/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create");
        const created = await response.json();
        setRecords((prev) => [...prev, created]);
      }
    } catch (error) {
      console.error("Error submitting student:", error);
    }
    setOpen(false);
    setEditing(null);
    reset();
  };

  const handleEdit = (record: Student) => {
    setEditing(record);
    reset({
      name: record.name,
      email: record.email,
      grade: record.grade,
      joinDate: record.joinDate
        ? new Date(record.joinDate).toISOString().split("T")[0]
        : "",
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`https://schooldashboard-production-04e3.up.railway.app/students/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return {
    router,
    records,
    setRecords,
    open,
    setOpen,
    editing,
    setEditing,
    form,
    handleSubmit,
    handleEdit,
    handleDelete,
    summaryData,
  };
};

export type { Student } from "../types/student";
export default useStudent;
