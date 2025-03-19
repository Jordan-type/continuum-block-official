"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, GripVertical } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { openCourseModal, deleteCourse, setBootcampCourses } from "@/state";
import React from "react";

interface Course {
  courseId: string;
  title: string;
}

const DroppableComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bootcampCourses } = useAppSelector((state) => state.global.bootcampEditor);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const updatedCourses = [...bootcampCourses];
    const [reorderedCourse] = updatedCourses.splice(startIndex, 1);
    updatedCourses.splice(endIndex, 0, reorderedCourse);
    dispatch(setBootcampCourses(updatedCourses)); // Use the exported action
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="bootcamp-courses">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="course-list space-y-2"
          >
            {bootcampCourses.length > 0 ? (
              bootcampCourses.map((course: Course, index: number) => (
                <Draggable
                  key={course.courseId}
                  draggableId={course.courseId}
                  index={index}
                >
                  {(draggableProvider) => (
                    <div
                      ref={draggableProvider.innerRef}
                      {...draggableProvider.draggableProps}
                      {...draggableProvider.dragHandleProps}
                      className="course-item flex items-center justify-between p-3 bg-gray-100 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <GripVertical className="h-5 w-5 text-gray-500 cursor-move" />
                        <p className="text-sm font-medium text-gray-800">
                          {course.title}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            dispatch(openCourseModal({ courseIndex: index }))
                          }
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => dispatch(deleteCourse(index))}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))
            ) : (
              <p className="text-sm text-gray-500">No courses added yet.</p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DroppableComponent;