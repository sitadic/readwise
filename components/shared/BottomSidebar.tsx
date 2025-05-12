"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bookmark, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Bottombar() {
  const pathname = usePathname();

  const links = [
    { route: "/", label: "Home", icon: Home },
    { route: "/search", label: "Search", icon: Search },
    { route: "/create-thread", label: "Create", icon: Plus },
  ];

  return (
    <div
      className={cn(
        "fixed bottom-0 z-40 w-full border-t",
        "md:hidden"
      )}
    >
      <div className="flex h-16 items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.route || pathname.startsWith(link.route + "/");

          return (
            <Link
              key={link.route}
              href={link.route}
               className={cn(
                "flex flex-col items-center p-2 flex-1",
                isActive
                  ? "text-primary-500"
                  : "text-gray-700 dark:text-gray-300",
                "hover:text-primary-500 dark:hover:text-primary-400"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}