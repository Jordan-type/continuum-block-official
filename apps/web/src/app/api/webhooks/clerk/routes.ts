import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createUser } from "../../../../lib/actions/user.action";

export async function POST(req: Request) {
    const SIGNING_SECRET = process.env.SIGNING_SECRET;
    
    if (!SIGNING_SECRET) {
        throw new Error(
            "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
        );
    }

  // Create a new Svix webhook instance
  const wh = new Webhook(SIGNING_SECRET);

  // Extract Svix headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", { status: 400 });
  }

    // Get the request body
    const payload = await req.json();
    console.log("Payload:", payload);
    const body = JSON.stringify(payload);
  
    let evt: WebhookEvent;
  
    try {
      // Verify the webhook signature
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error: Could not verify webhook:", err);
      return new Response("Error: Verification failed", { status: 400 });
    }

      // Handle the user.created event
      if (evt.type === "user.created") {
        const { id, email_addresses, first_name, last_name, public_metadata } = evt.data;
        console.log("Webhook Event Type:", evt.type);
        console.log("Webhook Payload Data:", evt.data);

        try {
            // Extract or default the userType to "student" if undefined
            const userType = typeof public_metadata?.userType === "string" ? public_metadata.userType : "student"; // Default to 'student'
            // Call the createUser function to add the user to your database
            await createUser({
                clerkUserId: id,
                firstName: first_name || "FirstName",
                lastName: last_name || "LastName",
                email: email_addresses[0]?.email_address,
                userType,
            });
            
            console.log("User successfully added to the database.");
        } catch (error) {
            console.error("Error adding user to the database:", error);
            return new Response("Error adding user to the database", { status: 500 });
        }
      }
}