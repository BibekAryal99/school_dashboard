"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { CourseFormData } from "@/app/validation/schemas/course";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseFormData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("course_data");
    const courses = stored ? JSON.parse(stored) : [];
    const found = courses.find((c: any) => c.id === Number(params.id));
    setCourse(found || null);
  }, [params.id]);

  if (!course) return <p className="p-6">Course not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">{course.name}</h1>
      <p><strong>Instructor:</strong> {course.instructor}</p>
      <p><strong>Students:</strong> {course.students}</p>
      <p><strong>Status:</strong> {course.status}</p>

      <div className="flex gap-2 mt-4">
        <Button onClick={() => router.push(`/course/${course.id}/edit`)}>Edit Course</Button>
        <Button variant="secondary" onClick={() => router.push("/course")}>Back to Courses</Button>
      </div>
    </div>
  );
}
