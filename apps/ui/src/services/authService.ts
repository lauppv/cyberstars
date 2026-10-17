import i18next from 'i18next';
import { api } from './apiClient';
import type {
  AuthenticatedUser as User,
  LoginPayload,
  SignupPayload,
} from '@cyberstars/shared/auth';

export function login(payload: LoginPayload) {
  return api.post<{ message: string }>('/auth/login', payload);
}

export function signup(payload: SignupPayload) {
  return api.post<{ message: string }>('/auth/signup', payload);
}

export function logout() {
  return api.post<{ message: string }>('/auth/logout');
}

export function getMe() {
  return api.get<User>('/auth/me');
}

export function forgotPassword(email: string) {
  return api.post<{ message: string }>('/auth/forgot-password', {
    email,
    lang: i18next.language === 'ro' ? 'ro' : 'en',
  });
}

export function resetPassword(email: string, code: string, password: string) {
  return api.post<{ message: string }>('/auth/reset-password', { email, code, password });
}
