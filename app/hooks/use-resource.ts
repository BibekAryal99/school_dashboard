"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Resource } from "../types/resource";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResourceFormData,
  resourceSchema,
} from "../validation/schemas/resource";

const defaultValues = {
  title: "",
  type: "",
  url: "",
  description: "",
};

const useResource = () => {
  const router = useRouter();

  const [records, setRecords] = useState<Resource[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);

  const form = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    const loadResources = async () => {
      try {
        const response = await fetch("https://schooldashboard-production-04e3.up.railway.app/resources");
        if (!response.ok) throw new Error("Failed to fetch resources");
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error loading resources:", error);
      }
    };
    loadResources();
  }, []);

  const handleSubmit = async (data: ResourceFormData) => {
    try {
      if (editing) {
        const response = await fetch(
          `https://schooldashboard-production-04e3.up.railway.app/resources/${editing.id}`,
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
        const response = await fetch("https://schooldashboard-production-04e3.up.railway.app/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create");
        const created = await response.json();
        setRecords((prev) => [...prev, created]);
      }
    } catch (error) {
      console.error("Error submitting resource:", error);
    }
    setOpen(false);
    setEditing(null);
    reset();
  };

  const handleEdit = (record: Resource) => {
    setEditing(record);
    reset({
      title: record.title,
      description: record.description,
      category: record.category,
      fileUrl: record.fileUrl,
      uploadDate: new Date(record.uploadDate).toISOString().split("T")[0],
      downloadCount: record.downloadCount,
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`https://schooldashboard-production-04e3.up.railway.app/resources/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting resource:", error);
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

export default useResource;
