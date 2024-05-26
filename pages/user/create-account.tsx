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
      router.push("/");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="p-20">
      <p className="text-xl mb-4 text-center">
        Please provide a name (first and last) and an email address to finish
        registering your account.
      </p>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 rounded-3xl p-10 mx-40"
      >
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-lg" htmlFor="name">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300  rounded-xl px-4 py-2 text-xl"
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label className="text-lg" htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300  rounded-xl px-4 py-2 text-xl"
            />
          </div>
        </div>
        <div className="flex mt-8 justify-center">
          <button
            className="text-gold text-xl px-4 py-2 border border-gold rounded-full hover:text-dark-gold hover:border-dark-gold transition"
            type="submit"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;
