"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Setting } from "@/app/types/setting";
import { ToastProvider, useToast } from "@/components/ui/toast";

const API_BASE_URL = "http://localhost:3001/settings";

export default function SettingEditPage() {
  const { toast, ToastContainer } = useToast();
  const params = useParams();
  const router = useRouter();

  const [record, setRecord] = useState<Setting | null>(null);
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
        toast({
          title: "Setting saved",
          description: "Setting has been updated successfully",
        });
        setTimeout(() => router.push(`/settings/${record.id}`), 2000);
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

  if (loading) return <div className="p-6">Loading...</div>;
  if (!record) return <div className="p-6">Setting not found</div>;

  return (
    <ToastProvider>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Setting</h1>
          <Button
            variant="outline"
            onClick={() => router.push(`/settings/${record.id}`)}
          >
            Back to Detail
          </Button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-base">
                User ID
              </Label>
              <Input
                id="userId"
                value={formData.userId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                placeholder="Enter user ID"
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme" className="text-base">
                Theme
              </Label>
              <select
                id="theme"
                value={formData.theme || "Auto"}
                onChange={(e) =>
                  setFormData({ ...formData, theme: e.target.value as Setting["theme"] })
                }
                className="w-full h-12 rounded-md border px-3 text-lg"
              >
                <option value="Light">Light</option>
                <option value="Dark">Dark</option>
                <option value="Auto">Auto</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-base">
                Language
              </Label>
              <Input
                id="language"
                value={formData.language || ""}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                placeholder="Enter language"
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="privacy" className="text-base">
                Privacy
              </Label>
              <select
                id="privacy"
                value={formData.privacy || "Private"}
                onChange={(e) =>
                  setFormData({ ...formData, privacy: e.target.value as Setting["privacy"] })
                }
                className="w-full h-12 rounded-md border px-3 text-lg"
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="notificationsEnabled"
                  checked={formData.notificationsEnabled || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notificationsEnabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="notificationsEnabled" className="text-base">
                  Enable Notifications
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="twoFactorAuth"
                  checked={formData.twoFactorAuth || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      twoFactorAuth: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="twoFactorAuth" className="text-base">
                  Enable Two Factor Auth
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastModified" className="text-base">
                Last Modified
              </Label>
              <Input
                id="lastModified"
                type="date"
                value={formData.lastModified || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lastModified: e.target.value })
                }
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
