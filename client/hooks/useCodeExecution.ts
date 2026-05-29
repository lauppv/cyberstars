import { useState, useCallback, useRef } from 'react';

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
  return '... (output truncated) ...\n' + trimmed;
}

export function useCodeExecution() {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const sendInputRef = useRef<((data: string) => void) | null>(null);

  const execute = useCallback((code: string, language: string) => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsRunning(true);
    setOutput('');

    const ws = new WebSocket(wsUrl());
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'run', code, language }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data as string) as {
        type: string;
        data?: string;
        code?: number;
      };
      if (msg.type === 'stdout' || msg.type === 'stderr') {
        setOutput((prev) => appendCapped(prev, msg.data ?? ''));
      } else if (msg.type === 'exit') {
        setIsRunning(false);
        sendInputRef.current = null;
        ws.close();
        wsRef.current = null;
      }
    };

    ws.onerror = () => {
      setOutput((prev) => prev + '\nConnection error.\n');
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
