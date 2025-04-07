"use client";

import React, { useState, useRef } from "react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Bell, BookOpen, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";


const Navbar = ({ isCoursePage }: { isCoursePage: boolean }) => {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(""); // State for input value
  const [isFocused, setIsFocused] = useState(false); // Track input focus
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle form submission or Enter key press
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`, {
        scroll: false,
      }); 
      setSearchQuery("");
    } else if (e.key === "Enter" && !searchQuery.trim()) {
      router.push("/search", { scroll: false });
    }
  };


  return (
    <nav className="dashboard-navbar">
      <div className="dashboard-navbar__container">
        <div className="dashboard-navbar__search">
          <div className="md:hidden">
            <SidebarTrigger className="dashboard-navbar__sidebar-trigger" />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
            <div
                className={cn(
                  "flex items-center w-full max-w-sm space-x-2 rounded-lg border border-gray-300 px-3.5 py-2",
                  "bg-customgreys-primarybg hover:bg-customgreys-darkerGrey transition-all duration-300",
                  {
                    "!bg-customgreys-secondarybg hover:!bg-customgreys-darkerGrey":
                      isCoursePage,
                  }
                )}
              >
                <SearchIcon className="h-4 w-4 text-customgreys-dirtyGrey group-hover:text-white-50 transition-all duration-300" />
                <Input
                  ref={inputRef}
                  type="search"
                  placeholder="Search Courses"
                  className="w-full border-0 h-8 font-semibold text-customgreys-dirtyGrey group-hover:text-white-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </div>
              {isFocused && (
                <div className="absolute left-0 mt-1 text-xs text-customgreys-dirtyGrey">
                  Press Enter to search or go to course list
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-navbar__actions">
          <button className="nondashboard-navbar__notification-button">
            <span className="nondashboard-navbar__notification-indicator"/>
            <Bell className="nondashboard-navbar__notification-icon" />
          </button>
          <UserButton
            appearance={{
              baseTheme: dark,
              elements: {
                userButtonOuterIdentifier: "text-customgreys-dirtyGrey",
                userButtonBox: "scale-90 sm:scale-100",
              },
            }}
            showName={true}
            userProfileMode="navigation"
            userProfileUrl={ userRole === "teacher" ? "/teacher/profile" : "/user/profile"}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
