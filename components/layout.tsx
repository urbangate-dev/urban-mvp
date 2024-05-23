"use client";

import { ConnectKitButton, useIsMounted } from "connectkit";
import { useAccount } from "wagmi";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { NextRouter, useRouter } from "next/router";
import Image from "next/image";
import Logo from "../public/logo2.png";
import Link from "next/link";
import { User, ChildPageProps } from "../utils/props";
import localFont from "@next/font/local";
import { Balance } from "./balance";

const poppins = localFont({
  src: [
    {
      path: "../public/fonts/Poppins-ExtraLight.ttf",
      weight: "200",
    },
    {
      path: "../public/fonts/Poppins-Light.ttf",
      weight: "300",
    },
    {
      path: "../public/fonts/Poppins-Regular.ttf",
      weight: "400",
    },
    {
      path: "../public/fonts/Poppins-Medium.ttf",
      weight: "500",
    },
    {
      path: "../public/fonts/Poppins-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "../public/fonts/Poppins-Bold.ttf",
      weight: "700",
    },
  ],
  variable: "--font-poppins",
});

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
      <div className={`${poppins.variable} font-sans`}>
        <header className="flex justify-between items-center px-8 py-6">
          <Link href="/">
            <Image src={Logo} alt="logo" width={180} height={100} />
          </Link>
          <div className="flex items-center gap-6 text-lg">
            {isConnected && user?.role === "ADMIN" ? (
              <Link href="/admin/dashboard" className="hover:text-gray-500">
                Admin Dashboard
              </Link>
            ) : (
              ""
            )}
            {isConnected ? (
              <>
              <Link href="/user/account" className="hover:text-gray-500">
                My Account
              </Link>
              <Balance/>
              </>
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
