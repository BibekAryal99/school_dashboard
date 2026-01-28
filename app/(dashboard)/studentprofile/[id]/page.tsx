"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { StudentProfile } from "@/app/types/studentprofile";
import { ToastProvider, useToast } from "@/components/ui/toast";

const STORAGE_KEY = "studentprofile_data";

const getFromStorage = (): StudentProfile[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const getById = (id: number): StudentProfile | undefined => {
  return getFromStorage().find((a) => a.id === id);
};

const updateRecord = (
  id: number,
  data: Partial<Omit<StudentProfile, "id">>,
): StudentProfile | null => {
  const records = getFromStorage();
  const index = records.findIndex((a) => a.id === id);
  if (index === -1) return null;
  records[index] = { ...records[index], ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  return records[index];
};

const deleteRecord = (id: number): boolean => {
  const records = getFromStorage();
  const filtered = records.filter((a) => a.id !== id);
  if (filtered.length === records.length) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

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
    const id = parseInt(params.id as string);
    const found = await getById(id);
    if (found) {
      setRecord(found);
      setFormData(found);
    }
    setLoading(false);
};
    fetchProfile();
  }, [params.id]);

  const handleSave = () => {
    if (!record) return;
    const updated = updateRecord(record.id, formData);
    if (updated) {
      setRecord(updated);
      setIsEditing(false);
      toast({
        title: "Profile saved",
        description: "Profile updated successfully",
      });
    }
  };

  const handleDelete = () => {
    if (record && confirm("Are you sure you want to delete this profile?")) {
      if (deleteRecord(record.id)) {
        toast({
          title: "Profile deleted",
          description: "Profile deleted successfully",
        });
        setTimeout(() => router.push("/studentprofile"), 800);
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
