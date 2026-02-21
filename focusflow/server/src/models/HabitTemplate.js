import { supabase } from '../db/supabase.js';

const HabitTemplateModel = {
  async findAll() {
    const { data, error } = await supabase
      .from('habit_templates')
      .select('*')
      .order('popularity', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async findByCategory(category) {
    const { data, error } = await supabase
      .from('habit_templates')
      .select('*')
      .eq('category', category)
      .order('popularity', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('habit_templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(templateData) {
    const { data, error } = await supabase
      .from('habit_templates')
      .insert([templateData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('habit_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('habit_templates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async incrementPopularity(id) {
    const template = await this.findById(id);
    
    const { data, error } = await supabase
      .from('habit_templates')
      .update({ popularity: (template.popularity || 0) + 1 })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export default HabitTemplateModel;
