const calculateOverallProgress = (sections: any[]): number => {
  if(!sections || sections.length === 0) return 0; // No sections available

  let totalChapters = 0;
  let completedChapters = 0;

  sections.forEach((section) => {
    if (!section.chapters || section.chapters.length === 0) return; // No chapters in this section

    const completed = section.chapters.filter((chapter: any) => chapter.completed).length;
    const total = section.chapters.length;

    completedChapters += completed;
    totalChapters += total;
  })

  console.log(`calculateOverallProgress - totalChapters: ${totalChapters}, completedChapters: ${completedChapters}`);

  // const totalChapters = sections.reduce(
  //   (acc: number, section: any) => acc + section.chapters.length,
  //   0
  // );

  // const completedChapters = sections.reduce(
  //   (acc: number, section: any) =>
  //     acc + section.chapters.filter((chapter: any) => chapter.completed).length,
  //   0
  // );

  if (totalChapters === 0) return 0; // No chapters available

  return completedChapters / totalChapters; // Return 0 to 1
};

export default calculateOverallProgress;
