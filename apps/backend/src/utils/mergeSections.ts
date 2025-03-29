const mergeChapters = (existingChapters: any[], newChapters: any[]): any[] => {
  console.log("mergeChapters - existingChapters:", JSON.stringify(existingChapters, null, 2));
  console.log("mergeChapters - newChapters:", JSON.stringify(newChapters, null, 2));

  const existingChaptersMap = new Map<string, any>();
  for (const existingChapter of existingChapters || []) {
    existingChaptersMap.set(existingChapter.chapterId, existingChapter);
  }

  for (const newChapter of newChapters || []) {
    const existingChapter = existingChaptersMap.get(newChapter.chapterId);
    if (!existingChapter) {
      console.error(`Chapter with ID ${newChapter.chapterId} not found in existing chapters. Skipping update.`);
      continue;
    }
    const mergedChapter = {
      ...existingChapter,
      ...newChapter,
      completionTime: newChapter.completed
        ? (existingChapter.completionTime || new Date().toISOString())
        : existingChapter.completionTime || null,
      score: newChapter.score !== undefined ? newChapter.score : existingChapter.score || 0,
      isLocked: newChapter.isLocked !== undefined ? newChapter.isLocked : existingChapter.isLocked || false,
    };
    console.log(`mergeChapters - merging chapter ${newChapter.chapterId}:`, JSON.stringify(mergedChapter, null, 2));
    existingChaptersMap.set(newChapter.chapterId, mergedChapter);
  }

  const result = Array.from(existingChaptersMap.values());
  console.log("mergeChapters - result:", JSON.stringify(result, null, 2));
  return result;
};

const mergeSections = (existingSections: any[], newSections: any[]): any[] => {
  console.log("mergeSections - existingSections:", JSON.stringify(existingSections, null, 2));
  console.log("mergeSections - newSections:", JSON.stringify(newSections, null, 2));

  const existingSectionsMap = new Map<string, any>();
  for (const existingSection of existingSections || []) {
    existingSectionsMap.set(existingSection.sectionId, existingSection);
  }

  for (const newSection of newSections || []) {
    const existingSection = existingSectionsMap.get(newSection.sectionId);
    if (existingSection) {
      existingSection.chapters = mergeChapters(existingSection.chapters || [], newSection.chapters || []);
      // Ensure sectionScore is preserved if not recalculated
      existingSection.sectionScore = existingSection.sectionScore || 0;
    } else {
      existingSectionsMap.set(newSection.sectionId, {
        ...newSection,
        chapters: newSection.chapters || [],
        sectionScore: 0,
      });
    }
  }

  const result = Array.from(existingSectionsMap.values());
  console.log("mergeSections - result:", JSON.stringify(result, null, 2));
  return result;
};

export { mergeSections };