const BASE = import.meta.env.VITE_API_URL || "";

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Templates
export const getTemplates = () => request("GET", "/api/templates");
export const createTemplate = (data) => request("POST", "/api/templates", data);
export const updateTemplate = (id, data) => request("PUT", `/api/templates/${id}`, data);
export const deleteTemplate = (id) => request("DELETE", `/api/templates/${id}`);

// Runs
export const createRun = (data) => request("POST", "/api/runs", data);
export const getRuns = () => request("GET", "/api/runs");

// Documents
export const getDocuments = () => request("GET", "/api/documents");
export const getDocument = (id) => request("GET", `/api/documents/${id}`);
export const deleteDocument = (id) => request("DELETE", `/api/documents/${id}`);
export const runAgain = (id, correction_prompt, model = "claude-sonnet-4-6") =>
  request("POST", `/api/documents/${id}/run-again`, { correction_prompt, model });
export const downloadUrl = (id) => `${BASE}/api/documents/${id}/download`;
export const streamUrl = (id) => `${BASE}/api/documents/${id}/stream`;
