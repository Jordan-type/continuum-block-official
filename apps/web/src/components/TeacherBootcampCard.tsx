import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";

const TeacherBootcampCard = ({
  bootcamp,
  onEdit,
  onDelete,
  isOwner,
}: TeacherBootcampCardProps) => {


  return (
    <Card className="bootcamp-card-teacher group">
      <CardHeader className="bootcamp-card-teacher__header relative p-4">
        <Image
          src={bootcamp.image || "/placeholder.png"}
          alt={bootcamp.title}
          width={370}
          height={150}
          className="bootcamp-card-teacher__image"
          priority
        />
        <Badge
          className={`absolute top-4 right-4 z-10 ${
            bootcamp.type === "Part-Time"
              ? "bg-blue-500"
              : bootcamp.type === "Full-Time"
              ? "bg-purple-500"
              : "bg-gray-500"
          } text-white rounded-full px-2 py-1 text-sm font-medium`}
        >
          {bootcamp.type || "Unknown"}
        </Badge>
      </CardHeader>

      <CardContent className="bootcamp-card-teacher__content">
        <div className="flex flex-col">
          <CardTitle className="bootcamp-card-teacher__title">
            {bootcamp.title || "Untitled Bootcamp"}
          </CardTitle>

          <CardDescription className="bootcamp-card-teacher__duration">
            {bootcamp.duration || "Duration not specified"}
          </CardDescription>

          <p className="text-sm mb-2">
            Status:{" "}
            <span
              className={cn(
                "font-semibold px-2 py-1 rounded",
                bootcamp.enrollmentStatus === "Open"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              )}
            >
              {bootcamp.enrollmentStatus || "Unknown"}
            </span>
          </p>

          <p className="text-sm mb-2">
            Start Date: <span className="font-semibold">{formatDate(bootcamp.startDate)}</span>
          </p>

          {bootcamp.liveClasses && (
            <p className="text-sm mb-2">
              Live Classes: <span className="font-semibold">{bootcamp.liveClasses.count}</span> -{" "}
              {bootcamp.liveClasses.description}
            </p>
          )}

          {bootcamp.members && (
            <p className="ml-1 mt-1 inline-block text-secondary text-sm font-normal">
              <span className="font-bold text-white-100">
                {bootcamp.members.length}
              </span>{" "}
              Member{bootcamp.members.length !== 1 ? "s" : ""} Enrolled
            </p>
          )}
        </div>

        <div className="w-full xl:flex space-y-2 xl:space-y-0 gap-2 mt-3">
          {isOwner ? (
            <>
              <Button
                  className="bootcamp-card-teacher__edit-button"
                  onClick={() => onEdit(bootcamp)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <DeleteConfirmationDialog
                itemType="bootcamp"
                itemTitle={bootcamp.title}
                onConfirm={() => onDelete(bootcamp)}
                triggerButton={
                  <Button className="bootcamp-card-teacher__delete-button">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                }
              />
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">View Only</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherBootcampCard;