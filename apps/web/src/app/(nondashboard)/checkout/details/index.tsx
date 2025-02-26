"use client";

import CoursePreview from "@/components/CoursePreview";
import { CustomFormField } from "@/components/CustomFormField";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import { GuestFormData, guestSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import SignUpComponent from "@/components/SignUp";
import SignInComponent from "@/components/SignIn";
import { useInitiateMpesaPaymentMutation } from "@/state/api";
import { toast } from "sonner";

const CheckoutDetailsPage = () => {
  const { course: selectedCourse, isLoading, isError } = useCurrentCourse();
  const searchParams = useSearchParams();
  const showSignUp = searchParams.get("showSignUp") === "true";
  const [initiateMpesaPayment] = useInitiateMpesaPaymentMutation();

  const methods = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleGuestCheckout = async (data: GuestFormData) => {
    console.log(data);
    if (!selectedCourse) return;

    try {
      const response = await initiateMpesaPayment({
        phone: data.email.split("@")[0] + "@example.com", // TODO add be actual phone number nstead of email
        amount: selectedCourse.price,
        courseId: selectedCourse._id,
        userId: "current-user-id", // Replace with actual user ID from Clerk or auth
      }).unwrap();

      toast.success("M-Pesa payment initiated. Check your phone for the prompt!");
    } catch (error) {
      console.error("Error initiating M-Pesa payment:", error);
      toast.error("Failed to initiate M-Pesa payment");
    }
  };


  if (isLoading) return <Loading />;
  if (isError) return <div>Failed to fetch course data</div>;
  if (!selectedCourse) return <div>Course not found</div>;

  return (
    <div className="checkout-details">
      <div className="checkout-details__container">
        <div className="checkout-details__preview">
          <CoursePreview course={selectedCourse} />
        </div>

        {/* STRETCH FEATURE */}
        <div className="checkout-details__options">
          <div className="checkout-details__guest">
            <h2 className="checkout-details__title">Guest Checkout</h2>
            <p className="checkout-details__subtitle">
              Enter email to receive course access details and order
              confirmation. You can create an account after purchase.
            </p>
            <Form {...methods}>
              <form
                onSubmit={methods.handleSubmit((data) => { console.log(data); })}
                className="checkout-details__form"
              >
                <CustomFormField
                  name="email"
                  label="Email address"
                  type="email"
                  className="w-full rounded mt-4"
                  labelClassName="font-normal text-white-50"
                  inputClassName="py-3"
                />
                <Button type="submit" className="checkout-details__submit">
                  Continue as Guest
                </Button>
              </form>
            </Form>
          </div>

          <div className="checkout-details__divider">
            <hr className="checkout-details__divider-line" />
            <span className="checkout-details__divider-text">Or</span>
            <hr className="checkout-details__divider-line" />
          </div>

          <div className="checkout-details__auth">
            {showSignUp ? <SignUpComponent /> : <SignInComponent />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetailsPage;
