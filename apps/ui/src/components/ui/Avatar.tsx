import { useMemo, useState } from 'react';
import { identiconUri } from './identicon';

// One avatar for the whole app. When a person has no picture (or theirs fails
// to load) it shows an identicon drawn from their user id: a small symmetric
// pattern in one colour, like GitHub's default avatar. The id never changes, so
// the pattern stays the same when the person renames themselves, and it says
// nothing about who they are.

interface AvatarProps {
  url: string | null | undefined;
  userId: number;
  /** Rendered box size in px. The border scales from it. */
  size?: number;
  className?: string;
}

export function Avatar({ url, userId, size = 40, className = '' }: AvatarProps) {
  // The url whose image failed to load. Kept per url, so a new picture (after
  // an upload) is tried again instead of staying on the identicon.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const identicon = useMemo(() => identiconUri(userId), [userId]);

  const box = { width: size, height: size };
  const ring = size >= 56 ? 'border-[3px]' : 'border-2';
  const base = `rounded-full flex-shrink-0 border-[var(--border)] ${ring} ${className}`;

  if (url && url !== failedUrl) {
    return (
      <img
        src={url}
        alt=""
        style={box}
        className={`${base} object-cover`}
        onError={() => setFailedUrl(url)}
      />
    );
  }
  return (
    <img
      src={identicon}
      alt=""
      style={box}
      className={`${base} bg-[var(--surface2)] select-none`}
      data-testid="identicon"
      aria-hidden
    />
  );
}
