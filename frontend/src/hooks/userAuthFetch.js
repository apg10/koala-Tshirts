import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

/** Wrapper opcional si quieres seguir usando la misma firma. */
export function useAuthFetch() {
  const { logout } = useAuth();

  return async (method, path, data = null) => {
    try {
      const res = await api.request({ method, url: path, data });
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) logout();
      throw err;
    }
  };
}
