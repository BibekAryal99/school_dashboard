"use client";

import Image from "next/image";
import NextLink from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Product } from "@/app/types/product";
import { ProductFormData, productSchema } from "@/app/validation/schemas/product";

import { ToastProvider, useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import Navbar from "../navbar/page";
import Rating from "@/components/ui/rating";

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
      description: "",
      rating: {
        rate: 0,
        count: 0,
      },
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
        const data:unknown = await res.json();

        if(!Array.isArray(data)){
          throw new Error("Invalid Api Response");
        }

        const formatted: Product[] = data.map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          category: p.category,
          status: "Available",
          image: p.image || "",
          description: p.description,
        }));

        setProducts(formatted);
        sessionStorage.setItem(
          "product_data_session",
          JSON.stringify(formatted),
        );
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
        await fetch(`https://fakestoreapi.com/products/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

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
        await fetch("https://fakestoreapi.com/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const newProduct = { id: Date.now(), ...data };
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
      await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: "DELETE",
      });
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
      <Navbar />
      <div className="flex justify-between items-center p-6">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Add Product
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
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
                <p className="text-sm text-red-500">
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

            <div>
              <Label>Description</Label>
              <Input {...form.register("description")} />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="rating-rate"
                className="text-sm font-medium text-gray-700"
              >
                Rating (0-5)
              </Label>
              <Input
                id="rating-rate"
                type="number"
                step="0.1"
                min="0"
                max="5"
                {...form.register("rating.rate", { valueAsNumber: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="4.5"
              />
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="rating-count"
                className="text-sm font-medium text-gray-700"
              >
                Rating Count
              </Label>
              <Input
                id="rating-count"
                type="number"
                min="0"
                {...form.register("rating.count", { valueAsNumber: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="120"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {editing ? "Update" : "Add"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Card
            key={p.id}
            className="hover:shadow-2xl transition-shadow duration-300 flex flex-col"
          >
            <div className="relative w-full h-64 bg-gray-50 flex items-center justify-center">
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-contain rounded-t-lg"
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>

            <CardContent className="flex-1 flex flex-col justify-between space-y-3 p-4">
              <div>
                <CardHeader className="p-0">
                  <CardTitle className="text-xl font-semibold">
                    {p.title}
                  </CardTitle>
                </CardHeader>
                <p className="text-gray-500 text-sm mb-1">
                  Category: {p.category}
                </p>

                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${
                      p.status === "Available" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {p.status}
                  </span>

                  {p.rating && (
                    <div className="ml-2">
                      <Rating rate={p.rating.rate} count={p.rating.count} />
                    </div>
                  )}
                </div>

                <p className="mt-2 text-gray-700 text-sm line-clamp-3">
                  {p.description}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-indigo-600 font-semibold">
                  NPR {p.price}
                </span>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </Button>

                  <NextLink href={`/products/${p.id}`} passHref>
                    <Button
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      View
                    </Button>
                  </NextLink>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
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
                          onClick={() => handleDelete(p.id ?? 0)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}