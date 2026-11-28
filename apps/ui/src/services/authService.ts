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

// The page's language, which the emails the server sends are written in
function emailLang(): 'en' | 'ro' {
  return i18next.language === 'ro' ? 'ro' : 'en';
}

export function signup(payload: SignupPayload) {
  return api.post<{ message: string }>('/auth/signup', { ...payload, lang: emailLang() });
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
    lang: emailLang(),
  });
}

export function resetPassword(email: string, code: string, password: string) {
  return api.post<{ message: string }>('/auth/reset-password', { email, code, password });
}

// The link from the confirmation email; it needs no session
export function confirmEmail(token: string) {
  return api.post<{ message: string }>('/auth/confirm-email', { token });
}

// A new confirmation link to the signed-in account's email
export function resendConfirmation() {
  return api.post<{ message: string }>('/auth/confirm-email/resend', { lang: emailLang() });
}
