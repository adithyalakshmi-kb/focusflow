import supabase from '../db/supabase.js';
import bcryptjs from 'bcryptjs';

// User model helper functions for Supabase
export const UserModel = {
  // Create a new user
  async create(userData) {
    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(userData.password, salt);

    const { data, error } = await supabase
      .from('users')
      .insert([{
        ...userData,
        password: hashedPassword,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Find by ID
  async findById(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Find by email
  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Update user
  async update(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Delete user
  async delete(userId) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    if (error) throw error;
  },

  // Compare password
  async comparePassword(password, hashedPassword) {
    return bcryptjs.compare(password, hashedPassword);
  },

  // Find by email verification token
  async findByVerificationToken(tokenHash) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email_verification_token', tokenHash)
      .gt('email_verification_expires', new Date().toISOString())
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Find by password reset token
  async findByResetToken(tokenHash) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('password_reset_token', tokenHash)
      .gt('password_reset_expires', new Date().toISOString())
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
};

export default UserModel;

