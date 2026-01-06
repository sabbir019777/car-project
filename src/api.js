
export const API_BASE = "https://car-rental-plantform.vercel.app";

export const endpoint = (path) => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE}${cleanPath}`;
};

export default endpoint;