import supabase from '../db/supabase.js';

export const GoalModel = {
  async findAll(userId, completed) {
    let query = supabase.from('goals').select('*').eq('user_id', userId);
    
    if (completed !== undefined) {
      query = query.eq('completed', completed);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(goalData) {
    const { data, error } = await supabase
      .from('goals')
      .insert([{ ...goalData, created_at: new Date().toISOString() }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async findById(goalId, userId) {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('id', goalId)
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async update(goalId, userId, updates) {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', goalId)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(goalId, userId) {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId)
      .eq('user_id', userId);
    if (error) throw error;
  },
};

export default GoalModel;

