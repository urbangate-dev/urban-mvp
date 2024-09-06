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
import AuthButtonGoogle from "./AuthButtonGoogle";
import { useSession } from "next-auth/react";

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

const roboto = localFont({
  src: [
    {
      path: "../public/fonts/Roboto-Light.ttf",
      weight: "300",
    },
    {
      path: "../public/fonts/Roboto-Regular.ttf",
      weight: "400",
    },
    {
      path: "../public/fonts/Roboto-Medium.ttf",
      weight: "500",
    },
    {
      path: "../public/fonts/Roboto-Bold.ttf",
      weight: "700",
    },
  ],
  variable: "--font-poppins",
});

const robotoCondensed = localFont({
  src: [
    {
      path: "../public/fonts/RobotoCondensed-VariableFont_wght.ttf",
      weight: "400",
    },
  ],
  variable: "--font-roboto-condensed",
});

const robotoMono = localFont({
  src: [
    {
      path: "../public/fonts/RobotoMono-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-roboto-mono",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    role: "",
    id: "",
    state: "",
    investorType: "",
    approved: false,
  });
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");
  const isUserRoute = router.pathname.startsWith("/user");

  const { data } = useSession();

  useEffect(() => {
    fetchUser();
  }, [isConnected, router.pathname]);

  // if user is connected and exists, then fetch user data from database

  const fetchUser = async () => {
    // if (!address && !data?.user) {
    //   router.push("/user/login");
    // }
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
            state: response.data.user.state,
            investorType: response.data.user.investorType,
            approved: response.data.user.approved,
          });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    else if (data && data.user) {
      try {
        const response = await axios.get(`/api/user/${data.user.email}`);
        console.log(response.data);
        setUser({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          id: response.data.id,
          state: response.data.state,
          investorType: response.data.investorType,
          approved: response.data.approved,
        });
        if (router.pathname === "/user/login") {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    } else {
      setUser({
        name: "",
        email: "",
        role: "",
        id: "",
        state: "",
        investorType: "",
        approved: false,
      });
      router.push("/user/login");
    }
  };

  if (isMounted)
    return (
      <div
        className={`${roboto.variable} font-sans ${robotoCondensed.variable} ${robotoMono.variable}`}
      >
        <header
          className={`flex ${robotoMono.variable} justify-between items-center px-8 py-6 shadow-sm sticky top-0 bg-background-black z-20 text-gold uppercase font-roboto-mono h-full border-b border-grey-border`}
        >
          <Link
            href={
              isConnected || data?.user
                ? "/"
                : "https://www.urbangatecapital.com/"
            }
          >
            <Image src={Logo} alt="logo" width={180} height={100} />
          </Link>
          <div className="flex gap-6 text-lg h-full">
            <div className="flex gap-6 items-center">
              {user?.role === "ADMIN" ? (
                <Link
                  href="/admin/dashboard"
                  className="hover:text-dark-gold mx-auto transition"
                >
                  Admin Dashboard
                </Link>
              ) : (
                ""
              )}
              {isConnected &&
              !router.pathname.startsWith("/user/create-account") &&
              user.approved ? (
                <>
                  <Link
                    href="/user/account"
                    className="hover:text-dark-gold transition"
                  >
                    My Account
                  </Link>
                  <Balance />
                </>
              ) : (
                ""
              )}
            </div>

            <div className="border-l border-grey-border"></div>
            {isConnected ? (
              <ConnectKitButton label="Login with Wallet" theme="midnight" />
            ) : (
              ""
            )}
            {data && data.user ? <AuthButtonGoogle /> : ""}
          </div>
        </header>

        <main>
          {isAdminRoute && user?.role !== "ADMIN" ? (
            <p className="text-white">Unauthorized</p>
          ) : user.name !== "" && !user.approved ? (
            <p className="text-white">
              Your account has not been approved yet.
            </p>
          ) : (
            // ) : isUserRoute && !isConnected ? (
            //   <p>Not Logged In</p>
            // ) : (
            React.Children.map(children, (child) =>
              React.isValidElement(child)
                ? React.cloneElement(child, {
                    isConnected,
                    address,
                    user,
                    router,
                    data,
                  } as ChildPageProps)
                : child
            )
          )}
        </main>
        <footer className="border-t border-grey-border p-16">
          <p
            className={`text-gold ${robotoMono.variable} font-roboto-mono mb-2`}
          >
            Links
          </p>
          <div className="flex justify-between">
            <div className="text-grey-text flex gap-4">
              <Link href="/">Home</Link>
              <Link href="/user/account" className="hover:text-gray-500">
                My Account
              </Link>
              <Link href="/faq">FAQ</Link>
              {isConnected && user?.role === "ADMIN" ? (
                <>
                <Link href="/admin/dashboard" className="">
                  Admin Dashboard
                </Link>
                </>
              ) : (
                ""
              )}
            </div>
            <p className="text-gold" style={{ fontVariant: "all-small-caps" }}>
              © 2024 urbangate capital. all rights reserved
            </p>
          </div>
        </footer>
      </div>
    );
}
