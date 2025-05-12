"use client";

import {
  Home,
  Search,
  Bookmark,
  User,
  PenSquare,
  Flame,
  Compass,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

export default function LeftSidebar() {
  const pathname = usePathname();
  const { userId } = useAuth();

  const navigation = [
    { route: "/", label: "Home", icon: Home },
    { route: "/search", label: "Search", icon: Search },
    { route: "/discover", label: "Discover", icon: Compass },
    { route: `/profile/${userId}`, label: "Profile", icon: User }
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-64 shrink-0",
        "sticky top-16 h-[calc(100vh-4rem)]",
        "border-r border-border bg-background px-4 py-6 space-y-1"
      )}
    >
      {/* Main Navigation */}
      {navigation.map((item) => {
        const isActive = pathname === item.route;
        return (
          <Link
            key={item.route}
            href={item.route}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg",
              "text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent/50"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}

      {/* Create Thread Button */}
      <div className="mt-auto pt-4">
        <Link
          href="/create-thread"
          className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-lg",
            "text-sm font-medium text-primary hover:bg-primary/10"
          )}
        >
          <PenSquare className="h-5 w-5" />
          Create Thread
        </Link>
      </div>
    </aside>
  );
}
