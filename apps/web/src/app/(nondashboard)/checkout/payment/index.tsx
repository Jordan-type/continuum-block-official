"use client"

import React, { useState } from "react";
// import StripeProvider from "./StripeProvider";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useCheckoutNavigation } from "@/hooks/useCheckoutNavigation";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import { useClerk, useUser } from "@clerk/nextjs";
import CoursePreview from "@/components/CoursePreview";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTransactionMutation, useInitiateMpesaPaymentMutation } from "@/state/api";
import { centsToDollars } from "@/lib/utils";
import { toast } from "sonner";
import { CustomFormField } from "@/components/CustomFormField";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { paymentSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";


type PaymentFormData = {
  phone: string;
};

const PaymentPageContent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState("");

  const methods = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      phone: "",
    },
  });
  const [createTransaction] = useCreateTransactionMutation();
  const [initiateMpesaPayment] = useInitiateMpesaPaymentMutation();

  const { navigateToStep } = useCheckoutNavigation();
  const { course, courseId } = useCurrentCourse();
  const { user } = useUser();
  const { signOut } = useClerk();

  console.log("Current state - isSubmitting:", isSubmitting, "phone:", phone);

  const handleFreeEnrollment = async () => {
    try {
        const priceInDollars = centsToDollars(course?.price);

        const transactionData: Partial<Transaction> = {
            transactionId: `free_${Date.now()}`,
            userId: user?.id,
            courseId: courseId,
            paymentProvider: 'free',
            amount: priceInDollars || 0,
        };
      await createTransaction(transactionData).unwrap();
      toast.success(`Enrolled in course for free! (Price: $${priceInDollars})`);
      navigateToStep(3); // Navigate to the completion page
    } catch (error) {
      console.log("Error enrolling in free course:", error);
      toast.error("Failed to enroll in free course");
    }
  };

  const handleMpesaPayment = async (data: PaymentFormData) => {
    console.log("Form data: ==>>", data);
    if (!course || !user?.id || !data.phone) return;

    const priceInDollars = centsToDollars(course.price); // Convert cents to dollars for logging/display
    console.log("M-Pesa payment price in dollars:", priceInDollars);

    setIsSubmitting(true);

    try {
      const response = await initiateMpesaPayment({
        phone: data.phone, 
        amount: priceInDollars, // Send USD amount, backend converts to KES
        courseId: courseId,
        userId: user.id,
      }).unwrap();

      console.log("resopnse ===>>>",response);

      toast.success(`M-Pesa payment initiated for $${priceInDollars}. Check your phone for the prompt!`);
      // You can poll or wait for the callback to update the transaction status
      // For now, navigate to step 3 after a delay or upon callback confirmation
      setTimeout(() => navigateToStep(3), 5000); // Delay for testing (remove in production)
    } catch (error) {
      console.log("Error initiating M-Pesa payment:", error);
      toast.error("Failed to initiate M-Pesa payment");
    } finally {
      setIsSubmitting(false);
    }
  };

//   const handleStripePaymentEnrollment = async () => {
//     if (!stripe || !elements) {
//       toast.error("Stripe service is not available");
//       return;
//     }

//     const baseUrl = process.env.NEXT_PUBLIC_LOCAL_URL
//       ? `http://${process.env.NEXT_PUBLIC_LOCAL_URL}`
//       : process.env.NEXT_PUBLIC_VERCEL_URL
//       ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
//       : undefined;

//     const result = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: `${baseUrl}/checkout?step=3&id=${courseId}`,
//       },
//       redirect: "if_required",
//     });

//     if (result.paymentIntent?.status === "succeeded") {
//         const transactionData: Partial<Transaction> = {
//           transactionId: result.paymentIntent.id,
//           userId: user?.id,
//           courseId: courseId,
//           paymentProvider: "stripe",
//           amount: course?.price || 0,
//         };

//         await createTransaction(transactionData), navigateToStep(3);
//   }



  const handleSubmit = async (data: PaymentFormData) => {
    console.log("Form values before submit:", data);

    if (!course) return;

    if (course.price === 0) {
      handleFreeEnrollment();
      return;
    }

    // handleStripePaymentEnrollment();
    handleMpesaPayment(data);
    
    // Implement your payment logic here for paid courses
    // toast.error("Paid courses are not yet supported.");
  };

  const handleSignOutAndNavigate = async () => {
    await signOut();
    navigateToStep(1);
  };

  if (!course) return null;

  return (
    <div className="payment">
      <div className="payment__container">
        {/* Order Summary */}
        <div className="payment__preview">
          <CoursePreview course={course} />
        </div>

        {/* Pyament Form */}
        <div className="payment__form-container">
          <Form {...methods}>
          <form id="payment-form" onSubmit={methods.handleSubmit(handleSubmit)} className="payment__form">
            <div className="payment__content">
              <h1 className="payment__title">Checkout</h1>
              <p className="payment__subtitle">
                {course.price > 0 ? "Enter your details to initiate M-Pesa payment and complete your purchase." : "Confirm your free course enrollment below."}
              </p>

              <div className="payment__method">
                <h3 className="payment__method-title">Payment Method</h3>
                {course.price > 0 && (
                  <>
                    {/* <CustomFormField
                      name="email"
                      label="Email Address"
                      type="email"
                      className="w-full rounded mt-4"
                      labelClassName="font-normal text-white-50"
                      inputClassName="py-3"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    /> */}
                    <CustomFormField
                      name="phone"
                      label="Phone Number (M-Pesa)"
                      type="tel"
                      className="w-full rounded mt-4"
                      labelClassName="font-normal text-white-50"
                      inputClassName="py-3"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(e.g., +2547XXXXXXXX, 2547XXXXXXXX)"
                    />
                    <Button
                      type="submit"
                      className="payment__submit w-full mt-4"
                      disabled={isSubmitting || !methods.watch("phone")}
                    >
                      {isSubmitting ? "Processing..." : "Pay with M-Pesa"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </form>
          </Form>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="payment__actions">
        <Button
          className="hover:bg-white-50/10"
          onClick={handleSignOutAndNavigate}
          variant="outline"
          type="button"
        >
          Switch Account
        </Button>

        {/* disabled={!stripe || !elements || course.price === 0} */}

        <Button form="payment-form" type="submit" className="payment__submit"  >
            {course.price > 0 ? 'Proceed with M-Pesa' : 'Enroll for Free'}
        </Button>
      </div>
    </div>
  );
};

const PaymentPage = () => (
//   <StripeProvider>
    <>
      <PaymentPageContent />
    </>
//   </StripeProvider>
);

export default PaymentPage;
