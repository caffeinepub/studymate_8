import { useCallback, useState } from "react";

const STORAGE_KEY = "studymate_credits";
const FEEDBACK_KEY = "studymate_feedback_given";
const INITIAL_CREDITS = 100;
const VIDEO_COST = 2;
const FEEDBACK_REWARD = 10;

export function useCreditSystem() {
  const [credits, setCredits] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      localStorage.setItem(STORAGE_KEY, String(INITIAL_CREDITS));
      return INITIAL_CREDITS;
    }
    return Number.parseInt(stored, 10);
  });

  const [feedbackGiven, setFeedbackGiven] = useState<boolean>(() => {
    return localStorage.getItem(FEEDBACK_KEY) === "true";
  });

  const spendCredits = useCallback((amount: number): boolean => {
    const current = Number.parseInt(
      localStorage.getItem(STORAGE_KEY) ?? String(INITIAL_CREDITS),
      10,
    );
    if (current < amount) return false;
    const next = current - amount;
    setCredits(next);
    localStorage.setItem(STORAGE_KEY, String(next));
    return true;
  }, []);

  const earnCredits = useCallback((amount: number) => {
    const current = Number.parseInt(
      localStorage.getItem(STORAGE_KEY) ?? String(INITIAL_CREDITS),
      10,
    );
    const next = current + amount;
    setCredits(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  }, []);

  const submitFeedback = useCallback(
    (feedback: string): boolean => {
      if (!feedback.trim()) return false;
      if (feedbackGiven) return false;
      earnCredits(FEEDBACK_REWARD);
      setFeedbackGiven(true);
      localStorage.setItem(FEEDBACK_KEY, "true");
      return true;
    },
    [feedbackGiven, earnCredits],
  );

  return {
    credits,
    feedbackGiven,
    spendCredits,
    earnCredits,
    submitFeedback,
    VIDEO_COST,
    FEEDBACK_REWARD,
  };
}
