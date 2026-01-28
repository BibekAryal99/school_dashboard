"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Message } from "../types/message";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageFormData, messageSchema } from "../validation/schemas/message";

const defaultValues = {
  title: "",
  content: "",
  sender: "",
  date: "",
  priority: "Medium" as "Low" | "Medium" | "High",
};

const useMessage = () => {
  const router = useRouter();

  const [records, setRecords] = useState<Message[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Message | null>(null);

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch("http://localhost:3001/messages");
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };
    loadMessages();
  }, []);

  const handleSubmit = async (data: MessageFormData) => {
    try {
      if (editing) {
        const response = await fetch(
          `http://localhost:3001/messages/${editing.id}`,
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
        const response = await fetch("http://localhost:3001/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create");
        const created = await response.json();
        setRecords((prev) => [...prev, created]);
      }
    } catch (error) {
      console.error("Error submitting message:", error);
    }
    setOpen(false);
    setEditing(null);
    reset();
  };

  const handleEdit = (record: Message) => {
    setEditing(record);
    reset({
      title: record.title,
      content: record.content,
      sender: record.sender,
      date: record.date,
      priority: record.priority as "Low" | "Medium" | "High",
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/messages/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
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

export default useMessage;
