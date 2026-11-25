'use client';

import * as React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';

export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'color-scheme';

function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system';
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark') return raw;
  } catch {
    // Abaikan jika storage diblokir browser
  }
  return 'system';
}

function applyMetaColorScheme(pref: ThemePreference) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
  const content = pref === 'system' ? 'light dark' : pref;
  if (meta) {
    meta.content = content;
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  const [preference, setPreference] = React.useState<ThemePreference>('system');

  React.useEffect(() => {
    const initial = readStoredPreference();
    setPreference(initial);
    applyMetaColorScheme(initial);

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        const next =
          event.newValue === 'light' || event.newValue === 'dark'
            ? event.newValue
            : 'system';
        setPreference(next);
        applyMetaColorScheme(next);
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const selectPreference = (next: ThemePreference) => {
    setPreference(next);
    applyMetaColorScheme(next);
    try {
      if (next === 'system') {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, next);
      }
    } catch {
      // Abaikan kegagalan persistensi storage
    }
  };

  const options: Array<{
    value: ThemePreference;
    label: string;
    icon: React.ReactNode;
  }> = [
    { value: 'light', label: 'Terang', icon: <Sun className="h-3.5 w-3.5" aria-hidden="true" /> },
    { value: 'dark', label: 'Gelap', icon: <Moon className="h-3.5 w-3.5" aria-hidden="true" /> },
    { value: 'system', label: 'Sistem', icon: <Monitor className="h-3.5 w-3.5" aria-hidden="true" /> },
  ];

  return (
    <div
      role="group"
      aria-label="Pengaturan tema tampilan"
      className={cn(
        'inline-flex items-center rounded-[6px] border border-[var(--border-default)] bg-[var(--bg-subtle)] p-0.5',
        className,
      )}
    >
      {options.map((opt) => {
        const active = preference === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-label={`Tema ${opt.label}`}
            title={`Tema ${opt.label}`}
            aria-pressed={active}
            onClick={() => selectPreference(opt.value)}
            className={cn(
              'inline-flex min-h-8 items-center gap-1.5 rounded-[5px] px-2.5 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent-operational)]',
              active
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
            )}
          >
            {opt.icon}
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
