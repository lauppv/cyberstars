// DTOs for the connection ("connect with another player") system. A connection
// is a directed request (requester -> addressee) that becomes mutual once
// accepted. The DB is the source of truth; the shared /ws/user socket only
// carries the bell notifications that announce a request / acceptance.

export interface ConnectionUser {
  id: number;
  name: string;
  avatarUrl: string | null;
}

// A pending request, shaped from the viewer's perspective: `user` is always the
// other party (the requester for incoming, the addressee for outgoing).
export interface PendingConnection {
  id: number; // connection row id
  user: ConnectionUser;
  createdAt: string; // ISO
}

// An established (accepted) connection: `user` is the other party.
export interface AcceptedConnection {
  id: number; // connection row id
  user: ConnectionUser;
  since: string; // ISO of when it was accepted (respondedAt)
}

// Everything the /connections page needs in one call.
export interface ConnectionsOverview {
  connections: AcceptedConnection[];
  incoming: PendingConnection[]; // requests awaiting this user's response
  outgoing: PendingConnection[]; // requests this user sent, still pending
}

// The viewer's relationship to a profile they're looking at, used to render the
// right button on the public profile. `self` when viewing your own profile.
export type ConnectionRelation =
  | 'self'
  | 'none'
  | 'pending_outgoing'
  | 'pending_incoming'
  | 'connected';
