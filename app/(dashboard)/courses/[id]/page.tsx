"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import type { Course } from "@/app/types/course";

const API_BASE_URL = "https://blissful-cat-production.up.railway.app/courses";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`);

        if (!response.ok) {
          setCourse(null);
          return;
        }

        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast({
          title: "Error",
          description: "Failed to load course details.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, toast]);

 
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

 
  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-400 mb-2">😕</p>
          <p className="text-gray-600 text-lg font-semibold">Course not found</p>
          <p className="text-gray-500 text-sm mt-1">
            The course you are looking for does not exist.
          </p>
          <Button
            onClick={() => router.push("/courses")}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <Card className="border">
          <CardHeader className="border-b bg-gray-50">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {course.name}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Course Information</p>
              </div>

              <Badge
                variant={course.status === "Active" ? "default" : "secondary"}
                className="whitespace-nowrap"
              >
                {course.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Instructor
                </label>
                <p className="text-base text-gray-900 mt-1 font-medium">
                  {course.instructor}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Number of Students
                </label>
                <p className="text-base text-gray-900 mt-1">
                  <span className="text-2xl font-bold text-blue-600">
                    {course.students}
                  </span>
                  <span className="text-gray-600 text-sm ml-2">
                    students enrolled
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Course Status
                </label>
                <div className="mt-1">
                  <Badge
                    variant={
                      course.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {course.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.push(`/courses/${course.id}/edit`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Edit Course
              </Button>

              <Button
                onClick={() => router.push("/courses")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900"
              >
                Back to Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
