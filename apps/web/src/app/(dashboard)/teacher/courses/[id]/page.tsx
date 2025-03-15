"use client";

import Image from 'next/image';
import { CustomFormField } from "@/components/CustomFormField";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { courseSchema } from "@/lib/schemas";
import { centsToDollars, createCourseFormData, uploadAllVideos, } from "@/lib/utils";
import { openSectionModal, openAddQuestionsModal, setSections } from "@/state";
import { useGetCourseQuery, useUpdateCourseMutation, useGetUploadVideoUrlMutation, } from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DroppableComponent from "./Droppable";
import ChapterModal from "./ChapterModal";
import SectionModal from "./SectionModal";
import AddQuestionsModal from "./AddQuestionsModal";
import { set } from "zod";

const CourseEditor = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [ preview, setPreview] = useState<string | undefined>(undefined);
  const { data: course, isLoading, refetch } = useGetCourseQuery(id);
  const [updateCourse] = useUpdateCourseMutation();
  const [getUploadVideoUrl] = useGetUploadVideoUrlMutation();

  const dispatch = useAppDispatch();
  const { sections } = useAppSelector((state) => state.global.courseEditor);

  const methods = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseTitle: "",
      courseDescription: "",
      courseLevel: "",
      courseCategory: "",
      coursePrice: "0",
      courseStatus: false,
      courseImage: "",
    },
  });

  // Remove useFieldArray since we no longer use quizQuestions
  // const { fields, append, remove } = useFieldArray({
  //   control: methods.control,
  //   name: "quizQuestions",
  // });
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number | null>(null);
  // Remove selectedChapterIndex since we’re creating new chapters
  // const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | null>(null);

  useEffect(() => {
    if (course) {
      methods.reset({
        courseTitle: course.title,
        courseDescription: course.description,
        courseLevel: course.level,
        courseCategory: course.category,
        coursePrice: centsToDollars(course.price),
        courseStatus: course.status === "Published",
        courseImage: course.image || "",
      });
      setPreview(course.image);
      dispatch(setSections(course.sections || []));
    }
  }, [course, methods]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: CourseFormData) => {
    console.log("Form submission data:", data);

    try {
      // Use the sections directly from the Redux state (no quizQuestions merging needed)
      let updatedSections = JSON.parse(JSON.stringify(sections));
      console.log("Sections with quiz chapters before video upload:", JSON.stringify(updatedSections, null, 2));

      // Upload videos if necessary
      updatedSections = await uploadAllVideos(sections, id, getUploadVideoUrl);
      console.log("Updated sections data:", updatedSections);

      const formData = createCourseFormData(data, updatedSections); // for the updated sections of the course
      console.log("FormData to be sent to server:", Object.fromEntries(formData));

      // const updateData = {
      //   title: data.courseTitle,
      //   description: data.courseDescription,
      //   price: data.coursePrice, // Ensure this is a number already, maybe convert before sending
      //   category: data.courseCategory,
      //   status: data.courseStatus ? "Published" : "Draft",
      //   image: data.courseImage, // This should be the image URL
      //   sections: updatedSections, // Make sure this includes all sections and their chapters
      // };

      // console.log("Update data to be sent to server: ==>>", updateData);

      await updateCourse({ courseId: id, updateData: formData }).unwrap(); // actual course update
      refetch();
    } catch (error) {
      console.log("Failed to update course:", error);
    }
  };

  const addQuizChapter = () => {
    if (selectedSectionIndex === null) return;
    dispatch(openAddQuestionsModal({ sectionIndex: selectedSectionIndex }));
  };

  return (
    <div>
      <div className="flex items-center gap-5 mb-5">
        <button
          className="flex items-center border border-customgreys-dirtyGrey rounded-lg p-2 gap-2 cursor-pointer hover:bg-customgreys-dirtyGrey hover:text-white-100 text-customgreys-dirtyGrey"
          onClick={() => router.push("/teacher/courses", { scroll: false })}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </button>
      </div>

      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          <Header
            title="Course Setup"
            subtitle="Complete all fields and save your course"
            rightElement={
              <div className="flex items-center space-x-4">
                <CustomFormField
                  name="courseStatus"
                  label={methods.watch("courseStatus") ? "Published" : "Draft"}
                  type="switch"
                  className="flex items-center space-x-2"
                  labelClassName={`text-sm font-medium ${
                    methods.watch("courseStatus")
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                  inputClassName="data-[state=checked]:bg-green-500"
                />
                <Button
                  type="submit"
                  className="bg-primary-700 hover:bg-primary-600"
                >
                  {methods.watch("courseStatus")
                    ? "Update Published Course"
                    : "Save Draft"}
                </Button>
              </div>
            }
          />

          <div className="flex justify-between md:flex-row flex-col gap-10 mt-5 font-dm-sans">
            <div className="basis-1/2">
              <div className="space-y-4">
                <CustomFormField
                  name="courseTitle"
                  label="Course Title"
                  type="text"
                  placeholder="Write course title here"
                  className="border-none"
                  initialValue={course?.title}
                />

                <CustomFormField
                  name="courseDescription"
                  label="Course Description"
                  type="textarea"
                  placeholder="Write course description here"
                  initialValue={course?.description}
                />

                <CustomFormField
                  name="courseCategory"
                  label="Course Category"
                  type="select"
                  placeholder="Select category"
                  options={[
                    { value: "web development", label: "Web Development" },
                    { value: "blockchain", label: "Blockchain" },
                    { value: "technology", label: "Technology" },
                    {
                      value: "artificial intelligence",
                      label: "Artificial Intelligence",
                    },
                    { value: "mathematics", label: "Mathematics" },
                    { value: "data science", label: "Data Science" },
                  ]}
                  initialValue={course?.category}
                />
                
                <CustomFormField
                  name="courseLevel"
                  label="Course Level"
                  type="select"
                  placeholder="Select level"
                  options={[ 
                    { value: "Beginner", label: "Beginner" },
                    { value: "Intermediate", label: "Intermediate" },
                    { value: "Advanced", label: "Advanced"},
                  ]}
                  initialValue={course?.level}
                />

                <CustomFormField
                  name="coursePrice"
                  label="Course Price"
                  type="number"
                  placeholder="0"
                  initialValue={course?.price}
                />

                <FormField
                  control={methods.control}
                  name="courseImage"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel className="text-customgreys-dirtyGrey text-sm">
                        Course Image
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-4">
                          {/* Drag & Drop or Browse Files Area */}
                          <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg text-center">
                            <p>Drag & Drop your images here</p>
                            <Button variant="outline" className="mt-2" asChild>
                              <label>
                                Or browse files
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      onChange(file); // Update form state with the new file
                                    }
                                  }}
                                  className="hidden" // Hide the default input
                                />
                              </label>
                            </Button>
                          </div>

                          {/* Image Display Area - Two Side-by-Side Containers */}
                          <div className="flex gap-4">
                            {/* Left: Uploaded Image (if any) */}
                            <div className="w-1/2 bg-gray-100 p-4 rounded-lg flex items-center justify-center">
                              {value instanceof File && (
                                <Image
                                  src={URL.createObjectURL(value)}
                                  alt="Uploaded Image"
                                  className="max-h-64 object-contain"
                                  width={500}
                                  height={500}
                                  onLoad={() => URL.revokeObjectURL(URL.createObjectURL(value))}
                                />
                              )}
                              {!value && <p>No image uploaded</p>}
                            </div>

                            {/* Right: Current Image (if any) */}
                            <div className="w-1/2 bg-gray-100 p-4 rounded-lg flex items-center justify-center">
                              {typeof value === "string" && value && (
                                <Image
                                  src={value}
                                  alt="Current Image"
                                  className="max-h-64 object-contain"
                                  width={500}
                                  height={500}
                                  priority
                                />
                              )}
                              {typeof value !== "string" && !value && (
                                <p>No current image</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-customgreys-darkGrey mt-4 md:mt-0 p-4 rounded-lg basis-1/2">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-semibold text-secondary-foreground">
                  Sections
                </h2>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    dispatch(openSectionModal({ sectionIndex: null }))
                  }
                  className="border-none text-primary-700 group"
                >
                  <Plus className="mr-1 h-4 w-4 text-primary-700 group-hover:white-100" />
                  <span className="text-primary-700 group-hover:white-100">
                    Add Section
                  </span>
                </Button>
              </div>

              {isLoading ? (
                <p>Loading course content...</p>
              ) : sections.length > 0 ? (
                <DroppableComponent />
              ) : (
                <p>No sections available</p>
              )}

              {/* Add Quiz Question Form */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-secondary-foreground mb-4">Add Quiz Chapter</h3>
                <div className="space-y-4">
                  <select
                    onChange={(e) => {
                      const sectionIdx = parseInt(e.target.value);
                      setSelectedSectionIndex(sectionIdx);
                    }}
                    className="w-full p-2 mt-2 border border-gray-300 rounded-lg bg-customgreys-primarybg"
                  >
                    <option value="">Select Section to Add Quiz Chapter</option>
                    {sections.map((section, sectionIdx) => (
                      <option key={section.sectionId} value={sectionIdx}>
                        Section {sectionIdx + 1}: {section.sectionTitle}
                      </option>
                    ))}
                  </select>

                  <Button
                    type="button"
                    onClick={addQuizChapter}
                    className="bg-primary-700 hover:bg-primary-600 mt-4"
                    disabled={selectedSectionIndex === null}
                  >
                    Add New Quiz Chapter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>

      <ChapterModal />
      <SectionModal />
      <AddQuestionsModal />
    </div>
  );
};

export default CourseEditor;
