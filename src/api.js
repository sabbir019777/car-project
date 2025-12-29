// Central API base for frontend. Uses Vite env var VITE_API_BASE when set.
export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:3000";

export const endpoint = (path) => `${API_BASE}${path}`;

export default endpoint;
