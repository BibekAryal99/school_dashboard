"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Product } from "@/app/types/type";
import { ProductFormData, productSchema } from "@/app/validation/schema";

import { ToastProvider, useToast } from "@/components/ui/toast";
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
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";


export default function ProductsPage() {
  const { toast, ToastContainer } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      price: 0,
      category: "",
      status: "Available",
      image: "",
    },
  });

  useEffect(() => {
    const loadProducts = async () => {
      const stored = sessionStorage.getItem("product_data_session");

      if (stored) {
        setProducts(JSON.parse(stored));
        setMounted(true);
        return;
      }

      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();

        const formatted: Product[] = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          category: p.category,
          status: "Available",
          image: p.image || "",
        }));

        setProducts(formatted);
        sessionStorage.setItem("product_data_session", JSON.stringify(formatted));
      } catch {
        toast({ title: "Error", description: "Failed to fetch products" });
      }

      setMounted(true);
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    sessionStorage.setItem("product_data_session", JSON.stringify(products));
  }, [products, mounted]);

  if (!mounted) return null;

  const handleSubmit = form.handleSubmit(async (data) => {
    if (editing) {
      try {
        const res = await fetch(`${"https://fakestoreapi.com/products"}/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        console.log(res);
        const updated = { ...editing, ...data };

        setProducts((prev) =>
          prev.map((p) => (p.id === editing.id ? updated : p)),
        );

        toast({ title: "Product updated" });
      } catch {
        toast({ title: "Error", description: "Update failed" });
      }
    } else {
      try {
        const res = await fetch("https://fakestoreapi.com/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        console.log(res);

        const newProduct = {
          id: Date.now(),
          ...data,
        };

        setProducts((prev) => [...prev, newProduct]);
        toast({ title: "Product added" });
      } catch {
        toast({ title: "Error", description: "Add failed" });
      }
    }

    setEditing(null);
    setOpen(false);
    form.reset();
  });

  const handleDelete = async (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch(`${"https://fakestoreapi.com/products"}/${id}`, { method: "DELETE" });
      toast({ title: "Product deleted" });
    } catch {
      toast({ title: "Error", description: "Delete failed" });
    }
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    form.reset(product);
    setOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    form.reset();
    setOpen(true);
  };

  return (
    <ToastProvider>
      <div className="flex justify-between items-center p-6">
        <h2 className="text-3xl font-bold">Products</h2>
        <Button onClick={handleAdd}>Add Product</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label>Price</Label>
              <Input
                type="number"
                {...form.register("price", { valueAsNumber: true })}
              />
              {form.formState.errors.price && (
                <p>
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            <div>
              <Label>Category</Label>
              <Input {...form.register("category")} />
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>

            <div>
              <Label>Status</Label>
              <select
                {...form.register("status")}
                className="w-full border p-2 rounded"
              >
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div>
              <Label>Image URL</Label>
              <Input {...form.register("image")} />
              {form.formState.errors.image && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.image.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              {editing ? "Update" : "Add"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
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
                <TableCell>
                  {p.image ? (
                    <div className="relative w-16 h-16">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    "No Image"
                  )}
                </TableCell>

                <TableCell>{p.title}</TableCell>
                <TableCell>NPR {p.price}</TableCell>
                <TableCell>{p.category}</TableCell>

                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      p.status === "Available" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {p.status === "Available" ? "Available" : "Out of Stock"}
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
                        <AlertDialogTitle>Delete product?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
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
