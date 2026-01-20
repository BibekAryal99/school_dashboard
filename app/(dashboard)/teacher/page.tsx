"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { MoreHorizontal, Eye, Trash, Edit } from "lucide-react";
import type { Teacher } from "@/app/types/type";
import { TeacherFormData, teacherSchema } from "@/app/validation/schemas/teacher";
import { ToastProvider, useToast } from "@/components/ui/toast";

const STORAGE_KEY = "teachers_data";

export default function TeachersPage() {
  const { toast, ToastContainer } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);

  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setTeachers(stored ? JSON.parse(stored) : []);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
  }, [teachers, mounted]);

  const form = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      status: "Active",
      joinDate: new Date().toISOString().split("T")[0],
    },
  });

  if (!mounted) return null;

  const handleSubmit = (data: TeacherFormData) => {
    if (editing?.id) {
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === editing.id
            ? { ...t, ...data, updatedAt: new Date().toISOString() }
            : t,
        ),
      );
      toast({
        title: "Updated",
        description: `${data.name} updated successfully`,
      });
    } else {
      setTeachers((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...data,
          joinDate: data.joinDate || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);

      toast({ title: "Added", description: `${data.name} added successfully` });
    }
    setEditing(null);
    form.reset();
  };

  const handleEdit = (teacher: Teacher) => {
    setEditing(teacher);
    form.reset(teacher);
  };

  const handleDelete = (id: number) => {
    const teacher = teachers.find((t) => t.id === id);
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    toast({ title: "Deleted", description: `${teacher?.name} deleted` });
  };

  const handleView = (id: number) => {
    router.push(`/teacher/${id}`);
  };

  return (
    <ToastProvider>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Teachers</h2>
          <Button onClick={() => setEditing({} as Teacher)}>Add Teacher</Button>
        </div>

        {editing !== null && (
          <div className="p-4 border rounded-lg mb-6 bg-white shadow-sm">
            <h3 className="text-xl font-semibold mb-4">
              {editing?.id ? "Edit Teacher" : "Add Teacher"}
            </h3>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <Label>Name *</Label>
                <Input {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Email *</Label>
                <Input {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Subject *</Label>
                <Input {...form.register("subject")} />
                {form.formState.errors.subject && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.subject.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Status *</Label>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
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
                <Label>Join Date *</Label>
                <Input type="date" {...form.register("joinDate")} />
                {form.formState.errors.joinDate && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.joinDate.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full mt-2">
                  {editing?.id ? "Update Teacher" : "Add Teacher"}
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>{teacher.status}</TableCell>
                  <TableCell>{teacher.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleView(teacher.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(teacher)}>
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure want to delete?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(teacher.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}
