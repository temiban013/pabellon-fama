import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { computeTimeLeft, useCuentaRegresiva } from '@/hooks/useCuentaRegresiva';

describe('computeTimeLeft', () => {
  it('descompone la diferencia en días, horas, minutos y segundos', () => {
    const now = new Date('2026-11-01T00:00:00.000Z');
    const target = new Date('2026-11-03T04:05:06.000Z');
    expect(computeTimeLeft(target, now)).toEqual({ days: 2, hours: 4, minutes: 5, seconds: 6 });
  });
  it('no devuelve valores negativos si el objetivo ya pasó', () => {
    const now = new Date('2026-11-09T00:00:00.000Z');
    const target = new Date('2026-11-08T00:00:00.000Z');
    expect(computeTimeLeft(target, now)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
  it('ignora fracciones de segundo', () => {
    const now = new Date('2026-11-01T00:00:00.000Z');
    const target = new Date('2026-11-01T00:00:01.999Z');
    expect(computeTimeLeft(target, now).seconds).toBe(1);
  });
});

describe('useCuentaRegresiva', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('avanza cada segundo y limpia el intervalo al desmontar', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-08T16:59:50.000Z'));
    const clearSpy = vi.spyOn(globalThis, 'clearInterval');
    const { result, unmount } = renderHook(() =>
      useCuentaRegresiva(new Date('2026-11-08T17:00:00.000Z')),
    );
    expect(result.current.restante).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 10 });
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.restante?.seconds).toBe(7);
    unmount();
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});
