"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/toast";

import { assignmentSchema } from "@/app/validation/schemas/assignment";
import type { AssignmentFormData } from "@/app/types/type";

export default function AssignmentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

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

  const STORAGE_KEY = "assignment_data";

  const getAssignments = () => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  };

  const saveAssignments = (items: any[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const addAssignment = (assignment: any) => {
    const updated = [...getAssignments(), assignment];
    saveAssignments(updated);
    setAssignments(updated);
  };

  const deleteAssignment = (id: number) => {
    const updated = getAssignments().filter((a: any) => a.id !== id);
    saveAssignments(updated);
    setAssignments(updated);
  };

  useEffect(() => {
    setAssignments(getAssignments());
  }, []);

  const onSubmit = (data: AssignmentFormData) => {
    const newAssignment = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    addAssignment(newAssignment);
    toast({ title: "Assignment created successfully" });
    setOpen(false);
    form.reset();
  };

  const handleDelete = (id: number) => {
    deleteAssignment(id);
    toast({ title: "Assignment deleted" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-sm text-muted-foreground">
            Manage course assignments
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Assignment
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Assignment</DialogTitle>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <Button type="submit" className="w-full">
                Create Assignment
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {assignments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  No assignments yet
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">
                    {assignment.title}
                  </TableCell>
                  <TableCell>{assignment.course}</TableCell>
                  <TableCell>{assignment.dueDate}</TableCell>
                  <TableCell>{assignment.points}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        assignment.status === "Graded"
                          ? "bg-green-100 text-green-800"
                          : assignment.status === "Submitted"
                            ? "bg-blue-100 text-blue-800"
                            : assignment.status === "Late"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/assignments/${assignment.id}`)
                          }
                        >
                          View
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/assignments/${assignment.id}/edit`)
                          }
                        >
                          Edit
                        </DropdownMenuItem>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onSelect={(e) => e.preventDefault()}
                            >
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete assignment?
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDelete(assignment.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
