import ffmpeg from "fluent-ffmpeg";

const getVideoDuration = (videoPath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        console.error("Error getting video duration:", err);
        return reject(err);
      }
      const durationInSeconds = metadata.format.duration || 0;
      resolve(durationInSeconds);
    });
  });
};

// Utility function to format duration into a human-readable string
const formatDuration = (durationInSeconds: number): string => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  } else if (minutes > 0) {
    return `${minutes}min`;
  } else {
    return `${seconds}sec`;
  }
};

export {
    getVideoDuration,
    formatDuration
}


// const backfillDurations = async () => {
//   const courses = await Course.find();
//   for (const course of courses) {
//     for (const section of course.sections) {
//       let sectionDurationInSeconds = 0;
//       for (const chapter of section.chapters) {
//         if (chapter.type === "Video" && chapter.video && !chapter.duration) {
//           const videoPublicId = // Extract public_id from chapter.video URL
//           const videoInfo = await cloudinary.api.resource(videoPublicId, { resource_type: "video" });
//           chapter.duration = formatDuration(videoInfo.duration);
//           sectionDurationInSeconds += videoInfo.duration;
//         } else if (chapter.type === "Quiz" && !chapter.duration) {
//           chapter.duration = "10min";
//           sectionDurationInSeconds += 10 * 60;
//         } else if (chapter.type === "Text" && !chapter.duration) {
//           chapter.duration = "5min";
//           sectionDurationInSeconds += 5 * 60;
//         }
//       }
//       section.duration = formatDuration(sectionDurationInSeconds);
//     }
//     await course.save();
//   }
// };