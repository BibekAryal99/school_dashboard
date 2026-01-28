"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AttendanceType } from "../types/attendence";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AttendanceFormData,
  attendanceSchema,
} from "../validation/schemas/attendence";

const defaultValues = {
  studentName: "",
  date: "",
  status: "Present" as "Present" | "Absent" | "Late",
};
const useAttendance = () => {
  const router = useRouter();

  const [records, setRecords] = useState<AttendanceType[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AttendanceType | null>(null);

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const response = await fetch("http://localhost:3001/attendance");
        if (!response.ok) throw new Error("Failed to fetch attendance");
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error loading attendance:", error);
      }
    };
    loadAttendance();
  }, []);

  const handleSubmit = async (data: AttendanceFormData) => {
    try {
      if (editing) {
        const response = await fetch(
          `http://localhost:3001/attendance/${editing.id}`,
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
        const response = await fetch("http://localhost:3001/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create");
        const created = await response.json();
        setRecords((prev) => [...prev, created]);
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
    }
    setOpen(false);
    setEditing(null);
    reset();
  };

  const handleEdit = (record: AttendanceType) => {
    setEditing(record);
    reset({
      studentName: record.studentName,
      date: record.date,
      status: record.status as "Present" | "Absent" | "Late",
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/attendance/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting attendance:", error);
    }
  };

  const summaryData = [
    { title: "Attendance Today", value: "95%" },
    {
      title: "Present",
      value: records.filter((a) => a.status === "Present").length,
    },
    {
      title: "Absent",
      value: records.filter((a) => a.status === "Absent").length,
    },
    {
      title: "Late",
      value: records.filter((a) => a.status === "Late").length,
    },
  ];

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

export default useAttendance;
