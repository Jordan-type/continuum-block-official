import { Request, Response } from "express";
import { clerkClient, getAuth } from "@clerk/express";


const getUserEnrolledCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const auth = getAuth(req);

        if (!auth || auth.userId !== userId) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
    } catch (error) {
        res.status(500).json({ 
            message: "Error retrieving enrolled courses", 
            error 
        });
    }
}

const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const userData = req.body;

        const user = await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
              userType: userData.publicMetadata.userType,
              settings: userData.publicMetadata.settings,
            },
          });
      
          res.json({ 
            message: "User updated successfully", 
            data: user 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error updating user", 
            error: error 
        });
    }
}

export {
    getUserEnrolledCourses,
    updateUser,
}