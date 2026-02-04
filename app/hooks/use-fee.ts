"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Fee } from "../types/fee";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FeeFormData, feeSchema } from "../validation/schemas/fee";

const defaultValues = {
  studentName: "",
  invoiceNumber: "",
  amount: 0,
  dueDate: "",
  paymentStatus: "Pending" as "Paid" | "Pending" | "Overdue",
  paymentDate: "",
  description: "",
};

const useFee = () => {
  const router = useRouter();

  const [records, setRecords] = useState<Fee[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Fee | null>(null);

  const form = useForm<FeeFormData>({
    resolver: zodResolver(feeSchema),
    defaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    const loadFees = async () => {
      try {
        const response = await fetch("https://schooldashboard-production-04e3.up.railway.app/fees");
        if (!response.ok) throw new Error("Failed to fetch fees");
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error loading fees:", error);
      }
    };
    loadFees();
  }, []);

  const handleSubmit = async (data: FeeFormData) => {
    try {
      if (editing) {
        const response = await fetch(
          `https://schooldashboard-production-04e3.up.railway.app/fees/${editing.id}`,
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
        const response = await fetch("https://schooldashboard-production-04e3.up.railway.app/fees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create");
        const created = await response.json();
        setRecords((prev) => [...prev, created]);
      }
    } catch (error) {
      console.error("Error submitting fee:", error);
    }
    setOpen(false);
    setEditing(null);
    reset();
  };

  const handleEdit = (record: Fee) => {
    setEditing(record);
    reset({
      studentName: record.studentName,
      invoiceNumber: record.invoiceNumber,
      amount: record.amount,
      dueDate: record.dueDate,
      paymentStatus: record.paymentStatus as "Paid" | "Pending" | "Overdue",
      paymentDate: record.paymentDate || "",
      description: record.description,
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`https://schooldashboard-production-04e3.up.railway.app/fees/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting fee:", error);
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

export default useFee;
