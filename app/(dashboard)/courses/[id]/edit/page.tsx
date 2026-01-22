"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, CourseFormData } from "@/app/validation/schemas/course";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Item } from "@/app/types/type";

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseFormData | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      instructor: "",
      students: 0,
      status: "Active",
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem("course_data");
    if (stored) {
      const courses = JSON.parse(stored);
      const found = courses.find((c: Item) => c.id === Number(params.id));

      if (found) {
        setCourse(found);
        form.reset({
          name: found.name,
          instructor: found.instructor,
          students: found.students,
          status: found.status,
        });
      }
    }
    setLoading(false);
  }, [params.id, form]);

  const onSubmit = (data: CourseFormData) => {
    const stored = localStorage.getItem("course_data");
    if (!stored) return;

    const courses = JSON.parse(stored);
    const updatedCourses = courses.map((c: Item) =>
      c.id === Number(params.id) ? { ...c, ...data } : c,
    );

    localStorage.setItem("course_data", JSON.stringify(updatedCourses));
    router.push(`/courses/${params.id}`);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/courses">
            <Button variant="ghost" size="icon">
              ←
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Course Not Found</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">
            The course you are looking for does not exist.
          </p>
        </div>

        <Link href="/courses">
          <Button variant="outline">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/courses/${params.id}`}>
            <Button variant="ghost" size="icon">
              ←
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
            <p className="text-gray-500">Update course information</p>
          </div>
        </div>

        <Link href={`/courses/${params.id}`}>
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Course Name *
              </Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Enter course name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructor" className="text-sm font-medium">
                Instructor *
              </Label>
              <Input
                id="instructor"
                {...form.register("instructor")}
                placeholder="Enter instructor name"
              />
              {form.formState.errors.instructor && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.instructor.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="students" className="text-sm font-medium">
                Number of Students *
              </Label>
              <Input
                id="students"
                type="number"
                {...form.register("students", { valueAsNumber: true })}
                placeholder="1"
                min="1"
              />
              {form.formState.errors.students && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.students.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status *
              </Label>
              <select
                id="status"
                {...form.register("status")}
                className="w-full border rounded-md p-2"
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
              {form.formState.errors.status && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.status.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              Update Course
            </Button>
            <Link href={`/courses/${params.id}`} className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
