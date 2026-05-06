'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Moon02Icon, Sun03Icon } from '@hugeicons/core-free-icons';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const initial = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setTheme(initial);
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  }

  if (!theme) return <span className="size-8" aria-hidden />;

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <HugeiconsIcon
        icon={theme === 'dark' ? Sun03Icon : Moon02Icon}
        strokeWidth={2}
        className="size-4"
      />
    </Button>
  );
}
