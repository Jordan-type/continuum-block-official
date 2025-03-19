"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface statsProps {
  quantity: string;
  description: string;
}

const stats: statsProps[] = [
  { quantity: "500+", description: "Users" },
  { quantity: "5+", description: "Bootcamps Hosted" },
  { quantity: "500+", description: "Developers Trained" },
  { quantity: "4", description: "Courses" },
];

const LoadingSkeleton = () => (
  <motion.section
    className="grid grid-cols-2 lg:grid-cols-4 gap-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {[...Array(4)].map((_, index) => (
      <div key={index} className="space-y-2 text-center">
        <Skeleton className="h-10 w-1/2 mx-auto bg-customgreys-secondarybg" />
        <Skeleton className="h-6 w-2/3 mx-auto bg-customgreys-secondarybg" />
      </div>
    ))}
  </motion.section>
);


const Statistics = () => {
  const [countedStats, setCountedStats] = useState(stats.map(() => 0));

  useEffect(() => {
    const duration = 2000; // 2 seconds total animation
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    const increments = stats.map((stat) =>
      Math.ceil(parseInt(stat.quantity.replace("+", "")) / steps)
    );


    let currentStep = 0;
    const timer = setInterval(() => {
      if (currentStep < steps) {
        setCountedStats((prev) =>
          prev.map((value, index) =>
            Math.min(
              value + increments[index],
              parseInt(stats[index].quantity.replace("+", ""))
            )
          )
        );
        currentStep++;
      } else {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.section
    id="statistics"
    className="grid grid-cols-2 lg:grid-cols-4 gap-8"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true, amount: 0.3 }}>

      {stats.map(({ quantity, description }, index) => (
          <motion.div
          key={description}
          className="space-y-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              {countedStats[index]}+
            </h2>
            <p className="text-xl text-muted-foreground">{description}</p>
          </motion.div>
        ))}

    </motion.section>
  );
};


export default Statistics;
export { LoadingSkeleton };
