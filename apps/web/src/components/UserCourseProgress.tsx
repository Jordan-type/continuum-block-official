"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { truncateUserId } from "@/lib/utils";
import Loading from "@/components/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetUserEnrolledCoursesQuery, useGetUserCourseProgressBatchQuery, useGetLearningLeaderboardQuery } from "@/state/api";

const UserProgressDashboard = () => {
  const { user, isLoaded } = useUser();
  const [timePeriod, setTimePeriod] = useState<"daily" | "monthly">("daily");


  const { data: enrolledCourses, isLoading: isLoadingEnrolled, isError: isErrorEnrolled } = useGetUserEnrolledCoursesQuery(user?.id ?? "", { skip: !isLoaded || !user,});
  // console.log("Enrolled Courses:", { enrolledCourses, isLoadingEnrolled, isErrorEnrolled });
  
  // Batch fetch progress for all enrolled courses
  const courseIds = useMemo(() => {
    // console.log("Course IDs before mapping:", enrolledCourses);
    const ids = enrolledCourses?.map((course: Course) => course._id.toString()) || [];
    // console.log("Generated Course IDs:", ids);
    return ids;
  }, [enrolledCourses]);

  // const { data: courseProgresses, isLoading: isLoadingProgress, isError: isErrorProgress } = useGetUserCourseProgressBatchQuery({userId: user?.id ?? "", courseIds }, { skip: !isLoaded || !user || !enrolledCourses?.length });
  // console.log("Course Progresses:", { courseProgresses, isLoadingProgress, isErrorProgress });

  const { data: leaderboardDataApi = [], isLoading: isLoadingLeaderboard, isError: isErrorLeaderboard } = useGetLearningLeaderboardQuery(user?.id ?? "");
  console.log("Leaderboard Data:", { leaderboardDataApi, isLoadingLeaderboard, isErrorLeaderboard });

  // Calculate user's rank from leaderboard data
  const userRank = useMemo(() => {
    if (!leaderboardDataApi || !Array.isArray(leaderboardDataApi) || !leaderboardDataApi.length || !user?.id) return null;
    const rank = leaderboardDataApi.find((entry: LeaderboardEntry) => entry.userId === user.id)?.rank; // 1-based rank
    console.log("<===Calculated User Rank===>", rank); // Debug rank
    return rank ?? null; // Return null if user not found
  }, [leaderboardDataApi, user]);
  console.log("<===Calculated User Rank===>", userRank);

  // Calculate user's total points and rank
  const userPoints = useMemo(() => {
    if (!leaderboardDataApi || !Array.isArray(leaderboardDataApi) || !leaderboardDataApi.length || !user?.id) return null;
    return leaderboardDataApi.find((entry: LeaderboardEntry) => entry.userId === user.id)?.totalPoints || 0;
  }, [leaderboardDataApi, user]);
  console.log("userPoints", userPoints)

  // Use real totalUsers from API 
  const totalUsers = Array.isArray(leaderboardDataApi) ? leaderboardDataApi.length : 0;
  console.log("totalUsers", totalUsers)

  // Get Top 3 Users
  const topUsers = useMemo(() => {
    if (!leaderboardDataApi.length) return [];
    return leaderboardDataApi.slice(0, 3); // Get the first 3 users
  }, [leaderboardDataApi]);

  console.log("topUsers", topUsers)


  if (!isLoaded) return <p>Loading user data...</p>;
  if (!user) return <p>Please sign in to view your progress.</p>;
  if (isLoadingLeaderboard) return <p>Loading leaderboard...</p>;
  if (isErrorLeaderboard) return <p>Error loading leaderboard.</p>;

  return (
    <div className="progress-dashboard bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      {/* Time Period Toggle */}
      <div className="flex justify-center mb-6">
        <Button variant={timePeriod === "daily" ? "default" : "outline"} onClick={() => setTimePeriod("daily")}
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

      {/* Top Users 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 custom-platform-background">
        {topUsers.map((user: TopUser) => (
          <Card key={user.rank} className="bg-gray-800 border-none shadow-md rounded-lg custom-card-3d">
            <CardContent className="p-4 text-center custom-card-content">
              <Image
                src={"/placeholder.png"}
                alt={user.userId}
                width={100}
                height={100}
                className="rounded-lg mx-auto mb-2" // Rounded rectangle, no shadow, matching first image
                onError={(e) => (e.currentTarget.src = "/placeholder.png")} // Fallback for missing avatars
              />
              <h3 className="text-lg font-semibold mb-2 text-white">{truncateUserId(user.userId)}</h3>
              <p className="text-yellow-500 flex items-center justify-center mb-2">
                <span className="mr-1">🏆</span> Earn {user.totalPoints} points
              </p>
              <p className="text-blue-400 flex items-center justify-center">
                <span className="mr-1">💎</span> {user.totalPrize} Prize
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
          You earned <span className="text-blue-400">💎 {userPoints || 0}</span> points today and are ranked{" "}
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
                <TableHead className="text-gray-400 text-left p-2 custom-table-header"># Rank</TableHead>
                <TableHead className="text-gray-400 text-left p-2 custom-table-header">User ID</TableHead>
                <TableHead className="text-gray-400 text-left p-2 custom-table-header">Courses</TableHead>
                <TableHead className="text-gray-400 text-left p-2 custom-table-header">Points</TableHead>
                <TableHead className="text-gray-400 text-left p-2 custom-table-header">Prize</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardDataApi.map((entry: LeaderboardEntry, index: number) => (
                <TableRow key={entry.userId} className="hover:bg-gray-700">
                  <TableCell className="text-center p-2 custom-table-cell">
                    <span className="mr-1">🏆</span> {entry.rank}
                  </TableCell>
                  <TableCell className="p-2">{truncateUserId(entry.userId)}</TableCell>
                  <TableCell className="p-2">{entry.courseCount}</TableCell>
                  <TableCell className="p-2">{entry.totalPoints}</TableCell>
                  <TableCell className="text-blue-400 p-2">💎 {entry.totalPrize}</TableCell>
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

        .custom-platform-background {
          background-color: #1a202c; /* Darker background for platform hierarchy */
          padding: 2rem 0; /* Add vertical padding for hierarchy spacing */
        }

        .custom-card-3d {
          background-color: #2d3748;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
          transform: perspective(1000px) translateZ(0);
          transition: transform 0.3s ease;
          margin: 0 auto; /* Center cards horizontally */
          width: 90%; /* Ensure cards take up most of the container width */
        }

        .custom-card-3d:hover {
          transform: perspective(1000px) translateZ(10px);
        }

        .custom-card-content {
          padding: 1rem; /* Override p-4 to match image spacing (16px) */
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

        .text-white {
          color: #fff;
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

        .mb-2 {
          margin-bottom: 0.5rem;
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





  




//   const { data: leaderboard, isLoading: isLoadingLeaderboard, isError: isErrorLeaderboard } =
//     useGetLearningLeaderboardQuery(undefined, { skip: !isLoaded || !userId });

//   console.log("Leaderboard Data:", { leaderboard, isLoadingLeaderboard, isErrorLeaderboard });
    


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