"use client";

import Loading from "@/components/Loading";
import { useListCoursesQuery } from "@/state/api";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CourseCardSearch from "@/components/CourseCardSearch";
import SelectedCourse from "./SelectedCourse";

const Search = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const query = searchParams.get("query")?.toLowerCase() || ""; // Get the search query from the URL
  const { data: allCourses, isLoading, isError } = useListCoursesQuery({});
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (allCourses) {
      let filteredCourses = allCourses.filter(
        (course: Course  )=> course.status !== 'Draft');

      // Further filter by search query if provided
      if (query) {
        filteredCourses = filteredCourses.filter(
          (course: Course) =>
            course.title.toLowerCase().includes(query) ||
            (course.description &&
              course.description.toLowerCase().includes(query))
        );
      }

      setCourses(filteredCourses);

      if (id) {
        const course = filteredCourses.find((c) => c._id === id);
        setSelectedCourse(course || filteredCourses[0]);
      } else {
        setSelectedCourse(filteredCourses[0]);
      }
    }
  }, [allCourses, id, query]);

  if (isLoading) return <Loading />;
  if (isError || !courses) return <div>Failed to fetch courses</div>;

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    router.push(`/search?id=${course._id}${query ? `&query=${query}` : ""}`, {
      scroll: false,
    });
  };

  const handleEnrollNow = (courseId: string) => {
    router.push(`/checkout?step=1&id=${courseId}&showSignUp=false`, {
      scroll: false,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="search"
    >
      <h1 className="search__title">List of available courses</h1>
      <h2 className="search__subtitle">{courses.length} courses avaiable</h2>
      <div className="search__content grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="search__courses-grid max-h-[calc(100vh-200px)] overflow-y-auto"
        >
          {courses.map((course) => (
            <CourseCardSearch
              key={course._id}
              course={course}
              isSelected={selectedCourse?._id === course._id}
              onClick={() => handleCourseSelect(course)}
            />
          ))}
        </motion.div>

        {selectedCourse && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="search__selected-course max-h-[calc(100vh-200px)] overflow-y-auto"
          >
            <SelectedCourse
              course={selectedCourse}
              handleEnrollNow={handleEnrollNow}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Search;
