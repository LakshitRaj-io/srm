import type { AssistantRequest, AssistantResponse } from "./assistant-types";

export class AssistantUnavailable extends Error {}

// Calls the server route. Throws AssistantUnavailable when the route itself can't be reached,
// and an Error with the route's message for rejected input (too long, empty and so on).
export async function askAssistant(body: AssistantRequest, signal?: AbortSignal): Promise<AssistantResponse> {
  let res: Response;
  try {
    res = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new AssistantUnavailable("network");
  }
  if (res.status >= 500) throw new AssistantUnavailable(String(res.status));
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error((data as { error?: string } | null)?.error ?? "Something went wrong.");
  if (!data || typeof data !== "object" || !Array.isArray((data as AssistantResponse).programmes)) throw new AssistantUnavailable("shape");
  return data as AssistantResponse;
}

export async function aiConfigured(): Promise<boolean | null> {
  try {
    const r = await fetch("/api/assistant", { method: "GET" });
    return r.ok ? Boolean((await r.json()).configured) : null;
  } catch {
    return null;
  }
}
