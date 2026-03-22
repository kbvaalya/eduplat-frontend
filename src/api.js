const BASE_URL = "http://localhost:8000/api/v1";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      Array.isArray(data?.detail)
        ? data.detail.map((e) => e.msg).join(", ")
        : data?.detail || "Неизвестная ошибка";
    throw new Error(message);
  }

  return data;
}

export const authApi = {
  register: (email, password, confirm_password) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, confirm_password }),
    }),

  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

export const userApi = {
  getMe: () => request("/users/me"),

  updateAbout: (data) =>
    request("/users/me/about", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  updateAcademic: (data) =>
    request("/users/me/academic", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  updateExtracurriculars: (data) =>
    request("/users/me/extracurriculars", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export const universitiesApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.country) params.append("country", filters.country);
    if (filters.difficulty) params.append("difficulty", filters.difficulty);
    if (filters.minGpa) params.append("min_gpa", filters.minGpa);
    const query = params.toString();
    return request(`/universities${query ? "?" + query : ""}`);
  },

  getCountries: () => request("/universities/countries"),
};