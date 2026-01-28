"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Teacher } from "../types/teacher";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TeacherFormData, teacherSchema } from "../validation/schemas/teacher";

const defaultValues = {
  name: "",
  email: "",
  subject: "",
  joinDate: "",
};

const useTeacher = () => {
  const router = useRouter();

  const [records, setRecords] = useState<Teacher[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);

  const form = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const response = await fetch("http://localhost:3001/teachers");
        if (!response.ok) throw new Error("Failed to fetch teachers");
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error loading teachers:", error);
      }
    };
    loadTeachers();
  }, []);

  const handleSubmit = async (data: TeacherFormData) => {
    try {
      if (editing) {
        const response = await fetch(
          `http://localhost:3001/teachers/${editing.id}`,
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
        const response = await fetch("http://localhost:3001/teachers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create");
        const created = await response.json();
        setRecords((prev) => [...prev, created]);
      }
    } catch (error) {
      console.error("Error submitting teacher:", error);
    }
    setOpen(false);
    setEditing(null);
    reset();
  };

  const handleEdit = (record: Teacher) => {
    setEditing(record);
    reset({
      name: record.name,
      email: record.email,
      subject: record.subject,
      joinDate: new Date(record.joinDate).toISOString().split("T")[0],
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/teachers/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting teacher:", error);
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
  };
};

export default useTeacher;
