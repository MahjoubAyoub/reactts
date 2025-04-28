export type UserRole = 'user' | 'admin';

export interface CustomUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  token?: string;
}

export function isAdmin(user: CustomUser | null): boolean {
  return user?.role === 'admin';
}