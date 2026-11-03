import * as repo from '../repositories/polls.repository.js';
import { pushLive } from './notifications.service.js';
import type { PollResultsDTO } from '@cyberstars/shared/polls';

// Polls are rare, so the admin page's history is the last 50, unpaged
const POLL_HISTORY = 50;

// A poll for every account but the sender's, sent like an announcement: one
// insert, live only to those online, and it throws when the insert fails
export async function send(authorId: number, question: string, options: string[]) {
  const rows = await repo.createPoll(authorId, question, options);
  await pushLive(rows);
  return rows.length;
}

// The latest polls with their counts, newest first, for the admin page
export async function list(): Promise<PollResultsDTO[]> {
  const rows = await repo.listPolls(POLL_HISTORY);
  return rows.map((p) => ({
    id: p.id,
    question: p.question,
    authorName: p.author?.name ?? null,
    createdAt: p.createdAt.toISOString(),
    recipients: p.recipients,
    voters: p.voters,
    options: p.options.map((o) => ({ id: o.id, text: o.text, votes: o.votes })),
  }));
}
