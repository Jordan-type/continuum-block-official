"use client";

import { SignUp, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { dark } from "@clerk/themes";
import { useSearchParams } from "next/navigation";
import { useCreateUserMutation, } from "@/state/api";
import { toast } from "sonner";

const SignUpComponent = () => {
  const { user, isSignedIn } = useUser();
  const searchParams = useSearchParams();
  const isCheckoutPage = searchParams.get("showSignUp") !== null;
  const courseId = searchParams.get("id");
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  // const [createUser] = useCreateUserMutation(); // Todo: add username later like this ==>> const username = `${resolvedFirstName.toLowerCase()}.${resolvedLastName.toLowerCase()}`;

  // useEffect(() => {
  //   const syncUserWithBackend = async () => {
  //     if (isSignedIn && user) {
  //       try {
  //         // Check if the user is verified
  //         const isVerified = user.emailAddresses[0]?.verification?.status === "verified";
  //         if (!isVerified) {
  //           console.log("User is not verified yet, waiting...");
  //           return; // Exit if the user is not verified
  //         }

  //         const {id, firstName, lastName, emailAddresses, publicMetadata } = user;
  //         console.log("user", user)

  //         const resolvedFirstName = firstName ?? "FirstName";
  //         const resolvedLastName = lastName ?? "LastName";
  //         const userType = typeof publicMetadata?.userType || "student";


  //         const backendResponse = await createUser({
  //           userId: id,
  //           firstName: resolvedFirstName,
  //           lastName: resolvedLastName,
  //           email: emailAddresses[0]?.emailAddress,
  //           userType,
  //         }).unwrap();

  //         toast.success("User synced with backend successfully!");
  //         console.log("User synced with backend:", backendResponse);
  //       } catch (error) {
  //         console.error("Error syncing user with backend:", error);
  //       }
  //     }
  //   };

  //   syncUserWithBackend();
  // }, [isSignedIn, user, createUser]);

  const signInUrl = isCheckoutPage
    ? `/checkout?step=1&id=${courseId}&showSignUp=false`
    : "/signin";

  const getRedirectUrl = () => {
    if (isCheckoutPage) {
      return `/checkout?step=2&id=${courseId}&showSignUp=false`;
    }

    const userType = user?.publicMetadata?.userType as string;
    console.log(userType, "userType");
    if (userType === "teacher") {
      return "/teacher/courses";
    }
    return "/user/courses";
  };

  return (
    <SignUp
      appearance={{
        baseTheme: dark,
        elements: {
          rootBox: "flex justify-center items-center py-5",
          cardBox: "shadow-none",
          card: "bg-customgreys-secondarybg w-full shadow-none",
          footer: {
            background: "#25262F",
            padding: "0rem 2.5rem",
            "& > div > div:nth-child(1)": {
              background: "#25262F",
            },
          },
          formFieldLabel: "text-white-50 font-normal",
          formButtonPrimary:
            "bg-primary-700 text-white-100 hover:bg-primary-600 !shadow-none",
          formFieldInput: "bg-customgreys-primarybg text-white-50 !shadow-none",
          footerActionLink: "text-primary-750 hover:text-primary-600",
        },
      }}
      signInUrl={signInUrl}
      forceRedirectUrl={getRedirectUrl()}
      routing="hash"
      afterSignOutUrl="/"
    />
  );
};

export default SignUpComponent;
