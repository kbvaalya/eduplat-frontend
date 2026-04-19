const BASE_URL = "/api/v1";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Таймаут 15 секунд (на случай cold start у Render)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        Array.isArray(data?.detail)
          ? data.detail.map((e) => e.msg).join(", ")
          : data?.detail || "Неизвестная ошибка";
      throw new Error(message);
    }

    return data;
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      throw new Error("Сервер не отвечает. Попробуйте позже.");
    }
    throw err;
  }
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
  deleteMe: () => request("/users/me", { method: "DELETE" }),

  updateAbout: (data) =>
    request("/profile/about", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAbout: () => request("/profile/about"),

  updateAcademic: (data) =>
    request("/profile/academic", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAcademic: () => request("/profile/academic"),

  updateExtracurriculars: (data) =>
    request("/profile/extracurricular", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getExtracurriculars: () => request("/profile/extracurricular"),
  deleteExtracurricular: (id) =>
    request(`/profile/extracurricular/${id}`, { method: "DELETE" }),
};

export const universitiesApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.country)    params.append("country", filters.country);
    if (filters.label)      params.append("label", filters.label);
    if (filters.sort_by)    params.append("sort_by", filters.sort_by);
    if (filters.sort_order) params.append("sort_order", filters.sort_order);
    if (filters.search)     params.append("search", filters.search);
    const query = params.toString();
    // Убран лишний слэш: /universities/ → /universities
    return request(`/universities${query ? "?" + query : ""}`);
  },

  // ВАЖНО: на бэке роут /universities/countries должен быть объявлен
  // ВЫШЕ роута /universities/{id}, иначе FastAPI примет "countries" как id
  getCountries: () => request("/universities/countries"),

  getById: (id) => request(`/universities/${id}`),

  // ВАЖНО: на бэке роут /universities/saved должен быть объявлен
  // ВЫШЕ роута /universities/{id}, иначе FastAPI примет "saved" как id
  getSaved: () => request("/universities/saved"),

  save: (id) => request(`/universities/${id}/save`, { method: "POST" }),
  unsave: (id) => request(`/universities/${id}/save`, { method: "DELETE" }),
};

export const opportunitiesApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type)   params.append("type", filters.type);
    if (filters.search) params.append("search", filters.search);
    const query = params.toString();
    // Убран лишний слэш: /opportunities/ → /opportunities
    return request(`/opportunities${query ? "?" + query : ""}`);
  },

  getById: (id) => request(`/opportunities/${id}`),

  // ВАЖНО: на бэке роут /opportunities/saved должен быть объявлен
  // ВЫШЕ роута /opportunities/{id}
  getSaved: () => request("/opportunities/saved"),

  save: (id) => request(`/opportunities/${id}/save`, { method: "POST" }),
  unsave: (id) => request(`/opportunities/${id}/save`, { method: "DELETE" }),
};

export const dashboardApi = {
  // Убран лишний слэш: /dashboard/ → /dashboard
  get: () => request("/dashboard"),
};

export const notificationsApi = {
  // Убран лишний слэш: /notifications/ → /notifications
  getAll: () => request("/notifications"),
  markRead: (id) => request(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () => request("/notifications/read-all", { method: "PATCH" }),
};

export const essayApi = {
  analyze: (text) =>
    request("/motivation-letter/analyze", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
};