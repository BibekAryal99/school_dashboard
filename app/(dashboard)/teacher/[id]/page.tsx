"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Teacher } from "@/app/types/type";

const STORAGE_KEY = "teachers_data";

export default function TeacherDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const id = Number(pathname.split("/").pop());
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const teachers: Teacher[] = JSON.parse(stored);
      const t = teachers.find(t => t.id === id);
      setTeacher(t || null);
    }
  }, [id]);

  if (!teacher)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Teacher not found.</p>
      </div>
    );

  const handleEdit = () => {
    router.push(`/teacher/${id}/edit`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{teacher.name}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-700">Email</p>
              <p className="text-gray-900">{teacher.email}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Subject</p>
              <p className="text-gray-900">{teacher.subject}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Status</p>
              <Badge variant={teacher.status === "Active" ? "default" : "destructive"}>
                {teacher.status}
              </Badge>
            </div>
            <div>
              <p className="font-medium text-gray-700">Join Date</p>
              <p className="text-gray-900">{teacher.joinDate}</p>
            </div>
            </div>
          <div className="pt-4">
            <Button onClick={handleEdit}>Edit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
