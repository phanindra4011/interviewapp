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
    <Sidebar className="border-r" collapsible="icon">
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
              >
                <Link href={link.href}>
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
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
