import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useGetCourseQuery, useGetUserCourseProgressQuery, useUpdateUserCourseProgressMutation, } from "@/state/api";
import { useUser } from "@clerk/nextjs";

export const useCourseProgressData = () => {
  const { courseId, chapterId } = useParams();
  const { user, isLoaded } = useUser();
  const [hasMarkedComplete, setHasMarkedComplete] = useState(false);

  const { data: course, isLoading: courseLoading } = useGetCourseQuery((courseId as string) ?? "", {skip: !courseId,});

  const { data: userProgress, isLoading: progressLoading, } = useGetUserCourseProgressQuery(
    {userId: user?.id ?? "", courseId: (courseId as string) ?? "",},
    {skip: !isLoaded || !user || !courseId, }
  );

  const [updateProgress] = useUpdateUserCourseProgressMutation();

  const isLoading = !isLoaded || courseLoading || progressLoading;

  const currentSection = course?.sections.find((s: Section) => s.chapters.some((c: Chapter) => c.chapterId === chapterId));
  const currentChapter = currentSection?.chapters.find((c: ChapterProgress) => c.chapterId === chapterId);

  const isChapterCompleted = () => {
    if (!currentSection || !currentChapter || !userProgress?.sections)
      return false;

    const section = userProgress.sections.find((s: SectionProgress) => s.sectionId === currentSection.sectionId);
    return (
      section?.chapters.some(
        (c: ChapterProgress ) => c.chapterId === currentChapter.chapterId && c.completed
      ) ?? false
    );
  };

  const updateChapterProgress = async ( sectionId: string, chapterId: string, completed: boolean, score: number = 0, isLocked: boolean = false
  ) => {
    if (!user) return;

    const updatedSections = [
      {
        sectionId,
        chapters: [
          {
            chapterId,
            completed,
            score, 
            isLocked, 
          },
        ],
      },
    ];

    try {
      
      await updateProgress({
        userId: user.id,
        courseId: (courseId as string) ?? "",
        progressData: {
          sections: updatedSections,
        },
      }).unwrap();
      setHasMarkedComplete(true);
    } catch (error) {
      console.log("Error updating chapter progress:", error);
    }
  };

  // Log userProgress to debug
  useEffect(() => {
    console.log("userProgress in useCourseProgressData:", JSON.stringify(userProgress, null, 2));
  }, [userProgress]);

  return {
    user,
    courseId,
    chapterId,
    course,
    userProgress,
    currentSection,
    currentChapter,
    isLoading,
    isChapterCompleted,
    updateChapterProgress,
    hasMarkedComplete,
    setHasMarkedComplete,
  };
};
