// components/DeleteConfirmationDialog.tsx
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
  import { Button } from "@/components/ui/button";
  import React from "react";
  
  interface DeleteConfirmationDialogProps {
    itemType: "course" | "bootcamp"; // Type of item being deleted
    itemTitle: string; // Title of the item for display
    onConfirm: () => void; // Callback to execute on confirmation
    triggerButton?: React.ReactNode; // Optional custom trigger button
    isOpen?: boolean; // Optional: Control dialog open state externally
    onOpenChange?: (open: boolean) => void; // Optional: Handle open state changes
  }
  
  export function DeleteConfirmationDialog({
    itemType,
    itemTitle,
    onConfirm,
    triggerButton,
    isOpen,
    onOpenChange,
  }: DeleteConfirmationDialogProps) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>
          {triggerButton || (
            <Button variant="outline">Delete {itemType}</Button>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this {itemType}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This action cannot be undone. This will permanently delete the{" "}
              <strong>{itemTitle}</strong> {itemType} and remove its data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-600 hover:bg-gray-500 text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-500" onClick={onConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }