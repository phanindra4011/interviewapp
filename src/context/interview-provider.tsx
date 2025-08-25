'use client';

import { useInterviewStore } from '@/hooks/use-interview-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

// This provider is a simple wrapper to ensure that we only render the UI
// once the store has been rehydrated from localStorage on the client.
export const InterviewProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const { isInitialized } = useInterviewStore();

  useEffect(() => {
    if (isInitialized) {
      setIsHydrated(true);
    }
  }, [isInitialized]);

  return <>{isHydrated ? children : null}</>;
};
