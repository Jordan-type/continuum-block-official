export default function calculateOverallProgress(sections: any[]): number {
    if (!sections || sections.length === 0) return 0;
  
    let totalChapters = 0;
    let completedChapters = 0;
  
    sections.forEach((section) => {
      if (section.chapters && section.chapters.length > 0) {
        totalChapters += section.chapters.length;
        completedChapters += section.chapters.filter((chapter: any) => chapter.completed).length;
      }
    });

    console.log(`calculateOverallProgress - totalChapters: ${totalChapters}, completedChapters: ${completedChapters}`);
  
    if (totalChapters === 0) return 0;
  
    // Calculate the progress as a percentage (0 to 1)
    const progress = completedChapters / totalChapters;
    return progress; // Returns a value between 0 and 1 (e.g., 0.67 for 67%)
  }