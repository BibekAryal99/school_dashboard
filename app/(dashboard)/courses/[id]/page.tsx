"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import type { Course } from "@/app/types/course";

const API_BASE_URL = "https://blissful-cat-production.up.railway.app/courses";

export default function CourseDetailPage() {
  const router = useRouter();
  const { toast } = useToast();
  const pathname = usePathname(); 
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  
  const id = pathname.split("/").pop();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/${id}`);
        if (!res.ok) {
          setCourse(null);
          return;
        }

        const data: Course = await res.json();
        setCourse(data);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load course details",
        });
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, toast]);

  if (loading) return <p>Loading course details...</p>;
  if (!course) return <p>Course not found</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{course.name}</CardTitle>
        <Badge>{course.status}</Badge>
      </CardHeader>
      <CardContent>
        <p>Instructor: {course.instructor}</p>
        <p>Students: {course.students}</p>
        <Button onClick={() => router.push("/courses")}>Back</Button>
      </CardContent>
    </Card>
  );
}
