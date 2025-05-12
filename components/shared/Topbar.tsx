"use client";

import { Book, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export default function Topbar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav
      className={cn(
        "sticky top-0 z-30 h-16 w-full bg-background border-b border-border",
        "px-4 flex items-center justify-between"
      )}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Book className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold hidden sm:block text-foreground">
          Readwise
        </span>
      </Link>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}
