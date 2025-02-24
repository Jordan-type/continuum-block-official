"use client"

import { useState, useEffect } from 'react';
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useGetUserByUsernameQuery, useGetUserMentionsByIdQuery } from '@/state/api';
import { Button, buttonVariants } from "../../../../components/ui/button";
import HeroCards from "../../../../components/HeroCards";
import { Tweet, Mention } from '@/types/type';

// const LoadingSkeleton = () => {
//   return (
//     <div className="landing-skeleton">
//       <div className="landing-skeleton__hero">
//         <div className="landing-skeleton__hero-content">
//           <Skeleton className="landing-skeleton__title" />
//           <Skeleton className="landing-skeleton__subtitle" />
//           <Skeleton className="landing-skeleton__subtitle-secondary" />
//           <Skeleton className="landing-skeleton__button" />
//         </div>
//         <Skeleton className="landing-skeleton__hero-image" />
//       </div>

//       <div className="landing-skeleton__featured">
//         <Skeleton className="landing-skeleton__featured-title" />
//         <Skeleton className="landing-skeleton__featured-description" />

//         <div className="landing-skeleton__tags">
//           {[1, 2, 3, 4, 5].map((_, index) => (
//             <Skeleton key={index} className="landing-skeleton__tag" />
//           ))}
//         </div>

//         <div className="landing-skeleton__courses">
//           {[1, 2, 3, 4].map((_, index) => (
//             <Skeleton key={index} className="landing-skeleton__course-card" />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

const Hero = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const username = "type_jordan";
  const { data: userData, isFetching: isFetchingUser } = useGetUserByUsernameQuery(username);

  const userId = userData?.id;
  const { data: mentionsData, isFetching: isFetchingMentions } = useGetUserMentionsByIdQuery(userId || '', {
    skip: !userId,  // Only run this query if userId is available
  });

  useEffect(() => {
    console.log("User Data:", userData);
    console.log("Mentions Data:", mentionsData);
    if (!isFetchingMentions && mentionsData && userData && !isFetchingUser) {
      const adaptedTweets = Array.isArray(mentionsData) ? mentionsData.map((mention: Mention) => ({
        id: mention.id,
        text: mention.text,
        user: {
          id: userData?.id || 'default_id',
          name: userData?.name || "Jordan Muthemba",
          username: userData?.username || "type_jordan",
          profile_image_url: userData?.profile_image_url || "https://i.pravatar.cc/150?u=" + mention.id,
        }
      })) : [];
      setTweets(adaptedTweets);
    }
  }, [mentionsData, isFetchingMentions, userData, isFetchingUser]);

  useEffect(() => {
    console.log('Tweets:', tweets); // Check what's actually in your state
  }, [tweets]);


  // if (isLoading) return <LoadingSkeleton />;

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
            Africa’s Largest network of
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
        className="z-10"
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.5 }}
      >
        <HeroCards tweets={tweets} />
      </motion.div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </motion.section>
  );
};

export default Hero;
