'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useCurrentUser } from '@/lib/auth/use-current-user';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const { isLoading, isError, data } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && (isError || !data)) {
      router.replace('/login');
    }
  }, [data, isError, isLoading, router]);

  if (isLoading || isError || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm text-[#667085]">
          Loading your account...
        </div>
      </div>
    );
  }

  return children;
}