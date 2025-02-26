import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const HeroCardsLoadingSkeleton = () => {
  return (
    <div className="lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px] sm:w-full sm:h-auto sm:flex-col sm:gap-4">
      {/* Testimonial Carousel Skeleton */}
      <Skeleton className="w-full h-[300px] rounded-lg bg-customgreys-secondarybg drop-shadow-xl shadow-black/10 dark:shadow-white/10" />

      {/* Team Card Skeleton */}
      <Skeleton className="absolute right-[20px] top-4 w-80 h-[250px] rounded-lg bg-customgreys-secondarybg drop-shadow-xl shadow-black/10 dark:shadow-white/10 sm:static sm:w-full sm:h-[200px] sm:mt-4" />

      {/* Pricing Card Skeleton */}
      <Skeleton className="absolute top-[150px] left-[50px] w-72 h-[400px] rounded-lg bg-customgreys-secondarybg drop-shadow-xl shadow-black/10 dark:shadow-white/10 sm:static sm:w-full sm:h-[350px] sm:mt-4" />

      {/* Service Card Skeleton */}
      <Skeleton className="absolute w-[350px] -right-[10px] bottom-[35px] h-[150px] rounded-lg bg-customgreys-secondarybg drop-shadow-xl shadow-black/10 dark:shadow-white/10 sm:static sm:w-full sm:h-[150px] sm:mt-4" />
    </div>
  );
};

export default HeroCardsLoadingSkeleton;