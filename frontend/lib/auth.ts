const KEYS = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
  userRole: "user_role",
  userId: "user_id",
  userName: "user_name",
  userCredential: "user_credential",
} as const;

export function saveTokens(
  access: string,
  refresh: string,
  role: string,
  userId: string,
  name?: string
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.accessToken, access);
  localStorage.setItem(KEYS.refreshToken, refresh);
  localStorage.setItem(KEYS.userRole, role);
  if (userId) localStorage.setItem(KEYS.userId, userId);
  if (name) localStorage.setItem(KEYS.userName, name);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.accessToken);
}

export function getRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.userRole);
}

export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.userId);
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.accessToken);
  localStorage.removeItem(KEYS.refreshToken);
  localStorage.removeItem(KEYS.userRole);
  localStorage.removeItem(KEYS.userId);
  localStorage.removeItem(KEYS.userName);
  localStorage.removeItem(KEYS.userCredential);
}

export function saveUserCredential(credential: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.userCredential, credential);
}

export function getUserCredential(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.userCredential);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
