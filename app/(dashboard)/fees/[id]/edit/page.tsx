"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Fee } from "@/app/types/fee";
import { ToastProvider, useToast } from "@/components/ui/toast";

const STORAGE_KEY = "fee_data";

const getFromStorage = (): Fee[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const getById = (id: number): Fee | undefined => {
  return getFromStorage().find((a) => a.id === id);
};

const updateRecord = (
  id: number,
  data: Partial<Omit<Fee, "id">>,
): Fee | null => {
  const records = getFromStorage();
  const index = records.findIndex((a) => a.id === id);
  if (index === -1) return null;
  records[index] = { ...records[index], ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  return records[index];
};

export default function FeeEditPage() {
  const { toast, ToastContainer } = useToast();
  const params = useParams();
  const router = useRouter();

  const [record, setRecord] = useState<Fee | null>(null);
  const [formData, setFormData] = useState<Partial<Fee>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFee = async () => { 
    const id = parseInt(params.id as string);
    const found = await getById(id);
    if (found) setRecord(found);
    setFormData(found || {});
    setLoading(false);
    };
    fetchFee();
  }, [params.id]);

  const handleSave = () => {
    if (record) {
      const updated = updateRecord(record.id, formData);
      if (updated) {
        toast({
          title: "Fee saved",
          description: "Fee has been updated successfully",
        });
        setTimeout(() => router.push(`/fees/${record.id}`), 2000);
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!record) return <div className="p-6">Fee not found</div>;

  return (
    <ToastProvider>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Fee</h1>
          <Button
            variant="outline"
            onClick={() => router.push(`/fees/${record.id}`)}
          >
            Back to Detail
          </Button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="studentName" className="text-base">
                Student Name
              </Label>
              <Input
                id="studentName"
                value={formData.studentName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, studentName: e.target.value })
                }
                placeholder="Enter student name"
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceNumber" className="text-base">
                Invoice Number
              </Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, invoiceNumber: e.target.value })
                }
                placeholder="Enter invoice number"
                className="h-12 text-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-base">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(e.target.value),
                    })
                  }
                  placeholder="Enter amount"
                  className="h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-base">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="h-12 text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentStatus" className="text-base">
                Payment Status
              </Label>
              <select
                id="paymentStatus"
                value={formData.paymentStatus || "Pending"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentStatus: e.target.value as Fee["paymentStatus"],
                  })
                }
                className="w-full h-12 rounded-md border px-3 text-lg"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDate" className="text-base">
                Payment Date
              </Label>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, paymentDate: e.target.value })
                }
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
