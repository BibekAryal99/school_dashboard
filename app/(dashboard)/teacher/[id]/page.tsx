"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Teacher } from "@/app/types/teacher";

export default function TeacherDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const id = params.id as string;
        const response = await fetch(`http://localhost:3001/teachers/${id}`);
        if (!response.ok) {
          throw new Error("Teacher not found");
        }
        const data = await response.json();
        setTeacher(data);
      } catch (error) {
        console.error("Error fetching teacher:", error);
        // Redirect to teachers list if teacher not found
        router.push('/teacher');
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [params.id, router]);

  if (!teacher)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-gray-500 text-lg font-semibold">
            Teacher not found
          </p>
          <p className="text-gray-400 text-sm mt-1">
            The teacher record you are looking for does not exist.
          </p>
        </div>
      </div>
    );

  const handleEdit = () => {
    router.push(`/teacher/${teacher?.id}/edit`);
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <Card className="border">
          <CardHeader className="border-b bg-gray-50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {teacher.name}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Teacher Information
                </p>
              </div>
              <Badge
                variant={
                  teacher.status === "Active" ? "default" : "destructive"
                }
                className={`whitespace-nowrap ${teacher.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
                  }`}
              >
                {teacher.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="text-base text-gray-900 mt-1">{teacher.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Subject
                </label>
                <p className="text-base text-gray-900 mt-1">
                  {teacher.subject}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Join Date
                </label>
                <p className="text-base text-gray-900 mt-1">
                  {teacher.joinDate}
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleEdit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors py-2"
              >
                Edit Teacher
              </Button>
              <Button
                onClick={() => router.back()}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors py-2"
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
