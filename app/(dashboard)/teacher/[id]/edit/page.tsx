"use client";

import { useRouter, useParams } from "next/navigation";
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

const API_BASE_URL = "http://localhost:3001/teachers";

export default function TeacherEditPage() {
  const { toast, ToastContainer } = useToast();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

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
    const fetchTeacher = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTeacher(data);
          form.reset(data);
        } else {
          toast({
            title: "Error",
            description: "Teacher not found",
          });
          router.push("/teacher");
        }
      } catch (error) {
        console.error("Error fetching teacher:", error);
        toast({
          title: "Error",
          description: "Failed to load teacher",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [id, form, toast, router]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!teacher) return <p className="p-6">Teacher not found.</p>;

  const handleSubmit = async (data: Teacher) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Teacher updated",
          description: "Teacher details updated successfully",
        });
        setTimeout(() => {
          router.push(`/teacher/${id}`);
        }, 3000);
      } else {
        toast({
          title: "Error",
          description: "Failed to update teacher",
        });
      }
    } catch (error) {
      console.error("Error updating teacher:", error);
      toast({
        title: "Error",
        description: "Failed to update teacher",
      });
    }
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
