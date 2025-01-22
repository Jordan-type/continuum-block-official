import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { toast } from "sonner";
import { UserMentions, User } from "@/types/type";

// console.log("", process.env.TWITTER_API_URL, process.env.TWITTER_BEARER_TOKEN)

const twitterApiBaseQuery = async (args:string, api: BaseQueryApi, extraOptions: any) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: 'https://api.twitter.com/2', // Ensure this is set in your environment
    prepareHeaders: async (headers) => {
      const token = 'AAAAAAAAAAAAAAAAAAAAANUQ7AAAAAAAqnXZQVt9tW%2FwhukLytoP1iIdGNY%3D0ItebNiLretJcD1UedhSe7iFGZ1DrI4sgStWHvWhGwfxSkqBHm'; // Use environment variable
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  try {
    const result = await baseQuery(args, api, extraOptions);
    console.log("Twitter API response:", result);

    if (result.error) {
      const errorMessage = result.error.status === 'FETCH_ERROR' ? 'Network error' : (result.error.data as { message?: string })?.message || result.error.status.toString();
      toast.error(`Error: ${errorMessage}`);
    }

    const isMutation = (args as unknown as FetchArgs).method && (args as unknown as FetchArgs).method !== 'GET';
    if (isMutation && result.data) {
      const successMessage = (result.data as { message?: string })?.message || 'Operation successful';
      toast.success(successMessage);
    }

    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error("Error fetching data:", errorMessage);
    return { error: { status: 'CUSTOM_ERROR', message: errorMessage } };
  }
};

export const twitterApi = createApi({
  reducerPath: 'twitterApi',
  baseQuery: twitterApiBaseQuery,
  endpoints: (builder) => ({
    getUserByUsername: builder.query<User, string>({
      query: (username: string) => `/users/by/username/${username}`
    }),
    getUserMentionsById: builder.query<UserMentions, string>({
      query: (userId: string) => `/users/${userId}/mentions`
    }),
  })
});

export const {
  useGetUserMentionsByIdQuery,
  useGetUserByUsernameQuery,
} = twitterApi;
