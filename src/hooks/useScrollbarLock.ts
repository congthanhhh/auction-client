import { useEffect, useCallback } from 'react';

export function useScrollbarLock(isLocked: boolean) {
  const lockScroll = useCallback(() => {
    // Early return if already locked
    if (document.body.style.overflow === 'hidden') return;
    
    // Get the current scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Store the current values in dataset for reliable cleanup
    const body = document.body;
    body.dataset.originalOverflow = body.style.overflow || '';
    body.dataset.originalPaddingRight = body.style.paddingRight || '';
    
    // Apply scroll lock with compensation
    body.style.overflow = 'hidden';
    body.style.paddingRight = `${scrollbarWidth}px`;
  }, []);

  const unlockScroll = useCallback(() => {
    const body = document.body;
    
    // Restore original values from dataset
    body.style.overflow = body.dataset.originalOverflow || '';
    body.style.paddingRight = body.dataset.originalPaddingRight || '';
    
    // Clean up dataset
    delete body.dataset.originalOverflow;
    delete body.dataset.originalPaddingRight;
  }, []);

  useEffect(() => {
    if (isLocked) {
      lockScroll();
      return unlockScroll;
    }
  }, [isLocked, lockScroll, unlockScroll]);
}