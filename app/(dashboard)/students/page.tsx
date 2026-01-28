 "use client";

import React from "react";
import useStudent from "@/app/hooks/use-student";
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
import { Loader, MoreHorizontal } from "lucide-react";

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

export default function StudentPage() {
  const {
    router,
    records,
    open,
    setOpen,
    editing,
    setEditing,
    form,
    handleSubmit,
    handleEdit,
    handleDelete,
  } = useStudent();

  const studentGradeOptions = ["A", "B+", "B", "C+", "C", "D", "F"];

  const summaryData = [
    { title: "Total Students", value: records.length.toString(), change: "+12%" },
    { title: "Active Students", value: records.filter(r => r.grade !== 'F').length.toString(), change: "+5%" },
    { title: "Average Grade", value: "B+", change: "+2%" },
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
            form.reset({
              name: "",
              email: "",
              grade: "A",
              joinDate: new Date().toISOString().split("T")[0],
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
              {editing ? "Edit Student" : "Add Student"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div>
              <Label>Student Name</Label>
              <Input {...form.register("name")} />
              <p className="text-sm text-red-500">
                {form.formState.errors.name?.message}
              </p>

            </div>

            <div>
              <Label>Email</Label>
              <Input {...form.register("email")} />
              <p className="text-sm text-red-500">
                {form.formState.errors.email?.message}
              </p>
            </div>

            <div>
              <Label>Join Date</Label>
              <Input type="date" {...form.register("joinDate")} />
              <p className="text-sm text-red-500">
                {form.formState.errors.joinDate?.message}
              </p>
            </div>

            <div>
              <Label>Grade</Label>
              <select
                {...form.register("grade")}
                className="w-full border rounded-md p-2"
              >
              {studentGradeOptions.map((grade) => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  {editing ? "Updating..." : "Adding..."}
                </>
              ) : editing ? (
                "Update Student"
              ) : (
                "Add Student"
              )}
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
                      <DropdownMenuItem
                        onClick={() => router.push(`/students/${record.id}`)}
                      >
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
