import { useState, useCallback, useRef, useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import {
  createTerminalSession,
  execTerminalCommand,
  destroyTerminalSession,
} from '../services/terminalService';
import { setRunWait, withRunWait } from './useRunWait';

export interface TerminalLine {
  type: 'input' | 'output' | 'system';
  text: string;
  prompt?: string;
}

export function useTerminalSession(
  courseKey: string,
  lessonSlug: string,
  onCommandRun?: () => void,
) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'ro' ? 'ro' : 'en';
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [cwd, setCwd] = useState('/home/student');
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const sessionRef = useRef<string | null>(null);
  const onCommandRunRef = useRef(onCommandRun);
  // The terminal's entry in the notice about a command waiting for a sandbox,
  // and the latest execute, which its Try again calls
  const runner = useId();
  const executeRef = useRef<(command: string) => Promise<void>>(async () => {});
  useEffect(() => {
    onCommandRunRef.current = onCommandRun;
  }, [onCommandRun]);

  const init = useCallback(async () => {
    if (!courseKey || !lessonSlug) return;
    setIsReady(false);
    setLines([]);
    try {
      const info = await createTerminalSession(courseKey, lessonSlug, lang);
      setSessionId(info.sessionId);
      sessionRef.current = info.sessionId;
      setCwd(info.cwd);
      if (info.intro) {
        setLines([{ type: 'system', text: info.intro }]);
      }
      setIsReady(true);
    } catch (e: unknown) {
      setLines([
        {
          type: 'system',
          text: i18next.t('terminal.startFailed', {
            reason: e instanceof Error ? e.message : i18next.t('common.somethingWrong'),
          }),
        },
      ]);
    }
  }, [courseKey, lessonSlug, lang]);

  useEffect(() => {
    if (!courseKey || !lessonSlug) return;
    init();
    return () => {
      if (sessionRef.current) {
        destroyTerminalSession(sessionRef.current).catch(() => {});
        sessionRef.current = null;
      }
    };
  }, [init, courseKey, lessonSlug]);

  const execute = useCallback(
    async (command: string) => {
      if (!sessionRef.current || isExecuting) return;
      setIsExecuting(true);
      const snap = `student@sandbox:${cwd.replace('/home/student', '~')}$`;
      setLines((prev) => [...prev, { type: 'input', text: command, prompt: snap }]);
      try {
        const session = sessionRef.current;
        const result = await withRunWait(
          runner,
          (runId) => execTerminalCommand(session, command, runId),
          () => void executeRef.current(command),
        );
        if (result.output) {
          setLines((prev) => [...prev, { type: 'output', text: result.output }]);
        }
        setCwd(result.cwd);
        onCommandRunRef.current?.();
      } catch (e: unknown) {
        setLines((prev) => [
          ...prev,
          {
            type: 'output',
            text: e instanceof Error ? e.message : i18next.t('common.somethingWrong'),
          },
        ]);
      }
      setIsExecuting(false);
    },
    [isExecuting, cwd, runner],
  );
  useEffect(() => {
    executeRef.current = execute;
  }, [execute]);
  useEffect(() => () => setRunWait(runner, null), [runner]);

  const reset = useCallback(async () => {
    if (sessionRef.current) {
      await destroyTerminalSession(sessionRef.current).catch(() => {});
      sessionRef.current = null;
    }
    setSessionId(null);
    await init();
  }, [init]);

  return {
    sessionId,
    cwd,
    lines,
    isReady,
    isExecuting,
    execute,
    reset,
  };
}
