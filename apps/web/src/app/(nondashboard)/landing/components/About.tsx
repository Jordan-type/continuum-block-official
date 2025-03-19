"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Statistics, { LoadingSkeleton } from "./Statistics";
import { Skeleton } from "@/components/ui/skeleton";

const AboutLoadingSkeleton = () => (
  <section className="container py-24 sm:py-32">
    <div className="bg-muted/50 border rounded-lg py-12">
      <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
        <Skeleton className="w-[300px] h-[300px] rounded-lg bg-customgreys-secondarybg" />
        <div className="flex flex-col justify-between">
          <div className="pb-6">
            <Skeleton className="h-10 w-1/2 mx-auto mb-4 bg-customgreys-secondarybg" />
            <Skeleton className="h-6 w-full max-w-xl mx-auto mt-4 mb-2 bg-customgreys-secondarybg" />
            <Skeleton className="h-6 w-5/6 max-w-xl mx-auto bg-customgreys-secondarybg" />
          </div>
          <LoadingSkeleton /> {/* Use the Statistics skeleton */}
        </div>
      </div>
    </div>
  </section>
);

export const About = () => {
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2-second delay to simulate loading
    return () => clearTimeout(timer);
  }, []);


  if (isLoading) return <AboutLoadingSkeleton />;


  return (
    <motion.section
    id="about"
    className="container py-24 sm:py-32"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true, amount: 0.3 }}
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <Image
            src="/growth.png"
            alt=""
            width={300}
            height={300}
            className="w-[300px] object-contain rounded-lg"
          />

          <div className="bg-green-0 flex flex-col justify-between">
          <motion.div
              className="pb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                <span className="bg-gradient-to-b from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
                  About{" "}
                </span>
                Continuum Block
              </h2>
              <p className="text-xl text-muted-foreground mt-4 text-center">
              Continuum Block is an educational platform dedicated to advancing software developers&apos; expertise in blockchain and Web3 technologies. By providing comprehensive training that ranges from foundational concepts to complex programming techniques, it aims to fill the industry&apos;s skill gap. 
              The platform fosters a community of innovative developers through formal courses, practical workshops, and collaborative projects, equipping them to impact both global and local communities positively.
              </p>
            </motion.div>

            <Statistics />
          </div>
        </div>
      </div>
    </motion.section>
  );
};