"use client";

import { CustomFormField } from "@/components/CustomFormField";
import CustomModal from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { courseBootCampSchema, CourseBootcampFormData } from "@/lib/schemas"; // Reuse or adjust
import { addCourse, closeCourseModal, editCourse } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, PlusCircle, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useListCoursesQuery, useAddCourseToBootcampMutation } from "@/state/api";

const CourseModal = () => {
  const dispatch = useAppDispatch();
  const {isCourseModalOpen, selectedCourseIndex, bootcampCourses, bootcampId} = useAppSelector((state) => state.global.bootcampEditor); // Adjust Redux state

  const { data: courses, isLoading: isCoursesLoading, isError: isCoursesError } = useListCoursesQuery({category: "all",}); 
  const [addCourseToBootcamp, { isLoading: isAddingCourse }] = useAddCourseToBootcampMutation();
  const course = selectedCourseIndex !== null ? bootcampCourses[selectedCourseIndex] : undefined;

  const methods = useForm<CourseBootcampFormData>({
    resolver: zodResolver(courseBootCampSchema),
    defaultValues: {
      courseId: "",
      title: "",
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoursePreview, setSelectedCoursePreview] = useState<Course | null>(null);

  useEffect(() => {
    if (course) {
      methods.reset({
        courseId: course.courseId,
        title: course.title,
      });
      const previewCourse = courses?.find((c: Course) => c._id === course.courseId);
      setSelectedCoursePreview(previewCourse || null);
    } else {
      methods.reset({
        courseId: "",
        title: "",
      });
    }
  }, [course, methods, courses]);

  const onClose = () => {
    dispatch(closeCourseModal());
    setSearchTerm("");
    setSelectedCoursePreview(null);
  };

  const onSubmit = async (data: CourseBootcampFormData) => {
    if (!data.courseId || !data.title) {
      toast.error("Please select a course");
      return;
    }

    // Check for duplicates when adding a new course
    if (selectedCourseIndex === null) {
      const isDuplicate = bootcampCourses.some((c) => c.courseId === data.courseId);
      if (isDuplicate) {
        toast.error(`"${data.title}" is already in this bootcamp!`, {
          description: "Each course can only be added once.",
        });
        return;
      }

      if (!bootcampId) {
        toast.error("Bootcamp ID is missing");
        return;
      }

      // add course to backend and update redux state
      try {
        await addCourseToBootcamp({ bootcampId, courseId: data.courseId }).unwrap();
        dispatch(addCourse(data)); // Update Redux state after successful backend update
        toast.success(`"${data.title}" added to your bootcamp!`, {
          description: "Save the bootcamp to apply changes.",
        });
      } catch (error) {
        toast.error("Failed to add course to bootcamp", {
          description: "Please try again.",
        });
      }

    } else {
      // For editing, allow the same courseId if it’s the one being edited
      const otherCourses = bootcampCourses.filter((_, i) => i !== selectedCourseIndex);
      const isDuplicate = otherCourses.some((c) => c.courseId === data.courseId);
      if (isDuplicate) {
        toast.error(`"${data.title}" is already in this bootcamp!`, {
          description: "Choose a different course to update.",
        });
      return;
    }
    dispatch(editCourse({ index: selectedCourseIndex, course: data }));
    toast.success(`"${data.title}" updated successfully!`, {
      description: "Save the bootcamp to apply changes.",
    });
    }
    onClose();
  };

  const filteredCourses = courses?.filter((c: Course) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CustomModal isOpen={isCourseModalOpen} onClose={onClose}>
      <div className="course-modal p-6 bg-customgreys-darkGrey rounded-lg">
        <div className="course-modal__content">
          <div className="course-modal__header flex justify-between items-center mb-4">
            <h2 className="course-modal__title text-2xl font-bold text-white-50">
              {selectedCourseIndex !== null ? "Edit Course" : "Add Course to Bootcamp"}
            </h2>
            <button onClick={onClose} className="course-modal__close text-white-50 hover:text-red-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          {isCoursesLoading ? (
            <div className="text-center py-4 text-white-50">Loading courses...</div>
          ) : isCoursesError || !courses ? (
            <div className="text-center py-4 text-red-400">Error loading courses.</div>
          ) : (
            <Form {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="course-modal__form space-y-6">
                {/* Search Bar */}
                <div className="flex items-center gap-2 bg-customgreys-primarybg p-2 rounded-lg">
                  <Search className="w-5 h-5 text-customgreys-dirtyGrey" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none text-white-50 placeholder:text-customgreys-dirtyGrey"
                  />
                </div>

                {/* Course Selection */}
                <FormField
                  control={methods.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white-50">Select a Course</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            const selectedCourse = courses.find((c: Course) => c._id === value);
                            if (selectedCourse) {
                              field.onChange(selectedCourse._id);
                              methods.setValue("title", selectedCourse.title);
                              setSelectedCoursePreview(selectedCourse);
                            }
                          }}
                          value={field.value}
                          disabled={!!course} // Disable if editing existing course
                        >
                          <SelectTrigger className="bg-customgreys-primarybg text-white-50">
                            <SelectValue placeholder="Choose a course" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 bg-customgreys-darkGrey text-white-50">
                            {filteredCourses?.map((course: Course) => (
                              <SelectItem key={course._id} value={course._id} className="hover:bg-primary-700">
                                {course.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Course Title (Read-Only) */}
                <FormField
                  control={methods.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white-50">Course Title</FormLabel>
                      <FormControl>
                        <Input {...field} disabled className="bg-customgreys-primarybg text-white-50" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Course Preview */}
                {selectedCoursePreview && (
                   <div className="bg-customgreys-primarybg p-4 rounded-lg">
                    <p className="text-white-50 text-sm"><strong>Preview:</strong> {selectedCoursePreview.description}</p>
                    <p className="text-customgreys-dirtyGrey text-xs">Level: {selectedCoursePreview.level}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="course-modal__actions flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="text-white-50 border-customgreys-dirtyGrey hover:bg-customgreys-dirtyGrey"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary-700 hover:bg-primary-600 flex items-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    {selectedCourseIndex !== null ? "Update Course" : "Add to Bootcamp"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </CustomModal>
  );
};

export default CourseModal;