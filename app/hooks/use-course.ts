"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Course } from "../types/course";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  courseCreateSchema,
  CourseCreateData,
} from "../validation/schemas/course";

const API_URL = "https://blissful-cat-production.up.railway.app/courses";

const defaultValues: CourseCreateData = {
  name: "",
  instructor: "",
  students: 0,
  status: "Active",
  joinDate: "",
};

const useCourse = () => {
  const router = useRouter();

  const [records, setRecords] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CourseCreateData>({
    resolver: zodResolver(courseCreateSchema),
    defaultValues,
  });

  const { reset } = form;


  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setRecords(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  
  const onSubmit = useCallback(
    async (data: CourseCreateData) => {
      try {
        const method = editing ? "PUT" : "POST";
        const url = editing ? `${API_URL}/${editing.id}` : API_URL;

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Failed to save course");

        const result = await res.json();

        setRecords((prev) =>
          editing
            ? prev.map((r) => (r.id === editing.id ? result : r))
            : [...prev, result]
        );

        setSuccessMessage(
          editing ? "Course updated successfully!" : "Course added successfully!"
        );

        setOpen(false);
        setEditing(null);
        reset();
      } catch (err: any) {
        setError(err.message);
      }
    },
    [editing, reset]
  );

  
  const handleEdit = (record: Course) => {
    setEditing(record);

    reset({
      name: record.name,
      instructor: record.instructor,
      students: record.students,
      status: record.status,
      joinDate: new Date(record.joinDate).toISOString().split("T")[0],
    });

    setOpen(true);
  };

  
  const handleDelete = async (id: number, name?: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      setRecords((prev) => prev.filter((r) => r.id !== id));
      setSuccessMessage(name ? `"${name}" deleted.` : "Course deleted");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    router,
    records,
    open,
    editing,
    loading,
    error,
    form,
    onSubmit,
    handleEdit,
    handleDelete,
    setOpen,
    successMessage,
  };
};

export default useCourse;
