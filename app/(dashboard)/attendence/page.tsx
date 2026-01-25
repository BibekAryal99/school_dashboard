
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AttendanceType } from "@/app/types/attendence";
import { AttendanceFormData, attendanceSchema } from "@/app/validation/schemas/attendence";

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

export default function AttendancePage() {
  const router = useRouter();

  const [records, setRecords] = useState<AttendanceType[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AttendanceType | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("attendence_data");
    setRecords(stored ? JSON.parse(stored) : []);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("attendence_data", JSON.stringify(records));
    }
  }, [records, mounted]);

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: { studentName: "", date: "", status: "Present" },
  });

  if (!mounted) return null;

  const handleSubmit = (data: AttendanceFormData) => {
    if (editing) {
      setRecords((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...r, ...data } : r))
      );
    } else {
      setRecords((prev) => [...prev, { id: Date.now(), ...data }]);
    }
    setOpen(false);
    setEditing(null);
    form.reset();
  };

  const handleEdit = (record: AttendanceType) => {
    setEditing(record);
    form.reset();
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const summaryData = [
    { title: "Attendance Today", value: "95%" },
    { title: "Present", value: records.filter((a) => a.status === "Present").length },
    { title: "Absent", value: records.filter((a) => a.status === "Absent").length },
    { title: "Late", value: records.filter((a) => a.status === "Late").length },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Attendance</h2>
          <p className="text-sm text-gray-500 font-semibold">
            Track and manage student attendance
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            form.reset({ studentName: "", date: "", status: "Present" });
            setOpen(true);
          }}
        >
          Add Record
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Attendance" : "Add Attendance"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div>
              <Label>Student Name</Label>
              <Input {...form.register("studentName")} />
              <p className="text-sm text-red-500">{form.formState.errors.studentName?.message}</p>
            </div>

            <div>
              <Label>Date</Label>
              <Input type="date" {...form.register("date")} />
              <p className="text-sm text-red-500">{form.formState.errors.date?.message}</p>
            </div>

            <div>
              <Label>Status</Label>
              <select {...form.register("status")} className="w-full border rounded-md p-2">
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
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
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.studentName}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/attendence/${record.id}`)}>
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
