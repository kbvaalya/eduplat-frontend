const BASE_URL = "http://localhost:8000/api/v1"; 
/* вот здесь когда будешь локально эндпоинты связывать прокинь вот этот url: 
http://localhost:8000/api/v1
А тот который здесь убери, я его чисто ради деплоя воткнул. 
А кста я эндпоинты прокинул в login и register, вроде все норм работает
*/

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
      data?.detail ||
      (Array.isArray(data?.detail)
        ? data.detail.map((e) => e.msg).join(", ")
        : "Неизвестная ошибка");
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