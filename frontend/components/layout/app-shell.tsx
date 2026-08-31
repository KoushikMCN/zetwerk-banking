'use client';

import { LogOut, Wallet } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#fffef1]">
      <header className="border-b border-[#e5e7eb] bg-[#fffef1]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-[#020b36] text-white">
              <Wallet size={18} />
            </div>

            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight text-[#020b36]">
                ZETWERK
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#667085]">
                Banking
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium text-[#667085] transition-colors hover:text-[#020b36]"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {children}
      </main>
    </div>
  );
}