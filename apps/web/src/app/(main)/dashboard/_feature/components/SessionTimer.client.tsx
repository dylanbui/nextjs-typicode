'use client';

import React, { useEffect, useTransition } from 'react';
import { useAuthStore } from '@/app/(auth)/login/_feature/stores/auth.store.client';
import { useRouter } from 'next/navigation';

export function SessionTimer() {
  const router = useRouter();
  const timeLeft = useAuthStore((state) => state.timeLeft);
  const decrementTimer = useAuthStore((state) => state.decrementTimer);
  const setTimeLeft = useAuthStore((state) => state.setTimeLeft);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timer = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [decrementTimer]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isNearExpiry = timeLeft < 300; // < 5 phút

  const handleExtend = () => {
    startTransition(() => {
      setTimeLeft(1800); // Gia hạn lại 30 phút
      router.refresh();
    });
  };

  return (
    <div className="d-flex align-items-center gap-2 px-3 py-1 bg-light border rounded-pill small">
      <i className={`bi bi-clock-history ${isNearExpiry ? 'text-danger animate-pulse' : 'text-primary'}`}></i>
      <span className="fw-semibold text-secondary" style={{ fontSize: '0.82rem' }}>
        Session: <strong className={isNearExpiry ? 'text-danger' : 'text-dark'}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </strong>
      </span>
      {isNearExpiry && (
        <button
          type="button"
          onClick={handleExtend}
          disabled={isPending}
          className="btn btn-outline-warning btn-xs rounded-pill py-0 px-2 small ms-1"
          style={{ fontSize: '0.7rem' }}
        >
          {isPending ? 'Đang gia hạn...' : 'Gia Hạn'}
        </button>
      )}
    </div>
  );
}
