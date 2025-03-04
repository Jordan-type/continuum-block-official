"use client";

import UserProgressDashboard from "@/components/UserCourseProgress";
import { useUser } from "@clerk/nextjs";
import React from "react";
import Loading from "@/components/Loading";
import Header from "@/components/Header";

const Progress = () => {
    const { user, isLoaded } = useUser();
  
    if (!isLoaded) return <Loading />;
    if (!user) return <div>Please sign in to view your progress.</div>;
  
    return (
      <div className="user-courses">
        <Header title="My Progress" subtitle="View your courses progress" />
        <UserProgressDashboard />
      </div>
    );
  };
  
  export default Progress;

  // userId={user.id}