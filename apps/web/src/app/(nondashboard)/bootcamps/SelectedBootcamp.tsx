"use client";

import AccordionSections from "@/components/AccordionSections";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import React from "react";

interface SelectedBootcampProps {
  bootcamp: Bootcamp;
  handleEnrollNow: (bootcampId: string) => void;
}

const SelectedBootcamp: React.FC<SelectedBootcampProps> = ({
  bootcamp,
  handleEnrollNow,
}) => {
  return (
    <div className="selected-course max-h-[calc(100vh-200px)] overflow-y-auto">
      <div>
        <h3 className="selected-course__title">{bootcamp.title}</h3>
        <p className="selected-course__author">
          Hosted by {bootcamp.hostedBy.name} |{" "}
          <span className="selected-course__enrollment-count">
            {bootcamp?.members?.length ?? 0}
          </span>
        </p>
      </div>

      <div className="selected-course__content">
        {/* <p className="selected-course__description">{bootcamp.description}</p> */}

        <div className="selected-course__sections">
          <h4 className="selected-course__sections-title">Included Courses</h4>
          <ul className="list-disc ml-5 text-sm text-muted-foreground">
            {bootcamp.courses.map((course) => (
              <li key={course.courseId}>{course.title}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>Duration: {bootcamp.duration}</p>
          <p>Mode: {bootcamp.deliveryMode}</p>
          <p>Type: {bootcamp.type}</p>
          <p>Certification: {bootcamp.certification}</p>
        </div>

        <div className="selected-course__footer">
          <span className="selected-course__price">
            {/* {formatPrice(bootcamp.price.amount)} */}
          </span>
          <Button
            onClick={() => handleEnrollNow(bootcamp._id)}
            className="bg-primary-700 hover:bg-primary-600"
          >
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectedBootcamp;
