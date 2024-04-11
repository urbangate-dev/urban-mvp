"use client";

import { Inter } from "next/font/google";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

type User = {
  name: string;
  email: string;
};

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
  });
  const { address, isConnected } = useAccount();

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isConnected) {
      handleCheck();
      fetchUser();
    }
  }, [isConnected]);

  const handleCheck = async () => {
    try {
      const response = await axios.get(
        `/api/checkuser?walletAddress=${encodeURIComponent(address as string)}`
      );
      if (isConnected && !response.data.exists) router.push("/create_account");
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `/api/getuser?walletAddress=${encodeURIComponent(address as string)}`
      );
      setUser({
        name: response.data.user.name,
        email: response.data.user.email,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  return (
    <main>
      {isClient ? <ConnectKitButton /> : ""}

      <p>{isConnected ? `Welcome, ${user.name}` : "Logged out"}</p>
      <p>
        <a href="https://demo.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=9b1138d3-d290-4968-9547-a6dc6683847a&env=demo&acct=4bb4edce-bff6-49b6-9503-264c6555fee0&v=2">
          Seal your fate
        </a>
      </p>
    </main>
  );
}
