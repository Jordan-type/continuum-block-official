"use client";

import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

const BootcampCard = ({ bootcamp, onGoToBootcamp }: BootcampCardProps) => {
  return (
    <Card className="course-card group" onClick={() => onGoToBootcamp(bootcamp)}>
      <CardHeader className="course-card__header">
        <Image
          src={bootcamp.image || "/placeholder.png"}
          alt={bootcamp.title}
          width={400}
          height={350}
          className="course-card__image"
          priority
        />
      </CardHeader>
      <CardContent className="course-card__content">
        <CardTitle className="course-card__title">
          {bootcamp.title}: {bootcamp.practicalCaseStudy}
        </CardTitle>

        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage alt={bootcamp.hostedBy.name} />
            <AvatarFallback className="bg-secondary-700 text-black">
              {bootcamp.hostedBy.name[0]}
            </AvatarFallback>
          </Avatar>

          <p className="text-sm text-customgreys-dirtyGrey">
            {bootcamp.hostedBy.name}
          </p>
        </div>

        <CardFooter className="course-card__footer">
          <div className="course-card__category-level-wrapper">
            <div className="course-card__category">{bootcamp.type}</div>
            <div className="course-card__level">{bootcamp.duration}</div>
          </div>
          <span className="course-card__price">
            {formatPrice(bootcamp.price.amount)}
          </span>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default BootcampCard;
