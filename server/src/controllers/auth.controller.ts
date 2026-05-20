import type { Request, Response } from 'express';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import type { RegisterInput, LoginInput } from '../validators/auth.schema';
import type { AuthPayload, AuthenticatedRequest } from '../types';

function signToken(payload: AuthPayload): string {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as RegisterInput;

  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict('A user with this email already exists');

  const user = await User.create({
    name,
    email,
    password,
    role: role ?? 'SalesUser',
  });

  const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });

  res.status(201).json({
    success: true,
    data: {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;

  const user = await User.findOne({ email }).select('+password');
  if (!user) throw ApiError.unauthorized('Invalid credentials');

  const ok = await user.comparePassword(password);
  if (!ok) throw ApiError.unauthorized('Invalid credentials');

  const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user) throw ApiError.unauthorized();
  const user = await User.findById(authReq.user.id);
  if (!user) throw ApiError.notFound('User not found');
  res.json({
    success: true,
    data: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
