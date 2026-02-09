"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Setting } from "@/app/types/setting";
import { ToastProvider, useToast } from "@/components/ui/toast";

const API_BASE_URL = "http://localhost:3001/settings";

export default function SettingDetailPage() {
  const { toast, ToastContainer } = useToast();
  const params = useParams();
  const router = useRouter();

  const [record, setRecord] = useState<Setting | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Setting>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSetting = async () => {
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
            description: "Setting not found",
          });
          router.push("/settings");
        }
      } catch (error) {
        console.error("Error fetching setting:", error);
        toast({
          title: "Error",
          description: "Failed to load setting",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSetting();
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
          title: "Setting saved",
          description: "Setting updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save setting",
        });
      }
    } catch (error) {
      console.error("Error saving setting:", error);
      toast({
        title: "Error",
        description: "Failed to save setting",
      });
    }
  };

  const handleDelete = async () => {
    if (record && confirm("Are you sure you want to delete this setting?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/${record.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast({
            title: "Setting deleted",
            description: "Setting deleted successfully",
          });
          setTimeout(() => router.push("/settings"), 800);
        } else {
          toast({
            title: "Error",
            description: "Failed to delete setting",
          });
        }
      } catch (error) {
        console.error("Error deleting setting:", error);
        toast({
          title: "Error",
          description: "Failed to delete setting",
        });
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!record) return <div className="p-6">Setting not found</div>;

  return (
    <ToastProvider>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Setting Details</h1>
          <Button variant="outline" onClick={() => router.push("/settings")}>
            Back to Settings
          </Button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {isEditing ? (
            <div className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">Edit Setting</h2>
              <input
                className="w-full border p-2 rounded"
                value={formData.userId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                placeholder="User ID"
              />
              <select
                className="w-full border p-2 rounded"
                value={formData.theme || "Auto"}
                onChange={(e) =>
                  setFormData({ ...formData, theme: e.target.value as Setting["theme"] })
                }
              >
                <option value="Light">Light</option>
                <option value="Dark">Dark</option>
                <option value="Auto">Auto</option>
              </select>
              <input
                className="w-full border p-2 rounded"
                value={formData.language || ""}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                placeholder="Language"
              />
              <select
                className="w-full border p-2 rounded"
                value={formData.privacy || "Private"}
                onChange={(e) =>
                  setFormData({ ...formData, privacy: e.target.value as Setting["privacy"] })
                }
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.notificationsEnabled || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notificationsEnabled: e.target.checked,
                      })
                    }
                  />
                  Enable Notifications
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.twoFactorAuth || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        twoFactorAuth: e.target.checked,
                      })
                    }
                  />
                  Enable 2FA
                </label>
              </div>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={formData.lastModified || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lastModified: e.target.value })
                }
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
                <h2 className="text-3xl font-bold">{record.userId}</h2>
                <p className="text-muted-foreground mt-1">
                  Last Modified: {record.lastModified}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-6 border">
                <div>
                  <h3 className="font-semibold mb-2">Theme</h3>
                  <p className="text-gray-700">{record.theme}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Language</h3>
                  <p className="text-gray-700">{record.language}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Privacy</h3>
                  <p className="text-gray-700">{record.privacy}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Notifications</h3>
                  <p className="text-gray-700">
                    {record.notificationsEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Two Factor Auth</h3>
                  <p className="text-gray-700">
                    {record.twoFactorAuth ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/settings/${record.id}/edit`)}
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
