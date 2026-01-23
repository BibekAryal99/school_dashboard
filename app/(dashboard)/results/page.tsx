"use client";

import { useEffect, useState } from "react";
import { ResultFormData, resultSchema } from "@/app/validation/schemas/result";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { SummaryCards } from "@/components/SummaryCards";

import { MoreHorizontal, Table as TableIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
import { useToast } from "@/components/ui/toast";
import { ToastProvider } from "@radix-ui/react-toast";
import type { Result } from "@/app/types/type";
import { useRouter } from "next/navigation";

const computeSummary = (results: Result[]) => [
  { title: "Total Exams", value: results.length },
  {
    title: "Average Marks",
    value: results.length
      ? (results.reduce((acc, r) => acc + r.marks, 0) / results.length).toFixed(
          2,
        )
      : 0,
  },
  {
    title: "Students passed",
    value: results.filter((r) => r.grade !== "F").length,
  },
];

export default function ResultsPage() {
  const router = useRouter();
  const { toast, ToastContainer } = useToast();
  const [records, setRecords] = useState<Result[]>([]);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Result | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("results_data");
    setRecords(stored ? JSON.parse(stored) : []);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("results_data", JSON.stringify(records));
    }
  }, [records, mounted]);

  const form = useForm<ResultFormData>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      studentName: "",
      examName: "",
      marks: 0,
      grade: "A",
    },
  });
  if (!mounted) return null;

  const handleSubmit = (data: ResultFormData) => {
    if (editing) {
      setRecords((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...r, ...data } : r)),
      );
      toast({
        title: "Result updated",
        description: "Student result updated successfully",
      });
    } else {
      setRecords((prev) => [...prev, { id: Date.now(), ...data }]);
      toast({
        title: "Result added",
        description: "Student result added successfully",
      });
    }

    setOpen(false);
    setEditing(null);
    form.reset();
  };

  const handleEdit = (record: Result) => {
    setEditing(record);
    form.reset();
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    toast({
      title: "Result deleted",
      description: "Student result removed successfully",
    });
  };

  return (
    <>
      <ToastProvider>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold p-4">Results</h2>
            <p className="text-sm text-gray-500 p-4">
              Add and manage student exam results
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="mr-4">Add Result</Button>
            </DialogTrigger>

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
                  <Label>Exam Name</Label>
                  <Input {...form.register("examName")} />
                  <p className="text-sm text-red-500">
                    {form.formState.errors.examName?.message}
                  </p>
                </div>

                <div>
                  <Label>Marks</Label>
                  <Input
                    type="number"
                    {...form.register("marks", { valueAsNumber: true })}
                  />
                  <p className="text-sm text-red-500">
                    {form.formState.errors.marks?.message}
                  </p>
                </div>

                <div>
                  <Label>Grade</Label>
                  <select
                    {...form.register("grade")}
                    className="w-full border rounded-md p-2"
                  >
                    <option value="A">A</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                  </select>
                </div>

                <Button type="submit" className="w-full">
                  {editing ? "Update Result" : "Add Result"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <SummaryCards data={computeSummary(records)} />

        <div className="rounded-lg border bg-white p-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.studentName}
                  </TableCell>
                  <TableCell>{record.examName}</TableCell>
                  <TableCell>{record.marks}</TableCell>
                  <TableCell>{record.grade}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/results/${record.id}`)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(record)}>
                          Edit
                        </DropdownMenuItem>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-red-600"
                              onSelect={(e) => e.preventDefault()}
                            >
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to delete this data?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone and will
                                permanently delete the result.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(record.id)}
                                className="bg-red-600 hover:bg-red-700"
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
        <ToastContainer />
      </ToastProvider>
    </>
  );
}