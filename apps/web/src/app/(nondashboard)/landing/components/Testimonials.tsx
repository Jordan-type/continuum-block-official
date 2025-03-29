"use client";

import { useState, useEffect } from "react";
import { useGetUserByUsernameQuery, useGetUserMentionsByIdQuery } from "@/state/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tweet, Mention } from "@/types/type";

const Testimonial = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const username = "type_jordan";
  const { data: userData, isFetching: isFetchingUser, error: userError } = useGetUserByUsernameQuery(username);
  const userId = userData?.id;
  const { data: mentionsData, isFetching: isFetchingMentions, error: mentionsError } = useGetUserMentionsByIdQuery(userId || "", {
    skip: !userId,
  });

  const isLoading = isFetchingUser || isFetchingMentions;
  const error = userError || mentionsError;

  useEffect(() => {
    if (!isFetchingMentions && mentionsData && userData && !isFetchingUser) {
      const adaptedTweets = Array.isArray(mentionsData)
        ? mentionsData.map((mention: Mention) => ({
            id: mention.id,
            text: mention.text,
            user: {
              id: userData?.id || 'default_id',
              name: userData?.name || "Jordan Muthemba",
              username: userData?.username || "type_jordan",
              profile_image_url: userData?.profile_image_url || "https://i.pravatar.cc/150?u=" + mention.id,
            },
          }))
        : [];
      setTweets(adaptedTweets);
    }
  }, [mentionsData, isFetchingMentions, userData, isFetchingUser]);

  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-center font-bold">
        Discover Why
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          People Love{" "}
        </span>
        Continuum Block
      </h2>

      <p className="text-xl text-muted-foreground text-center pt-4 pb-8">
        Hear from the real users who are part of our journey.
      </p>

      {isLoading ? (
        <div className="text-center">
          <svg
            className="animate-spin h-5 w-5 mx-auto text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p>Loading testimonials...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">
          Failed to load testimonials: {JSON.stringify(error)}
        </p>
      ) : tweets.length === 0 ? (
        <p className="text-center">No testimonials available at the moment.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 sm:block columns-2 lg:columns-3 lg:gap-6 mx-auto space-y-4 lg:space-y-6">
          {tweets.map((tweet) => (
            <Card
              key={tweet.id}
              className="w-full h-auto max-w-md md:break-inside-avoid overflow-hidden transition-transform hover:scale-105"
            >
              <CardHeader className="flex items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage alt={tweet.user.name} src={tweet.user.profile_image_url} />
                  <AvatarFallback>{tweet.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-lg">{tweet.user.name}</CardTitle>
                  <CardDescription>@{tweet.user.username}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="max-h-[150px] overflow-y-auto">{tweet.text}</CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default Testimonial;