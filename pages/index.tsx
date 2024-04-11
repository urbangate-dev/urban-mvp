import { Inter } from "next/font/google";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main>
      {isClient ? <ConnectKitButton /> : ""}

      <p>{isConnected ? "Logged in" : "Logged out"}</p>
      <p>
        <a href="https://demo.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=9b1138d3-d290-4968-9547-a6dc6683847a&env=demo&acct=4bb4edce-bff6-49b6-9503-264c6555fee0&v=2">
          Seal your fate
        </a>
      </p>
    </main>
  );
}
