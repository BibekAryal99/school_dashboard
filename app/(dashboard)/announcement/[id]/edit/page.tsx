"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AnnouncementType } from "@/app/types/announcement";
import { ToastProvider, useToast } from "@/components/ui/toast";

const API_BASE_URL = "http://localhost:3001/announcements";

export default function AnnouncementEditPage() {
  const params = useParams();
  const { toast, ToastContainer } = useToast();
  const router = useRouter();

  const [announcement, setAnnouncement] = useState<AnnouncementType | null>(
    null,
  );
  const [formData, setFormData] = useState<Partial<AnnouncementType>>({
    title: "",
    message: "",
    category: "General",
    publishedDate: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const id = parseInt(params.id as string);
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (response.ok) {
          const data = await response.json();
          setAnnouncement(data);
          setFormData(data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load announcement",
          });
        }
      } catch (error) {
        console.error("Error fetching announcement:", error);
        toast({
          title: "Error",
          description: "Failed to load announcement",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [params.id, toast]);

  const handleSave = async () => {
    if (!announcement) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${announcement.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Announcement saved",
          description: "Announcement has been updated successfully",
        });
        setTimeout(() => {
          router.push(`/announcement/${announcement.id}`);
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: "Failed to save announcement",
        });
      }
    } catch (error) {
      console.error("Error saving announcement:", error);
      toast({
        title: "Error",
        description: "Failed to save announcement",
      });
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!announcement) return <div className="p-6">Announcement not found</div>;

  return (
    <ToastProvider>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Edit Announcement</h1>
            <p className="text-muted-foreground mt-1">
              Update announcement details
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/announcement/${announcement.id}`)}
          >
            Back to Detail
          </Button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter title"
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-base">
                Message
              </Label>
              <Input
                id="message"
                value={formData.message || ""}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Enter message"
                className="h-32 text-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base">
                  Category
                </Label>
                <select
                  id="category"
                  value={formData.category || "General"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as
                        | "General"
                        | "Exam"
                        | "Event"
                        | "Holiday"
                        | "Urgent",
                    })
                  }
                  className="w-full h-12 rounded-md border px-3 text-lg"
                >
                  <option value="General">General</option>
                  <option value="Exam">Exam</option>
                  <option value="Event">Event</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="publishedDate" className="text-base">
                  Published Date
                </Label>
                <Input
                  id="publishedDate"
                  type="date"
                  value={formData.publishedDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, publishedDate: e.target.value })
                  }
                  className="h-12 text-lg"
                />
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
