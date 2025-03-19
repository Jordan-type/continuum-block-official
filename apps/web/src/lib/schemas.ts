import * as z from "zod";
import { parsePhoneNumberWithError } from "libphonenumber-js";

// Course Editor Schemas
export const courseSchema = z.object({
  courseTitle: z.string().min(1, "Title is required"),
  courseDescription: z.string().min(1, "Description is required"),
  courseLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  courseCategory: z.string().min(1, "Category is required"),
  coursePrice: z.string(),
  courseStatus: z.boolean(),
  courseImage: z.union([z.string(), z.instanceof(File)]).optional(),
});

export type CourseFormData = z.infer<typeof courseSchema>;

// Chapter Schemas
export const chapterSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  video: z.union([z.string(), z.instanceof(File)]).optional(),
});

export type ChapterFormData = z.infer<typeof chapterSchema>;

// Section Schemas
export const sectionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export type SectionFormData = z.infer<typeof sectionSchema>;

export const paymentSchema = z.object({
  phone: z
    .string()
    .refine((phone) => {
      try {
        const phoneNumber = parsePhoneNumberWithError(phone,{ defaultCountry: 'US'});
        return phoneNumber.isValid();
      } catch (error) {
        return false;
      }
    }, "Invalid Kenyan phone number format. Use +2547XXXXXXXX")
});


// Guest Checkout Schema
export const guestSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => {
      try {
        const phoneNumber = parsePhoneNumberWithError(phone,{ defaultCountry: 'US'});
        return phoneNumber.isValid();
      } catch (error) {
        return false;
      }
    }, "Invalid Kenyan phone number format. Use +2547XXXXXXXX")
});

export const validatePhoneNumber = (phone: string): boolean => {
  try {
    const phoneNumber = parsePhoneNumberWithError(phone,{ defaultCountry: 'US'});
    return phoneNumber.isValid();
  } catch (error) {
    return false;
  }
};

export type GuestFormData = z.infer<typeof guestSchema>;

// Notification Settings Schema
export const notificationSettingsSchema = z.object({
  courseNotifications: z.boolean(),
  emailAlerts: z.boolean(),
  smsAlerts: z.boolean(),
  notificationFrequency: z.enum(["immediate", "daily", "weekly"]),
});

export type NotificationSettingsFormData = z.infer<
  typeof notificationSettingsSchema
>;
