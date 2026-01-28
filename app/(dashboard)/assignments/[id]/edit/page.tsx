"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import type { Assignment, AssignmentFormData } from "@/app/types/assignment";
import { assignmentSchema } from "@/app/validation/schemas/assignment";

const API_BASE_URL = "http://localhost:3001/assignments";

export default function EditAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: "",
      course: "",
      dueDate: "",
      points: 100,
      status: "Pending",
    },
  });

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        if (!params.id) return;
        const response = await fetch(`${API_BASE_URL}/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setAssignment(data);
          form.reset({
            title: data.title,
            course: data.course,
            dueDate: data.dueDate,
            points: data.points,
            status: data.status,
          });
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
  }, [params.id, form, toast]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!assignment) return <div className="p-4">Assignment not found</div>;

  const onSubmit: SubmitHandler<AssignmentFormData> = async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${assignment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({ title: "Assignment updated successfully" });
        router.push(`/assignments/${assignment.id}`);
      } else {
        toast({
          title: "Error",
          description: "Failed to update assignment",
        });
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast({
        title: "Error",
        description: "Failed to update assignment",
      });
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Edit Assignment</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label>Assignment Title</Label>
          <Input {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        <div>
          <Label>Course</Label>
          <Input
            placeholder="e.g. Mathematics 101"
            {...form.register("course")}
          />
          {form.formState.errors.course && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.course.message}
            </p>
          )}
        </div>

        <div>
          <Label>Due Date</Label>
          <Input type="date" {...form.register("dueDate")} />
          {form.formState.errors.dueDate && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.dueDate.message}
            </p>
          )}
        </div>

        <div>
          <Label>Points</Label>
          <Input
            type="number"
            {...form.register("points", { valueAsNumber: true })}
          />
          {form.formState.errors.points && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.points.message}
            </p>
          )}
        </div>

        <div>
          <Label>Status</Label>
          <select
            {...form.register("status")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="Pending">Pending</option>
            <option value="Submitted">Submitted</option>
            <option value="Graded">Graded</option>
            <option value="Late">Late</option>
          </select>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="submit">Update Assignment</Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push(`/assignments/${assignment.id}`)}
          >
            Cancel / Back
          </Button>
        </div>
      </form>
    </div>
  );
}
