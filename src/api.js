// src/api.js
// সরাসরি প্রোডাকশন লিঙ্ক দিয়ে দিন যাতে কোনো ভুল না হয়
export const API_BASE = "https://car-rental-plantform.vercel.app";

export const endpoint = (path) => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE}${cleanPath}`;
};

export default endpoint;