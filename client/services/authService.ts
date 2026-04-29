import { api } from "./apiClient";
import type { AuthenticatedUser as User, LoginPayload, SignupPayload } from "../../shared/auth";

export function login(payload: LoginPayload) {
  return api.post<{ message: string }>("/auth/login", payload);
}

export function signup(payload: SignupPayload) {
  return api.post<{ message: string }>("/auth/signup", payload);
}

export function logout() {
  return api.post<{ message: string }>("/auth/logout");
}

export function getMe() {
  return api.get<User>("/auth/me");
}
