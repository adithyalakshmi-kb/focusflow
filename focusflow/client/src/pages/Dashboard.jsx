import { useEffect, useState } from 'react';
import { dashboardAPI } from '@/api';

/* ─── Circular Progress Ring ─── */
function ProgressRing({ percent = 0, size = 120, stroke = 10, gradient = ['#C7D2FE', '#818CF8'], label, value, sublabel }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size}>
          <defs>
            <linearGradient id={`ring-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradient[0]} />
              <stop offset="100%" stopColor={gradient[1]} />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="#F1F5F9" strokeWidth={stroke}
          />
          {/* Progress */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={`url(#ring-${label})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="progress-ring-circle"
          />
        </svg>
        {/* Center text */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B' }}>{value}</span>
          <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>{sublabel}</span>
        </div>
      </div>
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>{label}</span>
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ emoji, label, value, sub, accent = '#C7D2FE', accentText = '#4338CA', children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '24px',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.10)' : '0 10px 25px rgba(0,0,0,0.05)',
      }}
    >
      {/* Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: accent,
        borderRadius: '99px',
        padding: '4px 10px',
        marginBottom: '16px',
      }}>
        <span>{emoji}</span>
        <span style={{ fontSize: '11px', fontWeight: 700, color: accentText }}>{label}</span>
      </div>

      {value !== undefined && (
        <div style={{ fontSize: '32px', fontWeight: 800, color: '#1E293B', lineHeight: 1 }}>{value}</div>
      )}
      {sub && <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>{sub}</p>}
      {children}
    </div>
  );
}

/* ─── Mood Button ─── */
const MOODS = [
  { emoji: '😄', label: 'Great', bg: '#BBF7D0', color: '#15803D' },
  { emoji: '😊', label: 'Good', bg: '#BAE6FD', color: '#0369A1' },
  { emoji: '😐', label: 'Okay', bg: '#FEF9C3', color: '#A16207' },
  { emoji: '😞', label: 'Low', bg: '#FED7AA', color: '#C2410C' },
  { emoji: '😔', label: 'Bad', bg: '#FECACA', color: '#B91C1C' },
];

/* ─── Main Dashboard ─── */
export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [dashData, quoteData] = await Promise.all([
          dashboardAPI.getDashboard(),
          dashboardAPI.getQuote(),
        ]);
        setDashboard(dashData.data.dashboard);
        setQuote(quoteData.data.quote);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '4px solid #E2E8F0',
          borderTopColor: '#818CF8',
          animation: 'spin 0.9s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#94A3B8', fontSize: '14px', fontWeight: 500 }}>Loading your space...</p>
      </div>
    );
  }

  if (!dashboard) {
    return <div style={{ textAlign: 'center', padding: '48px', color: '#EF4444', fontWeight: 600 }}>Failed to load dashboard.</div>;
  }

  const goalsPct = dashboard.goals.total > 0
    ? Math.round((dashboard.goals.completed / dashboard.goals.total) * 100)
    : 0;

  const studyHours = dashboard.focus.totalHours || 0;
  const studyTarget = 8;
  const studyPct = Math.min(Math.round((studyHours / studyTarget) * 100), 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ── Motivational Quote Card ── */}
      {quote && (
        <div className="card" style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, #EDE9FE 0%, #E0F2FE 100%)',
          border: 'none',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '22px', marginBottom: '8px' }}>💬</div>
          <p style={{
            fontSize: '16px', fontWeight: 600, color: '#1E293B',
            fontStyle: 'italic', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7,
          }}>
            "{quote.text}"
          </p>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '10px', fontWeight: 500 }}>
            — {quote.author}
          </p>
        </div>
      )}

      {/* ── Top Row: Study Timer + Goals + Habit Streak ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>

        {/* Study Time Today */}
        <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#BAE6FD', borderRadius: '99px', padding: '4px 10px', marginBottom: '20px',
          }}>
            <span>⚡</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#0369A1' }}>Study Time Today</span>
          </div>
          <ProgressRing
            percent={studyPct}
            size={130}
            stroke={11}
            gradient={['#BAE6FD', '#38BDF8']}
            label="of 8h target"
            value={`${studyHours}h`}
            sublabel="today"
          />
          <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '14px' }}>
            {dashboard.focus.sessionsCount} session{dashboard.focus.sessionsCount !== 1 ? 's' : ''} this week
          </p>
        </div>

        {/* Goals Completed */}
        <StatCard
          emoji="🎯"
          label="Goals Completed"
          accent="#C7D2FE"
          accentText="#4338CA"
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '36px', fontWeight: 800, color: '#1E293B' }}>
              {dashboard.goals.completed}
            </span>
            <span style={{ fontSize: '16px', color: '#94A3B8', fontWeight: 500 }}>
              / {dashboard.goals.total}
            </span>
          </div>
          <div style={{ background: '#F1F5F9', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
            <div
              className="progress-bar"
              style={{
                width: `${goalsPct}%`,
                height: '8px',
                background: 'linear-gradient(90deg, #C7D2FE, #818CF8)',
              }}
            />
          </div>
          <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>
            {goalsPct}% completed
          </p>
        </StatCard>

        {/* Habit Streak */}
        <StatCard
          emoji="🔥"
          label="Habit Streak"
          accent="#FED7AA"
          accentText="#C2410C"
        >
          {dashboard.habits.total > 0 ? (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '12px' }}>
                <span style={{ fontSize: '40px', fontWeight: 800, color: '#EA580C' }}>
                  {dashboard.habits.streaks[0]?.streak ?? 0}
                </span>
                <span style={{ fontSize: '14px', color: '#94A3B8' }}>days</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {dashboard.habits.streaks.slice(0, 3).map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>{h.name}</span>
                    <span style={{
                      fontSize: '12px', fontWeight: 700,
                      background: '#FED7AA', color: '#C2410C',
                      padding: '2px 8px', borderRadius: '99px',
                    }}>🔥 {h.streak}d</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '8px' }}>No habits yet. Start one!</p>
          )}
        </StatCard>

        {/* Productivity Score */}
        <StatCard
          emoji="🏆"
          label="Productivity Score"
          value={dashboard.productivityScore}
          sub={dashboard.productivityScore >= 70 ? '🔥 Excellent work!' : '💪 Keep pushing!'}
          accent="#BBF7D0"
          accentText="#15803D"
        >
          <div style={{
            marginTop: '14px',
            background: '#F0FDF4', borderRadius: '12px', padding: '10px 14px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Target</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#15803D' }}>70+</span>
          </div>
        </StatCard>
      </div>

      {/* ── Bottom Row: Mood Tracker + Weekly Snapshot ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Mood Tracker */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#FBCFE8', borderRadius: '99px', padding: '4px 10px', marginBottom: '20px',
          }}>
            <span>😊</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#BE185D' }}>How are you feeling?</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {MOODS.map(({ emoji, label, bg, color }) => (
              <button
                key={label}
                onClick={() => setSelectedMood(label)}
                style={{
                  flex: 1,
                  minWidth: '68px',
                  padding: '12px 6px',
                  borderRadius: '14px',
                  border: selectedMood === label ? `2px solid ${color}` : '2px solid transparent',
                  background: selectedMood === label ? bg : '#F8FAFC',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  cursor: 'pointer',
                  transform: selectedMood === label ? 'scale(1.07)' : 'scale(1)',
                  boxShadow: selectedMood === label ? `0 4px 14px ${bg}` : 'none',
                }}
              >
                <span style={{ fontSize: '22px' }}>{emoji}</span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: selectedMood === label ? color : '#94A3B8' }}>{label}</span>
              </button>
            ))}
          </div>
          {selectedMood && (
            <p style={{ marginTop: '14px', fontSize: '13px', color: '#64748B', textAlign: 'center' }}>
              You're feeling <strong>{selectedMood}</strong> today ✨
            </p>
          )}
        </div>

        {/* Weekly Snapshot */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#C7D2FE', borderRadius: '99px', padding: '4px 10px', marginBottom: '20px',
          }}>
            <span>📊</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#4338CA' }}>Weekly Snapshot</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(dashboard.weeklyProgress || []).slice(-5).map((day, i) => {
              const max = Math.max(...(dashboard.weeklyProgress || []).map(d => d.completedGoals || 0), 1);
              const pct = Math.round(((day.completedGoals || 0) / max) * 100);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '52px', fontSize: '11px', color: '#94A3B8', fontWeight: 600, flexShrink: 0 }}>
                    {day.date}
                  </span>
                  <div style={{ flex: 1, background: '#F1F5F9', borderRadius: '99px', height: '7px' }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${pct}%`,
                        height: '7px',
                        background: 'linear-gradient(90deg, #C7D2FE, #818CF8)',
                      }}
                    />
                  </div>
                  <span style={{ width: '20px', fontSize: '12px', fontWeight: 700, color: '#4338CA', textAlign: 'right', flexShrink: 0 }}>
                    {day.completedGoals || 0}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
