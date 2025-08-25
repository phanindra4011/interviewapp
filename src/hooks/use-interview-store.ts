'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { InterviewSession } from '@/lib/types';

type InterviewState = {
  interviews: InterviewSession[];
  getInterview: (id: string) => InterviewSession | undefined;
  addInterview: (interview: InterviewSession) => void;
  updateInterview: (id: string, updates: Partial<InterviewSession>) => void;
  isInitialized: boolean;
};

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      interviews: [],
      isInitialized: false,
      getInterview: (id: string) => {
        return get().interviews.find((interview) => interview.id === id);
      },
      addInterview: (interview: InterviewSession) => {
        set((state) => ({ interviews: [...state.interviews, interview] }));
      },
      updateInterview: (id: string, updates: Partial<InterviewSession>) => {
        set((state) => ({
          interviews: state.interviews.map((interview) =>
            interview.id === id ? { ...interview, ...updates } : interview
          ),
        }));
      },
    }),
    {
      name: 'ace-interview-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrate: () => {
        // This is called when the store is rehydrated from localStorage
      },
    }
  )
);

// Set isInitialized to true after rehydration
useInterviewStore.setState({ isInitialized: true });
