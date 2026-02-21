import supabase from '../db/supabase.js';

export const HabitModel = {
  async findAll(userId, category, isActive) {
    let query = supabase.from('habits').select('*').eq('user_id', userId);

    if (category) query = query.eq('category', category);
    if (isActive !== undefined) query = query.eq('is_active', isActive);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(habitData) {
    const { data, error } = await supabase
      .from('habits')
      .insert([{ ...habitData, created_at: new Date().toISOString() }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async findById(habitId, userId) {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('id', habitId)
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async update(habitId, userId, updates) {
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', habitId)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(habitId, userId) {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId)
      .eq('user_id', userId);
    if (error) throw error;
  },

  async getCompletions(habitId) {
    const { data, error } = await supabase
      .from('habit_completions')
      .select('*')
      .eq('habit_id', habitId)
      .order('completion_date', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addCompletion(habitId, userId, completionData) {
    const { data, error } = await supabase
      .from('habit_completions')
      .insert([{
        habit_id: habitId,
        user_id: userId,
        ...completionData,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

export default HabitModel;

