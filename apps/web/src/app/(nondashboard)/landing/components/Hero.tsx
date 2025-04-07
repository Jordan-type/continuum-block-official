"use client"

import { useState, useEffect } from 'react';
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "../../../../components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import HeroCards from "../../../../components/HeroCards";

const LoadingSkeleton = () => {
  return (

<section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <Skeleton className="h-14 w-3/4 max-w-4xl mx-auto lg:mx-0" /> {/* Title (text-5xl md:text-6xl) */}
        <Skeleton className="h-6 w-full max-w-xl mx-auto lg:mx-0 md:w-10/12" /> {/* Description (text-xl) */}

        <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center lg:justify-start">
          <Skeleton className="h-10 w-40" /> {/* Get Started button */}
          <Skeleton className="h-10 w-48" /> {/* Github Resources button */}
        </div>
      </div>
      
      {/* Hero cards sections */}

      {/* Shadow effect (optional skeleton for shadow) */}
      <Skeleton className="absolute inset-0 bg-black bg-opacity-10 z-[-1] rounded-lg" />
    </section>
  );
};

const Hero = () => {

  return (
    <motion.section
      className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center lg:text-start space-y-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          className="text-5xl md:text-6xl font-bold"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
              Continuum Block
            </span>{" "}
            Africa&apos;s Largest network of
          </h1>
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              {" "}
              Web3 Builders
            </span>
          </h2>
        </motion.div>

        <motion.p
          className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Unlocking Potential with Every Block.
        </motion.p>

        <motion.div
          className="space-y-4 md:space-y-0 md:space-x-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/search" scroll={false}>
            <Button className="landing__cta-button">Get Started</Button>
          </Link>
          <a
            rel="noreferrer noopener"
            href="https://github.com/leoMirandaa/shadcn-landing-page.git"
            target="_blank"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Github Resources
            <GitHubLogoIcon className="ml-2 w-5 h-5" />
          </a>
        </motion.div>
      </motion.div>

      {/* Hero cards sections */}
      <motion.div
        className="z-10 w-full max-w-md lg:max-w-lg"
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.5 }}
      >
        <HeroCards/>
      </motion.div>

      {/* Shadow effect */}
      <div className="shadow" />
    </motion.section>
  );
};

export default Hero;
