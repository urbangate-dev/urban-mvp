import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtonGoogle() {
  const { data } = useSession();

  if (data && data.user) {
    return (
      <div>
        <button
          className="text-gold border uppercase font-roboto-mono text-lg border-gold rounded-full px-4 py-2 hover:text-dark-gold hover:border-dark-gold transition"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => signIn()}
        className="text-gold border uppercase font-roboto-condensed text-xl border-gold rounded-lg px-4 py-2 hover:text-dark-gold hover:border-dark-gold transition"
      >
        Login with Google
      </button>
    </div>
  );
}
