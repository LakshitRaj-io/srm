// Shapes shared by the /api/assistant route and its clients. Kept free of catalogue imports so
// the site-wide Guide does not ship the whole programme list to every page.

export type AssistantMode = "programmes" | "guide";
export type ChatTurn = { role: "user" | "assistant"; text: string };

export type AssistantRequest = {
  mode: AssistantMode;
  question: string;
  history?: ChatTurn[];
  level?: string;
  duration?: string;
};

export type ProgrammeResult = { id: string; name: string; url: string; level: string[]; duration: string | null; fee: string | null; intake: string | null; reason: string };
export type PageResult = { id: string; title: string; href: string; external: boolean; summary: string };

// source "ai": chosen and explained by the model from catalogue candidates.
// source "local": keyword matches from the catalogue, no AI involved.
export type AssistantNotice = "not-configured" | "provider-error" | "timeout" | "rate-limited";
export type AssistantResponse = {
  source: "ai" | "local";
  notice?: AssistantNotice;
  answer: string;
  programmes: ProgrammeResult[];
  pages: PageResult[];
};

export const LIMITS = { question: 400, historyTurns: 4, historyText: 500, body: 6000 } as const;

export const NOTICE_TEXT: Record<AssistantNotice, string> = {
  "not-configured": "AI isn't switched on for this site, so these are keyword matches, not AI answers.",
  "provider-error": "The AI service didn't respond properly, so these are keyword matches instead.",
  timeout: "The AI service took too long, so these are keyword matches instead.",
  "rate-limited": "You've asked a lot of questions in a short time, so these are keyword matches. AI answers return in a few minutes.",
};
