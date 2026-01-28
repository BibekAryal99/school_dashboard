"use client";

import React from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

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
import useResult from "@/app/hooks/use-result";

export default function ResultPage() {
  const { router,
    records,
    setRecords,
    open,
    setOpen,
    editing,
    setEditing,
    form,
    handleSubmit,
    handleEdit,
    handleDelete,
    summaryData } = useResult();

    const gradeOptions = ["A", "B+", "B", "C+", "C", "D", "F"];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Results</h2>
          <p className="text-sm text-gray-500 font-semibold">
            Track and manage student Result
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            form.reset({
              studentName: "",
              subject: "",
              score: 0,
              totalMarks: 100,
              date: new Date().toISOString().split("T")[0],
              grade: "A",
            });
            setOpen(true);
          }}
        >
          Add Record
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Result" : "Add Result"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div>
              <Label>Student Name</Label>
              <Input {...form.register("studentName")} />
              <p className="text-sm text-red-500">
                {form.formState.errors.studentName?.message}
              </p>
            </div>
            <div>
              <Label>Subject</Label>
              <Input {...form.register("subject")} />
              <p className="text-sm text-red-500">
                {form.formState.errors.subject?.message}
              </p>
            </div>

            <div>
              <Label>Score</Label>
              <Input {...form.register("score", { valueAsNumber: true })} />
              <p className="text-sm text-red-500">
                {form.formState.errors.score?.message}
              </p>
            </div>

            <div>
              <Label>Total Marks</Label>
              <Input
                {...form.register("totalMarks", { valueAsNumber: true })}
              />
              <p className="text-sm text-red-500">
                {form.formState.errors.totalMarks?.message}
              </p>
            </div>

            <div>
              <Label>Exam Name</Label>
              <Input {...form.register("examName")} />
              <p className="text-sm text-red-500">
                {form.formState.errors.examName?.message}
              </p>
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" {...form.register("date")} />
              <p className="text-sm text-red-500">
                {form.formState.errors.date?.message}
              </p>
            </div>

            <div>
              <Label>Grade</Label>
              <select
                {...form.register("grade")}
                className="w-full border rounded-md p-2"
              >
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            <Button type="submit" className="w-full">
              {editing ? "Update" : "Add"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="my-6">
        <SummaryCards data={summaryData} />
      </div>
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Total Marks</TableHead>
              <TableHead>Exam Name</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">
                  {record.studentName}
                </TableCell>
                <TableCell>{record.subject}</TableCell>
                <TableCell>{record.score}</TableCell>
                <TableCell>{record.totalMarks}</TableCell>
                <TableCell>{record.examName}</TableCell>
                <TableCell>{record.grade}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/results/${record.id}`)}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(record)}>
                        Edit
                      </DropdownMenuItem>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirm Delete
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleDelete(Number(record.id))}
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
    </div>
  );
}
