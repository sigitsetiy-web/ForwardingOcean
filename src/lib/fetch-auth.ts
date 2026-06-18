/**
 * Authenticated fetch wrapper.
 * Automatically adds x-user-id header from localStorage.
 */
export async function fetchAuth(url: string, options: RequestInit = {}): Promise<Response> {
  let userId = "";
  
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("fms_user");
      if (stored) {
        const user = JSON.parse(stored);
        userId = user.id || "";
      }
    } catch {}
  }

  const headers = new Headers(options.headers || {});
  if (userId) {
    headers.set("x-user-id", userId);
  }
  if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, { ...options, headers });
}
