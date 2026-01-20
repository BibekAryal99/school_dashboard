"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, CourseFormData } from "@/app/validation/schemas/course";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseFormData | null>(null);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: { name: "", instructor: "", students: 0, status: "Active" },
  });

  useEffect(() => {
    const stored = localStorage.getItem("course_data");
    const courses = stored ? JSON.parse(stored) : [];
    const found = courses.find((c: any) => c.id === Number(params.id));
    if (found) {
      setCourse(found);
      form.reset(found);
    }
  }, [params.id]);

  const onSubmit = (data: CourseFormData) => {
    const stored = localStorage.getItem("course_data");
    const courses = stored ? JSON.parse(stored) : [];
    const updatedCourses = courses.map((c: any) =>
      c.id === Number(params.id) ? { ...c, ...data } : c
    );
    localStorage.setItem("course_data", JSON.stringify(updatedCourses));
    router.push(`/course/${params.id}`);
  };

  if (!course) return <p className="p-6">Course not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Edit Course</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Course Name</Label>
          <Input {...form.register("name")} />
        </div>
        <div>
          <Label>Instructor</Label>
          <Input {...form.register("instructor")} />
        </div>
        <div>
          <Label>Students</Label>
          <Input type="number" {...form.register("students", { valueAsNumber: true })} />
        </div>
        <div>
          <Label>Status</Label>
          <select {...form.register("status")} className="w-full border p-2 rounded">
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <Button type="submit">Update Course</Button>
      </form>
    </div>
  );
}
