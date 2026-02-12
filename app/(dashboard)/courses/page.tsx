"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import useCourse from "@/app/hooks/use-course";

export default function CoursesPage() {
  const {
    router,
    records: courses,
    open,
    setOpen,
    form,
    onSubmit,
    handleDelete,
    successMessage,
  } = useCourse();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className="p-6">
     
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-sm text-gray-500">
            Manage all courses in the system
          </p>

          {successMessage && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
              {successMessage}
            </div>
          )}
        </div>

        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Add New Course
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
             
              <div>
                <Label htmlFor="name">Course Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., Advanced Mathematics"
                  className="mt-1"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message as string}
                  </p>
                )}
              </div>

              
              <div>
                <Label htmlFor="instructor">Instructor *</Label>
                <Input
                  id="instructor"
                  {...register("instructor")}
                  placeholder="e.g., Dr. John Smith"
                  className="mt-1"
                  disabled={isSubmitting}
                />
                {errors.instructor && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.instructor.message as string}
                  </p>
                )}
              </div>

             
              <div>
                <Label htmlFor="students">Number of Students *</Label>
                <Input
                  id="students"
                  type="number"
                  min={1}
                  {...register("students", { valueAsNumber: true })}
                  className="mt-1"
                  disabled={isSubmitting}
                />
                {errors.students && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.students.message as string}
                  </p>
                )}
              </div>

             
              <div>
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  {...register("status")}
                  className="w-full border rounded-md p-2 mt-1"
                  disabled={isSubmitting}
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
                {errors.status && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.status.message as string}
                  </p>
                )}
              </div>

             
              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Course"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      
      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Course</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead className="text-center">Students</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No courses found. Add your first course!
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">
                    {course.name}
                  </TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell className="text-center">
                    {course.students}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        course.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {course.status}
                    </span>
                  </TableCell>
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
                           router.push(`/courses/${String(course.id)}`);

                          }
                        >
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/courses/${course.id}/edit`)
                          }
                        >
                          Edit Course
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                        >
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="w-full text-left text-red-600 px-2 py-1.5 hover:bg-red-50 rounded">
                                Delete Course
                              </button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Course
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &quot;
                                  {course.name}&quot;? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDelete(Number(course.id))
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
