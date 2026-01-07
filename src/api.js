const envBase = import.meta.env.VITE_BACKEND_URL;
export const API_BASE = envBase
  ? envBase
  : import.meta.env.DEV
  ? "http://localhost:3000"
  : window.location.origin;

export const endpoint = (path) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
};

export default endpoint;
