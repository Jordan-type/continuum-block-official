"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { MagnifierIcon, WalletIcon, ChartIcon } from "@/components/ui/Icons";
import { Skeleton } from "@/components/ui/skeleton";

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

// Loading Skeleton Component
const LoadingSkeleton = () => { 
  return (
    <section className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <Skeleton className="h-10 w-3/4 max-w-md mb-4 bg-customgreys-secondarybg" />
          <Skeleton className="h-6 w-full max-w-2xl mt-4 mb-8 bg-customgreys-secondarybg" />
          <Skeleton className="h-6 w-5/6 max-w-2xl mt-2 bg-customgreys-secondarybg" />

          <div className="flex flex-col gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-2xl bg-customgreys-secondarybg" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-1/3 mb-2 bg-customgreys-secondarybg" />
                  <Skeleton className="h-4 w-full mb-1 bg-customgreys-secondarybg" />
                  <Skeleton className="h-4 w-5/6 bg-customgreys-secondarybg" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Skeleton className="w-[300px] md:w-[500px] lg:w-[600px] h-[300px] rounded-lg bg-customgreys-secondarybg" />
      </div>
    </section>
  );
}

const serviceList: ServiceProps[] = [
  {
    title: "Code Collaboration",
    description:
      "Provides platforms that enable collaborative coding experiences, including live coding sessions, peer reviews, and joint projects. This service enhances learning by leveraging community interactions and shared knowledge in blockchain technology.",
    icon: <ChartIcon />,
  },
  {
    title: "Project Management",
    description:
      "Delivers courses and workshops focused on the effective management of blockchain projects, incorporating agile methodologies and team management skills necessary for real-world blockchain applications.",
    icon: <WalletIcon />,
  },
  {
    title: "Task Automation",
    description:
      "Offers training on automating routine tasks within blockchain development, covering aspects like automated testing, deployment pipelines, and smart contract management, aimed at boosting productivity and project consistency.",
    icon: <MagnifierIcon />,
  },
];

export const Services = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay (remove this in a real-world scenario with API data)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2-second delay to simulate loading
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingSkeleton />;


  return (
    <motion.section
      className="container py-24 sm:py-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      >
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <motion.h2
            className="text-3xl md:text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              Client-Centric{" "}
            </span>
            Services
          </motion.h2>

          <motion.p 
            className="text-muted-foreground text-xl mt-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Continuum Block offers customized training in code collaboration,
            project management, and task automation, tailored to each
            learner&apos;s style and goals. Our programs feature personalized
            learning paths, mentorship, and strong community support, equipping
            participants with the skills needed to succeed in the blockchain
            industry.
          </motion.p>

          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {serviceList.map(
              ({ icon, title, description }: ServiceProps, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02, duration: 0.1 }}
                  viewport={{ amount: 0.4 }}
                >
                  <Card key={title}>
                    <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                      <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
                        {icon}
                      </div>
                      <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription className="text-md mt-2">
                          {description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              )
            )}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Image
            src="/cube-leg.png"
            width={300}
            height={300}
            className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
            alt="About services"
          />
        </motion.div>
      </div>
    </motion.section>
  );
};
