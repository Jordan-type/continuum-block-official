// types/type.ts
export interface TweetUser {
  name: string;
  username: string;
  profile_image_url: string;
}

export interface Tweet {
  id: string;
  text: string;
  user: TweetUser;
}

// Define the structure of the Twitter API response for searches
export interface TwitterApiResponse {
  statuses: Tweet[];
  search_metadata: {
    count: number;
    since_id: number;
  };
}

export interface UserMentions {
  data: Mention[];
  meta: {
    result_count: number;
  };
}

export interface Mention {
  id: string;
  text: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
}
