// Assuming this is the structure you receive for mentions
export interface Mention {
  id: string;
  text: string;
  user_id: string; // Assuming each mention has a user_id
}

// User data structure received from the API
export interface User {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
}

// Combined tweet structure for component usage
export interface Tweet {
  id: string;
  text: string;
  user: TweetUser;
}

export interface TweetUser {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
}


