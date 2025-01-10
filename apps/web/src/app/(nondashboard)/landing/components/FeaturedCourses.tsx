import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useListCoursesQuery } from "@/state/api";
import { useRouter } from "next/navigation";
import CourseCardSearch from "@/components/CourseCardSearch";

const LoadingSkeleton = () => {
  return (
    <div className="landing-skeleton">
      <div className="landing-skeleton__featured">
        <Skeleton className="landing-skeleton__featured-title" />
        <Skeleton className="landing-skeleton__featured-description" />

        <div className="landing-skeleton__tags">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Skeleton key={index} className="landing-skeleton__tag" />
          ))}
        </div>

        <div className="landing-skeleton__courses">
          {[1, 2, 3, 4].map((_, index) => (
            <Skeleton key={index} className="landing-skeleton__course-card" />
          ))}
        </div>
      </div>
    </div>
  );
};

const FeaturedCourses = () => {
  const router = useRouter();
  const { data: courses, isLoading, isError } = useListCoursesQuery({});

  const handleCourseClick = (courseId: string) => {
    router.push(`/search?id=${courseId}`, {
      scroll: false,
    });
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <motion.section
      className="container py-24 sm:py-32 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Many{" "}
        <span className="bg-gradient-to-b from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
          Great Courses
        </span>
      </h2>

      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        From beginner to advanced, in all industries, we have the right courses
        just for you and preparing your entire journey for learning and making
        the most.
      </p>

      <div className="flex flex-wrap md:justify-center gap-4">
        {[
          "web development",
          "enterprise IT",
          "react nextjs",
          "javascript",
          "backend development",
        ].map((tag, index) => (
          <span key={index} className="landing__tag">
            {tag}
          </span>
        ))}
      </div>

      <motion.div
        className="landing__featured"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ amount: 0.3, once: true }}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses &&
            courses.slice(0, 4).map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ amount: 0.4 }}
              >
                <CourseCardSearch
                  course={course}
                  onClick={() => handleCourseClick(course._id)}
                />
              </motion.div>
            ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default FeaturedCourses;
