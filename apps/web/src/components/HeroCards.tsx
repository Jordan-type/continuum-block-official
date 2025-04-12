import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { Linkedin, BookOpen, Users, ChevronRight } from "lucide-react";
import { LightBulbIcon } from "./ui/Icons";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useListCoursesQuery } from "@/state/api";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

const HeroCards = () => {
  const router = useRouter()
  const { data: courses, isLoading: coursesLoading } = useListCoursesQuery({});  // Fetch courses using the query

  // Memoize freeCourses to prevent recalculation on every render
  const freeCourses = useMemo(
    () =>
      courses?.filter(
        (course: Course) => course.price === 0 && course.status === "Published"
      ) || [],
    [courses]
  ); // add another must be published

  // State for carousel API and auto-rotation
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);

  // Auto-rotate the carousel
  useEffect(() => {
    if (!api || freeCourses.length <= 1) return; // Skip if no API or only one course

    const autoRotate = () => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0); // Loop back to the first item
      }
    };

    const interval = setInterval(autoRotate, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [api, freeCourses]);

  const handleEnrollNow = (courseId: string) => {
    router.push(`/checkout?step=1&id=${courseId}&showSignUp=false`, {
      scroll: false,
    });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Free course pricing */}
      <Carousel
        className="w-full max-w-md drop-shadow-xl shadow-black/10 dark:shadow-white/10"
        setApi={setApi}
      >
        {coursesLoading ? (
          <CardContent className="text-center py-4">
            Loading free courses...
          </CardContent>
        ) : freeCourses.length === 0 ? (
          <CardContent className="text-center py-4">
            No free courses available
          </CardContent>
        ) : (
          <>
            <CarouselContent>
              {freeCourses.map((course: Course, index: number) => (
                <CarouselItem key={course._id || index}>
                  <Card className="free-course-card">
                    {/* Image and Badges */}
                    <div className="free-course-card__image-container">
                      <Image
                        src={course.image || "/placeholder.png"}
                        alt={course.title}
                        width={448}
                        height={252} // 16:9 aspect ratio (448 / 16 * 9 = 252)
                        className="free-course-card__image"
                      />
                      <div className="free-course-card__badges">
                        <Badge variant="secondary" className="free-course-card__badge">FREE</Badge>
                        <Badge variant="secondary" className="free-course-card__badge">Most Popular</Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="free-course-card__content">
                    <div className="free-course-card__price bg-primary-700 text-white">
                        {formatPrice(course.price)}
                      </div>
                      <div className="free-course-card__details">
                        <span className="free-course-card__detail">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {course.sections.length} Sections
                        </span>
                        <span className="free-course-card__detail">
                          <Users className="w-4 h-4 mr-1" />
                          {course.enrollments?.length} Enrolled
                        </span>
                      </div>
                      <h3 className="free-course-card__title">
                        {course.title}
                      </h3>
                      <p className="free-course-card__description">
                        {course.description}
                      </p>
                      <div className="free-course-card__instructor">
                        <div className="flex items-center gap-2">
                        <Avatar className="free-course-card__instructor-avatar">
                          <AvatarImage alt={course.teacherName} />
                          <AvatarFallback className="free-course-card__instructor-avatar-fallback">
                            {course.teacherName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>{course.teacherName}</span>
                      </div>
                      <Button 
                        onClick={() => handleEnrollNow(course._id)}
                        className="free-course-card__button bg-purple-100 text-purple-700 hover:bg-purple-200">
                        Enroll Now <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="free-course-card__carousel-previous" />
            <CarouselNext className="free-course-card__carousel-next" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default HeroCards;
