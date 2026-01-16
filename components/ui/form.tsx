"use client";

import * as React from "react";
import type { FieldValues, FieldPath, ControllerProps } from "react-hook-form";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
} from "react-hook-form";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(
  null
);
const FormItemContext = React.createContext<{ id: string } | null>(null);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: ControllerProps<TFieldValues, TName>
) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const formContext = useFormContext();

  if (!fieldContext)
    throw new Error("useFormField must be used inside FormField");
  if (!itemContext)
    throw new Error("useFormField must be used inside FormItem");

  const formState = useFormState({
    control: formContext.control,
    name: fieldContext.name,
  });
  const fieldState = formContext.getFieldState(fieldContext.name, formState);

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const FormItem: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn("grid gap-2", className)} {...props} />
    </FormItemContext.Provider>
  );
};

const FormLabel: React.FC<React.ComponentProps<typeof Label>> = ({
  className,
  ...props
}) => {
  const { error, formItemId } = useFormField();
  return (
    <Label
      htmlFor={formItemId}
      className={cn("data-[error=true]:text-destructive", className)}
      data-error={!!error}
      {...props}
    />
  );
};

const FormControl: React.FC<React.ComponentProps<typeof Slot>> = (props) => {
  const { formItemId, formDescriptionId, formMessageId, error } =
    useFormField();
  return (
    <Slot
      id={formItemId}
      aria-invalid={!!error}
      aria-describedby={
        !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
      }
      {...props}
    />
  );
};

const FormDescription: React.FC<React.ComponentProps<"p">> = ({
  className,
  ...props
}) => {
  const { formDescriptionId } = useFormField();
  return (
    <p
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
};

const FormMessage: React.FC<React.ComponentProps<"p">> = ({
  className,
  children,
  ...props
}) => {
  const { formMessageId, error } = useFormField();
  if (!error && !children) return null;
  return (
    <p
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {error ? String(error?.message ?? "") : children}
    </p>
  );
};

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
};
