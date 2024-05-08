"use client";

import { ConnectKitButton, useIsMounted } from "connectkit";
import { useAccount } from "wagmi";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { NextRouter, useRouter } from "next/router";
import Image from "next/image";
import LogoSVG from "../public/logo.svg";
import Link from "next/link";
import { User, ChildPageProps } from "../utils/props";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    role: "",
    id: "",
  });
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");

  useEffect(() => {
    fetchUser();
  }, [isConnected]);

  // if user is connected and exists, then fetch user data from database

  const fetchUser = async () => {
    if (address)
      try {
        const response = await axios.get(`/api/user/${address}`);
        if (isConnected && Object.keys(response.data).length === 0)
          router.push("/user/create-account");
        else
          setUser({
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role,
            id: response.data.user.id,
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
            <Link href="/user/account">
              {isConnected && user?.name != "" ? `${user?.name}'s Account` : ""}
            </Link>
            {isConnected && user?.role === "ADMIN" ? (
              <Link href="/admin/dashboard">Admin Dashboard</Link>
            ) : (
              ""
            )}

            <ConnectKitButton label="Login with Wallet" />
          </div>
        </header>

        <main>
          {isAdminRoute && user?.role !== "ADMIN" ? (
            <p>Unauthorized</p>
          ) : (
            React.Children.map(children, (child) =>
              React.isValidElement(child)
                ? React.cloneElement(child, {
                    isConnected,
                    address,
                    user,
                    router,
                  } as ChildPageProps)
                : child
            )
          )}
        </main>
      </div>
    );
}
