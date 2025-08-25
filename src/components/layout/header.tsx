'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
      <SidebarTrigger />
      <h1 className="text-lg font-semibold">AceInterview</h1>
    </header>
  );
}
