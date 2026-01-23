"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Eye, MoreHorizontal } from "lucide-react";
import {
  studentSchema,
  StudentFormData,
} from "@/app/validation/schemas/student";
import { ToastProvider, useToast } from "@/components/ui/toast";
import type { Student } from "@/app/types/type";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STORAGE_KEY = "students_data";

export default function StudentPage() {
  const { toast, ToastContainer } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    setStudents(stored ? JSON.parse(stored) : []);
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    }
  }, [students, mounted]);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      grade: "A",
      joinDate: new Date().toISOString().split("T")[0],
    },
  });

  if (!mounted) return null;



  const handleSubmit = (data: StudentFormData) => {
    if (editing?.id) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === editing.id
            ? { ...s, ...data, updatedAt: new Date().toISOString() }
            : s,
        ),
      );
      toast({
        title: "Student updated",
        description: "Student details updated successfully",
      });
    } else {
      setStudents((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...data,
          joinDate: data.joinDate || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    }
    toast({
      title: "Student created",
      description: "Student details added successfully",
    });
    setOpen(false);
    setEditing(null);
    form.reset();
  };

  const handleEdit = (student: Student) => {
    setEditing(student);
    form.reset(student);
  };

  const handleDelete = (id: number) => {
    const student = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Deleted", description: `${student?.name} deleted` });
  };

  const handleView = (id: number) => {
    router.push(`/students/${id}`);
  };

  return (
    <>
      <ToastProvider>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Students</h2>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add Student</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Edit Student" : "Add Student"}
                </DialogTitle>
              </DialogHeader>

              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
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
                  <Label>Grade</Label>
                  <Controller
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C+">C+</SelectItem>
                          <SelectItem value="C"></SelectItem>
                          <SelectItem value="D">D</SelectItem>
                          <SelectItem value="F">F</SelectItem>
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
                <Button type="submit">{editing ? "Update" : "Create"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-8 rounded-lg border bg-white p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.joinDate}</TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleView(student.id)}
                        >
                          <Eye className="w-4 h-4 mr-[-5]" />
                           View
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setEditing(student);
                            form.reset(student);
                            setOpen(true);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-red-500"
                              onSelect={(e) => e.preventDefault()}
                            >
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This student can be undone and will be
                                permanently deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                  setStudents((prev) =>
                                    prev.filter((s) => s.id !== student.id),
                                  );
                                  toast({
                                    title: "Student deleted",
                                    description:
                                      "Student details removed successfully",
                                  });
                                }}
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
        <ToastContainer />
      </ToastProvider>
    </>
  );
}
