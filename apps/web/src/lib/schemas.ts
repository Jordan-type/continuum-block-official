import * as z from "zod";
import { parsePhoneNumberWithError } from "libphonenumber-js";

export const bootcampSchema = z.object({
  title: z.string().min(1, "Title is required"),
  startDate: z.date(),
  duration: z.string().min(1, "Duration is required"),
  type: z.boolean(),
  liveClasses: z.object({
    count: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val) && val >= 0, "Must be a non-negative number"),
    description: z.string().min(1, "Description is required"),
  }),
  practicalCaseStudy: z.string().min(1, "Practical case study is required"),
  weeklyFeedback: z.string().min(1, "Weekly feedback is required"),
  certification: z.string().min(1, "Certification is required"),
  enrollmentStatus: z.boolean(),
  image: z.union([z.string(), z.instanceof(File)]).optional(),
  status: z.boolean(),
  courses: z.array(z.object({ courseId: z.string(), title: z.string() })).optional(),
  members: z.array(z.object({ memberId: z.string(), fullName: z.string(), progress: z.number() })).optional(),
});

export type BootcampFormData = z.infer<typeof bootcampSchema>;

export const memberSchema = z.object({
  memberId: z.string().uuid(),
  fullName: z.string().min(1, "Full name is required"),
  progress: z.number().min(0).max(100),
});

export type MemberFormData = z.infer<typeof memberSchema>;

export const courseBootCampSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  title: z.string().min(1, "Title is required"),
});

export type CourseBootcampFormData = z.infer<typeof courseBootCampSchema>;

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
