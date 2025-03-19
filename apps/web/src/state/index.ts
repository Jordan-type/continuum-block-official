import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MemberFormData, CourseBootcampFormData } from "@/lib/schemas";

interface InitialStateTypes {
  courseEditor: {
    sections: Section[];
    isChapterModalOpen: boolean;
    isSectionModalOpen: boolean;
    selectedSectionIndex: number | null;
    selectedChapterIndex: number | null;
    isAddQuestionsModalOpen: boolean; // New property
    selectedSectionIndexForQuiz: number | null; // New property
    selectedChapterIndexForQuiz: number | null; // New property
  };
  bootcampEditor: {
    bootcampModules: BootcampModule[]; // Add bootcampModules
    bootcampMembers: MemberFormData[];
    bootcampCourses: CourseBootcampFormData[];
    isMemberModalOpen: boolean;
    isCourseModalOpen: boolean;
    selectedMemberIndex: number | null;
    selectedCourseIndex: number | null;
    bootcampId: string | null; // Add bootcampId
  };
}

const initialState: InitialStateTypes = {
  courseEditor: {
    sections: [],
    isChapterModalOpen: false,
    isSectionModalOpen: false,
    selectedSectionIndex: null,
    selectedChapterIndex: null,
    isAddQuestionsModalOpen: false, // Initialize new property
    selectedSectionIndexForQuiz: null, // Initialize new property
    selectedChapterIndexForQuiz: null, // Initialize new property
  },
  bootcampEditor: {
    bootcampModules: [], // Initialize bootcampModules
    bootcampMembers: [],
    bootcampCourses: [],
    isMemberModalOpen: false,
    isCourseModalOpen: false,
    selectedMemberIndex: null,
    selectedCourseIndex: null,
    bootcampId: null, // Initialize bootcampId
  },
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setSections: (state, action: PayloadAction<Section[]>) => {
      state.courseEditor.sections = action.payload;
    },
    openChapterModal: (
      state,
      action: PayloadAction<{
        sectionIndex: number | null;
        chapterIndex: number | null;
      }>
    ) => {
      state.courseEditor.isChapterModalOpen = true;
      state.courseEditor.selectedSectionIndex = action.payload.sectionIndex;
      state.courseEditor.selectedChapterIndex = action.payload.chapterIndex;
    },
    closeChapterModal: (state) => {
      state.courseEditor.isChapterModalOpen = false;
      state.courseEditor.selectedSectionIndex = null;
      state.courseEditor.selectedChapterIndex = null;
    },

    openSectionModal: (
      state,
      action: PayloadAction<{ sectionIndex: number | null }>
    ) => {
      state.courseEditor.isSectionModalOpen = true;
      state.courseEditor.selectedSectionIndex = action.payload.sectionIndex;
    },
    closeSectionModal: (state) => {
      state.courseEditor.isSectionModalOpen = false;
      state.courseEditor.selectedSectionIndex = null;
    },

    addSection: (state, action: PayloadAction<Section>) => {
      state.courseEditor.sections.push(action.payload);
    },
    editSection: (
      state,
      action: PayloadAction<{ index: number; section: Section }>
    ) => {
      state.courseEditor.sections[action.payload.index] =
        action.payload.section;
    },
    deleteSection: (state, action: PayloadAction<number>) => {
      state.courseEditor.sections.splice(action.payload, 1);
    },

    addChapter: (state,  action: PayloadAction<{ sectionIndex: number; chapter: Chapter }>) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters.push(
        action.payload.chapter
      );
    },
    editChapter: (state, action: PayloadAction<{sectionIndex: number; chapterIndex: number; chapter: Chapter;}>) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters[
        action.payload.chapterIndex
      ] = action.payload.chapter;
    },
    deleteChapter: (state, action: PayloadAction<{ sectionIndex: number; chapterIndex: number }>) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters.splice(
        action.payload.chapterIndex,
        1
      );
    },
    openAddQuestionsModal: (state, action: PayloadAction<{ sectionIndex: number }>) => {
      state.courseEditor.isAddQuestionsModalOpen = true;
      state.courseEditor.selectedSectionIndexForQuiz = action.payload.sectionIndex;
      state.courseEditor.selectedChapterIndexForQuiz = null;
    },
    closeAddQuestionsModal: (state) => {
      state.courseEditor.isAddQuestionsModalOpen = false;
      state.courseEditor.selectedSectionIndexForQuiz = null;
      state.courseEditor.selectedChapterIndexForQuiz = null;
    },
    // New Bootcamp Editor Actions
    setBootcampMembers: (state, action: PayloadAction<MemberFormData[]>) => {
      state.bootcampEditor.bootcampMembers = action.payload;
    },
    setBootcampCourses: (state, action: PayloadAction<CourseBootcampFormData[]>) => {
      state.bootcampEditor.bootcampCourses = action.payload;
    },
    openMemberModal: (state, action: PayloadAction<{ memberIndex: number | null }>) => {
      state.bootcampEditor.isMemberModalOpen = true;
      state.bootcampEditor.selectedMemberIndex = action.payload.memberIndex;
    },
    closeMemberModal: (state) => {
      state.bootcampEditor.isMemberModalOpen = false;
      state.bootcampEditor.selectedMemberIndex = null;
    },
    openCourseModal: (state, action: PayloadAction<{ courseIndex: number | null; bootcampId?: string }>) => {
      state.bootcampEditor.isCourseModalOpen = true;
      state.bootcampEditor.selectedCourseIndex = action.payload.courseIndex;
      if (action.payload.bootcampId) {
        state.bootcampEditor.bootcampId = action.payload.bootcampId; // Set bootcampId
      }
    },
    closeCourseModal: (state) => {
      state.bootcampEditor.isCourseModalOpen = false;
      state.bootcampEditor.selectedCourseIndex = null;
    },
    addMember: (state, action: PayloadAction<MemberFormData>) => {
      state.bootcampEditor.bootcampMembers.push(action.payload);
    },
    editMember: (state, action: PayloadAction<{ index: number; member: MemberFormData }>) => {
      state.bootcampEditor.bootcampMembers[action.payload.index] = action.payload.member;
    },
    addCourse: (state, action: PayloadAction<CourseBootcampFormData>) => {
      state.bootcampEditor.bootcampCourses.push(action.payload);
    },
    editCourse: (state, action: PayloadAction<{ index: number; course: CourseBootcampFormData }>) => {
      state.bootcampEditor.bootcampCourses[action.payload.index] = action.payload.course;
    },
    deleteCourse: (state, action: PayloadAction<number>) => {
      state.bootcampEditor.bootcampCourses.splice(action.payload, 1);
    },
  },
});

export const {
  setSections,
  openChapterModal,
  closeChapterModal,
  openSectionModal,
  closeSectionModal,
  addSection,
  editSection,
  deleteSection,
  addChapter,
  editChapter,
  deleteChapter,
  openAddQuestionsModal,
  closeAddQuestionsModal, // Export the new action
  // Bootcamp Editor Actions
  setBootcampMembers,
  setBootcampCourses,
  openMemberModal,
  closeMemberModal,
  openCourseModal,
  closeCourseModal,
  addMember,
  editMember,
  addCourse,
  editCourse,
  deleteCourse
} = globalSlice.actions;

export default globalSlice.reducer;
