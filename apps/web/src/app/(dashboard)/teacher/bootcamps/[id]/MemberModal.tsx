"use client";

import { CustomFormField } from "@/components/CustomFormField";
import CustomModal from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MemberFormData, memberSchema } from "@/lib/schemas"; // Define this schema
import { addMember, closeMemberModal, editMember } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const MemberModal = () => {
  const dispatch = useAppDispatch();
  const {
    isMemberModalOpen,
    selectedMemberIndex,
    bootcampMembers,
  } = useAppSelector((state) => state.global.bootcampEditor); // Adjust Redux state

  const member =
    selectedMemberIndex !== null
      ? bootcampMembers[selectedMemberIndex]
      : undefined;

  const methods = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      memberId: "",
      fullName: "",
      progress: 0,
    },
  });

  useEffect(() => {
    if (member) {
      methods.reset({
        memberId: member.memberId,
        fullName: member.fullName,
        progress: member.progress,
      });
    } else {
      methods.reset({
        memberId: uuidv4(),
        fullName: "",
        progress: 0,
      });
    }
  }, [member, methods]);

  const onClose = () => {
    dispatch(closeMemberModal());
  };

  const onSubmit = (data: MemberFormData) => {
    if (selectedMemberIndex === null) {
      dispatch(addMember(data));
    } else {
      dispatch(editMember({ index: selectedMemberIndex, member: data }));
    }
    toast.success("Member added/updated successfully (save bootcamp to apply)");
    onClose();
  };

  return (
    <CustomModal isOpen={isMemberModalOpen} onClose={onClose}>
      <div className="member-modal">
        <div className="member-modal__header">
          <h2 className="member-modal__title">
            {selectedMemberIndex !== null ? "Edit Member" : "Add Member"}
          </h2>
          <button onClick={onClose} className="member-modal__close">
            <X className="w-6 h-6" />
          </button>
        </div>

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="member-modal__form">
            <CustomFormField
              name="memberId"
              label="Member ID"
              placeholder="Enter member ID"
              disabled={!!member} // Disable if editing
            />

            <CustomFormField
              name="fullName"
              label="Full Name"
              placeholder="Enter full name"
            />

            <CustomFormField
              name="progress"
              label="Progress (%)"
              type="number"
              placeholder="0"
              min={0}
              max={100}
            />

            <div className="member-modal__actions">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary-700">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomModal>
  );
};

export default MemberModal;