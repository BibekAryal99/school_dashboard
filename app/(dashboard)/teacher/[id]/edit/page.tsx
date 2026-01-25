"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Teacher } from "@/app/types/teacher";
import { useToast } from "@/components/ui/toast";
import { ToastProvider } from "@radix-ui/react-toast";

const STORAGE_KEY = "teachers_data";

export default function TeacherEditPage() {
  const { toast, ToastContainer } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const id = Number(pathname.split("/")[2]);
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  const form = useForm<Teacher>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      status: "Active",
      joinDate: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const teachers: Teacher[] = JSON.parse(stored);
      const t = teachers.find((t) => t.id === id);
      if (t) {
        setTeacher(t);
        form.reset(t);
      }
    }
  }, [id, form]);

  if (!teacher) return <p className="p-6">Teacher not found.</p>;

  const handleSubmit = (data: Teacher) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const teachers: Teacher[] = JSON.parse(stored);
      const updated = teachers.map((t) =>
        t.id === id ? { ...t, ...data } : t,
      );
      toast({
        title: "Teacher updated",
        description: "Teacher details updated successfully",
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    setTimeout(() => {
      router.push("/teacher");
    }, 3000);
  };

  return (
    <ToastProvider>
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <h1 className="text-3xl font-bold">Edit {teacher.name}</h1>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <Label>Name</Label>
            <Input {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div>
            <Label>Email</Label>
            <Input {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label>Subject</Label>
            <Input {...form.register("subject")} />
            {form.formState.errors.subject && (
              <p className="text-sm text-red-500">
                {form.formState.errors.subject.message}
              </p>
            )}
          </div>
          <div>
            <Label>Status</Label>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label>Join Date</Label>
            <Input type="date" {...form.register("joinDate")} />
            {form.formState.errors.joinDate && (
              <p className="text-sm text-red-500">
                {form.formState.errors.joinDate.message}
              </p>
            )}
          </div>
          <div className="col-span-2 mt-4">
            <Button type="submit">Update Teacher</Button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}
