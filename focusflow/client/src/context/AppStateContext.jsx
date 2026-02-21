import { createContext, useState, useCallback } from 'react';

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);
  const [habits, setHabits] = useState([]);
  const [moods, setMoods] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateGoals = useCallback((newGoals) => setGoals(newGoals), []);
  const updateHabits = useCallback((newHabits) => setHabits(newHabits), []);
  const updateMoods = useCallback((newMoods) => setMoods(newMoods), []);
  const updateSessions = useCallback((newSessions) => setSessions(newSessions), []);
  const updateDashboard = useCallback((newDashboard) => setDashboard(newDashboard), []);

  const value = {
    goals,
    habits,
    moods,
    sessions,
    dashboard,
    isLoading,
    setIsLoading,
    updateGoals,
    updateHabits,
    updateMoods,
    updateSessions,
    updateDashboard,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export default AppStateContext;
