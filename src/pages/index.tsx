import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import Auth from 'src/client/components/Auth';
import Chat from 'src/client/components/Chat';

export default function Home({ session }: { session: Session }) {
  return (
    <SessionProvider session={session}>
      <Auth>
        <Chat />
      </Auth>
    </SessionProvider>
  );
}
