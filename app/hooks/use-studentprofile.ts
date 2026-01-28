"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StudentProfile } from "../types/studentprofile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StudentProfileFormData,
  studentProfileSchema,
} from "../validation/schemas/studentprofile";

const defaultValues: StudentProfileFormData = {
  name: "",
  rollNumber: "",
  className: "",
  enrollmentDate: "",
  guardianName: "",
  email: "",
  phone: "",
};

const useStudentProfile = () => {
  const router = useRouter();

  const [records, setRecords] = useState<StudentProfile[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<StudentProfile | null>(null);

  const form = useForm<StudentProfileFormData>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const response = await fetch("http://localhost:3001/studentprofile");
        if (!response.ok) throw new Error("Failed to fetch student profiles");
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error loading student profiles:", error);
      }
    };
    loadProfiles();
  }, []);

  const handleSubmit = async (data: StudentProfileFormData) => {
    try {
      if (editing) {
        const response = await fetch(
          `http://localhost:3001/studentprofile/${editing.id}`,
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
        const response = await fetch("http://localhost:3001/studentprofile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create");
        const created = await response.json();
        setRecords((prev) => [...prev, created]);
      }
    } catch (error) {
      console.error("Error submitting student profile:", error);
    }
    setOpen(false);
    setEditing(null);
    reset();
  };

  const handleEdit = (record: StudentProfile) => {
    setEditing(record);
    reset({
      name: record.name,
      rollNumber: record.rollNumber,
      className: record.className,
      enrollmentDate: new Date(record.enrollmentDate)
        .toISOString()
        .split("T")[0],
      guardianName: record.guardianName,
      email: record.email,
      phone: record.phone,
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:3001/studentprofile/${id}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to delete");
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting student profile:", error);
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

export default useStudentProfile;
