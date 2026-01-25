
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { StudentFormData, studentSchema } from "@/app/validation/schemas/student";
import { Student } from "@/app/types/student";
import { inititalStudents } from "@/app/constants/data";

export default function StudentPage() {
  const router = useRouter();

  const [records, setRecords] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("student_data");
    if(!stored) localStorage.setItem("student_data", JSON.stringify(inititalStudents));
    setRecords(stored ? JSON.parse(stored) : []);
    setMounted(true);
  }, []);

  

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("student_data", JSON.stringify(records));
    }
  }, [records, mounted]);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: { name: "", email:"",grade:"A", joinDate: "" },
  });

  if (!mounted) return null;

  const handleSubmit = (data: StudentFormData) => {
    if (editing) {
      setRecords((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...r, ...data } : r))
      );
    } else {
      setRecords((prev) => [...prev, { id:Date.now(),  ...data }]);
    }
    setOpen(false);
    setEditing(null);
    form.reset();
  };

  const handleEdit = (record: Student) => {
    setEditing(record);
    form.reset();
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const summaryData = [
    { title: "Student Enrolled Today", value: "95%" },
    { title: "A", value: records.filter((a) => a.grade === "A").length },
    { title: "B+", value: records.filter((a) => a.grade === "B+").length },
    { title: "B", value: records.filter((a) => a.grade === "B").length },
    { title: "C+", value: records.filter((a) => a.grade === "C+").length },
    { title: "C", value: records.filter((a) => a.grade === "C").length },
    { title: "D", value: records.filter((a) => a.grade === "D").length },
    { title: "F", value: records.filter((a) => a.grade === "F").length },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Student</h2>
          <p className="text-sm text-gray-500 font-semibold">
            Track and manage student details
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            form.reset({ name: "", email:'', grade:"A", joinDate: new Date().toISOString().split("T")[0] });
            setOpen(true);
          }}
        >
          Add Record
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Student" : "Add Student"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div>
              <Label>Student Name</Label>
              <Input {...form.register("name")} />
              <p className="text-sm text-red-500">{form.formState.errors.name?.message}</p>
            </div>

            <div>
              <Label>Email</Label>
              <Input {...form.register("email")} />
              <p className="text-sm text-red-500">{form.formState.errors.email?.message}</p>
            </div>

            <div>
              <Label>Join Date</Label>
              <Input type="date" {...form.register("joinDate")} />
              <p className="text-sm text-red-500">{form.formState.errors.joinDate?.message}</p>
            </div>

            <div>
              <Label>Grade</Label>
              <select {...form.register("grade")} className="w-full border rounded-md p-2">
                <option value="A">A</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="C">C+</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
            </div>

            <Button type="submit" className="w-full">{editing ? "Update" : "Add"}</Button>
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
              <TableHead>Email</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.name}</TableCell>
                <TableCell>{record.email}</TableCell>
                <TableCell>{record.joinDate}</TableCell>
                <TableCell>{record.grade}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/students/${record.id}`)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(record)}>
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
                            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleDelete(record.id)}
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
