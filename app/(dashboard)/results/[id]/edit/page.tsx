"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Result } from "@/app/types/result";
import { ToastProvider, useToast } from "@/components/ui/toast";

const getResultById = async (id: string): Promise<Result | undefined> => {
  try {
    const response = await fetch(`http://localhost:3001/results/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch result: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching result:', error);
    return undefined;
  }
};

const updateResult = async (
  id: string,
  resultData: Partial<Omit<Result, "id">>,
): Promise<Result | null> => {
  try {
    const response = await fetch(`http://localhost:3001/results/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resultData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update result: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating result:', error);
    return null;
  }
};

export default function ResultEditPage() {
  const { toast, ToastContainer } = useToast();
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);
  const [formData, setFormData] = useState<Partial<Result>>({
    studentName: "",
    subject: "",
    score: 0,
    totalMarks: 100,
    date: new Date().toISOString().split("T")[0],
    grade: "A",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      const id = params.id as string;
      const foundResult = await getResultById(id);

      if (foundResult) {
        setResult(foundResult);
        setFormData({
          studentName: foundResult?.studentName || "",
          subject: foundResult?.subject || "",
          score: foundResult?.score || 0,
          totalMarks: foundResult?.totalMarks || 100,
          examName: foundResult?.examName || "",
          date: foundResult?.date || new Date().toISOString().split("T")[0],
          grade: foundResult?.grade || "A",
        });
      } else {
        toast({
          title: "Error",
          description: "Result not found",
        });
        router.push('/results');
      }

      setLoading(false);
    }
    fetchResult();
  }, [params.id]);

  const handleSave = async () => {
    if (result) {
      const updatedResult = await updateResult(result.id.toString(), formData);
      if (updatedResult) {
        toast({
          title: "Result saved",
          description: "Result has been saved successfully",
        });
        setTimeout(() => {
          router.push(`/results/${result.id}`);
        }, 1000);
      } else {
        toast({
          title: "Error",
          description: "Failed to save result",
        });
      }
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!result) {
    return <div className="p-6">Result record not found</div>;
  }

  return (
    <ToastProvider>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Edit Result</h1>
            <p className="text-muted-foreground mt-1">
              Update result record information
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/results/${result.id}`)}
            >
              Back to Detail
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="studentName" className="text-base">
                Student Name
              </Label>
              <Input
                id="studentName"
                value={formData.studentName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, studentName: e.target.value })
                }
                placeholder="Enter student name"
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-base">
                Subject
              </Label>
              <Input
                id="subject"
                value={formData.subject || ""}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="Enter subject"
                className="h-12 text-lg"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="score" className="text-base">
                  Score
                </Label>
                <Input
                  id="score"
                  type="number"
                  value={formData.score || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, score: Number(e.target.value) })
                  }
                  placeholder="Enter score"
                  className="h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalMarks" className="text-base">
                  Total Marks
                </Label>
                <Input
                  id="totalMarks"
                  type="number"
                  value={formData.totalMarks || 100}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalMarks: Number(e.target.value),
                    })
                  }
                  placeholder="Enter total marks"
                  className="h-12 text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="examName" className="text-base">
                Exam Name
              </Label>
              <Input
                id="examName"
                value={formData.examName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, examName: e.target.value })
                }
                placeholder="Enter exam name"
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade" className="text-base">
                Grade
              </Label>
              <select
                id="grade"
                value={formData.grade || "A"}
                onChange={(e) =>
                  setFormData({ ...formData, grade: e.target.value as Result["grade"] })
                }
                className="w-full h-12 rounded-md border border-input bg-background px-3 py-2 text-lg"
              >
                <option value="A">A</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-base">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="h-12 text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-8 border-t mt-8">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="h-12 px-6 text-base"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="h-12 px-6 text-base">
            Save Changes
          </Button>
        </div>
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}
