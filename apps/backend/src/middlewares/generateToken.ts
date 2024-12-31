import axios from "axios";
import { Response, Request, NextFunction } from "express";

export type RequestExtended = Request & {token? : string}

const generateAccessToken = async (req: RequestExtended, res: Response, next: NextFunction) => {
    const consumerKey = process.env.CONSUMER_KEY_SANDBOX;
    const consumerSecret = process.env.CONSUMER_SECRET_SANDBOX;
    const authLink = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    try {
        const response = await axios(authLink, {
            headers: {
                Authorization: `Basic ${auth}`
            }
        })

        req.token = response.data.access_token;
        next();

    } catch (error: any) {
        throw new Error (`Failed to generate access token: ${error.message}`)
    }
}

export default generateAccessToken