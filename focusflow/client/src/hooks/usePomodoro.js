import { useState, useEffect, useCallback } from 'react';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

export const usePomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(WORK_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Session ended
          if (isWorkSession) {
            setSessionsCompleted((c) => c + 1);
          }
          setIsWorkSession(!isWorkSession);
          setIsRunning(false);
          return isWorkSession ? BREAK_MINUTES * 60 : WORK_MINUTES * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, isWorkSession]);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeLeft(WORK_MINUTES * 60);
    setIsRunning(false);
    setIsWorkSession(true);
  }, []);

  const skipSession = useCallback(() => {
    if (isWorkSession) {
      setSessionsCompleted((c) => c + 1);
    }
    setIsWorkSession(!isWorkSession);
    setTimeLeft(isWorkSession ? BREAK_MINUTES * 60 : WORK_MINUTES * 60);
    setIsRunning(false);
  }, [isWorkSession]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return {
    timeLeft,
    minutes,
    seconds,
    isRunning,
    isWorkSession,
    sessionsCompleted,
    toggleTimer,
    resetTimer,
    skipSession,
  };
};

export default usePomodoro;
