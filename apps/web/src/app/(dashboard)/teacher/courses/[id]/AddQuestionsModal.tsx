"use client";

import { CustomFormField } from "@/components/CustomFormField";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import CustomModal from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"
import { zodResolver } from "@hookform/resolvers/zod";
import { closeAddQuestionsModal, setSections } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { X, Plus, GripVertical } from "lucide-react";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";

// Define schema for a single quiz question
const quizQuestionSchema = z.object({
  questionText: z.string().min(1, "Question text is required"),
  options: z
    .array(
      z.object({
        optionId: z.string(),
        text: z.string().min(1, "Option text is required"),
        isCorrect: z.boolean(),
      })
    )
    .length(4)
    .refine((options) => options.some((opt) => opt.isCorrect), {
      message: "At least one option must be marked as correct",
    }),
});

// Define schema for the form with multiple questions
const formSchema = z.object({
  questions: z.array(quizQuestionSchema).min(1, "At least one question is required"),
});

type FormData = z.infer<typeof formSchema>;


const AddQuestionsModal = () => {
  const dispatch = useAppDispatch();
  const { isAddQuestionsModalOpen, selectedSectionIndexForQuiz, sections } = useAppSelector(
    (state) => state.global.courseEditor
  );

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questions: [
        {
          questionText: "",
          options: [
            { optionId: uuidv4(), text: "", isCorrect: false },
            { optionId: uuidv4(), text: "", isCorrect: false },
            { optionId: uuidv4(), text: "", isCorrect: false },
            { optionId: uuidv4(), text: "", isCorrect: false },
          ],
        },
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: methods.control,
    name: "questions",
  });

  const onClose = () => {
    dispatch(closeAddQuestionsModal());
    methods.reset();
  };

  const onSubmit = (data: FormData) => {
    console.log("Form data on submit:", data);
    if (selectedSectionIndexForQuiz === null) return;

    const newQuizQuestions = data.questions.map((question) => ({
        questionId: uuidv4(),
        text: question.questionText,
        options: question.options.map((option) => ({
          optionId: option.optionId,
          text: option.text,
          isCorrect: option.isCorrect,
        })),
      }));


    // Use the existing section title or a fallback
    const sectionTitle = sections[selectedSectionIndexForQuiz]?.sectionTitle || "Untitled Section";
    const newChapter: Chapter = {
        chapterId: uuidv4(),
        type: "Quiz",
        title: `Quiz - ${sectionTitle}`, // Simple date-based title ${new Date().toISOString().split("T")[0]}
        content: "", // Optional: Leave empty or add a description
        video: "",
        quiz: newQuizQuestions,
        comments: [],
        homeworks: [],
    };

    // Update the sections in the Redux state by adding a new chapter
    dispatch(
        setSections(
          sections.map((section: Section, sIndex: number) =>
            sIndex === selectedSectionIndexForQuiz
              ? {
                  ...section,
                  chapters: [...section.chapters, newChapter],
                }
              : section
          )
        )
      );

    toast.success("Quiz question added successfully but you need to save the course to apply the changes");
    onClose();
  };

  const handleCheckboxChange = (questionIndex: number, optIndex: number) => {
    const currentOptions = methods.getValues(`questions.${questionIndex}.options`) || [];
    const updatedOptions = currentOptions.map((option: any, i: number) => ({
      ...option,
      isCorrect: i === optIndex,
    }));
    methods.setValue(`questions.${questionIndex}.options`, updatedOptions);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  return (
    <CustomModal isOpen={isAddQuestionsModalOpen} onClose={onClose}>
      <div className="add-questions-modal">
        <div className="add-questions-modal__header">
          <h2 className="add-questions-modal__title">Add Quiz Question</h2>
          <button onClick={onClose} className="add-questions-modal__close">
            <X className="w-6 h-6" />
          </button>
        </div>

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="add-questions-modal__form space-y-6">            
            {/* Questions Section with Drag-and-Drop */}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {fields.map((field, questionIndex) => (
                      <Draggable key={field.id} draggableId={field.id} index={questionIndex}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="border border-gray-700 p-4 rounded-lg bg-gray-800 space-y-4"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="h-5 w-5 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold">
                                  {questionIndex + 1}. Question
                                </h3>
                              </div>
                              {questionIndex > 0 && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                  onClick={() => remove(questionIndex)}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>

                            <FormField
                              control={methods.control}
                              name={`questions.${questionIndex}.questionText`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-400 text-sm">Question Text</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter the quiz question"
                                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />

                            {Array.from({ length: 4 }).map((_, optIndex) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <FormField
                                  control={methods.control}
                                  name={`questions.${questionIndex}.options.${optIndex}.text`}
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder={`Enter option ${optIndex + 1}`}
                                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 h-10"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-red-400" />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={methods.control}
                                  name={`questions.${questionIndex}.options.${optIndex}.isCorrect`}
                                  render={({ field }) => (
                                    <FormItem className="flex items-center h-10">
                                      <FormControl>
                                        <Checkbox
                                          className="h-5 w-5 text-blue-500 border-gray-500"
                                          checked={field.value}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              handleCheckboxChange(questionIndex, optIndex);
                                            } else {
                                              field.onChange(false);
                                            }
                                          }}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* Add Question Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  questionText: "",
                  options: [
                    { optionId: uuidv4(), text: "", isCorrect: false },
                    { optionId: uuidv4(), text: "", isCorrect: false },
                    { optionId: uuidv4(), text: "", isCorrect: false },
                    { optionId: uuidv4(), text: "", isCorrect: false },
                  ],
                })
              }
              className="mt-4 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Question
            </Button>

            <div className="add-questions-modal__actions mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary-700">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomModal>
  );
};

export default AddQuestionsModal;