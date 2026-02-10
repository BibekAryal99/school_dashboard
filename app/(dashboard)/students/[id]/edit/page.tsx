"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Student } from "@/app/types/student";

const API_BASE_URL = "https://blissful-cat-production.up.railway.app/students";

export default function StudentEditPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    joinDate: "",
    grade: "A",
  });

  // prevents form reset after user edits
  const initializedRef = useRef(false);

  // Normalize date to YYYY-MM-DD
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (!params?.id) return;

    const fetchStudent = async () => {
      try {
        const id = params.id as string;
        const response = await fetch(`${API_BASE_URL}/${id}`);

        if (!response.ok) {
          toast({ title: "Error", description: "Student not found" });
          router.push("/students");
          return;
        }

        const data: Student = await response.json();
        setStudent(data);

        // hydrate form ONLY ONCE
        if (!initializedRef.current) {
          setFormData({
            name: data.name ?? "",
            email: data.email ?? "",
            joinDate: formatDate(data.joinDate),
            grade: data.grade ?? "A",
          });
          initializedRef.current = true;
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to load student",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [params?.id, router, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!student) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${student.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        toast({
          title: "Error",
          description: "Failed to save student",
        });
        return;
      }

      toast({
        title: "Saved",
        description: "Student updated successfully",
      });

      setTimeout(() => {
        router.push(`/students/${student.id}`);
      }, 1500);
    } catch {
      toast({
        title: "Error",
        description: "Failed to save student",
      });
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!student) return <div className="p-6">Student record not found</div>;

  return (
    <>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Edit Student</h1>
            <p className="text-muted-foreground mt-1">
              Update student information
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/students/${student.id}`)}
          >
            Back to Detail
          </Button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-8 space-y-6">
          <div>
            <Label className="text-base">Student Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter student name"
              className="h-12 text-lg"
            />
          </div>

          <div>
            <Label className="text-base">Email</Label>
            <Input
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email"
              className="h-12 text-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label className="text-base">Join Date</Label>
              <Input
                type="date"
                value={formData.joinDate}
                onChange={(e) =>
                  handleInputChange("joinDate", e.target.value)
                }
                className="h-12 text-lg"
              />
            </div>

            <div>
              <Label className="text-base">Grade</Label>
              <select
                value={formData.grade}
                onChange={(e) =>
                  handleInputChange("grade", e.target.value)
                }
                className="w-full h-12 rounded-md border bg-background px-3 py-2 text-lg"
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
          </div>

          <div className="flex justify-end space-x-4 pt-8 border-t">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </div>

      <Toaster />
    </>
  );
}

