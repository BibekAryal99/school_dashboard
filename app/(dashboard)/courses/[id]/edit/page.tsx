"use client";
import { Course } from "@/app/types/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { ToastProvider } from "@radix-ui/react-toast";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const API_BASE_URL = "http://localhost:3001/courses";

export default function CourseEditPage() {
  const { toast, ToastContainer } = useToast();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<Course>({
    defaultValues: {
      name: "",
      instructor: "",
      students: 0,
      status: "Active",
      joinDate: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
          form.reset(data);
        } else {
          toast({
            title: "Error",
            description: "Course not found",
          });
          router.push("/courses");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast({
          title: "Error",
          description: "Failed to load course",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, form, toast, router]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!course) return <p className="p-6">Course not found</p>;

  const handleSubmit = async (data: Course) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Course Updated",
          description: "Course details updated successfully",
        });
        setTimeout(() => {
          router.push(`/courses/${id}`);
        }, 3000);
      } else {
        toast({
          title: "Error",
          description: "Failed to update course",
        });
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: "Error",
        description: "Failed to update course",
      });
    }
  };

  return (
    <ToastProvider>
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <h1 className="text-3xl font-bold">Edit {course.name}</h1>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <Label>Name</Label>
            <Input {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div>
            <Label>Instructor</Label>
            <Input {...form.register("instructor")} />
            {form.formState.errors.instructor && (
              <p className="text-sm text-red-500">
                {form.formState.errors.instructor.message}
              </p>
            )}
          </div>
          <div>
            <Label>Status</Label>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label>Join Date</Label>
            <Input type="date" {...form.register("joinDate")} />
          </div>
          <div className="col-span-2 mt-4">
            <Button type="submit">Update Course</Button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}
