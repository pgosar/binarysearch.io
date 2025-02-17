import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';

interface AuthProps {
  children: React.ReactNode;
}

export default function Auth({ children }: AuthProps) {
  const { data } = useSession();

  if (!data) {
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
        <p>Welcome, {data.user?.name}!</p>
        <p>Id: {data?.user?.id}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
      {children}
    </div>
  );
}
