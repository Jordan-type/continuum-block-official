declare global {

    interface IReview {
        user: { userId: string; name?: string };
        rating: number;
        comment: string;
        commentReplies: Array<Record<string, any>>;
      }


      interface ICourse extends Document {
        teacherId: string;
        teacherName: string;
        title: string;
        description: string;
        category: string;
        image: string;
        price: number;
        level: "Beginner" | "Intermediate" | "Advanced";
        status: "Draft" | "Published";
        sections: Array<{
          sectionId: string;
          sectionTitle: string;
          sectionDescription: string;
          chapters: Array<{
            chapterId: string;
            type: "Text" | "Quiz" | "Video";
            title: string;
            content: string;
            comments: Array<{
              commentId: string;
              userId: Schema.Types.ObjectId;
              text: string;
              timestamp: string;
            }>;
            video: string;
            quiz: Array<{
              questionId: string;
              text: string;
              options: Array<{
                optionId: string;
                text: string;
                isCorrect: boolean;
              }>;
            }>;
            homeworks: Schema.Types.ObjectId[];
          }>;
        }>;
        reviews: IReview[];
        ratings: number;
        enrollments: Array<{ userId: string }>;
        createdAt: Date;
        updatedAt: Date;
      }

}

export {};

