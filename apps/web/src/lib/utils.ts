import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import { api } from "../state/api";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// For display purposes
export const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// For <input type="date">
export const formatDateForInput = (date: Date | string) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Function to truncate userId (e.g., user_2tcF27Xqj8FE9nSEDY00yl7jEhp → user_2tc...Ehp)
export const truncateUserId = (userId: string): string => {
  if (userId.length <= 10) return userId;
  const prefix = userId.slice(0, 8); // Take first 8 characters
  const suffix = userId.slice(-3);   // Take last 3 characters
  return `${prefix}...${suffix}`;
};

// Convert cents to formatted currency string (e.g., 4999 -> "$49.99")
export function formatPrice(cents: number | undefined): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format((cents || 0) / 100);
}

// Convert dollars to cents (e.g., "49.99" -> 4999)
export function dollarsToCents(dollars: string | number): number {
  const amount = typeof dollars === "string" ? parseFloat(dollars) : dollars;
  return Math.round(amount * 100);
}

// Convert cents to dollars (e.g., 4999 -> "49.99")
export function centsToDollars(cents: number | undefined): string {
  return ((cents || 0) / 100).toString();
}

// Zod schema for price input (converts dollar input to cents)
export const priceSchema = z.string().transform((val) => {
  const dollars = parseFloat(val);
  if (isNaN(dollars)) return "0";
  return dollarsToCents(dollars).toString();
});

export const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor (Timor-Leste)",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (formerly Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

export const customStyles = "text-gray-300 placeholder:text-gray-500";

export function convertToSubCurrency(amount: number, factor = 100) {
  return Math.round(amount * factor);
}

export const NAVBAR_HEIGHT = 48;

export const courseCategories = [
  { value: "web-development", label: "Web Development" },
  { value: "blockchain", label: "Blockchain" },
  { value: "technology", label: "Technology" },
  { value: "data-science", label: "Data Science" },
  { value: "mathematics", label: "Mathematics" },
  { value: "artificial-intelligence", label: "Artificial Intelligence" },
] as const;

export const customDataGridStyles = {
  border: "none",
  backgroundColor: "#17181D",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#1B1C22",
    color: "#6e6e6e",
    "& [role='row'] > *": {
      backgroundColor: "#1B1C22 !important",
      border: "none !important",
    },
  },
  "& .MuiDataGrid-cell": {
    color: "#6e6e6e",
    border: "none !important",
  },
  "& .MuiDataGrid-row": {
    backgroundColor: "#17181D",
    "&:hover": {
      backgroundColor: "#25262F",
    },
  },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: "#17181D",
    color: "#6e6e6e",
    border: "none !important",
  },
  "& .MuiDataGrid-filler": {
    border: "none !important",
    backgroundColor: "#17181D !important",
    borderTop: "none !important",
    "& div": {
      borderTop: "none !important",
    },
  },
  "& .MuiTablePagination-root": {
    color: "#6e6e6e",
  },
  "& .MuiTablePagination-actions .MuiIconButton-root": {
    color: "#6e6e6e",
  },
};

export const createBootcampFormData = (data: BootcampFormData): FormData => {
  const formData = new FormData();

  // Append basic fields
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("startDate", data.startDate instanceof Date ? data.startDate.toISOString() : data.startDate); // Convert Date to ISO string
  formData.append("duration", data.duration);
  formData.append("type", data.type ? "Full-Time" : "Part-Time"); // Convert boolean to string
  formData.append("liveClasses[count]", String(data.liveClasses.count)); // Nested object field
  formData.append("liveClasses[description]", data.liveClasses.description);
  formData.append("practicalCaseStudy", data.practicalCaseStudy);
  formData.append("weeklyFeedback", data.weeklyFeedback);
  formData.append("certification", data.certification);
  formData.append("enrollmentStatus", data.enrollmentStatus ? "Open" : "Closed"); // Convert boolean to string
  formData.append("status", data.status ? "Published" : "Draft"); // Add status field
  formData.append("testimonials", JSON.stringify(data.testimonials));
  formData.append("price", JSON.stringify(data.price));
  formData.append("paymentPlans", JSON.stringify(data.paymentPlans));
  formData.append("categories", JSON.stringify(data.categories));
  formData.append("averageRating", String(data.averageRating));
  formData.append("reviewCount", String(data.reviewCount));
  formData.append("prerequisites", data.prerequisites);
  formData.append("leaderboard", JSON.stringify(data.leaderboard));
  // Handle courses array
  if (data.courses && data.courses.length > 0) {
    data.courses.forEach((course, index) => {
      formData.append(`courses[${index}][courseId]`, course.courseId);
      formData.append(`courses[${index}][title]`, course.title);
    });
  }

  // Handle members array
  if (data.members && data.members.length > 0) {
    data.members.forEach((member, index) => {
      formData.append(`members[${index}][memberId]`, member.memberId);
      formData.append(`members[${index}][fullName]`, member.fullName);
      formData.append(`members[${index}][progress]`, member.progress.toString());
    });
  }

  // Handle image (optional)
  if (data.image instanceof File) {
    formData.append("image", data.image); // For file upload
  } else if (typeof data.image === "string" && data.image) {
    formData.append("image", data.image); // For existing image URL
  }

  // Log for debugging
  console.log("FormData created for bootcamp:", {
    title: data.title,
    description: data.description,
    startDate: data.startDate,
    duration: data.duration,
    type: data.type,
    liveClasses: data.liveClasses,
    practicalCaseStudy: data.practicalCaseStudy,
    weeklyFeedback: data.weeklyFeedback,
    certification: data.certification,
    enrollmentStatus: data.enrollmentStatus,
    status: data.status,
    courses: data.courses,
    members: data.members,
    image: data.image,
    testimonials: data.testimonials,
    price: data.price,
    paymentPlans: data.paymentPlans,
    categories: data.categories,
    averageRating: data.averageRating,
    reviewCount: data.reviewCount,
    prerequisites: data.prerequisites,
    leaderboard: data.leaderboard,
  });
  return formData;
};

