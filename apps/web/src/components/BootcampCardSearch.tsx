"use client";

import Image from "next/image";
import React from "react";
import { Badge } from "@/components/ui/badge";

const BootcampCardSearch = ({ bootcamp, isSelected, onClick, }: SearchBootcampCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`bootcamp-card-search group ${
        isSelected
          ? "bootcamp-card-search--selected"
          : "bootcamp-card-search--unselected"
      }`}
    >
      <div className="bootcamp-card-search__image-container relative p-4">
        <Image
          src={bootcamp.image || "/placeholder.png"}
          alt={bootcamp.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="bootcamp-card-search__image"
          priority
        />
        <Badge
          className={`absolute top-4 right-4 z-10 ${
            bootcamp.type === "Full-Time" ? "bg-purple-500" : "bg-blue-500"
          } text-white rounded-full px-2 py-1 text-sm font-medium`}
        >
          {bootcamp.type || "Unknown"}
        </Badge>
      </div>
      <div className="bootcamp-card-search__content">
        <div>
          <h2 className="bootcamp-card-search__title">{bootcamp.title}</h2>
          <p className="bootcamp-card-search__description">
            {bootcamp.practicalCaseStudy || "No case study provided"}
          </p>
        </div>
        <div className="mt-2">
          <p className="bootcamp-card-search__creator">
            Host By {bootcamp.hostedBy.name || "Unknown Creator"}
          </p>
          <div className="bootcamp-card-search__footer">
            <span className="bootcamp-card-search__duration">
              {bootcamp.duration || "Duration not specified"}
            </span>
            <span className="bootcamp-card-search__enrollment">
              {bootcamp.members?.length || 0} Enrolled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootcampCardSearch;
