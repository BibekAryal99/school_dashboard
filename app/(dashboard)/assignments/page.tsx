"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SummaryCards } from "@/components/SummaryCards";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";
import { AssignmentForm, assignmentSchema } from "../../validation/utils";

type Assignment = AssignmentForm & {
  id: number;
};

const initialAssignments: Assignment[] = [
  { id: 1, title: "Algebra Homework", subject: "Math", dueDate: "2024-02-15" },
  {
    id: 2,
    title: "Physics Lab Report",
    subject: "Physics",
    dueDate: "2024-02-18",
  },
];

const getSummary = (data: Assignment[]) => [
  { title: "Total Assignments", value: data.length },
  {
    title: "Upcoming",
    value: data.filter((a) => new Date(a.dueDate) > new Date()).length,
  },
  {
    title: "Overdue",
    value: data.filter((a) => new Date(a.dueDate) < new Date()).length,
  },
];

export default function AssignmentsPage() {
  const [assignments, setAssignments] =
    useState<Assignment[]>(initialAssignments);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);

  const form = useForm<AssignmentForm>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: { title: "", subject: "", dueDate: "" },
  });

  const onSubmit = (data: AssignmentForm) => {
    if (editing) {
      setAssignments((prev) =>
        prev.map((a) => (a.id === editing.id ? { ...a, ...data } : a))
      );
    } else {
      setAssignments((prev) => [...prev, { id: Date.now(), ...data }]);
    }

    setOpen(false);
    setEditing(null);
    form.reset();
  };

  const handleEdit = (assignment: Assignment) => {
    setEditing(assignment);
    form.reset(assignment);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold p-4">Assignments</h2>
          <p className="text-sm text-gray-500 font-semibold p-5">
            Create and manage assignments
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mr-6">Add Assignment</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Assignment" : "Add Assignment"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input {...form.register("title")} />
                <p className="text-red-500 text-sm">
                  {form.formState.errors.title?.message}
                </p>
              </div>

              <div>
                <Label>Subject</Label>
                <Input {...form.register("subject")} />
                <p className="text-red-500 text-sm">
                  {form.formState.errors.subject?.message}
                </p>
              </div>

              <div>
                <Label>Due Date</Label>
                <Input type="date" {...form.register("dueDate")} />
                <p className="text-red-500 text-sm">
                  {form.formState.errors.dueDate?.message}
                </p>
              </div>

              <Button type="submit" className="w-full">
                {editing ? "Update Assignment" : "Add Assignment"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-8">
        <SummaryCards data={getSummary(assignments)} />
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell className="font-medium">
                  {assignment.title}
                </TableCell>
                <TableCell>{assignment.subject}</TableCell>
                <TableCell>{assignment.dueDate}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(assignment)}>
                        Edit
                      </DropdownMenuItem>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure want to delete the data?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This assignment will be permanently deleted.
                            </AlertDialogDescription>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
