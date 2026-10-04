export type OwnedQuestion = { token: string; sessionId: string; path: string; submittedAt: string };
export type QuestionOwnership = Record<string, OwnedQuestion>;
const key = 'tf-question-ownership-v1';
export function readQuestionOwnership(): QuestionOwnership {
 try {
  const stored = JSON.parse(localStorage.getItem(key) ?? '{}');
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {};
  return Object.fromEntries(Object.entries(stored).filter(([id, value]) => {
   const owner = value as Partial<OwnedQuestion> | null;
   return /^[a-f0-9-]{36}$/i.test(id) && owner && typeof owner.token === 'string' && /^[a-f0-9]{64}$/.test(owner.token) && typeof owner.sessionId === 'string' && typeof owner.path === 'string' && typeof owner.submittedAt === 'string';
  })) as QuestionOwnership;
 } catch { return {}; }
}
export function writeQuestionOwnership(ownership: QuestionOwnership) {
 try { localStorage.setItem(key, JSON.stringify(ownership)); return true; } catch { return false; }
}
export function newDeletionToken() {
 return Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => byte.toString(16).padStart(2, '0')).join('');
}
