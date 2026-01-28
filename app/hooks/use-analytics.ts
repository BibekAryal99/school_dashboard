"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Analytics } from "../types/analytics";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AnalyticsFormData,
  analyticsSchema,
} from "../validation/schemas/analytics";
import { ToastProvider } from "@/components/ui/toast";

const defaultValues = {
  subject: "",
  averageScore: 0,
  strength: "",
  weakness: "",
  overallPerformance: "Average" as const,
  date: "",
};

const useAnalytics = () => {
  const router = useRouter();

  const [records, setRecords] = useState<Analytics[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Analytics | null>(null);

  const form = useForm<AnalyticsFormData>({
    resolver: zodResolver(analyticsSchema),
    defaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await fetch("http://localhost:3001/analytics");
        if (!response.ok) throw new Error("Failed to fetch analytics");
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error loading analytics:", error);
      }
    };
    loadAnalytics();
  }, []);

  const handleSubmit = async (data: AnalyticsFormData) => {
    try {
      if (editing) {
        const response = await fetch(
          `http://localhost:3001/analytics/${editing.id}`,
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
        const response = await fetch("http://localhost:3001/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create");
        const created = await response.json();
        setRecords((prev) => [...prev, created]);
      }
    } catch (error) {
      console.error("Error submitting analytics:", error);
    }
    setOpen(false);
    setEditing(null);
    reset();
  };

  const handleEdit = (record: Analytics) => {
    setEditing(record);
    reset({
      subject: record.subject,
      averageScore: record.averageScore,
      strength: record.strength,
      weakness: record.weakness,
      overallPerformance: record.overallPerformance,
      date: new Date(record.date).toISOString().split("T")[0],
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/analytics/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting analytics:", error);
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
    ToastProvider,
  
  };
};

export default useAnalytics;
