"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { CalendarEvent } from "@/app/types/calender";
import { ToastProvider, useToast } from "@/components/ui/toast";

export default function CalendarEventDetailPage() {
  const { toast, ToastContainer } = useToast();
  const params = useParams();
  const router = useRouter();

  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const id = params.id as string;
        const response = await fetch(`http://localhost:3001/calendar/${id}`);
        if (!response.ok) throw new Error("Event not found");
        const data = await response.json();
        setEvent(data);
        setFormData(data);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast({
          title: "Error",
          description: "Event not found",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [params.id, toast]);

  const handleSave = async () => {
    if (!event) return;

    try {
      const response = await fetch(
        `http://localhost:3001/calendar/${event.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      if (!response.ok) throw new Error("Failed to save");
      const updated = await response.json();
      setEvent(updated);
      setIsEditing(false);
      toast({
        title: "Event saved",
        description: "Event updated successfully",
      });
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: "Error",
        description: "Failed to save event",
      });
    }
  };

  const handleDelete = async () => {
    if (event && confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/calendar/${event.id}`,
          {
            method: "DELETE",
          },
        );
        if (!response.ok) throw new Error("Failed to delete");
        toast({
          title: "Event deleted",
          description: "Event deleted successfully",
        });
        setTimeout(() => router.push("/calender"), 800);
      } catch (error) {
        console.error("Error deleting event:", error);
        toast({
          title: "Error",
          description: "Failed to delete event",
        });
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!event) return <div className="p-6">Event not found</div>;

  return (
    <ToastProvider>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Event Details</h1>
            <p className="text-muted-foreground mt-1">
              View and manage event information
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/calender")}>
            Back to Calendar
          </Button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {isEditing ? (
            <div className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">Edit Event</h2>

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
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description"
              />

              <input
                type="date"
                className="w-full border p-2 rounded"
                value={formData.date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />

              <input
                type="time"
                className="w-full border p-2 rounded"
                value={formData.time || ""}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />

              <input
                className="w-full border p-2 rounded"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Location"
              />

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(event);
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
                  <h2 className="text-3xl font-bold">{event.title}</h2>
                  <p className="text-muted-foreground mt-1">
                    {event.date} at {event.time}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-white text-sm bg-blue-500">
                  {event.location}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{event.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-6 border">
                <div>
                  <h3 className="font-semibold mb-2">Date</h3>
                  <p className="text-gray-700">{event.date}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Time</h3>
                  <p className="text-gray-700">{event.time}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-gray-700">{event.location}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/calender/${event.id}/edit`)}
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
