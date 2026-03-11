const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

export function token() {
  return localStorage.getItem("token");
}

export function user() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function saveAuth(data) {
  const authToken = data?.token || data?.data?.token || data?.accessToken;
  const authUser = data?.user || data?.data?.user || data?.profile || null;

  if (!authToken) {
    throw new Error("Token not returned from server");
  }

  localStorage.setItem("token", authToken);

  if (authUser) {
    localStorage.setItem("user", JSON.stringify(authUser));
  }
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (auth && token()) {
    headers.Authorization = `Bearer ${token()}`;
  }

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

export async function uploadFile(path, file, extra = {}) {
  const form = new FormData();
  form.append("file", file);

  Object.entries(extra).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      form.append(key, value);
    }
  });

  const data = await api(path, {
    method: "POST",
    body: form,
    auth: true,
  });

  if (!data?.url) {
    throw new Error(data?.message || "Upload failed");
  }

  return data.url;
}

export { API };