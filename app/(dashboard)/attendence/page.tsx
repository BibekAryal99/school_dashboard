"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Attendance } from "@/app/types/type";

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
import { MoreHorizontal } from "lucide-react";
import { AttendanceFormData, attendanceSchema } from "../../validation/schema";
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
import { initialAttendance } from "@/app/constants/data";

const summaryData = [
  { title: "Attendance Today", value: 95 + "%" },
  {
    title: "Present",
    value: initialAttendance.filter((a) => a.status === "Present").length,
  },
  {
    title: "Absent",
    value: initialAttendance.filter((a) => a.status === "Absent").length,
  },
  {
    title: "Late",
    value: initialAttendance.filter((a) => a.status === "Late").length,
  },
];

export default function AttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Attendance | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("attendence_data");
    setRecords(stored ? JSON.parse(stored) : []);
    setMounted(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("attendence_data", JSON.stringify(records));
  }, [records, mounted]);

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: { studentName: "", date: "", status: "Present" },
  });
  if (!mounted) return null;

  const handleSubmit = (data: AttendanceFormData) => {
    if (editing) {
      setRecords((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...r, ...data } : r)),
      );
    } else {
      setRecords((prev) => [...prev, { id: Date.now(), ...data }]);
    }
    setOpen(false);
    setEditing(null);
    form.reset();
  };

  const handleEdit = (record: Attendance) => {
    setEditing(record);
    form.reset(record);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold p-4">Attendance</h2>
          <p className="text-sm text-gray-500 font-semibold p-5">
            Track and manage student attendance
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mr-6">Add Record</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Attendance" : "Add Attendance"}
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
                <Label>Date</Label>
                <Input type="date" {...form.register("date")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.date?.message}
                </p>
              </div>

              <div>
                <Label>Status</Label>
                <select
                  {...form.register("status")}
                  className="w-full border rounded-md p-2"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                </select>
              </div>

              <Button type="submit" className="w-full">
                {editing ? "Update" : "Add"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-8">
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
                <TableCell className="font-medium">
                  {record.studentName}
                </TableCell>
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
                      <DropdownMenuItem onClick={() => handleEdit(record)}>
                        Edit
                      </DropdownMenuItem>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="bg-red-500">
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure want to delete the data?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone and will permanently
                              the data.
                            </AlertDialogDescription>
                            <AlertDialogFooter>
                              <AlertDialogCancel></AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDelete(record.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogHeader>
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
