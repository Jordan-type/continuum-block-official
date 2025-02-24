import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { User } from "@clerk/nextjs/server";
import { Clerk } from "@clerk/clerk-js";
import { toast } from "sonner";

import { Mention, TweetUser } from "@/types/type";

const customBaseQuery = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: any) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  try {
    const result: any = await baseQuery(args, api, extraOptions);

    console.log("results....", result)

    if (result.error) {
      const errorData = result.error.data;
      const errorMessage = errorData?.message || result.error.status.toString() || "An error occurred";
      toast.error(`Error: ${errorMessage}`);
    }

    const isMutationRequest = (args as FetchArgs).method && (args as FetchArgs).method !== "GET";

    if (isMutationRequest) {
      const successMessage = result.data?.message;
      if (successMessage) toast.success(successMessage);
    }

    if (result.data) {
      result.data = result.data.data;
    } else if (
      result.error?.status === 204 ||
      result.meta?.response?.status === 24
    ) {
      return { data: null };
    }

    return result;
  } catch (error: unknown) {
    console.log("error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return { error: { status: "FETCH_ERROR", error: errorMessage } };
  }
};

export const api = createApi({ baseQuery: customBaseQuery, reducerPath: "api", tagTypes: ["Users", "Courses", "CourseProgress"], endpoints: (build) => ({
    /* USER CLERK AND MONGODB USER */
    createUser: build.mutation<User,{ userId: string; firstName: string; lastName: string; email: string; userType?: string }>({
      query: (newUser) => ({
        url: "users/create/${newUser.userId}",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: build.mutation<User, { userId: string; email?: string; firstName?: string; lastName?: string; userType?: string; }>({
      query: ({ userId, ...updatedUser }) => ({
        url: `users/update/${userId}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["Users"],
    }),

    /* COURSES */
    createCourse: build.mutation({
      query: (courseData) => ({
        url: "courses/create",
        method: "POST",
        body: courseData,
      }),
      invalidatesTags: ["Courses"],
    }),
    
    listCourses: build.query<Course[], { category?: string }>({
      query: ({ category }) => ({
        url: "courses/all-courses",
        params: { category },
      }),
      providesTags: ["Courses"],
    }),

    getCourse: build.query({
      query: (id: string) => ({
        url: `courses/${id}`,
        method: "GET",
      }),
      
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),

    updateCourse: build.mutation({
      query: ({ courseId, updateData }) => ({
        url: `courses/update/${courseId}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: (result, error, { courseId }) => [{ type: "Courses", id: courseId }],
    }),

    deleteCourse: build.mutation({
      query: (courseId: string) => ({
        url: `courses/delete/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

    getUploadVideoUrl: build.mutation({
      query: ({ courseId, sectionId, chapterId, formData }) => ({
        url: `courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/get-upload-url`,
        method: "POST",
        body: formData,
      }),
    }),

    /* TWEETS */
    getUserByUsername: build.query<TweetUser, string>({
      query: (username: string) => ({
        url: `tweets/user/by/username/${username}`,
        method: "GET"
      })
    }),
    getUserMentionsById: build.query<Mention, string>({
      query: (userId: string) => ({
        url: `tweets/user/${userId}/mentions`,
        method: "GET"
      })
    }),

    /* USER COURSE PROGRESS */
    getUserEnrolledCourses: build.query({
      query: (userId: string) => ({
        url: `course-progress/${userId}/enrolled-courses`,
        method: "GET",
      }),
      providesTags: ["Courses", "CourseProgress"],
    }),

    getUserCourseProgress: build.query({
      query: ({ userId, courseId }: { userId: string; courseId: string }) => ({
        url: `course-progress/${userId}/courses/${courseId}`,
        method: "GET",
      }),
      providesTags: ["CourseProgress"],
    }),

    updateUserCourseProgress: build.mutation({
      query: ({ userId, courseId, progressData }: { userId: string; courseId: string; progressData: any }) => ({
        url: `course-progress/${userId}/courses/${courseId}`,
        method: "PUT",
        body: progressData,
      }),
      invalidatesTags: ["CourseProgress"],
      async onQueryStarted(
        { userId, courseId, progressData },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          api.util.updateQueryData(
            "getUserCourseProgress",
            { userId, courseId },
            (draft) => {
              Object.assign(draft, {
                ...draft,
                sections: progressData.sections,
              });
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),


    /* BUY COURSE TRANSACTIONS */




  });

export const {
  useCreateUserMutation,
  useUpdateUserMutation,

  useGetUserMentionsByIdQuery,
  useGetUserByUsernameQuery,

  useCreateCourseMutation,
  useListCoursesQuery,
  useGetCourseQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetUploadVideoUrlMutation,

  useGetUserEnrolledCoursesQuery,
  useGetUserCourseProgressQuery,
  useUpdateUserCourseProgressMutation,

} = api;
