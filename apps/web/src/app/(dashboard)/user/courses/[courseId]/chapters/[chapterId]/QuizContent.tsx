"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetChapterQuizzesQuery, useSubmitQuizResponseMutation } from "@/state/api";
import { toast } from "sonner";

interface QuizContentProps {
  courseId: string;
  chapterId: string;
  userId: string;
  onQuizComplete?: () => void;
}

interface Answer {
  questionId: string;
  selectedAnswer: string;
}

const QuizContent: React.FC<QuizContentProps> = ({ courseId, chapterId, userId, onQuizComplete }) => {
  const { data: quizzes, isLoading, error } = useGetChapterQuizzesQuery({ courseId, chapterId });
  const [submitQuizResponse] = useSubmitQuizResponseMutation();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]); // Track all answers
  const [showResults, setShowResults] = useState(false); // Show results screen after quiz completion

  if (isLoading) return <div className="quiz-content__loading">Loading quiz...</div>;
  if (error) return <div className="quiz-content__error">Error loading quiz: {(error as any).error}</div>;
  if (!quizzes || quizzes.length === 0) return <div className="quiz-content__empty">No quizzes available for this chapter.</div>;

  const currentQuiz = quizzes[0];
  const questions = currentQuiz.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Calculate score based on answers
  const calculateScore = () => {
    let correctCount = 0;
    answers.forEach((answer) => {
      const question = questions.find((q: any) => q.id === answer.questionId);
      if (question && question.correctAnswer === answer.selectedAnswer) {
        correctCount++;
      }
    });
    const scorePercentage = (correctCount / totalQuestions) * 100;
    const points = scorePercentage; // Assuming 100 points total, so percentage = points
    return { correctCount, scorePercentage, points };
  };

  const passingScore = 80; // 80% passing score
  const passingPoints = passingScore; // 80 points out of 100

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = async () => {
    if (!selectedAnswer) {
      toast.error("Please select an answer before proceeding.");
      return;
    }

    // Save the answer
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedAnswer,
    };
    setAnswers([...answers, newAnswer]);

    try {
      await submitQuizResponse({
        courseId,
        chapterId,
        quizId: currentQuiz.id,
        questionId: currentQuestion.id,
        answer: selectedAnswer,
        userId,
      }).unwrap();
      toast.success("Answer submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit answer.");
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true); // Show results screen
      if (onQuizComplete) onQuizComplete();
    }
  };

  if (showResults) {
    const { scorePercentage, points } = calculateScore();
    const passed = scorePercentage >= passingScore;

    return (
      <div className="quiz-results">
        <h2 className="quiz-results__title">Knowledge Check</h2>
        <div className="quiz-results__score">
          <span className="quiz-results__label">Your Score:</span>
          <span className="quiz-results__value">{Math.round(scorePercentage)}%</span>
          <span className="quiz-results__points">{Math.round(points)} Points</span>
        </div>
        <div className="quiz-results__passing">
          <span className="quiz-results__label">Passing Score:</span>
          <span className="quiz-results__value">{passingScore}%</span>
          <span className="quiz-results__points">{passingPoints} Points</span>
        </div>
        <div className="quiz-results__result">
          <h3 className="quiz-results__result-title">Result</h3>
          <div className={`quiz-results__status ${passed ? "quiz-results__status--pass" : "quiz-results__status--fail"}`}>
            {passed ? "✔ You Passed" : "✘ You did not Pass"}
          </div>
          {!passed && <p className="quiz-results__message">Better Luck Next Time!</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-content">
      <CardHeader className="quiz-content__header">
        <CardTitle className="quiz-content__title">
          <span className="quiz-content__question-number">
            QUESTION {currentQuestionIndex + 1}/{totalQuestions}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="quiz-content__body">
        <div className="quiz-content__question-container">
          <h3 className="quiz-content__question">{currentQuestion.question}</h3>
          <div className="quiz-content__options">
            {currentQuestion.options.map((option, index) => {
              const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = selectedAnswer === option.value;
              return (
                <Button
                  key={option.value}
                  variant={isSelected ? "default" : "outline"}
                  className={`quiz-content__option ${
                    isSelected ? "quiz-content__option--selected" : ""
                  }`}
                  onClick={() => handleAnswerSelect(option.value)}
                >
                  <span className="quiz-content__option-label">{optionLabel}</span>
                  {option.label}
                </Button>
              );
            })}
          </div>
        </div>
        <div className="quiz-content__actions">
          <Button
            onClick={handleNextQuestion}
            className="quiz-content__next-button"
          >
            {currentQuestionIndex < totalQuestions - 1 ? "NEXT QUESTION" : "SUBMIT QUIZ"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="quiz-content__next-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>
      </CardContent>
    </div>
  );
};

export default QuizContent;