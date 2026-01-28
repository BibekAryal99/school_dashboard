"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "../types/product";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormData, productSchema } from "../validation/schemas/product";

const defaultValues = {
  title: "",
  price: 0,
  category: "",
  status: "Available" as "Available" | "Out of Stock",
  image: "",
  description: "",
  rating: {
    rate: 0,
    count: 0,
  },
};

const useProduct = () => {
  const router = useRouter();

  const [records, setRecords] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    loadProducts();
  }, []);

  const handleSubmit = async (data: ProductFormData) => {
    try {
      if (editing) {
        const response = await fetch(
          `http://localhost:3001/products/${editing.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          },
        );
        if (!response.ok) throw new Error("Failed to update");
        const updated = await response.json();
        setRecords((prev) =>
          prev.map((r) => (r.id === editing.id ? updated : r)),
        );
      } else {
        const response = await fetch("http://localhost:3001/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create");
        const created = await response.json();
        setRecords((prev) => [...prev, created]);
      }
    } catch (error) {
      console.error("Error submitting product:", error);
    }
    setOpen(false);
    setEditing(null);
    reset();
  };

  const handleEdit = (record: Product) => {
    setEditing(record);
    reset({
      title: record.title,
      price: record.price,
      category: record.category,
      status: record.status as "Available" | "Out of Stock",
      image: record.image,
      description: record.description,
      rating: record.rating || { rate: 0, count: 0 },
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return {
    router,
    records,
    setRecords,
    open,
    setOpen,
    editing,
    setEditing,
    form,
    handleSubmit,
    handleEdit,
    handleDelete,
  };
};

export default useProduct;
