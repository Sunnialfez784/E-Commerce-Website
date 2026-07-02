const ADMIN_SESSION_KEY = "ecommerce-admin-session";

export function getAdminSession() {
  try {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
}

export function setAdminSession(data) {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(data));
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  localStorage.removeItem('accessToken')
}

export function isAdminAuthenticated() {
  const session = getAdminSession();
  return session?.role === "admin";
}