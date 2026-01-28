"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { AttendanceType } from "@/app/types/attendence";
import { ToastProvider, useToast } from "@/components/ui/toast";

const API_BASE_URL = "http://localhost:3001/attendance";

export default function AttendenceDetailPage() {
  const { toast, ToastContainer } = useToast();
  const params = useParams();
  const router = useRouter();
  const [attendance, setAttendance] = useState<AttendanceType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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
        const updated = await response.json();
        setAttendance(updated);
        setIsEditing(false);
        toast({
          title: "Attendence saved",
          description: "Attendence Record have been saved successfully",
        });
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

  const handleDelete = async () => {
    if (
      attendance &&
      confirm("Are you sure you want to delete this attendance record?")
    ) {
      try {
        const response = await fetch(`${API_BASE_URL}/${attendance.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast({
            title: "Attendence deleted",
            description: "Attendence Record deleted successfully",
          });
          setTimeout(() => {
            router.push("/attendence");
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to delete attendance record",
          });
        }
      } catch (error) {
        console.error("Error deleting attendance:", error);
        toast({
          title: "Error",
          description: "Failed to delete attendance record",
        });
      }
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!attendance) {
    return <div className="p-6">Attendance record not found</div>;
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
            <h1 className="text-3xl font-bold">Attendance Details</h1>
            <p className="text-muted-foreground mt-1">
              View and manage attendance information
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push("/attendence")}
            >
              Back to Attendance
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {isEditing ? (
            <div className="p-8 space-y-8">
              <div className="border-b pb-6">
                <h2 className="text-2xl font-bold text-primary">
                  Edit Attendance
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Update attendance information below
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      studentName: attendance.studentName || "",
                      date:
                        attendance.date ||
                        new Date().toISOString().split("T")[0],
                      status: attendance.status || "Present",
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
                    {attendance.studentName}
                  </h2>
                  <p className="text-muted-foreground text-lg mt-1">
                    Attendance Details
                  </p>
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2 min-w-30 text-center">
                  <p className="text-xs font-medium text-gray-600">
                    Attendance ID
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    #{attendance.id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-sm font-medium text-black-700 mb-1">
                    Student Name
                  </h3>
                  <p className="text-2xl font-bold text-black-900">
                    {attendance.studentName || "N/A"}
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-sm font-medium text-black-700 mb-1">
                    Date
                  </h3>
                  <p className="text-2xl font-bold text-black-900">
                    {attendance.date || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl p-6 border">
                  <h3 className="text-sm font-medium mb-1">Status</h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(attendance.status || "Present")}`}
                  >
                    {attendance.status || "N/A"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-card rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">
                      Attendance Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Student Name
                        </h4>
                        <p className="text-lg font-medium">
                          {attendance.studentName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Date
                        </h4>
                        <p className="text-lg font-medium">
                          {attendance.date || "N/A"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Status
                        </h4>
                        <p className="text-lg font-medium">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(attendance.status || "Present")}`}
                          >
                            {attendance.status || "N/A"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-card rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">
                      Additional Info
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Record ID
                        </h4>
                        <p className="text-2xl font-bold text-primary">
                          #{attendance.id}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Status Type
                        </h4>
                        <p className="text-lg font-medium capitalize">
                          {attendance.status?.toLowerCase() || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/attendence/${attendance.id}/edit`)
                  }
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
