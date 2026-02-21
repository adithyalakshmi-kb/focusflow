import { usePomodoro } from '@/hooks/usePomodoro';
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';

export default function Timer() {
  const { minutes, seconds, isRunning, isWorkSession, sessionsCompleted, toggleTimer, resetTimer, skipSession } = usePomodoro();

  const displayMinutes = String(minutes).padStart(2, '0');
  const displaySeconds = String(seconds).padStart(2, '0');

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-8">
      {/* Session Type Indicator */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">
          {isWorkSession ? '💪 Work Time' : '☕ Break Time'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isWorkSession ? '25 minutes to focus' : '5 minutes to relax'}
        </p>
      </div>

      {/* Timer Display */}
      <div className="text-center">
        <div className={`text-9xl font-bold font-mono ${isWorkSession ? 'text-blue-600' : 'text-green-600'}`}>
          {displayMinutes}:{displaySeconds}
        </div>
      </div>

      {/* Completed Sessions */}
      <div className="text-center">
        <p className="text-2xl font-semibold">{sessionsCompleted} sessions completed</p>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Great progress! Keep going! 🎉</p>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className={`p-4 rounded-full ${
            isRunning
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isRunning ? <Pause size={32} /> : <Play size={32} />}
        </button>
        <button
          onClick={skipSession}
          className="p-4 rounded-full bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          <SkipForward size={32} />
        </button>
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-gray-600 hover:bg-gray-700 text-white"
        >
          <RotateCcw size={32} />
        </button>
      </div>

      {/* Tips */}
      <div className="text-center mt-8 max-w-md">
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
          <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Pro Tip</p>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {isWorkSession
              ? 'Disable notifications and focus on your most important task.'
              : 'Stand up, stretch, and get some water to recharge!'}
          </p>
        </div>
      </div>
    </div>
  );
}
