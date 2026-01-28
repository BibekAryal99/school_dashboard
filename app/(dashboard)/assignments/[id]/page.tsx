"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import type { Assignment } from "@/app/types/assignment";

const API_BASE_URL = "http://localhost:3001/assignments";

export default function AssignmentViewPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        if (!params.id) return;
        const response = await fetch(`${API_BASE_URL}/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setAssignment(data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load assignment",
          });
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
        toast({
          title: "Error",
          description: "Failed to load assignment",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [params.id, toast]);

  if (loading) {
    return <div className="p-4 text-center">Loading assignment...</div>;
  }

  if (!assignment) {
    return <div className="p-4 text-center">Assignment not found</div>;
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold">Subject: {assignment.title}</h1>

      <div className="space-y-4">
        <div className="flex flex-col">
          <Label className="text-gray-500">Course</Label>
          <p className="text-gray-800 font-medium">
            {assignment.course || "—"}
          </p>
        </div>

        <div className="flex flex-col">
          <Label className="text-gray-500">Due Date</Label>
          <p className="text-gray-800 font-medium">
            {formatDate(assignment.dueDate)}
          </p>
        </div>

        <div className="flex flex-col">
          <Label className="text-gray-500">Points</Label>
          <p className="text-gray-800 font-medium">{assignment.points}</p>
        </div>

        <div className="flex flex-col">
          <Label className="text-gray-500">Status</Label>
          <p
            className={`font-medium capitalize ${
              assignment.status === "Graded"
                ? "text-green-600"
                : assignment.status === "Submitted"
                  ? "text-blue-600"
                  : assignment.status === "Late"
                    ? "text-red-600"
                    : "text-yellow-600"
            }`}
          >
            {assignment.status}
          </p>
        </div>

        {assignment.createdAt && (
          <div className="flex flex-col text-sm text-gray-500">
            <span>Created: {formatDate(assignment.createdAt)}</span>
          </div>
        )}
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          onClick={() => router.push(`/assignments/${assignment.id}/edit`)}
        >
          Edit Assignment
        </Button>
        <Button variant="outline" onClick={() => router.push("/assignments")}>
          Back to Assignments
        </Button>
      </div>
    </div>
  );
}
