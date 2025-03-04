"use client";


import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetUserEnrolledCoursesQuery, useGetUserCourseProgressBatchQuery, useGetLearningLeaderboardQuery, } from "@/state/api";


const UserProgressDashboard = () => {
  const { user, isLoaded } = useUser();
  const [timePeriod, setTimePeriod] = useState<"daily" | "monthly">("daily");

  // Dummy data for top users (matching UI: Skulldugger, Klaxxon, Ultralex)
  const topUsers: TopUser[] = useMemo(() => [
    {
      rank: 1,
      username: "Skulldugger",
      points: 500,
      prize: 5000,
      avatar: "/placeholder.png", // Dummy avatar for Skulldugger (orange character)
    },
    {
      rank: 2,
      username: "Klaxxon",
      points: 10000,
      prize: 10000,
      avatar: "/placeholder.png", // Dummy avatar for Klaxxon (purple robot)
    },
    {
      rank: 3,
      username: "Ultralex",
      points: 250,
      prize: 2500,
      avatar: "/placeholder.png", // Dummy avatar for Ultralex (white skull)
    },
  ], []);

  // Dummy data for user summary and leaderboard
  const userPoints = 50; // Dummy points
  const userRank = null; // Dummy rank (— in UI)
  const totalUsers = 13868; // Dummy total users from UI

  // Dummy data for leaderboard table
  const leaderboardData = [
    { place: 4, username: "Protesian", points: 156, prize: 750 },
    { place: 5, username: "Protesian", points: 156, prize: 750 },
    { place: 6, username: "Protesian", points: 155, prize: 750 },
  ];

  if (!isLoaded) return <Loading />;
  if (!user) return <div>Please sign in to view your progress.</div>;

  return (
    <div className="progress-dashboard bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      {/* Time Period Toggle */}
      <div className="flex justify-center mb-6">
        <Button
          variant={timePeriod === "daily" ? "default" : "outline"}
          onClick={() => setTimePeriod("daily")}
          className="mr-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
        >
          Daily
        </Button>
        <Button
          variant={timePeriod === "monthly" ? "default" : "outline"}
          onClick={() => setTimePeriod("monthly")}
          className="bg-gray-700 hover:bg-gray-600 text-white rounded"
        >
          Monthly
        </Button>
      </div>

      {/* Top Users */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {topUsers.map((user) => (
          <Card key={user.rank} className="bg-gray-800 border-none shadow-md rounded-lg custom-card-3d">
            <CardContent className="p-4 text-center">
              <Image
                src={user.avatar}
                alt={user.username}
                width={100}
                height={100}
                className="rounded-full mx-auto mb-2 shadow-md"
                onError={(e) => (e.currentTarget.src = "/placeholder.png")} // Fallback for missing avatars
              />
              <h3 className="text-lg font-semibold">{user.username}</h3>
              <p className="text-yellow-500 flex items-center justify-center">
                <span className="mr-1">🏆</span> Earn {user.points} points
              </p>
              <p className="text-blue-400 flex items-center justify-center">
                <span className="mr-1">💎</span> {user.prize} Prize
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timer (Centered below top users) */}
      {timePeriod === "daily" && (
        <div className="flex justify-center mb-6">
          <p className="text-sm text-gray-400 flex items-center">
            <span className="mr-1">⏰</span> Ends in 00d 00h 43m 15s
          </p>
        </div>
      )}

      {/* User Summary (Adjusted width) */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6 text-center shadow-md custom-user-summary max-w-3xl mx-auto">
        <p className="text-gray-400">
          You earned <span className="text-blue-400">💎 {userPoints}</span> today and are ranked{" "}
          {userRank !== null ? userRank : "—"} out of {totalUsers} users
        </p>
      </div>

      {/* Leaderboard Table */}
      <Card className="bg-gray-800 border-none shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-center">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="w-full text-white">
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-400 text-left p-2 custom-table-header">Place</TableHead>
                <TableHead className="text-gray-400 text-left p-2 custom-table-header">Username</TableHead>
                <TableHead className="text-gray-400 text-left p-2 custom-table-header">Points</TableHead>
                <TableHead className="text-gray-400 text-left p-2 custom-table-header">Prize</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((entry, index) => (
                <TableRow key={index} className="hover:bg-gray-700">
                  <TableCell className="text-center p-2 custom-table-cell">
                    <span className="mr-1">🏆</span> {entry.place}
                  </TableCell>
                  <TableCell className="p-2 custom-table-cell">{entry.username}</TableCell>
                  <TableCell className="p-2 custom-table-cell">{entry.points}</TableCell>
                  <TableCell className="text-blue-400 p-2 custom-table-cell">💎 {entry.prize}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Custom CSS to match UI exactly */}
      <style jsx>{`
        .progress-dashboard {
          background-color: #1a202c;
          color: #fff;
        }

        .custom-card-3d {
          background-color: #2d3748;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
          transform: perspective(1000px) translateZ(0);
          transition: transform 0.3s ease;
        }

        .custom-card-3d:hover {
          transform: perspective(1000px) translateZ(10px);
        }

        .custom-user-summary {
          background-color: #2d3748;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .custom-table-header {
          background-color: #2d3748;
          font-weight: 500;
          color: #a0aec0;
        }

        .custom-table-cell {
          background-color: #2d3748;
          color: #fff;
        }

        .hover:bg-gray-700:hover {
          background-color: #2d3748 !important; /* Adjust hover to match UI */
        }

        .text-blue-400 {
          color: #4299e1;
        }

        .text-yellow-500 {
          color: #d69e2e;
        }

        .text-gray-400 {
          color: #a0aec0;
        }

        .bg-gray-800 {
          background-color: #2d3748;
        }

        .bg-gray-700 {
          background-color: #4a5568;
        }

        .bg-gray-900 {
          background-color: #1a202c;
        }

        .rounded {
          border-radius: 0.375rem;
        }

        .rounded-lg {
          border-radius: 0.5rem;
        }

        .shadow-md {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .p-2 {
          padding: 0.5rem;
        }

        .p-4 {
          padding: 1rem;
        }

        .mb-6 {
          margin-bottom: 1.5rem;
        }

        .mt-2 {
          margin-top: 0.5rem;
        }

        .mr-1 {
          margin-right: 0.25rem;
        }

        .mr-2 {
          margin-right: 0.5rem;
        }

        .flex {
          display: flex;
        }

        .items-center {
          align-items: center;
        }

        .justify-center {
          justify-content: center;
        }

        .text-lg {
          font-size: 1.125rem;
        }

        .font-semibold {
          font-weight: 600;
        }

        .text-center {
          text-align: center;
        }

        .text-left {
          text-align: left;
        }

        .w-full {
          width: 100%;
        }

        .max-w-3xl {
          max-width: 48rem; /* 768px, matching UI card width approximately */
        }

        .mx-auto {
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </div>
  );
};

export default UserProgressDashboard;

// Define interfaces for TypeScript
interface Course {
  _id: string;
  name: string;
  title: string;
  category: string;
  // ... other fields
}

interface CourseProgress {
  courseId: string;
  overallProgress: number;
  enrollmentDate: string;
  lastAccessedTimestamp: string;
  sections: SectionProgress[];
  totalPoints?: number;
  totalPrize?: number;
  lastActivityDate?: string;
  completionStatus?: string;
  badges?: string[];
  engagementScore?: number;
}

interface LeaderboardEntry {
  userId: string;
  overallProgress: number;
  courseCount?: number;
  totalPoints?: number;
  totalPrize?: number;
}

interface TopUser {
  rank: number;
  username: string;
  points: number;
  prize: number;
  avatar: string;
}

interface SectionProgress {
  sectionId: string;
  chapters: ChapterProgress[];
}

interface ChapterProgress {
  chapterId: string;
  completed: boolean;
}









// "use client";


// import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";


// // Function to truncate userId (e.g., user_2tcF27Xqj8FE9nSEDY00yl7jEhp → user_2tc...Ehp)
// const truncateUserId = (userId: string): string => {
//   if (userId.length <= 10) return userId;
//   const prefix = userId.slice(0, 8); // Take first 8 characters
//   const suffix = userId.slice(-3);   // Take last 3 characters
//   return `${prefix}...${suffix}`;
// };


// const UserProgressDashboard = ({ userId }: { userId: string }) => {
//   const [timePeriod, setTimePeriod] = useState<"daily" | "monthly">("daily");
//   const { user, isLoaded } = useUser();

//   console.log("User Data:", { user, isLoaded, userId });
  

//   const { data: enrolledCourses, isLoading: isLoadingEnrolled, isError: isErrorEnrolled } =
//     useGetUserEnrolledCoursesQuery(user?.id ?? "", {
//       skip: !isLoaded || !user,
//     });

//    console.log("Enrolled Courses:", { enrolledCourses, isLoadingEnrolled, isErrorEnrolled });

//   // Batch fetch progress for all enrolled courses
//   const courseIds = useMemo(() => {
//     console.log("Course IDs before mapping:", enrolledCourses);
//     const ids = enrolledCourses?.map((course: Course) => course._id.toString()) || []; 
//     console.log("Generated Course IDs:", ids);
//     return ids;
//   }, [enrolledCourses]);
  

  
//   const { data: courseProgresses, isLoading: isLoadingProgress, isError: isErrorProgress } =
//   useGetUserCourseProgressBatchQuery(
//       { userId, courseIds: courseIds }, // Adjust if your query expects a single courseId
//       { skip: !isLoaded || !userId || !enrolledCourses?.length }
//     );

//   console.log("Course Progresses:", { courseProgresses, isLoadingProgress, isErrorProgress });

//   const { data: leaderboard, isLoading: isLoadingLeaderboard, isError: isErrorLeaderboard } =
//     useGetLearningLeaderboardQuery(undefined, { skip: !isLoaded || !userId });

//   console.log("Leaderboard Data:", { leaderboard, isLoadingLeaderboard, isErrorLeaderboard });
    
//   // Calculate user's total points and rank
//   const userPoints = useMemo(() => {
//     console.log("Calculating userPoints with courseProgresses:", courseProgresses);
//     if (!courseProgresses || !Array.isArray(courseProgresses)) {
//       console.warn("No course progresses or invalid array for userPoints");
//        return 0;
//     }

//     const points = courseProgresses.reduce((total, progress: CourseProgress) => {
//       const normalizedProgress = Math.min(progress.overallProgress * 100, 100);
//       console.log(`Progress for course ${progress.courseId}: overallProgress=${progress.overallProgress}, normalized=${normalizedProgress}, points=${progress.totalPoints || normalizedProgress * 10}`);
//       return total + (progress.totalPoints || normalizedProgress * 10); // 10 points per percent, max 1000 per course
//     }, 0);
//     console.log("<====Calculated User Points====>", points); // Debug final points
//     return points;
//   }, [courseProgresses]);

//   const userRank = useMemo(() => {
//     console.log("<====Calculating userRank with leaderboard====>", { leaderboard, userId });
//     if (!leaderboard?.data) return null;
//     const rank = leaderboard.data.findIndex((entry: LeaderboardEntry) => entry.userId === userId) + 1 || null;
//     console.log("<===Calculated User Rank===>", rank); // Debug rank
//     return rank;
//   }, [leaderboard, userId]);
  
  
//   // Top users for the leaderboard (using actual leaderboard data with Clerk usernames and avatars)
//   const [topUsers, setTopUsers] = useState<TopUser[]>([]);
//   useEffect(() => {
//     console.log("<<<====Fetching top users with leaderboard==>>>", leaderboard);

//     const fetchTopUsers = async () => {
//       if (!leaderboard?.data) return;

//       const userPromises = leaderboard.data.slice(0, 3).map(async (entry: LeaderboardEntry, index: number) => {
//       const username = truncateUserId(entry.userId); // Truncate userId for username
//       const points = entry.totalPoints || Math.min(entry.overallProgress * 100, 100) * 100;
//       const prize = entry.totalPrize || Math.min(entry.overallProgress * 100, 100) * 1000;
//       console.log(`Top User ${index + 1}:`, { userId: entry.userId, username, points, prize });
//         return {
//           rank: index + 1,
//           username,
//           points, // UI: Skulldugger (500), Klaxxon (10,000), Ultralex (250)
//           prize, // UI: Skulldugger (5,000), Klaxxon (10,000), Ultralex (2,500)
//           avatar: `/placeholder.png`,
//         };
//       });
//       const resolvedUsers = userPromises;
//       setTopUsers(resolvedUsers);
//     };
//     fetchTopUsers();
//   }, [leaderboard, user]);


//   if (!isLoaded) return <Loading />;
//   if (!user) return <div>Please sign in to view your progress.</div>;
//   if (isErrorEnrolled || isErrorProgress || isErrorLeaderboard)
//     return <div>Error loading progress dashboard</div>;

//   return (
//     <div className="progress-dashboard bg-gray-900 text-white p-4 rounded-lg shadow-lg">
//       {/* Time Period Toggle */}
//       <div className="flex justify-center mb-6">
//         <Button
//           variant={timePeriod === "daily" ? "default" : "outline"}
//           onClick={() => setTimePeriod("daily")}
//           className="mr-2 bg-gray-800 hover:bg-gray-700 text-white"
//         >
//           Daily
//         </Button>
//         <Button
//           variant={timePeriod === "monthly" ? "default" : "outline"}
//           onClick={() => setTimePeriod("monthly")}
//           className="bg-gray-800 hover:bg-gray-700 text-white"
//         >
//           Monthly
//         </Button>
//       </div>

//       {/* Top Users */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         {topUsers.map((user: TopUser) => (
//           <Card key={user.rank} className="bg-gray-800 border-none shadow-md">
//             <CardContent className="p-4 text-center">
//               <Image
//                 src={user.avatar}
//                 alt={user.username}
//                 width={100}
//                 height={100}
//                 className="rounded-full mx-auto mb-2"
//                 onError={(e) => (e.currentTarget.src = "/placeholder.png")} // Fallback for missing avatars
//               />
//               <h3 className="text-lg font-semibold">{user.username}</h3>
//               <p className="text-yellow-500 flex items-center justify-center">
//                 <span className="mr-1">🏆</span> Earn {user.points} points
//               </p>
//               <p className="text-blue-400 flex items-center justify-center">
//                 <span className="mr-1">💎</span> {user.prize} Prize
//               </p>
//               {timePeriod === "daily" && (
//                 <p className="text-sm text-gray-400">Ends in 00d 00h 43m 15s</p>
//               )}
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* User Summary */}
//       <div className="bg-gray-800 p-4 rounded-lg mb-6 text-center">
//         <p className="text-gray-400">
//           You earned <span className="text-blue-400">💎 {userPoints}</span> today and are ranked{" "}
//           {userRank !== null ? userRank : "—"} out of {leaderboard?.totalUsers} users
//         </p>
//       </div>

//       {/* Leaderboard Table */}
//       <Card className="bg-gray-800 border-none shadow-md">
//         <CardHeader>
//           <CardTitle className="text-center">Leaderboard</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {isLoadingLeaderboard ? (
//             <Loading />
//           ) : leaderboard?.data ? (
//             <Table className="w-full text-white">
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="text-gray-400">Place</TableHead>
//                   <TableHead className="text-gray-400">Username</TableHead>
//                   <TableHead className="text-gray-400">Points</TableHead>
//                   <TableHead className="text-gray-400">Prize</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {leaderboard.data.map((entry: LeaderboardEntry, index: number) => (
//                   <TableRow key={entry.userId}>
//                     <TableCell className="text-center">{index + 1}</TableCell>
//                     <TableCell className="p-2 flex items-center">
//                         <Image
//                           src={"/placeholder.png"}
//                           alt={entry.userId}
//                           width={30}
//                           height={30}
//                           className="rounded-full mr-2"
//                           onError={(e) => (e.currentTarget.src = "/placeholder.png")}
//                         />
//                         {entry.userId}
//                       </TableCell> {/* Replace with username if available */}
//                       <TableCell className="p-2">{entry.totalPoints}</TableCell> {/* Use totalPoints or normalize */}
//                       <TableCell className="text-blue-400 p-2">💎 {entry.totalPrize}</TableCell> {/* Use totalPrize or normalize */}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <p className="text-center text-gray-400">No leaderboard data available</p>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };


// export default UserProgressDashboard;