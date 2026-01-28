"use client";

import React from "react";

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
import useStudentProfile from "@/app/hooks/use-studentprofile";

export default function StudentProfilePage() {
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
  } = useStudentProfile();

 

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">Student Profiles</h2>
            <p className="text-sm text-gray-500 font-semibold">
              Personal info, class, ID, enrollment details
            </p>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              form.reset({
                name: "",
                rollNumber: "",
                className: "",
                enrollmentDate: "",
                guardianName: "",
                email: "",
                phone: "",
              });
              setOpen(true);
            }}
          >
            Add Profile
          </Button>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Profile" : "Add Profile"}
              </DialogTitle>
            </DialogHeader>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div>
                <Label>Name</Label>
                <Input {...form.register("name")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.name?.message}
                </p>
              </div>

              <div>
                <Label>Roll Number</Label>
                <Input {...form.register("rollNumber")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.rollNumber?.message}
                </p>
              </div>

              <div>
                <Label>Class</Label>
                <Input {...form.register("className")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.className?.message}
                </p>
              </div>

              <div>
                <Label>Enrollment Date</Label>
                <Input type="date" {...form.register("enrollmentDate")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.enrollmentDate?.message}
                </p>
              </div>

              <div>
                <Label>Guardian Name</Label>
                <Input {...form.register("guardianName")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.guardianName?.message}
                </p>
              </div>

              <div>
                <Label>Email</Label>
                <Input type="email" {...form.register("email")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.email?.message}
                </p>
              </div>

              <div>
                <Label>Phone</Label>
                <Input {...form.register("phone")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.phone?.message}
                </p>
              </div>

              <Button type="submit" className="w-full">
                {editing ? "Update" : "Add"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <div className="rounded-lg border bg-white mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Guardian</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.name}</TableCell>
                  <TableCell>{record.rollNumber}</TableCell>
                  <TableCell>{record.className}</TableCell>
                  <TableCell>{record.guardianName}</TableCell>
                  <TableCell>{record.email}</TableCell>
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
                            router.push(`/studentprofile/${record.id}`)
                          }
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
