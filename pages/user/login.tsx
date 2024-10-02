import { FormEvent, useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { ChildPageProps } from "@/utils/props";
import AuthButtonGoogle from "@/components/AuthButtonGoogle";
import { useSIWE } from "connectkit";
import CustomSIWEButton from "@/components/siweButton";
import EmbedForm from "@/components/EmbedForm";

const Login: React.FC<ChildPageProps> = ({
  isConnected,
  address,
  user,
  router,
  data,
}) => {
  const { data: siweData, isSignedIn } = useSIWE();

  useEffect(() => {
    console.log("Login component mounted");

    if (data?.user || (isConnected && isSignedIn)) {
      // Ensure the user is not already on the homepage
      if (router.pathname !== "/") {
        router.push("/");
      }
    }

    return () => {
      console.log("Login component unmounted");
    };
  }, [data, isConnected, isSignedIn, router]);

  return (
    <div className="p-20">
      <div className="grid grid-cols-2 rounded-3xl border border-grey-border">
        {/* Left side */}
        <div className="p-8 flex flex-col gap-4 items-center border-r border-grey-border">
          {/* Login section content */}
          <p
            className="text-white text-4xl uppercase font-roboto-condensed text-center"
            style={{ fontVariant: "all-small-caps" }}
          >
            Lending Investor Login (Beta Version)
          </p>
          <p className="text-grey-text text-center mb-4">
            Login with either your Google account or your crypto wallet.
            Connecting with your wallet will require account approval before
            investing. Logging in with Google does not require approval, but you
            only view loans, not invest in them.
          </p>
          <AuthButtonGoogle />
          <p className="text-grey-text text-lg">OR</p>
          <CustomSIWEButton />
        </div>

        {/* Right side */}
        <div className="p-8 flex flex-col gap-4 items-center">
          <p
            className="text-white text-4xl uppercase font-roboto-condensed"
            style={{ fontVariant: "all-small-caps" }}
          >
            Apply to invest in our loan offerings
          </p>
          <p className="text-grey-text text-center">
            If you want to become an investor for our private loans, please fill
            out the form below and we will be in contact with more details
            shortly!
          </p>
          <EmbedForm />
          {/* Ensure this is the last element in this container */}
        </div>
      </div>
    </div>
  );
};

export default Login;
