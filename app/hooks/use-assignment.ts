"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Assignment } from "../types/assignment";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  assignmentSchema,
  AssignmentForm,
} from "../validation/schemas/assignment";

const defaultValues = {
  title: "",
  course: "",
  dueDate: "",
  points: 0,
  status: "Pending" as const,
};

const useAssignment = () => {
  const router = useRouter();

  const [records, setRecords] = useState<Assignment[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);

  const form = useForm<AssignmentForm>({
    resolver: zodResolver(assignmentSchema),
    defaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const response = await fetch("https://schooldashboard-production-04e3.up.railway.app/assignments");
        if (!response.ok) throw new Error("Failed to fetch assignments");
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error loading assignments:", error);
      }
    };
    loadAssignments();
  }, []);

  const handleSubmit = async (data: AssignmentForm) => {
    try {
      if (editing) {
        const response = await fetch(
          `https://schooldashboard-production-04e3.up.railway.app/assignments/${editing.id}`,
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
        const response = await fetch("https://schooldashboard-production-04e3.up.railway.app/assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create");
        const created = await response.json();
        setRecords((prev) => [...prev, created]);
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
    }
    setOpen(false);
    setEditing(null);
    reset();
  };

  const handleEdit = (record: Assignment) => {
    setEditing(record);
    reset({
      title: record.title,
      course: record.course,
      dueDate: new Date(record.dueDate).toISOString().split("T")[0],
      points: record.points,
      status: record.status,
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`https://schooldashboard-production-04e3.up.railway.app/assignments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting assignment:", error);
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

export default useAssignment;
