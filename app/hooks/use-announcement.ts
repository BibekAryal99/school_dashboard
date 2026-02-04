"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnnouncementType } from "../types/announcement";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { announcementSchema } from "../validation/schemas/announcement";

export type AnnouncementFormData = {
  title: string;
  message: string;
  category: "Exam" | "Event" | "Holiday" | "General" | "Urgent";
  publishedDate: string;
  isPinned: boolean;
};

const defaultValues: AnnouncementFormData = {
  title: "",
  message: "",
  category: "General",
  publishedDate: "",
  isPinned: false,
};

const useAnnouncement = () => {
  const router = useRouter();

  const [records, setRecords] = useState<AnnouncementType[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AnnouncementType | null>(null);

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const response = await fetch("https://schooldashboard-production-04e3.up.railway.app/announcements");
        if (!response.ok) throw new Error("Failed to fetch announcements");
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error loading announcements:", error);
      }
    };
    loadAnnouncements();
  }, []);

  const handleSubmit = async (data: AnnouncementFormData) => {
    try {
      if (editing) {
        const response = await fetch(
          `https://schooldashboard-production-04e3.up.railway.app/announcements/${editing.id}`,
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
        const response = await fetch("https://schooldashboard-production-04e3.up.railway.app/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create");
        const created = await response.json();
        setRecords((prev) => [...prev, created]);
      }
    } catch (error) {
      console.error("Error submitting announcement:", error);
    }
    setOpen(false);
    setEditing(null);
    reset();
  };

  const handleEdit = (record: AnnouncementType) => {
    setEditing(record);
    reset({
      title: record.title,
      message: record.message,
      category: record.category,
      publishedDate: record.publishedDate,
      isPinned: record.isPinned,
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `https://schooldashboard-production-04e3.up.railway.app/announcements/${id}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to delete");
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting announcement:", error);
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

export default useAnnouncement;
