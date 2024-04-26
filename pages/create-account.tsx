import { FormEvent, useState, useEffect } from "react";
import axios from "axios";
import { ChildPageProps } from "@/utils/props";

const CreateAccount: React.FC<ChildPageProps> = ({
  isConnected,
  address,
  user,
  router,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    console.log(user);
    if (!isConnected || (isConnected && user?.name != "" && user)) {
      router.push("/");
    }
  }, [isConnected]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/user", {
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
};

export default CreateAccount;
