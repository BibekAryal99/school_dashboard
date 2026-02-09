"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarEvent } from "../types/calender";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarFormData,
  calendarSchema,
} from "../validation/schemas/calender";

const defaultValues = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
};

const useCalendar = () => {
  const router = useRouter();

  const [records, setRecords] = useState<CalendarEvent[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);

  const form = useForm<CalendarFormData>({
    resolver: zodResolver(calendarSchema),
    defaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch("https://schooldashboard-production-04e3.up.railway.app/calendar");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error loading events:", error);
      }
    };
    loadEvents();
  }, []);

  const handleSubmit = async (data: CalendarFormData) => {
    try {
      if (editing) {
        const response = await fetch(
          `https://schooldashboard-production-04e3.up.railway.app/calendar/${editing.id}`,
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
        const response = await fetch("https://schooldashboard-production-04e3.up.railway.app/calendar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create");
        const created = await response.json();
        setRecords((prev) => [...prev, created]);
      }
    } catch (error) {
      console.error("Error submitting event:", error);
    }
    setOpen(false);
    setEditing(null);
    reset();
  };

  const handleEdit = (record: CalendarEvent) => {
    setEditing(record);
    reset({
      title: record.title,
      description: record.description,
      date: record.date,
      time: record.time,
      location: record.location,
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`https://schooldashboard-production-04e3.up.railway.app/calendar/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
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

export default useCalendar;
