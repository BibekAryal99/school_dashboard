"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Assignment } from "@/app/types/assignment";

export default function AssignmentViewPage() {
  const params = useParams();
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);

  const STORAGE_KEY = "assignment_data";

  const getAssignmentById = (id: number) => {
    if (typeof window === "undefined") return undefined;
    const assignments: Assignment[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]",
    );
    return assignments.find((a) => a.id === id);
  };

  useEffect(() => {
    if (!params.id) return;
    const found = getAssignmentById(Number(params.id));
    if (found) setAssignment(found);
  }, [params.id]);

  if (!assignment) {
    return <div className="p-4 text-center">Loading assignment...</div>;
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
      <h1 className="text-2xl font-bold">{assignment.title}</h1>

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
