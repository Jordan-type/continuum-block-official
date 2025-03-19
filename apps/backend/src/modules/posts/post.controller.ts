import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { Query } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

import { cloudinary } from "../../config/cloudinary.config";
import PostModel, { IPost } from "./model";

// Define the expected shape of req.query
interface PostQueryParams {
  userId?: string;
  searchTerm?: string;
  title?: string;
  slug?: string;
  category?: string;
  postId?: string;
  sort?: string;
  select?: string;
  page?: string;
  limit?: string;
}

// Define the response shape
interface PostResponse {
  posts: IPost[];
  totalPosts: number;
  lastMonthPosts: number;
  pageNo: number;
  itemRange: string;
  nbHits: number;
}

const createPost = async (req: Request, res: Response): Promise<void> => {
  const { title, content, category } = req.body;
  const { userId } = req.params;

  try {
    // Verify the authenticated user
    const auth = getAuth(req);
    if (!auth || auth.userId !== userId) {
      res.status(403).json({ message: "You are not allowed to create a post" });
      return;
    }

    const post = await PostModel.findOne({ title });
    if (post) {
      res.status(403).json({ message: "Create unique post or title" });
      return;
    }

    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    const newPost = new PostModel({ ...req.body, userId, slug });
    const createdPost = await newPost.save();

    res
      .status(201)
      .json({
        status: 201,
        data: { post: createdPost },
        message: "post has been created successfully",
      });
  } catch (error) {
    res.status(500).json({
      message: "Some error occurred while creating the post.",
      error,
    });
  }
};

const getPosts = async (
  req: Request<{}, {}, {}, PostQueryParams>,
  res: Response
): Promise<void> => {
  try {
    const {
      userId,
      searchTerm,
      title,
      slug,
      category,
      postId,
      sort,
      select,
      page,
      limit,
    } = req.query;
    const queryObject: Record<string, any> = {};

    // Data Filteration
    if (userId) {
      queryObject.userId = { $regex: userId, $options: "i" };
    }
    if (category && category !== "all") {
      queryObject.category = { $regex: category, $options: "i" };
    }
    if (slug) {
      queryObject.slug = { $regex: slug, $options: "i" };
    }
    if (postId) {
      queryObject._id = postId;
    }
    if (title) {
      queryObject.title = { $regex: title, $options: "i" };
    }
    if (searchTerm) {
      queryObject.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { content: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // Initialize the Mongoose query with proper typing
    let postData: Query<IPost[], IPost> = PostModel.find(queryObject);

    // Sorting
    if (sort) {
      const sortFix = sort.split(",").join(" ");
      let sortValue: Record<string, 1 | -1> | string;

      if (sortFix === "desc") {
        sortValue = { createdAt: -1 }; // Descending: newest first
      } else if (sortFix === "asc") {
        sortValue = { createdAt: 1 }; // Ascending: oldest first
      } else {
        sortValue = sortFix; // Custom sort (e.g., "title -createdAt")
      }

      postData = postData.sort(sortValue);
    }

    // Selecting fields
    if (select) {
      const selectFix = select.split(",").join(" ");
      postData = postData.select(selectFix);
    }

    // Pagination
    const pageNo = Math.max(1, parseInt(page || "1", 10)); // Ensure page is at least 1
    const pageLimit = Math.max(1, parseInt(limit || "9", 10)); // Ensure limit is at least 1
    const skip = (pageNo - 1) * pageLimit;

    postData = postData.skip(skip).limit(pageLimit);

    // Execute the query
    const posts = await postData.exec();
    const totalPosts = await PostModel.countDocuments(queryObject);
    const totalAllPosts = await PostModel.countDocuments(); // Total posts without filters

    // Calculate item range
    const leftRange = skip + 1;
    const rightRange = Math.min(skip + pageLimit, totalPosts);
    const itemRange = totalPosts > 0 ? `${leftRange}-${rightRange}` : "0-0";

    // Count posts from the last month
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await PostModel.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Send the response with typed structure
    const response: PostResponse = {
      posts,
      totalPosts: totalAllPosts,
      lastMonthPosts,
      pageNo,
      itemRange,
      nbHits: posts.length,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Some error occurred while fetching the posts.",
      error,
    });
  }
};

const getAllPosts = async (
  req: Request<{}, {}, {}, PostQueryParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Destructure query parameters with proper typing
    const {
      userId,
      searchTerm,
      title,
      slug,
      category,
      postId,
      sort,
      select,
      page,
    } = req.query;

    // Build the query object with proper typing
    const queryObject: Record<string, any> = {};

    // Data Filteration
    if (userId) {
      queryObject.userId = { $regex: userId, $options: "i" };
    }
    if (category && category !== "all") {
      queryObject.category = { $regex: category, $options: "i" };
    }
    if (slug) {
      queryObject.slug = { $regex: slug, $options: "i" };
    }
    if (postId) {
      queryObject._id = postId;
    }
    if (title) {
      queryObject.title = { $regex: title, $options: "i" };
    }
    if (searchTerm) {
      queryObject.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { content: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // Initialize the Mongoose query
    let postData = PostModel.find(queryObject) as unknown as ReturnType<
      typeof PostModel.find
    >;

    // Sorting
    if (sort) {
      const sortFix = sort.split(",").join(" ");
      const sortValue: Record<string, 1 | -1> | string =
        sortFix === "desc"
          ? { createdAt: -1 }
          : sortFix === "asc"
          ? { createdAt: 1 }
          : sortFix;
      postData = postData.sort(sortValue);
    }

    // Selecting fields
    if (select) {
      const selectFix = select.split(",").join(" ");
      postData = postData.select(selectFix);
    }

    // Pagination
    const pageNo = Math.max(1, parseInt(page || "1", 10)); // Ensure page is at least 1
    const skip = (pageNo - 1) * 9; // Default limit of 9 (matches original code)

    postData = postData.skip(skip);

    // Execute the query
    const posts = await postData as IPost[];
    const totalPosts = await PostModel.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await PostModel.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Send the response
    const responseData: PostResponse = {
      posts,
      totalPosts,
      lastMonthPosts,
      pageNo,
      itemRange: "0-0", // Add the itemRange property
      nbHits: posts.length,
    };

    res.status(200).json({
        data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Some error occurred while fetching the posts.",
      error,
    });
  }
};

export { 
    createPost,
    getPosts,
    getAllPosts,
};
