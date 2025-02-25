import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check, Linkedin } from "lucide-react";
import { LightBulbIcon } from "./ui/Icons";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Tweet } from "@/types/type";

interface HeroCardsProps {
  tweets: Tweet[]; // Accept tweets as a prop
}

const HeroCards: React.FC<HeroCardsProps> = ({ tweets }) => {
  console.log("Rendering HeroCards with tweets:", tweets);

  // if (tweets.length === 0) {
  //   return <div>No tweets to display</div>;
  // }

  return (
    <div className="lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Testimonial */}
      <Carousel className="w-full h-auto overflow-hidden">
        <CarouselContent className="flex transition-transform duration-300 ease-in-out">
          {tweets.map((tweet) => (
            <CarouselItem key={tweet.id} className="flex-none w-full h-auto">
              <Card className="m-4 drop-shadow-xl shadow-black/10 dark:shadow-white/10">
                <CardHeader className="flex items-center gap-4 pb-2">
                  <Avatar>
                    <AvatarImage
                      alt={tweet.user.name}
                      src={tweet.user.profile_image_url}
                    />
                    <AvatarFallback>{tweet.user.name[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col">
                    <CardTitle className="text-lg">{tweet.user.name}</CardTitle>
                    <CardDescription>@{tweet.user.username}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>{tweet.text}</CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* Team */}
      <Card className="absolute right-[20px] top-4 w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="mt-8 flex justify-center items-center pb-2">
          <Image
            src="https://i.pravatar.cc/150?img=58"
            alt="user avatar"
            width={150}
            height={150}
            className="absolute grayscale-[0%] -top-12 rounded-full w-24 h-24 aspect-square object-cover"
          />
          <CardTitle className="text-center">Leo Miranda</CardTitle>
          <CardDescription className="font-normal text-primary">
            Frontend Developer
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center pb-2">
          <p>
            I really enjoy transforming ideas into functional software that
            exceeds expectations
          </p>
        </CardContent>

        <CardFooter>
          <div>
            <a
              rel="noreferrer noopener"
              href="https://github.com/leoMirandaa"
              target="_blank"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <span className="sr-only">Github icon</span>
              <GitHubLogoIcon className="w-5 h-5" />
            </a>
            <a
              rel="noreferrer noopener"
              href="https://twitter.com/leo_mirand4"
              target="_blank"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <span className="sr-only">X icon</span>
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-foreground w-5 h-5"
              >
                <title>X</title>
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>
            </a>

            <a
              rel="noreferrer noopener"
              href="https://www.linkedin.com/in/leopoldo-miranda/"
              target="_blank"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <span className="sr-only">Linkedin icon</span>
              <Linkedin size="20" />
            </a>
          </div>
        </CardFooter>
      </Card>

      {/* Pricing */}
      <Card className="absolute top-[150px] left-[50px] w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="flex item-center justify-between">
            Introduction to Git and GitHub
            <Badge variant="secondary" className="text-sm text-primary">
              Free – Most Popular
            </Badge>
          </CardTitle>
          <div>
            <span className="text-3xl font-bold">$0.00</span>
            <span className="text-muted-foreground"> /month</span>
          </div>

          <CardDescription>
            Master Git and GitHub for free! Learn version control, collaborate like a pro, and build foundational skills for modern development with Jordan Muthemba.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button className="landing__cta-button w-full">
            Enroll Now
          </Button>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {["Learn version control basics", "Collaborate on projects effectively", "Access 7 practical lessons"].map(
              (benefit: string) => (
                <span key={benefit} className="flex">
                  <Check className="text-green-500" />{" "}
                  <h3 className="ml-2">{benefit}</h3>
                </span>
              )
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Service */}
      <Card className="absolute w-[350px] -right-[10px] bottom-[35px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
            <LightBulbIcon />
          </div>
          <div>
            <CardTitle>Light & dark mode</CardTitle>
            <CardDescription className="text-md mt-2">
              Lorem ipsum dolor sit amet consect adipisicing elit. Consectetur
              natusm.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default HeroCards;
