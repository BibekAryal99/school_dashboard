"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Setting } from "../types/setting";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingFormData, settingSchema } from "../validation/schemas/setting";

const defaultValues: SettingFormData = {
  userId: "",
  notificationsEnabled: false,
  theme: "Light",
  language: "English",
  privacy: "Private",
  twoFactorAuth: false,
  lastModified: "",
};

const useSetting = () => {
  const router = useRouter();

  const [records, setRecords] = useState<Setting[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Setting | null>(null);

  const form = useForm<SettingFormData>({
    resolver: zodResolver(settingSchema),
    defaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("http://localhost:3001/settings");
        if (!response.ok) throw new Error("Failed to fetch settings");
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    loadSettings();
  }, []);

  const handleSubmit = async (data: SettingFormData) => {
    try {
      if (editing) {
        const response = await fetch(
          `http://localhost:3001/settings/${editing.id}`,
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
        const response = await fetch("http://localhost:3001/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create");
        const created = await response.json();
        setRecords((prev) => [...prev, created]);
      }
    } catch (error) {
      console.error("Error submitting setting:", error);
    }
    setOpen(false);
    setEditing(null);
    reset();
  };

  const handleEdit = (record: Setting) => {
    setEditing(record);
    reset({
      userId: record.userId,
      notificationsEnabled: record.notificationsEnabled,
      theme: record.theme,
      language: record.language,
      privacy: record.privacy,
      twoFactorAuth: record.twoFactorAuth,
      lastModified: new Date(record.lastModified).toISOString().split("T")[0],
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/settings/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting setting:", error);
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

export default useSetting;
