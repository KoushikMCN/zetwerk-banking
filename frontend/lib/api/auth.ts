import { apiFetch } from './client';
import type {
  AuthMessageResponse,
  CurrentUser,
} from '@/types/api';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
}

export function login(data: LoginRequest) {
  return apiFetch<AuthMessageResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function register(data: RegisterRequest) {
  return apiFetch<AuthMessageResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function logout() {
  return apiFetch<AuthMessageResponse>('/auth/logout', {
    method: 'POST',
  });
}

export function getCurrentUser() {
  return apiFetch<CurrentUser>('/auth/me');
}