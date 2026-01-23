"use client";

import { Result, Student } from "@/app/types/type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "results_data";

export default function ResultDetailPage() {
    const router = useRouter();
    const pathname = usePathname();
    const id = Number(pathname.split("/").pop());
    const [result, setResult] = useState<Result | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if(stored) {
            const results : Result[] = JSON.parse(stored);
            const r = results.find(r => r.id === id);
            setResult(r || null);
        }
    }, [id]);

    if(!result) 
        return(
       <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Result not found</p>
       </div>
    );

    const handleEdit = () => {
        router.push(`/results/${id}/edit`);
    };

    return(
        <div className="max-w-4xl mx-auto p-6">
         <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">{result.studentName}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="font-medium text-gray-700">Exam Name</p>
                    <p className="text-gray-900">{result.examName}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-700">Grade</p>
                    <Badge variant={result.grade === "A" ? "default":"destructive"}>
                     {result.grade}
                    </Badge>
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