'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, History, Settings } from 'lucide-react';
import { LogoIcon } from '@/components/icons';

const links = [
  { href: '/', label: 'New Interview', icon: Home },
  { href: '/history', label: 'History', icon: History },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r no-print bg-gradient-to-b from-[#f0f4ff] to-[#e0e0f8]" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <LogoIcon className="size-8 text-sidebar-primary" />
          <span className="text-lg font-semibold text-sidebar-foreground">
            AceInterview
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                tooltip={link.label}
                className={
                  pathname === link.href
                    ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-md scale-[1.04]'
                    : 'hover:bg-[#e0e7ff] hover:text-[#667eea] transition-all'
                }
              >
                <Link href={link.href} className="flex items-center gap-2 px-2 py-2">
                  <link.icon className="h-5 w-5" />
                  <span className="font-medium text-base">{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {/* Placeholder for future items like settings or profile */}
      </SidebarFooter>
    </Sidebar>
  );
}
