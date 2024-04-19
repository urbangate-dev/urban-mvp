"use client";

import { ConnectKitButton, useIsMounted } from "connectkit";
import { useAccount } from "wagmi";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { NextRouter, useRouter } from "next/router";
import Image from "next/image";
import LogoSVG from "../public/logo.svg";
import Link from "next/link";

type User = {
  name: string;
  email: string;
  role: string;
};

interface ChildProps {
  isConnected: boolean;
  address: string;
  user: User;
  router: NextRouter;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    role: "",
  });
  const { address, isConnected } = useAccount();

  const router = useRouter();
  const isMounted = useIsMounted();
  const isAdminRoute = router.pathname.startsWith("/admin");

  useEffect(() => {
    fetchUser();
  }, [isConnected]);

  // if user is connected and exists, then fetch user data from database
  const fetchUser = async () => {
    if (address)
      try {
        const response = await axios.get(
          `/api/user?walletAddress=${encodeURIComponent(address as string)}`
        );
        if (isConnected && response.data.user.name == "")
          router.push("/create-account");
        else
          setUser({
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role,
          });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
  };

  if (isMounted)
    return (
      <div>
        <header className="flex justify-between items-center p-4 border-b">
          <Link href="/">
            <Image src={LogoSVG} alt="logo" width={70} height={70} />
          </Link>
          <div className="flex items-center gap-6">
            <p>
              {isConnected && user.name != "" ? `Welcome, ${user.name}` : ""}
            </p>
            <ConnectKitButton label="Login with Wallet" />
          </div>
        </header>

        <main>
          {isAdminRoute && user.role !== "ADMIN" ? (
            <p>Unauthorized</p>
          ) : (
            React.Children.map(children, (child) =>
              React.isValidElement(child)
                ? React.cloneElement(child, {
                    isConnected,
                    address,
                    user,
                    router,
                  } as ChildProps)
                : child
            )
          )}
        </main>
      </div>
    );
}
