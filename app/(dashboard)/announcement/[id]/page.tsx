"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { AnnouncementType } from "@/app/types/announcement";
import { ToastProvider, useToast } from "@/components/ui/toast";

const ANNOUNCEMENT_STORAGE_KEY = "announcement_data";

const getAnnouncementsFromStorage = (): AnnouncementType[] => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error parsing announcements:", error);
    return [];
  }
};

const getAnnouncementById = (id: number): AnnouncementType | undefined => {
  const announcements = getAnnouncementsFromStorage();
  return announcements.find((a) => a.id === id);
};

const updateAnnouncement = (
  id: number,
  data: Partial<Omit<AnnouncementType, "id">>,
): AnnouncementType | null => {
  const announcements = getAnnouncementsFromStorage();
  const index = announcements.findIndex((a) => a.id === id);

  if (index === -1) return null;

  announcements[index] = { ...announcements[index], ...data };
  localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, JSON.stringify(announcements));

  return announcements[index];
};

const deleteAnnouncement = (id: number): boolean => {
  const announcements = getAnnouncementsFromStorage();
  const filtered = announcements.filter((a) => a.id !== id);

  if (filtered.length === announcements.length) return false;

  localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

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
    const id = parseInt(params.id as string);
    const found = getAnnouncementById(id);

    if (found) {
      setAnnouncement(found);
      setFormData(found);
    }
    setLoading(false);
  }, [params.id]);

  const handleSave = () => {
    if (!announcement) return;

    const updated = updateAnnouncement(announcement.id, formData);
    if (updated) {
      setAnnouncement(updated);
      setIsEditing(false);
      toast({
        title: "Announcement saved",
        description: "Announcement updated successfully",
      });
    }
  };

  const handleDelete = () => {
    if (
      announcement &&
      confirm("Are you sure you want to delete this announcement?")
    ) {
      const deleted = deleteAnnouncement(announcement.id);
      if (deleted) {
        toast({
          title: "Announcement deleted",
          description: "Announcement deleted successfully",
        });
        setTimeout(() => router.push("/announcement"), 800);
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
