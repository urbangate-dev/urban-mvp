import { FormEvent, useState, useEffect } from "react";
import axios from "axios";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

export default function create_account() {
  const [isClient, setIsClient] = useState(false);
  const { address, isConnected } = useAccount();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (isClient) {
      handleCheck();
    }
  }, [isClient]);
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  });

  const handleCheck = async () => {
    try {
      const response = await axios.get(
        `/api/checkuser?walletAddress=${encodeURIComponent(address as string)}`
      );
      if (!isConnected || (response.data.exists && isConnected))
        router.push("/");
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/signup", {
        name,
        email,
        address,
      });
      console.log("New user created:", response.data);
      router.push("/");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <main>
      {isClient ? <ConnectKitButton /> : ""}
      <p>
        Please provide a name (first and last) and an email address to finish
        registering your account.
      </p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-black"
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-black"
          />
        </div>
        <button type="submit">Create Account</button>
      </form>
    </main>
  );
}
