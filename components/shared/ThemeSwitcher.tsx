"use client";

import { useState, useEffect } from "react";
import { SunIcon, MoonIcon, ComputerIcon } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { useTheme } from "next-themes";

const themeOptions = [
  {
    id: "light",
    name: "Light",
    icon: <SunIcon className="size-5" />,
  },
  {
    id: "dark",
    name: "Dark",
    icon: <MoonIcon className="size-5" />,
  },
  {
    id: "system",
    name: "System",
    icon: <ComputerIcon className="size-5" />,
  },
];

export default function DarkModeSelector() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const currentIcon = currentTheme === "dark" ? <MoonIcon className="size-5" /> : <SunIcon className="size-5" />;

  return (
    <Listbox value={theme} onChange={setTheme}>
      <div className="relative">
        <Listbox.Button className="flex items-center">
          {currentIcon}
        </Listbox.Button>
        <Listbox.Options className="absolute z-50 top-full list-none right-0 bg-white rounded-lg ring-1 ring-slate-900/10 shadow-lg overflow-hidden w-36 py-1 text-sm dark:bg-slate-800 dark:ring-0 mt-2">
          {themeOptions.map((option) => (
            <Listbox.Option
              key={option.id}
              value={option.id}
              className={({ active }) =>
                `py-2 px-4 flex items-center cursor-pointer ${
                  active ? "bg-gray-100 dark:bg-gray-700" : ""
                } ${
                  theme === option.id ? "text-purple-600 dark:text-purple-300" : "text-gray-900 dark:text-gray-50"
                }`
              }
            >
              <span className="mr-3">{option.icon}</span>
              {option.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}