"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { AnnouncementType } from "@/app/types/announcement";
import { ToastProvider, useToast } from "@/components/ui/toast";

const API_BASE_URL = "http://localhost:3001/announcements";

export default function AnnouncementDetailPage() {
  const { toast, ToastContainer } = useToast();
  const params = useParams();
  const router = useRouter();

  const [announcement, setAnnouncement] = useState<AnnouncementType | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<AnnouncementType>>({});
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
        const updated = await response.json();
        setAnnouncement(updated);
        setIsEditing(false);
        toast({
          title: "Announcement saved",
          description: "Announcement updated successfully",
        });
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

  const handleDelete = async () => {
    if (
      announcement &&
      confirm("Are you sure you want to delete this announcement?")
    ) {
      try {
        const response = await fetch(`${API_BASE_URL}/${announcement.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast({
            title: "Announcement deleted",
            description: "Announcement deleted successfully",
          });
          setTimeout(() => router.push("/announcement"), 800);
        } else {
          toast({
            title: "Error",
            description: "Failed to delete announcement",
          });
        }
      } catch (error) {
        console.error("Error deleting announcement:", error);
        toast({
          title: "Error",
          description: "Failed to delete announcement",
        });
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!announcement) return <div className="p-6">Announcement not found</div>;

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "exam":
        return "bg-blue-500";
      case "event":
        return "bg-green-500";
      case "holiday":
        return "bg-purple-500";
      case "urgent":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <ToastProvider>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Announcement Details</h1>
            <p className="text-muted-foreground mt-1">
              View and manage announcement information
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/announcement")}
          >
            Back to Announcements
          </Button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {isEditing ? (
            <div className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">Edit Announcement</h2>

              <input
                className="w-full border p-2 rounded"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Title"
              />

              <textarea
                className="w-full border p-2 rounded"
                value={formData.message || ""}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Message"
              />

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(announcement);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold">{announcement.title}</h2>
                  <p className="text-muted-foreground mt-1">
                    Published on {announcement.publishedDate}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm ${getCategoryColor(
                    announcement.category,
                  )}`}
                >
                  {announcement.category}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border">
                <h3 className="font-semibold mb-2">Message</h3>
                <p className="text-gray-700">{announcement.message}</p>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/announcement/${announcement.id}/edit`)
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
