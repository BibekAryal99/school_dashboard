"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Course } from "../types/course";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  courseCreateSchema,
  CourseCreateData,
} from "../validation/schemas/course";

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

  const form = useForm<CourseCreateData>({
    resolver: zodResolver(courseCreateSchema),
    defaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch("http://localhost:3001/courses");
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error loading courses:", error);
      }
    };
    loadCourses();
  }, []);

  const handleSubmit = async (data: CourseCreateData) => {
    try {
      if (editing) {
        const response = await fetch(
          `http://localhost:3001/courses/${editing.id}`,
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
        const response = await fetch("http://localhost:3001/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create");
        const created = await response.json();
        setRecords((prev) => [...prev, created]);
      }
    } catch (error) {
      console.error("Error submitting course:", error);
    }
    setOpen(false);
    setEditing(null);
    reset();
  };

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

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/courses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
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

export default useCourse;
