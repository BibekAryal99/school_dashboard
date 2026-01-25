"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { MoreHorizontal } from "lucide-react";
import {
  CourseCreateData,
  courseCreateSchema,
} from "@/app/validation/schemas/course";
import type { Course } from "@/app/types/course";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const STORAGE_KEY = "course_data";

import { initialCourses } from "@/app/constants/data";

const courseService = {
  getAllCourses: () => {
    if (typeof window === "undefined") return [];

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCourses));
      return initialCourses;
    }
    return JSON.parse(stored);
  },

  createCourse: (courseData: CourseCreateData) => {
    const courses = courseService.getAllCourses();
    const newCourse: Course = {
      id: Date.now(),
      ...courseData,
      joinDate: courseData.joinDate ?? new Date().toISOString(),
    };
    courses.push(newCourse);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    return newCourse;
  },

  updateCourse: (id: number, updatedData: Partial<Course>) => {
    const courses = courseService.getAllCourses();
    const index = courses.findIndex((c: Course) => c.id === id);
    if (index === -1) return null;

    courses[index] = { ...courses[index], ...updatedData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    return courses[index];
  },

  deleteCourse: (id: number) => {
    const courses = courseService.getAllCourses();
    const filtered = courses.filter((c: Course) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },
};

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CourseCreateData>({
    resolver: zodResolver(courseCreateSchema),
    defaultValues: {
      name: "",
      instructor: "",
      students: 0,
      status: "Active",
    },
  });

  useEffect(() => {
    setCourses(courseService.getAllCourses());
    setMounted(true);
  }, []);

  const onSubmit = async (data: CourseCreateData) => {
    try {
      const newCourse = courseService.createCourse(data);
      setCourses(courseService.getAllCourses());
      setOpen(false);
      reset();

      setSuccessMessage(`Course "${newCourse.name}" added successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);

      router.replace("/courses");
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course. Please try again.");
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (courseService.deleteCourse(id)) {
      setCourses(courseService.getAllCourses());
      setSuccessMessage(`Course "${name}" deleted successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  if (!mounted) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-sm text-gray-500">
            Manage all courses in the system
          </p>

          {successMessage && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 text-green-700 rounded animate-fadeIn">
              {successMessage}
            </div>
          )}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Add New Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Course Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., Advanced Mathematics"
                  className="mt-1"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="instructor">Instructor *</Label>
                <Input
                  id="instructor"
                  {...register("instructor")}
                  placeholder="e.g., Dr. John Smith"
                  className="mt-1"
                  disabled={isSubmitting}
                />
                {errors.instructor && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.instructor.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="students">Number of Students *</Label>
                <Input
                  id="students"
                  type="number"
                  {...register("students", { valueAsNumber: true })}
                  placeholder="1"
                  min="1"
                  className="mt-1"
                  disabled={isSubmitting}
                />
                {errors.students && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.students.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  {...register("status")}
                  className="w-full border rounded-md p-2 mt-1"
                  disabled={isSubmitting}
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
                {errors.status && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Course"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Course</TableHead>
              <TableHead className="font-semibold">Instructor</TableHead>
              <TableHead className="font-semibold text-center">
                Students
              </TableHead>
              <TableHead className="font-semibold text-center">
                Status
              </TableHead>
              <TableHead className="font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  No courses found. Add your first course!
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell className="text-center">
                    {course.students}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        course.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {course.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/courses/${course.id}`)}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/courses/${course.id}/edit`)
                          }
                        >
                          Edit Course
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-0" onSelect={(e) => e.preventDefault()}>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                className="w-full text-left px-2 py-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                              >
                                Delete Course
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Course
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &quot;
                                  {course.name}&quot;? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDelete(course.id, course.name)
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
