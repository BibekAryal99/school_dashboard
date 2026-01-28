"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Analytics } from "@/app/types/analytics";
import { ToastProvider, useToast } from "@/components/ui/toast";

export default function AnalyticsDetailPage() {
  const { toast, ToastContainer } = useToast();
  const params = useParams();
  const router = useRouter();

  const [record, setRecord] = useState<Analytics | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Analytics>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const id = params.id as string;
        const response = await fetch(`http://localhost:3001/analytics/${id}`);
        if (!response.ok) throw new Error("Analytics not found");
        const data = await response.json();
        setRecord(data);
        setFormData(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast({
          title: "Error",
          description: "Analytics not found",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [params.id, toast]);

  const handleSave = async () => {
    if (!record) return;

    try {
      const response = await fetch(
        `http://localhost:3001/analytics/${record.id}`,
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
        title: "Analytics saved",
        description: "Analytics updated successfully",
      });
    } catch (error) {
      console.error("Error saving analytics:", error);
      toast({
        title: "Error",
        description: "Failed to save analytics",
      });
    }
  };

  const handleDelete = async () => {
    if (record && confirm("Are you sure you want to delete this analytics?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/analytics/${record.id}`,
          {
            method: "DELETE",
          },
        );
        if (!response.ok) throw new Error("Failed to delete");
        toast({
          title: "Analytics deleted",
          description: "Analytics deleted successfully",
        });
        setTimeout(() => router.push("/analytics"), 800);
      } catch (error) {
        console.error("Error deleting analytics:", error);
        toast({
          title: "Error",
          description: "Failed to delete analytics",
        });
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!record) return <div className="p-6">Analytics not found</div>;

  return (
    <ToastProvider>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Analytics Details</h1>
          <Button variant="outline" onClick={() => router.push("/analytics")}>
            Back to Analytics
          </Button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {isEditing ? (
            <div className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">Edit Analytics</h2>
              <input
                className="w-full border p-2 rounded"
                value={formData.subject || ""}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="Subject"
              />
              <input
                type="number"
                className="w-full border p-2 rounded"
                value={formData.averageScore || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    averageScore: parseFloat(e.target.value),
                  })
                }
                placeholder="Average Score"
              />
              <input
                className="w-full border p-2 rounded"
                value={formData.strength || ""}
                onChange={(e) =>
                  setFormData({ ...formData, strength: e.target.value })
                }
                placeholder="Strength"
              />
              <input
                className="w-full border p-2 rounded"
                value={formData.weakness || ""}
                onChange={(e) =>
                  setFormData({ ...formData, weakness: e.target.value })
                }
                placeholder="Weakness"
              />
              <select
                className="w-full border p-2 rounded"
                value={formData.overallPerformance || "Average"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    overallPerformance: e.target
                      .value as Analytics["overallPerformance"],
                  })
                }
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Below Average">Below Average</option>
              </select>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={formData.date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
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
                <h2 className="text-3xl font-bold">{record.subject}</h2>
                <p className="text-muted-foreground mt-1">
                  Score: {record.averageScore}%
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-6 border">
                <div>
                  <h3 className="font-semibold mb-2">Strength</h3>
                  <p className="text-gray-700">{record.strength}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Weakness</h3>
                  <p className="text-gray-700">{record.weakness}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Overall Performance</h3>
                  <p className="text-gray-700">{record.overallPerformance}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Date</h3>
                  <p className="text-gray-700">{record.date}</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/analytics/${record.id}/edit`)}
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
