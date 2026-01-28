"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Message } from "@/app/types/message";
import { ToastProvider, useToast } from "@/components/ui/toast";

export default function MessageDetailPage() {
  const { toast, ToastContainer } = useToast();
  const params = useParams();
  const router = useRouter();

  const [record, setRecord] = useState<Message | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Message>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const id = params.id as string;
        const response = await fetch(`http://localhost:3001/messages/${id}`);
        if (!response.ok) throw new Error("Message not found");
        const data = await response.json();
        setRecord(data);
        setFormData(data);
      } catch (error) {
        console.error("Error fetching message:", error);
        toast({
          title: "Error",
          description: "Message not found",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, [params.id, toast]);

  const handleSave = async () => {
    if (!record) return;

    try {
      const response = await fetch(
        `http://localhost:3001/messages/${record.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      if (!response.ok) throw new Error("Failed to save");
      const updated = await response.json();
      setRecord(updated);
      setIsEditing(false);
      toast({
        title: "Message saved",
        description: "Message updated successfully",
      });
    } catch (error) {
      console.error("Error saving message:", error);
      toast({
        title: "Error",
        description: "Failed to save message",
      });
    }
  };

  const handleDelete = async () => {
    if (record && confirm("Are you sure you want to delete this message?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/messages/${record.id}`,
          {
            method: "DELETE",
          },
        );
        if (!response.ok) throw new Error("Failed to delete");
        toast({
          title: "Message deleted",
          description: "Message deleted successfully",
        });
        setTimeout(() => router.push("/messages"), 800);
      } catch (error) {
        console.error("Error deleting message:", error);
        toast({
          title: "Error",
          description: "Failed to delete message",
        });
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!record) return <div className="p-6">Message not found</div>;

  return (
    <ToastProvider>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Message Details</h1>
          <Button variant="outline" onClick={() => router.push("/messages")}>
            Back to Messages
          </Button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {isEditing ? (
            <div className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">Edit Message</h2>
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
                value={formData.content || ""}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Content"
              />
              <input
                className="w-full border p-2 rounded"
                value={formData.sender || ""}
                onChange={(e) =>
                  setFormData({ ...formData, sender: e.target.value })
                }
                placeholder="Sender"
              />
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={formData.date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
              <select
                className="w-full border p-2 rounded"
                value={formData.priority || "Medium"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as Message["priority"],
                  })
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
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
                <h2 className="text-3xl font-bold">{record.title}</h2>
                <p className="text-muted-foreground mt-1">
                  From {record.sender} on {record.date}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border">
                <h3 className="font-semibold mb-2">Content</h3>
                <p className="text-gray-700">{record.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-6 border">
                <div>
                  <h3 className="font-semibold mb-2">Priority</h3>
                  <p className="text-gray-700">{record.priority}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <p className="text-gray-700">
                    {record.isRead ? "Read" : "Unread"}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/messages/${record.id}/edit`)}
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
