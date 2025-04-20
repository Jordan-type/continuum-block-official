// components/FeaturedBootcamps.tsx
import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useListBootcampsQuery } from "@/state/api";
import { useRouter } from "next/navigation";
import BootcampCardSearch from "@/components/BootcampCardSearch";
import { Badge } from "@/components/ui/badge";

const LoadingSkeleton = () => {
  return (
    <section className="container py-24 sm:py-32 space-y-8">
      <Skeleton className="h-10 w-3/4 max-w-2xl mx-auto md:text-center" />
      <Skeleton className="h-6 w-full max-w-3xl mx-auto md:w-3/4 mt-4 mb-8" />
      <div className="flex flex-wrap md:justify-center gap-4">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <Skeleton
            key={index}
            className="h-8 w-32 px-3 py-1 rounded-full bg-customgreys-secondarybg"
          />
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <Skeleton
            key={index}
            className="h-[340px] xl:h-[380px] rounded-lg bg-customgreys-secondarybg border-2 border-transparent animate-pulse"
          />
        ))}
      </div>
    </section>
  );
};

const bootcampList: string[] = [
  "full-stack development",
  "data science",
  "cybersecurity",
  "ui/ux design",
  "devops",
];

const FeaturedBootcamps = () => {
  const router = useRouter();
  const { data: bootcamps, isLoading, isError } = useListBootcampsQuery({ type: "all" });

  const handleBootcampClick = (bootcampId: string) => {
    router.push(`/bootcamps?id=${bootcampId}`, { scroll: false });
  };

  if (isLoading) return <LoadingSkeleton />;

  // Filter bootcamps to show only published ones
  const publishedBootcamps = bootcamps?.filter((bootcamp) => bootcamp.status === "Published");

  return (
    <motion.section
      className="container py-24 sm:py-32 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Kickstart Your Career with Our{" "}
        <span className="bg-gradient-to-b from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
          Intensive Bootcamps
        </span>
      </h2>

      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground text-center">
        Transform your skills with hands-on, expert-led bootcamps designed to fast-track your success in today’s top industries.
      </p>

      <div className="flex flex-wrap md:justify-center gap-4">
        {bootcampList.map((tag: string, index) => (
          <div key={index}>
            <Badge variant="secondary" className="text-sm">
              {tag}
            </Badge>
          </div>
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
          {publishedBootcamps && (
            publishedBootcamps.slice(0, 6).map((bootcamp, index) => (
              <motion.div
                key={bootcamp._id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ amount: 0.4 }}
              >
                <BootcampCardSearch
                  bootcamp={bootcamp}
                  onClick={() => handleBootcampClick(bootcamp._id)}
                />
              </motion.div>
            ))
            )}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default FeaturedBootcamps;