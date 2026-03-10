const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:8000";

type RequestOptions = {
  method?: string;
  token?: string | null;
  body?: BodyInit | null;
  headers?: HeadersInit;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body,
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) {
    return null;
  }
  return `${API_URL}${path}`;
}

export { API_URL };
