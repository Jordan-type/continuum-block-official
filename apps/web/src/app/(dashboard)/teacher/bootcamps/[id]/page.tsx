"use client";

import Image from "next/image";
import { CustomFormField } from "@/components/CustomFormField";
import Header from "@/components/Header";
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
import { bootcampSchema, BootcampFormData } from "@/lib/schemas";
import { formatDate, formatDateForInput, createBootcampFormData, } from "@/lib/utils";
import { useListCoursesQuery, useGetBootcampQuery, useUpdateBootcampMutation } from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DroppableComponent from "./Droppable";
import MemberModal from "./MemberModal";
import CourseModal from "./CourseModal";
import { toast } from "sonner"; // Add toast import
import {setBootcampCourses, openMemberModal, openCourseModal } from "@/state";

const BootcampEditor = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const {data: courses, isLoading: isCoursesLoading, isError: isCoursesError,} = useListCoursesQuery({ category: "all" });
  const { data: bootcamp, isLoading: isBootcampLoading, refetch } = useGetBootcampQuery(id);
  const [updateBootcamp] = useUpdateBootcampMutation();

  const dispatch = useAppDispatch();

  const methods = useForm<BootcampFormData>({
    resolver: zodResolver(bootcampSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      duration: "",
      type: false,
      liveClasses: {
         count: 0,
         description: "No live classes scheduled" 
      },
      practicalCaseStudy: "",
      weeklyFeedback: "",
      certification: "",
      enrollmentStatus: false,
      image: "",
      status: false,
      courses: [],
      members: [],
      testimonials: [],
      price: { amount: 0, currency: "USD" },
      paymentPlans: [],
      categories: [],
      averageRating: 0,
      reviewCount: 0,
      prerequisites: "",
      leaderboard: [],  
    },
  });


  useEffect(() => {
    if (bootcamp) {
      methods.reset({
        title: bootcamp.title,
        description: bootcamp.description ,
        startDate: new Date(bootcamp.startDate),
        duration: bootcamp.duration,
        type: bootcamp.type === "Part-Time",
        liveClasses: bootcamp.liveClasses,
        practicalCaseStudy: bootcamp.practicalCaseStudy,
        weeklyFeedback: bootcamp.weeklyFeedback,
        certification: bootcamp.certification,
        enrollmentStatus: bootcamp.enrollmentStatus === "Open",
        image: bootcamp.image || "/placeholder.png",
        status: bootcamp.status === "Published",
        courses: bootcamp.courses || [],
        members: bootcamp.members || [],
        testimonials: bootcamp.testimonials || [],
        price: bootcamp.price || { amount: 0, currency: "USD" },
        paymentPlans: bootcamp.paymentPlans || [],
        categories: bootcamp.categories || [],
        averageRating: bootcamp.averageRating || 0,
        reviewCount: bootcamp.reviewCount || 0,
        prerequisites: bootcamp.prerequisites || "",
        leaderboard: bootcamp.leaderboard || [],
      });
      setPreview(bootcamp.image);
      dispatch(setBootcampCourses(bootcamp.courses || []));
    }
  }, [bootcamp, methods, dispatch]);

  const onSubmit = async (data: BootcampFormData) => {
    console.log("Form submission data:", data);

    try {
      const formData = createBootcampFormData(data); // Create FormData

      // Use the FormData with the mutation
      await updateBootcamp({ bootcampId: id, updateData: formData }).unwrap();
      refetch();
      toast.success("Bootcamp updated successfully!");
    } catch (error) {
      console.log("Failed to update bootcamp:", error);
      toast.error("Error updating bootcamp");
    }
  };

  const addMember = () => {
    dispatch(openMemberModal({ memberIndex: null }));
  };

  const addCourse = () => {
    dispatch(openCourseModal({ courseIndex: null, bootcampId: id }));
  };

  // const removeCourse = (index: number) => {
  //   const currentCourses = methods.getValues("courses") || [];
  //   const updatedCourses = currentCourses.filter((_, i) => i !== index);
  //   methods.setValue("courses", updatedCourses);
  //   dispatch({ type: "global/bootcampEditor/removeCourse", payload: index });
  //   toast.success("Course removed from bootcamp");
  // };

  if (isBootcampLoading || isCoursesLoading) return <div>Loading...</div>;
  if (isCoursesError) return <div>Error loading courses.</div>;

  return (
    <div>
      <div className="flex items-center gap-5 mb-5">
        <button
          className="flex items-center border border-customgreys-dirtyGrey rounded-lg p-2 gap-2 cursor-pointer hover:bg-customgreys-dirtyGrey hover:text-white-100 text-customgreys-dirtyGrey"
          onClick={() => router.push("/teacher/bootcamps", { scroll: false })}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bootcamps</span>
        </button>
      </div>

      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} encType="multipart/form-data">
          <Header
            title="Bootcamp Editor"
            subtitle="Edit bootcamp details and manage content"
            rightElement={
              <div className="flex items-center space-x-4">
                <CustomFormField
                  name="status"
                  label={methods.watch("status") ? "Published" : "Draft"}
                  type="switch"
                  className="flex items-center space-x-2"
                  labelClassName={`text-sm font-medium ${
                    methods.watch("status") ? "text-green-500" : "text-yellow-500"
                  }`}
                  inputClassName="data-[state=checked]:bg-green-500"/>
                <Button type="submit" className="bg-primary-700 hover:bg-primary-600">
                  {methods.watch("status") ? "Update Published Bootcamp": "Save Draft"}
                </Button>
              </div>
            }
          />
          <div className="flex justify-between md:flex-row flex-col gap-10 mt-5 font-dm-sans">
            <div className="basis-1/2">
              <div className="space-y-4">
                <CustomFormField
                  name="title"
                  label="Bootcamp Title"
                  type="text"
                  placeholder="Write bootcamp title here"
                  initialValue={bootcamp?.title}
                />

                <CustomFormField
                  name="startDate"
                  label={`Start Date${bootcamp?.startDate ? ` (${formatDate(bootcamp.startDate)})` : ""}`}
                  type="date"
                  initialValue={bootcamp?.startDate ? formatDateForInput(bootcamp.startDate) : ""}
                />

                <CustomFormField
                  name="duration"
                  label="Duration"
                  type="text"
                  placeholder="e.g., 8 weeks"
                  initialValue={bootcamp?.duration}
                />
                
                <CustomFormField
                  name="type"
                  label={methods.watch("type") ? "Full-Time" : "Part-Time"}
                  type="switch"
                  className="flex items-center space-x-2"
                  labelClassName={`text-sm font-medium ${
                    methods.watch("type") ? "text-green-500" : "text-yellow-500"
                  }`}
                  inputClassName="data-[state=checked]:bg-green-500"
                />
                <CustomFormField
                  name="enrollmentStatus"
                  label={methods.watch("enrollmentStatus") ? "Open" : "Closed"}
                  type="switch"
                  className="flex items-center space-x-2"
                  labelClassName={`text-sm font-medium ${
                    methods.watch("enrollmentStatus") ? "text-green-500" : "text-yellow-500"
                  }`}
                  inputClassName="data-[state=checked]:bg-green-500"
                />

                <CustomFormField
                  name="liveClasses.count"
                  label="Number of Live Classes"
                  type="number"
                  placeholder="0"
                  initialValue={bootcamp?.liveClasses?.count ?? 0}
                />

                <CustomFormField
                  name="liveClasses.description"
                  label="Live Classes Description"
                  type="text"
                  placeholder="e.g., Weekly live sessions"
                  initialValue={bootcamp?.liveClasses?.description}
                />

                <CustomFormField
                  name="practicalCaseStudy"
                  label="Practical Case Study"
                  type="textarea"
                  placeholder="Describe the case study"
                  initialValue={bootcamp?.practicalCaseStudy}
                />

                <CustomFormField
                  name="weeklyFeedback"
                  label="Weekly Feedback"
                  type="textarea"
                  placeholder="Describe feedback process"
                  initialValue={bootcamp?.weeklyFeedback}
                />

                <CustomFormField
                  name="certification"
                  label="Certification"
                  type="text"
                  placeholder="e.g., Certificate of Completion"
                  initialValue={bootcamp?.certification}
                />

                <FormField
                  control={methods.control}
                  name="image"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel className="text-customgreys-dirtyGrey text-sm">
                        Bootcamp Image
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-4">
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
                                      onChange(file);
                                      setPreview(URL.createObjectURL(file));
                                    }
                                  }}
                                  className="hidden"
                                />
                              </label>
                            </Button>
                          </div>
                          <div className="flex gap-4">
                            {preview && (
                              <div className="w-1/2 bg-gray-100 p-4 rounded-lg flex items-center justify-center">
                                <Image
                                  src={preview}
                                  alt="Preview Image"
                                  className="max-h-64 object-contain"
                                  width={500}
                                  height={500}
                                  onLoad={() => URL.revokeObjectURL(preview)}
                                />
                              </div>
                            )}
                            {!preview && <p>No image uploaded</p>}
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
                 Manage Bootcamp Courses
                </h2>

                <Button
                  type="button"
                  size="sm"
                 className="border-none bg-primary-700 hover:bg-primary-600 mb-4"
                 onClick={addCourse}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Course
                </Button>
              </div>
            {isBootcampLoading ? (
                <p>Loading bootcamp content...</p>
              ) : (
                <DroppableComponent />
              )}
            </div>
          </div>
        </form>
      </Form>

      <MemberModal />
      <CourseModal />
    </div>
  );
};

export default BootcampEditor;