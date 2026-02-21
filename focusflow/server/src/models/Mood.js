import supabase from '../db/supabase.js';

export const MoodModel = {
  async create(moodData) {
    const { data, error } = await supabase
      .from('moods')
      .insert([{ ...moodData, created_at: new Date().toISOString() }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async findByUser(userId, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async findTodayMood(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async getStats(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('moods')
      .select('rating')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    if (!data || data.length === 0) {
      return { averageRating: 0, count: 0 };
    }

    const sum = data.reduce((acc, mood) => acc + mood.rating, 0);
    return {
      averageRating: (sum / data.length).toFixed(1),
      count: data.length,
    };
  },
};

export default MoodModel;
