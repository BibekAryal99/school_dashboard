"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { courseSchema, CourseFormData } from "@/app/validation/schema";

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
import { MoreHorizontal } from "lucide-react";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Course } from "@/app/types/type";
import { useToast } from "@/components/ui/toast";
import { ToastProvider } from "@radix-ui/react-toast";


export default function CoursesPage() {
  const { toast, ToastContainer } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('course_data');
    setCourses(stored ? JSON.parse(stored) : []);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('course_data', JSON.stringify(courses));
    }
  }, [courses, mounted]);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      instructor: "",
      students: 0,
      status: "Active",
    },
  });

  const onSubmit = (data: CourseFormData) => {
    if (editing) {
      setCourses((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, ...data } : c)),
      );
      toast({
        title: "Course Updated",
        description: "Course have been updated successfully",
      });
    } else {
      setCourses((prev) => [...prev, { id: Date.now(), ...data }]);
    }
    toast({
      title: "Course added",
      description: "Course have been added successfully",
    });

    setOpen(false);
    setEditing(null);
    form.reset();
  };

  const handleEdit = (course: Course) => {
    setEditing(course);
    form.reset(course);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    toast({
      title: "Course deleted",
      description: "Course have been deleted successfully",
    });
  };  

  return (
    <>
      <ToastProvider>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">Courses</h2>
            <p className="text-sm text-gray-500">
              Manage courses with validation
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add Course</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Edit Course" : "Add Course"}
                </DialogTitle>
              </DialogHeader>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div>
                  <Label>Course Name</Label>
                  <Input {...form.register("name")} />
                  <p className="text-sm text-red-500">
                    {form.formState.errors.name?.message}
                  </p>
                </div>

                <div>
                  <Label>Instructor</Label>
                  <Input {...form.register("instructor")} />
                  <p className="text-sm text-red-500">
                    {form.formState.errors.instructor?.message}
                  </p>
                </div>

                <div>
                  <Label>Students</Label>
                  <Input
                    type="number"
                    {...form.register("students", {
                      valueAsNumber: true,
                    })}
                  />
                  <p className="text-sm text-red-500">
                    {form.formState.errors.students?.message}
                  </p>
                </div>

                <div>
                  <Label>Status</Label>
                  <select
                    {...form.register("status")}
                    className="w-full border rounded-md p-2"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <Button type="submit" className="w-full">
                  {editing ? "Update Course" : "Create Course"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>{course.students}</TableCell>
                  <TableCell>{course.status}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(course)}>
                          Edit
                        </DropdownMenuItem>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="bg-red-500"
                            >
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure want to delete the data?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone and will
                                permanently the data.
                              </AlertDialogDescription>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(course.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogHeader>
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
