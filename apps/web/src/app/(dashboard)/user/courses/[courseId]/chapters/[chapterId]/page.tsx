"use client";

import { useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"; // Import Button component
import ReactPlayer from "react-player";
import Loading from "@/components/Loading";
import { useCourseProgressData } from "@/hooks/useCourseProgressData";
import QuizContent from "./QuizContent";
import CommentsSidebar from "@/components/CommentsSidebar";

const Course = () => {
  const {
    user,
    course,
    userProgress,
    currentSection,
    currentChapter,
    isLoading,
    isChapterCompleted,
    updateChapterProgress,
    hasMarkedComplete,
    setHasMarkedComplete,
  } = useCourseProgressData();
  console.log("currentChapter.video:", currentChapter);

  const playerRef = useRef<ReactPlayer>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Track sidebar state

  const handleProgress = ({ played }: { played: number }) => {
    if (
      played >= 0.8 &&
      !hasMarkedComplete &&
      currentChapter &&
      currentSection &&
      userProgress?.sections &&
      !isChapterCompleted()
    ) {
      try {
        setHasMarkedComplete(true);
        updateChapterProgress(
        currentSection.sectionId,
        currentChapter.chapterId,
        true
      );
    } catch (error) {
        console.error("Error updating chapter progress:", error);
        setHasMarkedComplete(false); // Reset on failure
      }
    }
  };

  const handleQuizComplete = () => {
    if (
      !hasMarkedComplete &&
      currentChapter &&
      currentSection &&
      userProgress?.sections &&
      !isChapterCompleted()
    ) {
      setHasMarkedComplete(true);
    }
  };

  const handleMarkTextComplete = () => {
    if (
      !hasMarkedComplete &&
      currentChapter &&
      currentSection &&
      userProgress?.sections &&
      !isChapterCompleted()
    ) {
      setHasMarkedComplete(true);
      updateChapterProgress(
        currentSection.sectionId,
        currentChapter.chapterId,
        true
      );
    }
  };

  if (isLoading) return <Loading />;
  if (!user) return <div>Please sign in to view this course.</div>;
  if (!course || !userProgress) return <div>Error loading course</div>;

  const isTextChapter = currentChapter?.type === "Text";
  const chapterCompleted = isChapterCompleted();

  return (
    <div className="course">
      <div className={`course__container ${isSidebarCollapsed ? "course__container--sidebar-collapsed" : ""}`}>
        <div className="course__breadcrumb">
          <div className="course__path">
            {course.title} / {currentSection?.sectionTitle} /{" "}
            <span className="course__current-chapter">
              {currentChapter?.title}
            </span>
          </div>
          <h2 className="course__title">{currentChapter?.title}</h2>
          <div className="course__header">
            <div className="course__instructor">
              <Avatar className="course__avatar">
                <AvatarImage alt={course.teacherName} />
                <AvatarFallback className="course__avatar-fallback">
                  {course.teacherName[0]}
                </AvatarFallback>
              </Avatar>
              <span className="course__instructor-name">
                {course.teacherName}
              </span>
            </div>
          </div>
        </div>

        <Card className="course__video">
          <CardContent className="course__video-container">
            {currentChapter?.type === "Video" && currentChapter?.video ? (
              <ReactPlayer
                ref={playerRef}
                url={currentChapter.video as string}
                controls
                width="100%"
                height="100%"
                onProgress={handleProgress}
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload",
                    },
                  },
                }}
              />
            ) : currentChapter?.type === "Quiz" ? (
              <QuizContent
                courseId={course._id}
                chapterId={currentChapter?.chapterId || ""}
                userId={user.id}
                onQuizComplete={handleQuizComplete}
              />
            ) : (
              <div className="course__no-video">
                {currentChapter?.type === "Text"
                  ? "This chapter contains text content. Please view it in the Notes tab."
                  : "No video or quiz available for this chapter."}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="course__content">
          <Tabs defaultValue="Notes" className="course__tabs">
            <TabsList className="course__tabs-list">
              <TabsTrigger className="course__tab" value="Notes">
                Notes
              </TabsTrigger>
              <TabsTrigger className="course__tab" value="Resources">
                Resources
              </TabsTrigger>
              <TabsTrigger className="course__tab" value="Comments">
                Comments
              </TabsTrigger>
            </TabsList>

            <TabsContent className="course__tab-content" value="Notes">
              <Card className="course__tab-card">
                <CardHeader className="course__tab-header">
                  <CardTitle>Notes Content</CardTitle>
                </CardHeader>
                <CardContent className="course__tab-body">
                {currentChapter?.content || "No content available for this chapter."}
                  {isTextChapter && (
                    <div className="course__mark-complete">
                      <Button
                        onClick={handleMarkTextComplete}
                        disabled={chapterCompleted}
                        className="course__mark-complete-button"
                      >
                        {chapterCompleted ? "Chapter Completed" : "Mark as Complete"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent className="course__tab-content" value="Resources">
              <Card className="course__tab-card">
                <CardHeader className="course__tab-header">
                  <CardTitle>Resources Content</CardTitle>
                </CardHeader>
                <CardContent className="course__tab-body">
                  {/* Add resources content here */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent className="course__tab-content" value="Comments">
              {/* <CommentsSidebar
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
              /> */}
            </TabsContent>
          </Tabs>

          <Card className="course__instructor-card">
            <CardContent className="course__instructor-info">
              <div className="course__instructor-header">
                <Avatar className="course__instructor-avatar">
                  <AvatarImage alt={course.teacherName} />
                  <AvatarFallback className="course__instructor-avatar-fallback">
                    {course.teacherName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="course__instructor-details">
                  <h4 className="course__instructor-name">
                    {course.teacherName}
                  </h4>
                  {/* <p className="course__instructor-title">Senior UX Designer</p> */}
                </div>
              </div>
              {/* <div className="course__instructor-bio">
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* <CommentsSidebar
              isCollapsed={isSidebarCollapsed}
              setIsCollapsed={setIsSidebarCollapsed}
            /> */}
    </div>
  );
};

export default Course;
