"use client";

import { Student } from "@/app/types/type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "students_data";

export default function StudentDetailPage() {
    const router = useRouter();
    const pathname = usePathname();
    const id = Number(pathname.split("/").pop());
    const [student, setStudent] = useState<Student | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if(stored) {
            const students : Student[] = JSON.parse(stored);
            const s = students.find(s => s.id === id);
            setStudent(s || null);
        }
    }, [id]);

    if(!student) 
        return(
       <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Student not found</p>
       </div>
    );

    const handleEdit = () => {
        router.push(`/students/${id}/edit`);
    };

    return(
        <div className="max-w-4xl mx-auto p-6">
         <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">{student.name}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="font-medium text-gray-700">Email</p>
                    <p className="text-gray-900">{student.email}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-700">Grade</p>
                    <Badge variant={student.grade === "A" ? "default":"destructive"}>
                     {student.grade}
                    </Badge>
                </div>
                <div>
                    <p className="font-medium text-gray-700">Join Date</p>
                    <p className="text-gray-900">{student.joinDate}</p>
                </div>
              </div>
              <div className="pt-4">
              <Button onClick={handleEdit}>Edit</Button>
              </div>
            </CardContent>
         </Card>
        </div>
    )
}