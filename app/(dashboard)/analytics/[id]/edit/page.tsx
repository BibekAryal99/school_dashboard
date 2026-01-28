"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Analytics } from "@/app/types/analytics";
import { ToastProvider, useToast } from "@/components/ui/toast";

export default function AnalyticsEditPage() {
  const { toast, ToastContainer } = useToast();
  const params = useParams();
  const router = useRouter();

  const [record, setRecord] = useState<Analytics | null>(null);
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
      toast({
        title: "Analytics saved",
        description: "Analytics has been updated successfully",
      });
      setTimeout(() => router.push(`/analytics/${record.id}`), 2000);
    } catch (error) {
      console.error("Error saving analytics:", error);
      toast({
        title: "Error",
        description: "Failed to save analytics",
      });
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!record) return <div className="p-6">Analytics not found</div>;

  return (
    <ToastProvider>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Analytics</h1>
          <Button
            variant="outline"
            onClick={() => router.push(`/analytics/${record.id}`)}
          >
            Back to Detail
          </Button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-base">
                Subject
              </Label>
              <Input
                id="subject"
                value={formData.subject || ""}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="Enter subject"
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="averageScore" className="text-base">
                Average Score
              </Label>
              <Input
                id="averageScore"
                type="number"
                value={formData.averageScore || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    averageScore: parseFloat(e.target.value),
                  })
                }
                placeholder="Enter score"
                className="h-12 text-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="strength" className="text-base">
                  Strength
                </Label>
                <Input
                  id="strength"
                  value={formData.strength || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, strength: e.target.value })
                  }
                  placeholder="Enter strength"
                  className="h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weakness" className="text-base">
                  Weakness
                </Label>
                <Input
                  id="weakness"
                  value={formData.weakness || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, weakness: e.target.value })
                  }
                  placeholder="Enter weakness"
                  className="h-12 text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="overallPerformance" className="text-base">
                Overall Performance
              </Label>
              <select
                id="overallPerformance"
                value={formData.overallPerformance || "Average"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    overallPerformance: e.target
                      .value as Analytics["overallPerformance"],
                  })
                }
                className="w-full h-12 rounded-md border px-3 text-lg"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Below Average">Below Average</option>
              </select>
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
