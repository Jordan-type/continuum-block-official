import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    editChapter: (
      state,
      action: PayloadAction<{
        sectionIndex: number;
        chapterIndex: number;
        chapter: Chapter;
      }>
    ) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters[
        action.payload.chapterIndex
      ] = action.payload.chapter;
    },
    deleteChapter: (
      state,
      action: PayloadAction<{ sectionIndex: number; chapterIndex: number }>
    ) => {
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
} = globalSlice.actions;

export default globalSlice.reducer;
