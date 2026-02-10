"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Fee } from "@/app/types/fee";
import { ToastProvider, useToast } from "@/components/ui/toast";

const API_BASE_URL = "https://blissful-cat-production.up.railway.app/fees";

export default function FeeDetailPage() {
  const { toast, ToastContainer } = useToast();
  const params = useParams();
  const router = useRouter();

  const [record, setRecord] = useState<Fee | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Fee>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFee = async () => {
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
            description: "Fee not found",
          });
          router.push("/fees");
        }
      } catch (error) {
        console.error("Error fetching fee:", error);
        toast({
          title: "Error",
          description: "Failed to load fee",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchFee();
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
          title: "Fee saved",
          description: "Fee updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save fee",
        });
      }
    } catch (error) {
      console.error("Error saving fee:", error);
      toast({
        title: "Error",
        description: "Failed to save fee",
      });
    }
  };

  const handleDelete = async () => {
    if (record && confirm("Are you sure you want to delete this fee?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/${record.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast({
            title: "Fee deleted",
            description: "Fee deleted successfully",
          });
          setTimeout(() => router.push("/fees"), 800);
        } else {
          toast({
            title: "Error",
            description: "Failed to delete fee",
          });
        }
      } catch (error) {
        console.error("Error deleting fee:", error);
        toast({
          title: "Error",
          description: "Failed to delete fee",
        });
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!record) return <div className="p-6">Fee not found</div>;

  return (
    <ToastProvider>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Fee Details</h1>
          <Button variant="outline" onClick={() => router.push("/fees")}>
            Back to Fees
          </Button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {isEditing ? (
            <div className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">Edit Fee</h2>

              <input
                className="w-full border p-2 rounded"
                value={formData.studentName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, studentName: e.target.value })
                }
                placeholder="Student Name"
              />

              <input
                className="w-full border p-2 rounded"
                value={formData.invoiceNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, invoiceNumber: e.target.value })
                }
                placeholder="Invoice Number"
              />

              <input
                type="number"
                className="w-full border p-2 rounded"
                value={formData.amount || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value),
                  })
                }
                placeholder="Amount"
              />

              <input
                type="date"
                className="w-full border p-2 rounded"
                value={formData.dueDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />

              <select
                className="w-full border p-2 rounded"
                value={formData.paymentStatus || "Pending"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentStatus: e.target.value as Fee["paymentStatus"],
                  })
                }
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>

              <input
                type="date"
                className="w-full border p-2 rounded"
                value={formData.paymentDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, paymentDate: e.target.value })
                }
              />

              <input
                className="w-full border p-2 rounded"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description"
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
                <h2 className="text-3xl font-bold">{record.studentName}</h2>
                <p className="text-muted-foreground mt-1">
                  Invoice: {record.invoiceNumber}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-6 border">
                <div>
                  <h3 className="font-semibold mb-2">Amount</h3>
                  <p className="text-gray-700">${record.amount}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Due Date</h3>
                  <p className="text-gray-700">{record.dueDate}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <p className="text-gray-700">{record.paymentStatus}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Payment Date</h3>
                  <p className="text-gray-700">
                    {record.paymentDate || "N/A"}
                  </p>
                </div>
                <div className="col-span-2">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{record.description}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsEditing(true)}>
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
