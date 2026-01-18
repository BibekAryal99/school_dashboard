"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FakeApiProduct, Product } from "@/app/types/type";
import { ProductFormData, productSchema } from "@/app/validation/schema";

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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

import { ToastProvider, useToast } from "@/components/ui/toast";

const STORAGE_KEY = "products_data";

export default function ProductsPage() {
  const { toast, ToastContainer } = useToast();

  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    if (products.length > 0) return;
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data: FakeApiProduct[]) => {
        const formatted: Product[] = data.map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          category: p.category,
          status: "Available",
        }));
        setProducts(formatted);
      });
  }, [products.length]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      price: 0,
      category: "",
      status: "Available",
    },
  });
  const handleSubmit = (data: ProductFormData) => {
    if (editing) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...data } : p)),
      );

      toast({
        title: "Product updated",
        description: "Product updated successfully",
      });
    } else {
      setProducts((prev) => [...prev, { id: Date.now(), ...data }]);

      toast({
        title: "Product added",
        description: "New product added successfully",
      });
    }

    setOpen(false);
    setEditing(null);
    form.reset();
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    form.reset(product);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({
      title: "Product deleted",
      description: "Product removed successfully",
    });
  };

  return (
    <ToastProvider>
      <div className="flex justify-between items-center mb-6 p-4">
        <h2 className="text-3xl font-bold">Products</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Product" : "Add Product"}
              </DialogTitle>
            </DialogHeader>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div>
                <Label>Title</Label>
                <Input {...form.register("title")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.title?.message}
                </p>
              </div>

              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  {...form.register("price", {
                    valueAsNumber: true,
                  })}
                />
                <p className="text-sm text-red-500">
                  {form.formState.errors.price?.message}
                </p>
              </div>

              <div>
                <Label>Category</Label>
                <Input {...form.register("category")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.category?.message}
                </p>
              </div>

              <div>
                <Label>Status</Label>
                <select
                  {...form.register("status")}
                  className="w-full border rounded-md p-2"
                >
                  <option value="Available">Available</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <Button type="submit" className="w-full">
                {editing ? "Update Product" : "Add Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-white p-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.title}</TableCell>
                <TableCell>NPR {p.price}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      p.status === "Available" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </TableCell>

                <TableCell className="text-right space-x-2">
                  <Button variant="outline" onClick={() => handleEdit(p)}>
                    Edit
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="bg-red-600 hover:bg-red-700">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure want to delete this product?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone and will be permanently
                          data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(p.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}
