"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StudentProfile } from "@/app/types/studentprofile";
import { ToastProvider, useToast } from "@/components/ui/toast";

const API_BASE_URL = "http://localhost:3001/studentprofile";

export default function StudentProfileEditPage() {
  const { toast, ToastContainer } = useToast();
  const params = useParams();
  const router = useRouter();

  const [record, setRecord] = useState<StudentProfile | null>(null);
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
        toast({
          title: "Profile saved",
          description: "Profile has been updated successfully",
        });
        setTimeout(() => router.push(`/studentprofile/${record.id}`), 2000);
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

  if (loading) return <div className="p-6">Loading...</div>;
  if (!record) return <div className="p-6">Profile not found</div>;

  return (
    <ToastProvider>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <Button
            variant="outline"
            onClick={() => router.push(`/studentprofile/${record.id}`)}
          >
            Back to Detail
          </Button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter name"
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rollNumber" className="text-base">
                Roll Number
              </Label>
              <Input
                id="rollNumber"
                value={formData.rollNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, rollNumber: e.target.value })
                }
                placeholder="Enter roll number"
                className="h-12 text-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="className" className="text-base">
                  Class
                </Label>
                <Input
                  id="className"
                  value={formData.className || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, className: e.target.value })
                  }
                  placeholder="Enter class"
                  className="h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enrollmentDate" className="text-base">
                  Enrollment Date
                </Label>
                <Input
                  id="enrollmentDate"
                  type="date"
                  value={formData.enrollmentDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, enrollmentDate: e.target.value })
                  }
                  className="h-12 text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianName" className="text-base">
                Guardian Name
              </Label>
              <Input
                id="guardianName"
                value={formData.guardianName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, guardianName: e.target.value })
                }
                placeholder="Enter guardian name"
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email"
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter phone"
                className="h-12 text-lg"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-8 border-t mt-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
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
