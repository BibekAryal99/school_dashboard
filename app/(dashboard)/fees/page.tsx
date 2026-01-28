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
import useFee from "@/app/hooks/use-fee";


export default function FeePage() {
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
  } = useFee();

  const paymentStatusOptions = ["Paid", "Pending", "Overdue"];

  return (
  
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">Fees & Payments</h2>
            <p className="text-sm text-gray-500 font-semibold">
              Invoices, payment status
            </p>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              form.reset({
                studentName: "",
                invoiceNumber: "",
                amount: 0,
                dueDate: "",
                paymentStatus: "Pending",
                paymentDate: "",
                description: "",
              });
              setOpen(true);
            }}
          >
            Add Fee
          </Button>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Fee" : "Add Fee"}</DialogTitle>
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
                <Label>Invoice Number</Label>
                <Input {...form.register("invoiceNumber")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.invoiceNumber?.message}
                </p>
              </div>

              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  {...form.register("amount", { valueAsNumber: true })}
                />
                <p className="text-sm text-red-500">
                  {form.formState.errors.amount?.message}
                </p>
              </div>

              <div>
                <Label>Due Date</Label>
                <Input type="date" {...form.register("dueDate")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.dueDate?.message}
                </p>
              </div>

              <div>
                <Label>Payment Status</Label>
                <select
                  {...form.register("paymentStatus")}
                  className="w-full border rounded-md p-2"
                >
                 {paymentStatusOptions.map((status) => (
                   <option key={status} value={status}>
                     {status}
                   </option>
                 ))}
                </select>
              </div>

              <div>
                <Label>Payment Date</Label>
                <Input type="date" {...form.register("paymentDate")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.paymentDate?.message}
                </p>
              </div>

              <div>
                <Label>Description</Label>
                <Input {...form.register("description")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.description?.message}
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
                <TableHead>Student Name</TableHead>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
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
                  <TableCell>{record.invoiceNumber}</TableCell>
                  <TableCell>${record.amount}</TableCell>
                  <TableCell>{record.dueDate}</TableCell>
                  <TableCell>{record.paymentStatus}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/fees/${record.id}`)}
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
