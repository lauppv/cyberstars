import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCodeSave } from './useCodeSave';

vi.mock('react-i18next', () => {
  const t = (key: string) => key;
  return { useTranslation: () => ({ t }) };
});

const save = vi.fn<(code: string) => Promise<void>>();

function renderSave(savedCodeFailed = false, lessonKey = 'python/py-1/') {
  return renderHook((props) => useCodeSave(save, props.savedCodeFailed, props.lessonKey), {
    initialProps: { savedCodeFailed, lessonKey },
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  save.mockReset();
  save.mockResolvedValue(undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('useCodeSave', () => {
  it('says the code was saved for a moment', async () => {
    const { result } = renderSave();
    await act(() => result.current.save('print(1)'));
    expect(save).toHaveBeenCalledWith('print(1)');
    expect(result.current.saved).toBe(true);
    expect(result.current.error).toBeNull();
    act(() => vi.advanceTimersByTime(2000));
    expect(result.current.saved).toBe(false);
  });

  it("shows the server's reason when a save fails, until the next one works", async () => {
    save.mockRejectedValueOnce(new Error('Lecția nu există'));
    const { result } = renderSave();
    await act(() => result.current.save('print(1)'));
    expect(result.current.error).toBe('Lecția nu există');
    expect(result.current.saved).toBe(false);
    await act(() => result.current.save('print(1)'));
    expect(result.current.error).toBeNull();
    expect(result.current.saved).toBe(true);
  });

  it('falls back to a general message when a failure says nothing', async () => {
    save.mockRejectedValueOnce('nope');
    const { result } = renderSave();
    await act(() => result.current.save('print(1)'));
    expect(result.current.error).toBe('common.somethingWrong');
  });

  it('forgets the message on another lesson', async () => {
    save.mockRejectedValueOnce(new Error('Something went wrong'));
    const { result, rerender } = renderSave();
    await act(() => result.current.save('print(1)'));
    rerender({ savedCodeFailed: false, lessonKey: 'python/py-2/' });
    expect(result.current.error).toBeNull();
  });

  it("drops a save's answer that comes after the lesson changed", async () => {
    let fail: (err: Error) => void = () => {};
    save.mockReturnValueOnce(new Promise((_, reject) => (fail = reject)));
    const { result, rerender } = renderSave();
    let pending: Promise<void> = Promise.resolve();
    act(() => {
      pending = result.current.save('print(1)');
    });
    rerender({ savedCodeFailed: false, lessonKey: 'python/py-2/' });
    await act(async () => {
      fail(new Error('Something went wrong'));
      await pending;
    });
    expect(result.current.error).toBeNull();
  });

  it('lets the lesson save on its own while the stored code is known', () => {
    const { result } = renderSave();
    expect(result.current.savedCodeUnknown).toBe(false);
    act(() => result.current.autoSave('print(1)'));
    expect(save).toHaveBeenCalledWith('print(1)');
  });

  it("keeps a failed save of the lesson's own quiet", async () => {
    save.mockRejectedValueOnce(new Error('Something went wrong'));
    const { result } = renderSave();
    await act(async () => result.current.autoSave('print(1)'));
    expect(result.current.error).toBeNull();
  });

  describe('when the stored code failed to load', () => {
    it("doesn't save on its own", () => {
      const { result } = renderSave(true);
      expect(result.current.savedCodeUnknown).toBe(true);
      act(() => result.current.autoSave('print(1)'));
      expect(save).not.toHaveBeenCalled();
    });

    it('saves nothing when the student says no', async () => {
      const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const { result } = renderSave(true);
      await act(() => result.current.save('print(1)'));
      expect(confirm).toHaveBeenCalledWith('lesson.confirmReplaceSaved');
      expect(save).not.toHaveBeenCalled();
      expect(result.current.savedCodeUnknown).toBe(true);
    });

    it('replaces it when the student says yes, and stops asking', async () => {
      const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const { result } = renderSave(true);
      await act(() => result.current.save('print(1)'));
      expect(save).toHaveBeenCalledWith('print(1)');
      expect(result.current.savedCodeUnknown).toBe(false);
      await act(() => result.current.save('print(2)'));
      expect(confirm).toHaveBeenCalledTimes(1);
      act(() => result.current.autoSave('print(3)'));
      expect(save).toHaveBeenCalledWith('print(3)');
    });

    it('still asks after a confirmed save that failed', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      save.mockRejectedValueOnce(new Error('Something went wrong'));
      const { result } = renderSave(true);
      await act(() => result.current.save('print(1)'));
      expect(result.current.savedCodeUnknown).toBe(true);
    });

    it('asks again on another lesson whose load failed too', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      const { result, rerender } = renderSave(true);
      await act(() => result.current.save('print(1)'));
      rerender({ savedCodeFailed: true, lessonKey: 'python/py-2/' });
      expect(result.current.savedCodeUnknown).toBe(true);
    });
  });
});
