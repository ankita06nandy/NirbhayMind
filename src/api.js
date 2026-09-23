const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export function getDashboard(victimId) {
  return request(`/api/v1/dashboard/${encodeURIComponent(victimId)}`);
}

export function login(victimId, caseId) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ victimId, caseId })
  });
}

export function createCheckin(victimId, answers) {
  return request(`/api/v1/victims/${encodeURIComponent(victimId)}/checkins`, {
    method: "POST",
    body: JSON.stringify(answers)
  });
}

export function sendChatMessage(message) {
  return request("/api/v1/chat", {
    method: "POST",
    body: JSON.stringify({ message })
  });
}
