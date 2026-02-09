"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Message } from "@/app/types/message";
import { ToastProvider, useToast } from "@/components/ui/toast";

const API_BASE_URL = "http://localhost:3001/messages";

export default function MessageEditPage() {
  const { toast, ToastContainer } = useToast();
  const params = useParams();
  const router = useRouter();

  const [record, setRecord] = useState<Message | null>(null);
  const [formData, setFormData] = useState<Partial<Message>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
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
            description: "Message not found",
          });
          router.push("/messages");
        }
      } catch (error) {
        console.error("Error fetching message:", error);
        toast({
          title: "Error",
          description: "Failed to load message",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
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
          title: "Message saved",
          description: "Message has been updated successfully",
        });
        setTimeout(() => router.push(`/messages/${record.id}`), 2000);
      } else {
        toast({
          title: "Error",
          description: "Failed to save message",
        });
      }
    } catch (error) {
      console.error("Error saving message:", error);
      toast({
        title: "Error",
        description: "Failed to save message",
      });
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!record) return <div className="p-6">Message not found</div>;

  return (
    <ToastProvider>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Message</h1>
          <Button
            variant="outline"
            onClick={() => router.push(`/messages/${record.id}`)}
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
              <Label htmlFor="content" className="text-base">
                Content
              </Label>
              <Input
                id="content"
                value={formData.content || ""}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Enter content"
                className="h-32 text-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="sender" className="text-base">
                  Sender
                </Label>
                <Input
                  id="sender"
                  value={formData.sender || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, sender: e.target.value })
                  }
                  placeholder="Enter sender"
                  className="h-12 text-lg"
                />
              </div>

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
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-base">
                Priority
              </Label>
              <select
                id="priority"
                value={formData.priority || "Medium"}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as Message["priority"] })
                }
                className="w-full h-12 rounded-md border px-3 text-lg"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
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
