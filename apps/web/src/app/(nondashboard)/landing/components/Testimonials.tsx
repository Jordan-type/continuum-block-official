"use client"

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetUserByUsernameQuery, useGetUserMentionsByIdQuery } from '@/state/api';
import { Tweet, Mention } from '@/types/type';


interface TestimonialProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
}

const testimonials: TestimonialProps[] = [
  {
    image: "https://github.com/shadcn.png",
    name: "John Doe React",
    userName: "@john_Doe",
    comment: "This landing page is awesome!",
  },
  {
    image: "https://github.com/shadcn.png",
    name: "John Doe React",
    userName: "@john_Doe1",
    comment:
      "Lorem ipsum dolor sit amet,empor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.",
  },

  {
    image: "https://github.com/shadcn.png",
    name: "John Doe React",
    userName: "@john_Doe2",
    comment:
      "Lorem ipsum dolor sit amet,exercitation. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
  },
  {
    image: "https://github.com/shadcn.png",
    name: "John Doe React",
    userName: "@john_Doe3",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
  },
  {
    image: "https://github.com/shadcn.png",
    name: "John Doe React",
    userName: "@john_Doe4",
    comment:
      "Lorem ipsum dolor sit amet, tempor incididunt  aliqua. Ut enim ad minim veniam, quis nostrud.",
  },
  {
    image: "https://github.com/shadcn.png",
    name: "John Doe React",
    userName: "@john_Doe5",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

export  const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<TestimonialProps[]>([]);
  const username = "type_jordan";
  const { data: userData, isFetching: isFetchingUser } = useGetUserByUsernameQuery(username);
  const userId = userData?.id;
  const { data: mentionsData, isFetching: isFetchingMentions } = useGetUserMentionsByIdQuery(userId || '', {
    skip: !userId,  // Only run this query if userId is available
  });
  
  // Combine loading states from both hooks
  const isLoading = isFetchingUser || isFetchingMentions;

    useEffect(() => {
      if (!isFetchingMentions && mentionsData && userData && !isFetchingUser) {
        const adaptedTestimonials = Array.isArray(mentionsData) ? mentionsData.map((mention: Tweet) => ({
          id: mention.id,
          image: mention.user.profile_image_url,
          name: mention.user.name,
          userName: `@${mention.user.username}`,
          comment: mention.text,
        })) : [];
        setTestimonials(adaptedTestimonials);
      }
    }, [mentionsData, userData, isFetchingMentions, isFetchingUser]);
  
  return (
    <section
      id="testimonials"
      className="container py-24 sm:py-32"
    >
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
        <p>Loading testimonials...</p>
      ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 sm:block columns-2  lg:columns-3 lg:gap-6 mx-auto space-y-4 lg:space-y-6">
          {testimonials.map(testimonial => (
            <Card
              key={testimonial.userName}
              className="max-w-md md:break-inside-avoid overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage
                    alt={testimonial.name}
                    src={testimonial.image}
                  />
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <CardTitle className="text-lg">{testimonial.name[0]}</CardTitle>
                  <CardDescription>{testimonial.userName}</CardDescription>
                </div>
              </CardHeader>

              <CardContent>{testimonial.comment}</CardContent>
            </Card>
         ))}
      </div>
      )}
    </section>
  );
};



