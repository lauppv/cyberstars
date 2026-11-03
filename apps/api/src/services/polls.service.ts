import { AppError } from '@cyberstars-framework/server-kit/errors';
import * as repo from '../repositories/polls.repository.js';
import * as userRepo from '../repositories/user.repository.js';
import { notify, pushLive } from './notifications.service.js';
import type { PollDTO, PollResultsDTO } from '@cyberstars/shared/polls';

// Polls are rare, so the admin page's history is the last 50, unpaged
const POLL_HISTORY = 50;

// A poll for every account but the sender's, sent like an announcement: one
// insert, live only to those online, and it throws when the insert fails
export async function send(authorId: number, question: string, options: string[], other = false) {
  const rows = await repo.createPoll(authorId, question, options, other);
  await pushLive(rows);
  return rows.length;
}

// Only an account it went to opens it: everyone but the author who was here
// when it was sent, so voters never outgrow recipients
async function received(id: number, userId: number) {
  const [poll, joined] = await Promise.all([repo.findPoll(id, userId), repo.joinedAt(userId)]);
  if (!poll || poll.authorId === userId || !joined || joined > poll.createdAt) {
    throw new AppError(404, 'Poll not found');
  }
  return poll;
}

// The poll as a student opens it, no counts. Opening it counts them among its
// viewers, and a failure there is only logged, the poll still opens
export async function get(id: number, userId: number): Promise<PollDTO> {
  const poll = await received(id, userId);
  try {
    await repo.noteView(id, userId);
  } catch (err) {
    console.error(`[polls] poll ${id} opened without counting the view:`, err);
  }
  return {
    id: poll.id,
    question: poll.question,
    options: poll.options,
    voted: poll.voted.length > 0,
  };
}

// What was written under Other reaches the admins' and the founder's bells
// with no actor, so the row doesn't say who wrote it, and never fails the vote
async function tellAdmins(pollId: number, question: string, answer: string, writer: number) {
  try {
    const admins = await userRepo.getAdminIds();
    await notify({
      recipientIds: admins.filter((id) => id !== writer),
      type: 'POLL_ANSWER',
      entityId: pollId,
      data: { text: answer, title: question },
    });
  } catch (err) {
    console.error(`[polls] the answer to poll ${pollId} reached no bell:`, err);
  }
}

// An answer goes with Other ticked and only then
export async function vote(
  id: number,
  userId: number,
  optionIds: number[],
  answer?: string,
): Promise<void> {
  const poll = await received(id, userId);
  const own = new Set(poll.options.map((o) => o.id));
  if (!optionIds.every((o) => own.has(o))) throw new AppError(400, 'Pick options from this poll');
  const other = poll.options.find((o) => o.writeIn);
  const writes = !!other && optionIds.includes(other.id);
  if (writes && !answer) throw new AppError(400, 'Write your answer under Other');
  if (!writes && answer) throw new AppError(400, 'Tick Other to write your own answer');
  if (!(await repo.vote(id, userId, optionIds, answer))) {
    throw new AppError(409, 'You already voted in this poll');
  }
  if (answer) await tellAdmins(id, poll.question, answer, userId);
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
    viewers: p.countsViewers ? p.viewers : null,
    options: p.options.map((o) => ({ id: o.id, text: o.text, votes: o.votes, writeIn: o.writeIn })),
    answers: p.answers.map((a) => a.text),
  }));
}
