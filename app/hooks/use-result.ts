"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Result } from "../types/result";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResultFormData, resultSchema } from "../validation/schemas/result";

const defaultValues = {
  studentName: "",
  subject: "",
  score: 0,
  totalMarks: 100,
  examName: "",
  grade: "A" as const,
  date: "",
};

const useResult = () => {
  const router = useRouter();

  const [records, setRecords] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Result | null>(null);

  // Calculate summary data
  const summaryData = [
    { title: "Total Results", value: records.length.toString(), change: "+5%" },
    { title: "Average Score", value: records.length ? Math.round(records.reduce((sum, r) => sum + r.score, 0) / records.length).toString() : "0", change: "+2%" },
    { title: "Pass Rate", value: records.length ? Math.round((records.filter(r => (r.score / r.totalMarks) >= 0.5).length / records.length) * 100).toString() + "%" : "0%", change: "+3%" },
  ];

  const form = useForm<ResultFormData>({
    resolver: zodResolver(resultSchema),
    defaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    const loadResults = async () => {
      try {
        const response = await fetch("http://localhost:3001/results");
        if (!response.ok) throw new Error("Failed to fetch results");
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error loading results:", error);
      }
    };
    loadResults();
  }, []);

  const handleSubmit = async (data: ResultFormData) => {
    try {
      if (editing) {
        const response = await fetch(
          `http://localhost:3001/results/${editing.id}`,
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
        const response = await fetch("http://localhost:3001/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create");
        const created = await response.json();
        setRecords((prev) => [...prev, created]);
      }
    } catch (error) {
      console.error("Error submitting result:", error);
    }
    setOpen(false);
    setEditing(null);
    reset();
  };

  const handleEdit = (record: Result) => {
    setEditing(record);
    reset({
      studentName: record.studentName,
      subject: record.subject,
      score: record.score,
      totalMarks: record.totalMarks,
      examName: record.examName,
      grade: record.grade as "A" | "B+" | "B" | "C+" | "C" | "D" | "F",
      date: new Date(record.date).toISOString().split("T")[0],
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/results/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting result:", error);
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

export type { Result } from "../types/result";
export default useResult;
