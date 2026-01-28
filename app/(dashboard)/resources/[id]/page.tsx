"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Resource } from "@/app/types/resource";
import { ToastProvider, useToast } from "@/components/ui/toast";

export default function ResourceDetailPage() {
  const { toast, ToastContainer } = useToast();
  const params = useParams();
  const router = useRouter();

  const [record, setRecord] = useState<Resource | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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
      const updated = await response.json();
      setRecord(updated);
      setIsEditing(false);
      toast({
        title: "Resource saved",
        description: "Resource updated successfully",
      });
    } catch (error) {
      console.error("Error saving resource:", error);
      toast({
        title: "Error",
        description: "Failed to save resource",
      });
    }
  };

  const handleDelete = async () => {
    if (record && confirm("Are you sure you want to delete this resource?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/resources/${record.id}`,
          {
            method: "DELETE",
          },
        );
        if (!response.ok) throw new Error("Failed to delete");
        toast({
          title: "Resource deleted",
          description: "Resource deleted successfully",
        });
        setTimeout(() => router.push("/resources"), 800);
      } catch (error) {
        console.error("Error deleting resource:", error);
        toast({
          title: "Error",
          description: "Failed to delete resource",
        });
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!record) return <div className="p-6">Resource not found</div>;

  return (
    <ToastProvider>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Resource Details</h1>
          <Button variant="outline" onClick={() => router.push("/resources")}>
            Back to Resources
          </Button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {isEditing ? (
            <div className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">Edit Resource</h2>
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
                className="w-full border p-2 rounded"
                value={formData.category || ""}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="Category"
              />
              <input
                className="w-full border p-2 rounded"
                value={formData.fileUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fileUrl: e.target.value })
                }
                placeholder="File URL"
              />
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={formData.uploadDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, uploadDate: e.target.value })
                }
              />
              <input
                type="number"
                className="w-full border p-2 rounded"
                value={formData.downloadCount || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    downloadCount: parseInt(e.target.value),
                  })
                }
                placeholder="Download Count"
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
                <h2 className="text-3xl font-bold">{record.title}</h2>
                <p className="text-muted-foreground mt-1">
                  Category: {record.category}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{record.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-6 border">
                <div>
                  <h3 className="font-semibold mb-2">Upload Date</h3>
                  <p className="text-gray-700">{record.uploadDate}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Downloads</h3>
                  <p className="text-gray-700">{record.downloadCount}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="font-semibold mb-2">File URL</h3>
                  <p className="text-gray-700 break-all">
                    <a
                      href={record.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {record.fileUrl}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/resources/${record.id}/edit`)}
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
