// Who a request is signed in as: authenticateToken sets it, optionalAuth sets
// it when there is a session, and the role is never in it (requireAdmin asks
// the store)
export interface SessionUser {
  id: number;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}
