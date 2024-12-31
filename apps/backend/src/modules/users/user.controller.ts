import { Request, Response } from "express";
import { clerkClient } from "@clerk/express";

import User from "./model"

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = req.body;

    // Step 2: Create the user in MongoDB
    const newUser = new User({
      clerkUserId: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      userType: userData.userType || "student",
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      data: { 
        newUser 
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Fetch user details from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);

    // Fetch user details from MongoDB
    const mongoUser = await User.findOne({ clerkUserId: userId });

    res.json({
      message: "User details retrieved successfully",
      data: { clerkUser, mongoUser },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user details",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Fetch users from MongoDB (pagination example)
    const users = await User.find()
      .skip((+page - 1) * +limit)
      .limit(+limit);

    res.json({
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving users",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const syncUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Fetch user details from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);

    const mongoUserUpdate = {
      firstName: clerkUser.firstName || undefined,
      lastName: clerkUser.lastName || undefined,
      email: clerkUser.emailAddresses[0]?.emailAddress || undefined,
      isVerified: clerkUser.emailAddresses[0]?.verification?.status === "verified",
      clerkMetadata: clerkUser.publicMetadata || {},
    };

    // Update MongoDB
    const updatedMongoUser = await User.findOneAndUpdate(
      { clerkUserId: userId },
      { $set: mongoUserUpdate },
      { new: true, upsert: true }
    );

    res.json({
      message: "User synchronized successfully",
      data: { clerkUser, mongoUser: updatedMongoUser },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error synchronizing user",
      error: error instanceof Error ? error.message : error,
    });
  }
};
  
  
  
const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Delete user from Clerk
    await clerkClient.users.deleteUser(userId);

    // Delete user from MongoDB
    await User.findOneAndDelete({ clerkUserId: userId });

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error instanceof Error ? error.message : error,
    });
  }
};
  

const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const userData = req.body;

        console.log("userdata", userData)

        // Step 1: Update the user in Clerk
        const clerkUser = await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
              userType: userData.publicMetadata.userType,
              settings: userData.publicMetadata.settings,
            },
          });

        console.log("clerkUser", clerkUser)

        // Step 2: Update the user in MongoDB
        const mongoUserUpdate = {
            firstName: clerkUser.firstName || undefined,
            lastName: clerkUser.lastName || undefined,
            email: clerkUser.emailAddresses[0]?.emailAddress || undefined,
            isVerified: clerkUser.emailAddresses[0]?.verification?.status === "verified",
            userType: userData.userType || "student",
            clerkMetadata: clerkUser.publicMetadata || {},
          };

          const updatedMongoUser = await User.findOneAndUpdate(
            { clerkUserId: userId },
            { $set: mongoUserUpdate },
            { new: true, upsert: true } // Create a new document if one doesn't exist
          );

          console.log("<=updated Mongo User=>", updatedMongoUser)
      
          res.json({ 
            message: "User updated successfully", 
            data: { clerkUser, mongoUser: updatedMongoUser } 
        });
    } catch (error) {
        console.log("<===error===>", error)
        res.status(500).json({ 
            message: "Error updating user", 
            error: error 
        });
    }
}

const promoteUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { role } = req.body; // e.g., 'admin', 'teacher'

    // Update role in Clerk
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
      },
    });

    // Update role in MongoDB
    const updatedMongoUser = await User.findOneAndUpdate(
      { clerkUserId: userId },
      { $set: { userType: role } },
      { new: true }
    );

    res.json({
      message: `User role updated to ${role} successfully`,
      data: updatedMongoUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user role",
      error: error instanceof Error ? error.message : error,
    });
  }
};
  

export {
    createUser,
    getUser,
    listUsers,
    syncUser,
    deleteUser,
    updateUser,
    promoteUserRole
}