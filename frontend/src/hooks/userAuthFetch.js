import { useAuth } from "../context/AuthContext";
import { request } from "../api/request";

/** hook that injects JWT automatically */
export function useAuthFetch() {
  const { token, logout } = useAuth();

  return async (path, opts = {}) => {
    try {
      return await request(path, opts, token);
    } catch (e) {
      if (e.message.startsWith("HTTP 401")) logout();
      throw e;
    }
  };
}
