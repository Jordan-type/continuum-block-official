"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Bell, BookOpen, SearchIcon } from "lucide-react";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";


const NonDashboardNavbar = () => {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false); // Track input focus
  const inputRef = useRef<HTMLInputElement>(null); // Ref to the input

  // Handle search navigation on Enter key press or click
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      e.preventDefault(); // Prevent default form submission (if any)
      window.location.href = `/search?query=${encodeURIComponent(searchQuery.trim())}`; // Use window.location.href for simplicity
      setSearchQuery(""); // Clear the input after navigation
    } else if (e.key === "Enter" && !searchQuery.trim()) {
      window.location.href = "/search"; // Navigate to search page if query is empty
    }
  };

  return (
    <nav className="nondashboard-navbar">
      <div className="nondashboard-navbar__container">
        <div className="nondashboard-navbar__search">
          <Link href="/" className="nondashboard-navbar__brand" scroll={false}>
            Continuum Block
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative group">
            <div
                className={cn(
                  "flex items-center w-full max-w-sm space-x-2 rounded-lg border border-gray-300 px-3.5 py-2",
                  "bg-customgreys-primarybg hover:bg-customgreys-darkerGrey transition-all duration-300",
                  "focus-within:ring-2 focus-within:ring-primary-700" // Optional: Add focus ring
                )}
              >
                <SearchIcon className="h-4 w-4 text-customgreys-dirtyGrey group-hover:text-white-50 transition-all duration-300" />
                <Input
                  ref={inputRef} 
                  type="search"
                  placeholder="Search Courses"
                  className="w-full border-0 h-8 font-semibold text-customgreys-dirtyGrey group-hover:text-white-50 focus:outline-none"
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
        <div className="nondashboard-navbar__actions">
          <button className="nondashboard-navbar__notification-button">
            <span className="nondashboard-navbar__notification-indicator"></span>
            <Bell className="nondashboard-navbar__notification-icon" />
          </button>
          <SignedIn>
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
              userProfileUrl={
                userRole === "teacher" ? "/teacher/profile" : "/user/profile"
              }
            />
          </SignedIn>
          <SignedOut>
            <Link
              href="/signin"
              className="nondashboard-navbar__auth-button--login"
              scroll={false}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="nondashboard-navbar__auth-button--signup"
              scroll={false}
            >
              Sign up
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default NonDashboardNavbar;
