"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";

export const ToastProvider = ToastPrimitive.Provider;

export const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentProps<typeof ToastPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={`
      bg-white border border-gray-200 shadow-lg rounded-lg p-4 w-80
      flex flex-col gap-1
      animate-slide-in-right
      ${className}
    `}
    {...props}
  />
));
Toast.displayName = "Toast";

export const ToastTitle = ToastPrimitive.Title;
export const ToastDescription = ToastPrimitive.Description;

export const ToastViewport = (props: React.ComponentProps<typeof ToastPrimitive.Viewport>) => (
  <ToastPrimitive.Viewport
    {...props}
    className="fixed top-4 right-4 z-50 flex flex-col gap-3"
  />
);

type ToastItem = {
  id: number;
  title: string;
  description?: string;
};

export const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = ({ title, description }: { title: string; description?: string }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, description }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const ToastContainer = () => (
    <>
      {toasts.map((t) => (
        <Toast key={t.id}>
          <ToastTitle className="font-semibold text-gray-900">{t.title}</ToastTitle>
          {t.description && <ToastDescription className="text-gray-600">{t.description}</ToastDescription>}
        </Toast>
      ))}
      <ToastViewport />
    </>
  );

  return { toast, ToastContainer };
};
