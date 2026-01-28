"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AttendanceType } from "@/app/types/attendence";
import { ToastProvider, useToast } from "@/components/ui/toast";

const API_BASE_URL = "http://localhost:3001/attendance";

export default function AttendenceEditPage() {
  const params = useParams();
  const { toast, ToastContainer } = useToast();
  const router = useRouter();
  const [attendance, setAttendance] = useState<AttendanceType | null>(null);
  const [formData, setFormData] = useState<Partial<AttendanceType>>({
    studentName: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const id = params.id as string;
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (response.ok) {
          const data = await response.json();
          setAttendance(data);
          setFormData({
            studentName: data.studentName || "",
            date: data.date || new Date().toISOString().split("T")[0],
            status: data.status || "Present",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to load attendance record",
          });
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
        toast({
          title: "Error",
          description: "Failed to load attendance record",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [params.id, toast]);

  const handleSave = async () => {
    if (!attendance) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${attendance.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Attendence record saved",
          description: "Attendence Record have been saved successfully",
        });
        setTimeout(() => {
          router.push(`/attendence/${attendance.id}`);
        }, 3000);
      } else {
        toast({
          title: "Error",
          description: "Failed to save attendance record",
        });
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast({
        title: "Error",
        description: "Failed to save attendance record",
      });
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!attendance) {
    return <div className="p-6">Attendance record not found</div>;
  }

  return (
    <ToastProvider>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Edit Attendance</h1>
            <p className="text-muted-foreground mt-1">
              Update attendance record information
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/attendence/${attendance.id}`)}
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

              <div className="space-y-2">
                <Label htmlFor="status" className="text-base">
                  Status
                </Label>
                <select
                  id="status"
                  value={formData.status || "Present"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as AttendanceType["status"],
                    })
                  }
                  className="w-full h-12 rounded-md border border-input bg-background px-3 py-2 text-lg"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Excused">Excused</option>
                </select>
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
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}
