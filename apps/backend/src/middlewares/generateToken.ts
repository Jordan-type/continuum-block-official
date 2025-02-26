import axios from "axios";
import { Response, Request, NextFunction } from "express";

export type RequestExtended = Request & {token? : string}

const generateAccessToken = async (req: RequestExtended, res: Response, next: NextFunction) => {
    const consumerKey = process.env.CONSUMER_KEY_SANDBOX;
    const consumerSecret = process.env.CONSUMER_SECRET_SANDBOX;
    const authLink = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

    if (!consumerKey || !consumerSecret) {
        throw new Error("Missing CONSUMER_KEY_SANDBOX or CONSUMER_SECRET_SANDBOX in environment variables");
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    try {
        const response = await axios(authLink, {
            headers: {
                Authorization: `Basic ${auth}`
            }
        })

        if (!response.data.access_token) {
            throw new Error("Invalid response from Safaricom OAuth: No access token received");
        }

        req.token = response.data.access_token;
        next();

    } catch (error: any) {
        console.log("Error generating M-Pesa access token:", error.response?.data || error.message);
        res.status(500).json({
            message: "Failed to generate M-Pesa access token",
            error: error.message || "Unknown error",
        });
        
        return; // Ensure the middleware stops execution on error
    }
}

export default generateAccessToken