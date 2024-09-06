import React from 'react';
import { useSIWE, useModal, SIWESession } from "connectkit";
import { useAccount } from "wagmi";

const CustomSIWEButton = () => {
  const { setOpen } = useModal();
  const { isConnected } = useAccount();

  const { data, isRejected, isLoading, signIn } = useSIWE();

  const handleSignIn = async () => {
    await signIn()?.then((session?: SIWESession) => {
    });
  };

  const buttonClass = "text-gold border uppercase font-roboto-condensed text-xl border-gold rounded-lg px-4 py-2 hover:text-dark-gold hover:border-dark-gold transition";


  /** Wallet is connected, but not signed in */
  if (isConnected) {
    return (
      <button
        onClick={handleSignIn}
        disabled={isLoading}
        className={buttonClass}
      >
        {isRejected
          ? "Try Again"
          : isLoading
          ? "Awaiting request..."
          : "Sign In"}
      </button>
    );
  }

  /** A wallet needs to be connected first */
  return (
    <button onClick={() => setOpen(true)} className={buttonClass}>
      Connect Wallet
    </button>
  );
};

export default CustomSIWEButton;