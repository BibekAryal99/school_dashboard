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
import useAnalytics from "@/app/hooks/use-analytics";

export default function AnalyticsPage() {
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
  } = useAnalytics(); 

  const performanceOptions = ["Excellent", "Good", "Average", "Below Average", "Poor"];

  return (
    
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">Performance Analytics</h2>
            <p className="text-sm text-gray-500 font-semibold">
              Charts, reports, strengths/weaknesses
            </p>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              form.reset({
                subject: "",
                averageScore: 0,
                strength: "",
                weakness: "",
                overallPerformance: "Average",
                date: new Date().toISOString().split("T")[0],
              });
              setOpen(true);
            }}
          >
            Add Analytics
          </Button>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Analytics" : "Add Analytics"}
              </DialogTitle>
            </DialogHeader>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div>
                <Label>Subject</Label>
                <Input {...form.register("subject")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.subject?.message}
                </p>
              </div>

              <div>
                <Label>Average Score</Label>
                <Input
                  type="number"
                  {...form.register("averageScore", { valueAsNumber: true })}
                />
                <p className="text-sm text-red-500">
                  {form.formState.errors.averageScore?.message}
                </p>
              </div>

              <div>
                <Label>Strength</Label>
                <Input {...form.register("strength")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.strength?.message}
                </p>
              </div>

              <div>
                <Label>Weakness</Label>
                <Input {...form.register("weakness")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.weakness?.message}
                </p>
              </div>

              <div>
                <Label>Overall Performance</Label>
                <select
                  {...form.register("overallPerformance")}
                  className="w-full border rounded-md p-2"
                >
                  {performanceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Date</Label>
                <Input type="date" {...form.register("date")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.date?.message}
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
                <TableHead>Subject</TableHead>
                <TableHead>Average Score</TableHead>
                <TableHead>Strength</TableHead>
                <TableHead>Weakness</TableHead>
                <TableHead>Overall Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.subject}
                  </TableCell>
                  <TableCell>{record.averageScore}%</TableCell>
                  <TableCell>{record.strength}</TableCell>
                  <TableCell>{record.weakness}</TableCell>
                  <TableCell>{record.overallPerformance}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/analytics/${record.id}`)}
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
