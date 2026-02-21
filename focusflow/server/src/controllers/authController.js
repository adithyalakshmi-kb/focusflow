import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailUtils.js';
import { generateRandomToken } from '../utils/helpers.js';
import crypto from 'crypto';

export const register = async (req, res, next) => {
  try {
    const { email, password, displayName } = req.validatedBody;

    // Check if user exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate email verification token
    const verificationToken = generateRandomToken();
    const verificationTokenHash = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    // Create user
    const user = await UserModel.create({
      email,
      password,
      display_name: displayName || email.split('@')[0],
      email_verification_token: verificationTokenHash,
      email_verification_expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedBody;

    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isPasswordValid = await UserModel.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        emailVerified: user.email_verified,
        darkMode: user.dark_mode,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserModel.findByVerificationToken(tokenHash);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    await UserModel.update(user.id, {
      email_verified: true,
      email_verification_token: null,
      email_verification_expires: null,
    });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = generateRandomToken();
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await UserModel.update(user.id, {
      password_reset_token: resetTokenHash,
      password_reset_expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
    });

    try {
      await sendPasswordResetEmail(email, resetToken);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      await UserModel.update(user.id, {
        password_reset_token: null,
        password_reset_expires: null,
      });
      return res.status(500).json({ message: 'Failed to send reset email' });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserModel.findByResetToken(tokenHash);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    await UserModel.update(user.id, {
      password: newPassword,
      password_reset_token: null,
      password_reset_expires: null,
    });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: oldRefreshToken } = req.body;

    if (!oldRefreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

export default {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
};
