import supabase from '../db/supabase.js';

export const SessionModel = {
  async create(sessionData) {
   const { data, error } = await supabase
      .from('sessions')
      .insert([{ ...sessionData, created_at: new Date().toISOString() }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async findById(sessionId, userId) {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async findByUser(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async update(sessionId, userId, updates) {
    const { data, error } = await supabase
      .from('sessions')
      .update(updates)
      .eq('id', sessionId)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getStats(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('sessions')
      .select('focus_minutes')
      .eq('user_id', userId)
      .eq('type', 'work')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    if (!data || data.length === 0) {
      return { totalFocusMinutes: 0, sessionsCount: 0 };
    }

    const totalMinutes = data.reduce((acc, session) => acc + (session.focus_minutes || 0), 0);
    return {
      totalFocusMinutes: totalMinutes,
      sessionsCount: data.length,
      averagePerSession: (totalMinutes / data.length).toFixed(1),
    };
  },
};

export default SessionModel;

