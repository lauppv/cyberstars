import { useState, useCallback, useRef, useEffect } from 'react';
import i18next from 'i18next';
import type { RunLesson } from '@cyberstars/shared/lesson';
import { localizeRunOutput } from '../i18n/serverMessages';

function wsUrl(): string {
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${location.host}/ws/run`;
}

const OUTPUT_DISPLAY_MAX = 256 * 1024;

function appendCapped(prev: string, chunk: string): string {
  const next = prev + chunk;
  if (next.length <= OUTPUT_DISPLAY_MAX) return next;
  const kept = next.slice(-OUTPUT_DISPLAY_MAX);
  const nlIdx = kept.indexOf('\n');
  const trimmed = nlIdx >= 0 ? kept.slice(nlIdx + 1) : kept;
  return `${i18next.t('code.outputTruncated')}\n${trimmed}`;
}

export function useCodeExecution(onExit?: (code: number | undefined) => void) {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const sendInputRef = useRef<((data: string) => void) | null>(null);
  const onExitRef = useRef(onExit);
  useEffect(() => {
    onExitRef.current = onExit;
  }, [onExit]);

  // `lesson`: the lesson the code belongs to, so a challenge with a hidden part
  // runs the student's function inside it.
  const execute = useCallback((code: string, language: string, lesson?: RunLesson) => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsRunning(true);
    setOutput('');

    const ws = new WebSocket(wsUrl());
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'run', code, language, ...(lesson && { lesson }) }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data as string) as {
        type: string;
        data?: string;
        code?: number;
      };
      if (msg.type === 'stdout') {
        setOutput((prev) => appendCapped(prev, msg.data ?? ''));
      } else if (msg.type === 'stderr') {
        // The server's own notes (a time limit, a refused run) come this way too
        setOutput((prev) => appendCapped(prev, localizeRunOutput(msg.data ?? '')));
      } else if (msg.type === 'exit') {
        setIsRunning(false);
        sendInputRef.current = null;
        ws.close();
        wsRef.current = null;
        onExitRef.current?.(msg.code);
      }
    };

    ws.onerror = () => {
      setOutput((prev) => `${prev}\n${i18next.t('code.connectionError')}\n`);
      setIsRunning(false);
      sendInputRef.current = null;
    };

    ws.onclose = () => {
      setIsRunning(false);
      sendInputRef.current = null;
      wsRef.current = null;
    };

    sendInputRef.current = (data: string) => {
      if (ws.readyState === WebSocket.OPEN) {
        setOutput((prev) => appendCapped(prev, data));
        ws.send(JSON.stringify({ type: 'stdin', data }));
      }
    };
  }, []);

  // Leaving the page mid-run ends the run: the server only stops the program,
  // and frees the container for the next run, once this socket closes.
  useEffect(() => () => wsRef.current?.close(), []);

  const sendInput = useCallback((data: string) => {
    sendInputRef.current?.(data);
  }, []);

  const clearOutput = useCallback(() => {
    setOutput('');
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    sendInputRef.current = null;
  }, []);

  return { output, isRunning, execute, sendInput, clearOutput };
}
