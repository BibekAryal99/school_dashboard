"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Result } from "@/app/types/result";
import { defaultResults } from "@/app/constants/data";
import { useToast } from "@/components/ui/toast";
import { ToastProvider } from "@radix-ui/react-toast";

const RESULT_STORAGE_KEY = "results_data";

const getResultFromStorage = (): Result[] => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(RESULT_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(defaultResults));
    return defaultResults;
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error parsing attendance from localStorage:", error);
    return [];
  }
};

const getResultById = (id: number): Result | undefined => {
  const result = getResultFromStorage();
  return result.find((item) => item.id === id);
};

const updateResult = (
  id: number,
  resultData: Partial<Omit<Result, "id">>,
): Result | null => {
  const result = getResultFromStorage();
  const index = result.findIndex((r) => r.id === id);

  if (index === -1) return null;

  result[index] = { ...result[index], ...resultData };
  localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
  return result[index];
};

const deleteResult = (id: number): boolean => {
  const result = getResultFromStorage();
  const initialLength = result.length;
  const filteredResult = result.filter((r) => r.id !== id);

  if (filteredResult.length === initialLength) {
    return false;
  }

  localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(filteredResult));
  return true;
};

export default function ResultDetailPage() {
  const params = useParams();
  const {toast, ToastContainer} = useToast();
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Result>>({
    studentName: "",
    subject: "",
    score: 0,
    totalMarks: 100,
    examName: "",
    date: new Date().toISOString().split("T")[0],
    grade: "A",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = parseInt(params.id as string);
    const foundResult = getResultById(id);

    if (foundResult) {
      setResult(foundResult);
      setFormData({
        studentName: foundResult.studentName || "",
        subject: foundResult.subject || "",
        score: foundResult.score || 0,
        totalMarks: foundResult.totalMarks || 100,
        examName: foundResult.examName || "",
        date: foundResult.date || new Date().toISOString().split("T")[0],
        grade: foundResult.grade || "A",
      });
    }
    setLoading(false);
  }, [params.id]);

  const handleSave = () => {
    if (result) {
      const updatedResult = updateResult(result.id, formData);
      if (updatedResult) {
        setResult(updatedResult);
        setIsEditing(false);
        toast({
          title:"Result update",
          description:"Result have been updated successfully",
        })
      }
    }
  };

  const handleDelete = () => {
    if (
      result &&
      confirm("Are you sure you want to delete this attendance record?")
    ) {
      const deleted = deleteResult(result.id);
      if (deleted) {
        alert("Result record deleted successfully!");
        router.push("/results");
      }
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!result) {
    return <div className="p-6">Result record not found</div>;
  }
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return "bg-green-500";
      case "absent":
        return "bg-red-500";
      case "late":
        return "bg-yellow-500";
      case "excused":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <ToastProvider> 
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Result Details</h1>
          <p className="text-muted-foreground mt-1">
            View and manage result information
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push("/results")}>
            Back to Result
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {isEditing ? (
          <div className="p-8 space-y-8">
            <div className="border-b pb-6">
              <h2 className="text-2xl font-bold text-primary">Edit Result</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Update result information below
              </p>
            </div>
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    studentName: result.studentName || "",
                    date:
                      result.date || new Date().toISOString().split("T")[0],
                    grade: result.grade || "A",
                  });
                }}
                className="h-12 px-6 text-base"
              >
                Cancel
              </Button>
              <Button onClick={handleSave} className="h-12 px-6 text-base">
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-primary">
                  {result.studentName}
                </h2>
                <p className="text-muted-foreground text-lg mt-1">
                  Result Details
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2 min-w-30 text-center">
                <p className="text-xs font-medium text-gray-600">
                  Result ID
                </p>
                <p className="text-lg font-bold text-gray-800">
                  #{result.id}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-sm font-medium text-black-700 mb-1">
                  Subject
                </h3>
                <p className="text-2xl font-bold text-black-900">
                  {result.subject || "N/A"}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-sm font-medium text-black-700 mb-1">
                  Score
                </h3>
                <p className="text-2xl font-bold text-black-900">
                  {result.score || 0}/{result.totalMarks || 0}
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-sm font-medium text-black-700 mb-1">
                  Percentage
                </h3>
                <p className="text-2xl font-bold text-black-900">
                  {result.score && result.totalMarks
                    ? ((result.score / result.totalMarks) * 100).toFixed(2)
                    : "0.00"}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-card rounded-xl p-6 border">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">
                    Result Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Student Name
                      </h4>
                      <p className="text-lg font-medium">
                        {result.studentName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Subject
                      </h4>
                      <p className="text-lg font-medium">
                        {result.subject || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Exam Name
                      </h4>
                      <p className="text-lg font-medium">
                        {result.examName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Date
                      </h4>
                      <p className="text-lg font-medium">
                        {result.date || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card rounded-xl p-6 border">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">
                    Performance Metrics
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Obtained Score
                      </h4>
                      <p className="text-2xl font-bold text-primary">
                        {result.score || 0}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Total Marks
                      </h4>
                      <p className="text-2xl font-bold text-muted-foreground">
                        {result.totalMarks || 0}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Percentage
                      </h4>
                      <p className="text-2xl font-bold text-success">
                        {result.score && result.totalMarks
                          ? ((result.score / result.totalMarks) * 100).toFixed(2)
                          : "0.00"}%
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Grade
                      </h4>
                      <p className="text-2xl font-bold">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(result.grade || "A")}`}
                        >
                          {result.grade || "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => router.push(`/results/${result.id}/edit`)}
                className="h-12 px-6 text-base"
              >
                Edit Page
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="h-12 px-6 text-base"
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    <ToastContainer />
    </ToastProvider>
  );
}
