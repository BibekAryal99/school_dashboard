"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Resource } from "@/app/types/resource";
import { ToastProvider, useToast } from "@/components/ui/toast";

export default function ResourceEditPage() {
  const { toast, ToastContainer } = useToast();
  const params = useParams();
  const router = useRouter();

  const [record, setRecord] = useState<Resource | null>(null);
  const [formData, setFormData] = useState<Partial<Resource>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const id = params.id as string;
        const response = await fetch(`http://localhost:3001/resources/${id}`);
        if (!response.ok) throw new Error("Resource not found");
        const data = await response.json();
        setRecord(data);
        setFormData(data);
      } catch (error) {
        console.error("Error fetching resource:", error);
        toast({
          title: "Error",
          description: "Resource not found",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [params.id, toast]);

  const handleSave = async () => {
    if (!record) return;

    try {
      const response = await fetch(
        `http://localhost:3001/resources/${record.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      if (!response.ok) throw new Error("Failed to save");
      toast({
        title: "Resource saved",
        description: "Resource has been updated successfully",
      });
      setTimeout(() => router.push(`/resources/${record.id}`), 2000);
    } catch (error) {
      console.error("Error saving resource:", error);
      toast({
        title: "Error",
        description: "Failed to save resource",
      });
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!record) return <div className="p-6">Resource not found</div>;

  return (
    <ToastProvider>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Resource</h1>
          <Button
            variant="outline"
            onClick={() => router.push(`/resources/${record.id}`)}
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
              <Label htmlFor="description" className="text-base">
                Description
              </Label>
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter description"
                className="h-32 text-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base">
                  Category
                </Label>
                <Input
                  id="category"
                  value={formData.category || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Enter category"
                  className="h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="uploadDate" className="text-base">
                  Upload Date
                </Label>
                <Input
                  id="uploadDate"
                  type="date"
                  value={formData.uploadDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, uploadDate: e.target.value })
                  }
                  className="h-12 text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUrl" className="text-base">
                File URL
              </Label>
              <Input
                id="fileUrl"
                value={formData.fileUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fileUrl: e.target.value })
                }
                placeholder="Enter file URL"
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="downloadCount" className="text-base">
                Download Count
              </Label>
              <Input
                id="downloadCount"
                type="number"
                value={formData.downloadCount || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    downloadCount: parseInt(e.target.value),
                  })
                }
                placeholder="Enter download count"
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