// sections: Section[]
export const createCourseFormData = (data: CourseFormData, sections: Section[]): FormData => {
  const formData = new FormData();
  console.log("<<<<=== form data  image ===>>>>", data.courseImage)
  formData.append("title", data.courseTitle);
  formData.append("description", data.courseDescription);
  formData.append("category", data.courseCategory);
  formData.append("price", data.coursePrice.toString());
  formData.append("status", data.courseStatus ? "Published" : "Draft");

  if (data.courseImage instanceof File) {
    formData.append("image", data.courseImage); // Match backend's 'image'
  } else if (typeof data.courseImage === "string" && data.courseImage) {
    formData.append("image", data.courseImage); // For existing URL, if needed
  }

  const sectionsWithVideos = sections.map((section) => ({
    ...section,
    chapters: section.chapters.map((chapter) => ({
      ...chapter,
      video: chapter.video,
    })),
  }));

  console.log("sections with videos", sectionsWithVideos)

  formData.append("sections", JSON.stringify(sectionsWithVideos));

  return formData;
};

export const uploadAllVideos = async (localSections: Section[], courseId: string, getUploadVideoUrl: any) => {
  const updatedSections = localSections.map((section) => ({
    ...section,
    chapters: section.chapters.map((chapter) => ({
      ...chapter,
    })),
  }));

  console.log("updatedSections", updatedSections)

  for (let i = 0; i < updatedSections.length; i++) {
    for (let j = 0; j < updatedSections[i].chapters.length; j++) {
      const chapter = updatedSections[i].chapters[j];
      if (chapter.video instanceof File && chapter.video.type === "video/mp4") {
        try {
          const updatedChapter = await uploadVideo(chapter, courseId, updatedSections[i].sectionId, getUploadVideoUrl);
          updatedSections[i].chapters[j] = updatedChapter;
        } catch (error) {
          console.log(`Failed to upload video for chapter ${chapter.chapterId}:`, error);
        }
      }
    }
  }

  return updatedSections;
};

async function uploadVideo(chapter: Chapter, courseId: string, sectionId: string, getUploadVideoUrl: any) {
  const file = chapter.video as File;
  const formData = new FormData();
  formData.append('video', file);
  console.log(`<<=== Uploading video for chapter ===>> ${chapter.chapterId}:`, file);
  console.log(`<<=== Uploading video formData ===>> ${chapter.chapterId}:`, formData);


  try {
    const responseData = await getUploadVideoUrl({courseId, sectionId, chapterId: chapter.chapterId, formData}).unwrap();
    console.log("Upload URL:", responseData.uploadUrl);
    console.log("Video URL:", responseData.videoUrl);
    console.log("Video Duration", responseData.duration)

    await fetch(responseData.uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
      },
      body: formData,
    });
    toast.success(`Video uploaded successfully for chapter ${chapter.chapterId}`);

    return { ...chapter, video: responseData.videoUrl };
  } catch (error) {
    console.log(`Failed to upload video for chapter ${chapter.chapterId}:`, error);
    toast.error(`Failed to upload video for chapter ${chapter.chapterId}`);
    throw error;
  }
}
