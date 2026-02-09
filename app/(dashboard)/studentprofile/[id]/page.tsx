"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { StudentProfile } from "@/app/types/studentprofile";
import { ToastProvider, useToast } from "@/components/ui/toast";

const API_BASE_URL = "http://localhost:3001/studentprofile";

export default function StudentProfileDetailPage() {
  const { toast, ToastContainer } = useToast();
  const params = useParams();
  const router = useRouter();

  const [record, setRecord] = useState<StudentProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<StudentProfile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const id = params.id as string;
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (response.ok) {
          const data = await response.json();
          setRecord(data);
          setFormData(data);
        } else {
          toast({
            title: "Error",
            description: "Profile not found",
          });
          router.push("/studentprofile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [params.id, toast, router]);

  const handleSave = async () => {
    if (!record) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${record.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updated = await response.json();
        setRecord(updated);
        setIsEditing(false);
        toast({
          title: "Profile saved",
          description: "Profile updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save profile",
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile",
      });
    }
  };

  const handleDelete = async () => {
    if (record && confirm("Are you sure you want to delete this profile?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/${record.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast({
            title: "Profile deleted",
            description: "Profile deleted successfully",
          });
          setTimeout(() => router.push("/studentprofile"), 800);
        } else {
          toast({
            title: "Error",
            description: "Failed to delete profile",
          });
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
        toast({
          title: "Error",
          description: "Failed to delete profile",
        });
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!record) return <div className="p-6">Profile not found</div>;

  return (
    <ToastProvider>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Student Profile Details</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/studentprofile")}
          >
            Back to Profiles
          </Button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {isEditing ? (
            <div className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">Edit Profile</h2>
              <input
                className="w-full border p-2 rounded"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Name"
              />
              <input
                className="w-full border p-2 rounded"
                value={formData.rollNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, rollNumber: e.target.value })
                }
                placeholder="Roll Number"
              />
              <input
                className="w-full border p-2 rounded"
                value={formData.className || ""}
                onChange={(e) =>
                  setFormData({ ...formData, className: e.target.value })
                }
                placeholder="Class"
              />
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={formData.enrollmentDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, enrollmentDate: e.target.value })
                }
              />
              <input
                className="w-full border p-2 rounded"
                value={formData.guardianName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, guardianName: e.target.value })
                }
                placeholder="Guardian Name"
              />
              <input
                className="w-full border p-2 rounded"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Email"
              />
              <input
                className="w-full border p-2 rounded"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Phone"
              />
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(record);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <div className="p-8 space-y-8">
              <div>
                <h2 className="text-3xl font-bold">{record.name}</h2>
                <p className="text-muted-foreground mt-1">
                  Roll: {record.rollNumber}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-6 border">
                <div>
                  <h3 className="font-semibold mb-2">Class</h3>
                  <p className="text-gray-700">{record.className}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Enrollment Date</h3>
                  <p className="text-gray-700">{record.enrollmentDate}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Guardian</h3>
                  <p className="text-gray-700">{record.guardianName}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-gray-700">{record.email}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-gray-700">{record.phone}</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/studentprofile/${record.id}/edit`)
                  }
                >
                  Edit
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
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
