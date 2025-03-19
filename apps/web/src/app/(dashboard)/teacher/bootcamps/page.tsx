"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import TeacherBootcampCard from "@/components/TeacherBootcampCard";
import Toolbar from "@/components/Toolbar";
import { Button } from "@/components/ui/button";
import { useCreateBootcampMutation, useDeleteBootcampMutation, useListBootcampsQuery } from "@/state/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

const Bootcamps = () => {
    const router = useRouter();
    const { user } = useUser();
    const {
      data: bootcamps,
      isLoading,
      isError,
    } = useListBootcampsQuery({ type: "all" }); // Adjust query parameter as needed
  
    const [createBootcamp] = useCreateBootcampMutation();
    const [deleteBootcamp] = useDeleteBootcampMutation();
  
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("all"); // Filter by bootcamp type (e.g., full-time, part-time)
  
    const filteredBootcamps = useMemo(() => {
      if (!bootcamps) return [];
  
      return bootcamps.filter((bootcamp) => {
        const matchesSearch = bootcamp.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === "all" || bootcamp.type === selectedType;
        return matchesSearch && matchesType;
      });
    }, [bootcamps, searchTerm, selectedType]);
  
    const handleEdit = (bootcamp: Bootcamp) => {
      router.push(`/teacher/bootcamps/${bootcamp._id}`, {
        scroll: false,
      });
    };
  
    const handleDelete = async (bootcamp: Bootcamp) => {
      console.log("Attempting to delete bootcamp with ID:", bootcamp._id);
      await deleteBootcamp(bootcamp._id).unwrap();
    };
  
    const handleCreateBootcamp = async () => {
      if (!user) return;

      const result = await createBootcamp({ hostedBy: {type: "individual", name: user.fullName || "Unknown User", id: user.id, }, }).unwrap();
      router.push(`/teacher/bootcamps/${result._id}`, {
        scroll: false,
      });
    };
  
    if (isLoading) return <Loading />;
    if (isError || !bootcamps) return <div>Error loading bootcamps.</div>;
  
    return (
      <div className="teacher-bootcamps">
        <Header
          title="Bootcamps"
          subtitle="Manage your bootcamps"
          rightElement={
            <Button
              onClick={handleCreateBootcamp}
              className="teacher-bootcamps__header"
            >
              Create Bootcamp
            </Button>
          }
        />
        <Toolbar
          onSearch={setSearchTerm}
          onCategoryChange={setSelectedType} // Use type instead of category for bootcamps
        />
        <div className="teacher-bootcamps__grid">
          {filteredBootcamps.map((bootcamp) => (
            <TeacherBootcampCard
              key={bootcamp._id}
              bootcamp={bootcamp}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isOwner={bootcamp.hostedBy.id === user?.id}
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default Bootcamps;