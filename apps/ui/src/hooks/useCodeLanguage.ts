import { useCallback, useState } from 'react';
import {
  DEFAULT_CODE_LANGUAGE,
  isCodeLanguage,
  type CodeLanguage,
} from '@cyberstars/shared/constants';
import { useAuth } from '../context/AuthContext';
import * as profileService from '../services/profileService';

const STORAGE_KEY = 'cyberstars.codeLanguage';

function storedLanguage(): CodeLanguage | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isCodeLanguage(value) ? value : null;
  } catch {
    return null;
  }
}

// The language a multi-language course's lessons open in: the one picked last,
// kept on the account for a signed-in student (so another device opens it too)
// and on the device for a guest, Python until one is picked.
export function useCodeLanguage(): [CodeLanguage, (language: CodeLanguage) => void] {
  const { user, refreshUser } = useAuth();
  // This page's pick holds while the account catches up with it.
  const [picked, setPicked] = useState<CodeLanguage | null>(null);
  const language = picked ?? user?.codeLanguage ?? storedLanguage() ?? DEFAULT_CODE_LANGUAGE;

  const pick = useCallback(
    (next: CodeLanguage) => {
      setPicked(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // storage blocked: the pick lasts for this page
      }
      if (user) {
        profileService
          .saveCodeLanguage(next)
          .then(refreshUser)
          .catch(() => {});
      }
    },
    [user, refreshUser],
  );

  return [language, pick];
}
