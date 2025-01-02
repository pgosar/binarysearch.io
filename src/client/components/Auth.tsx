import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';

interface AuthProps {
  children: React.ReactNode;
}

export default function Auth({ children }: AuthProps) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <p>You are not signed in</p>
        <button onClick={() => signIn('github')}>Sign in with GitHub</button>
      </div>
    );
  }

  return (
    <div>
      <div>
        <p>Welcome, {session.user?.name}!</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
      {children}
    </div>
  );
}
