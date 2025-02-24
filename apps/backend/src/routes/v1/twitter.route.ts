import express, { Request, Response, Router } from "express";
import fetch from "node-fetch";

const fetchTwitterAPI = async (url: string) => {
  const token = process.env.TWITTER_BEARER_TOKEN;
  console.log("token", token);

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const router: Router = express.Router();

router.get('/user/by/username/:username', async (req: Request, res: Response) => {
  const { username } = req.params;
  const url = `https://api.twitter.com/2/users/by/username/${username}`;

  try {
    const userData = await fetchTwitterAPI(url);
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
});


router.get('/user/:userId/mentions', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const url = `https://api.twitter.com/2/users/${userId}/mentions`;

  try {
    const mentionsData = await fetchTwitterAPI(url);
    res.json(mentionsData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch mentions' });
  }
});


export default router

