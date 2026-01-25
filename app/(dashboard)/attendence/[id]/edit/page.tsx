"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AttendanceType } from "@/app/types/attendence";
import { defaultAttendance } from "@/app/constants/data";
import { ToastProvider, useToast } from "@/components/ui/toast";

const ATTENDANCE_STORAGE_KEY = "attendence_data";

const getAttendanceFromStorage = (): AttendanceType[] => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(
      ATTENDANCE_STORAGE_KEY,
      JSON.stringify(defaultAttendance),
    );
    return defaultAttendance;
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error parsing attendance from localStorage:", error);
    return [];
  }
};

const getAttendanceById = (id: number): AttendanceType | undefined => {
  const attendance = getAttendanceFromStorage();
  return attendance.find((item) => item.id === id);
};

const updateAttendance = (
  id: number,
  attendanceData: Partial<Omit<AttendanceType, "id">>,
): AttendanceType | null => {
  const attendance = getAttendanceFromStorage();
  const index = attendance.findIndex((s) => s.id === id);

  if (index === -1) return null;

  attendance[index] = { ...attendance[index], ...attendanceData };
  localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(attendance));
  return attendance[index];
};

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
    const id = parseInt(params.id as string);
    const foundAttendance = getAttendanceById(id);

    if (foundAttendance) {
      setAttendance(foundAttendance);
      setFormData({
        studentName: foundAttendance.studentName || "",
        date: foundAttendance.date || new Date().toISOString().split("T")[0],
        status: foundAttendance.status || "Present",
      });
    }
    setLoading(false);
  }, [params.id]);

  const handleSave = () => {
    if (attendance) {
      const updatedAttendance = updateAttendance(attendance.id, formData);
      if (updatedAttendance) {
        toast({
          title: "Attendence record saved",
          description: "Attendence Record have been saved successfully",
        });
        setTimeout(() => {
          router.push(`/attendence/${attendance.id}`);
        }, 3000);
      }
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
                    setFormData({ ...formData, status: e.target.value as any })
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
