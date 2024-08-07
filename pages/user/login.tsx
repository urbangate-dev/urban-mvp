import { FormEvent, useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { ChildPageProps } from "@/utils/props";
import AuthButtonGoogle from "@/components/AuthButtonGoogle";
import { ConnectKitButton } from "connectkit";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const Login: React.FC<ChildPageProps> = ({
  isConnected,
  address,
  user,
  router,
  data,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // submit form logic
  };

  useEffect(() => {
    if (data?.user || isConnected) {
      router.push("/");
    }
  });

  return (
    <div className="p-20">
      <div className="grid grid-cols-2 rounded-3xl border border-grey-border">
        <div className="p-8 flex flex-col gap-4 items-center border-r border-grey-border">
          <p
            className="text-white text-4xl uppercase font-roboto-condensed"
            style={{ fontVariant: "all-small-caps" }}
          >
            Lending Investor Login
          </p>
          <p className="text-grey-text text-center">
            Login with either your Google account or your crypto wallet. Please
            note: If you login with your Google Account, you can only view
            loans. To invest with crypto, you must use your wallet.
          </p>
          <AuthButtonGoogle />
          <p className="text-grey-text text-lg">OR</p>
          <ConnectKitButton label="Login with Wallet" theme="midnight" />
        </div>

        <div className="p-8 flex flex-col gap-4 items-center">
          <p
            className="text-white text-4xl uppercase font-roboto-condensed"
            style={{ fontVariant: "all-small-caps" }}
          >
            Apply to be a lending investor
          </p>
          <p className="text-grey-text text-center">
            If you want to become an investor for our private loans, please fill
            out the form below and we will be in contact with more details
            shortly!
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4  w-full">
            <label className="flex flex-col text-lg">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md px-4 py-3 font-light placeholder:text-grey-text outline-dark-gold text-lg"
              />
            </label>
            <label className="flex flex-col text-lg">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md px-4 py-3 font-light placeholder:text-grey-text outline-dark-gold text-lg"
              />
            </label>
            <label className="flex flex-col text-lg">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md px-4 py-3 font-light placeholder:text-grey-text outline-dark-gold text-lg"
              />
            </label>
            <label className="flex flex-col text-lg">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md px-4 py-3 font-light placeholder:text-grey-text outline-dark-gold text-lg h-28"
              />
            </label>
            <div className="flex justify-center">
              <button className="text-gold border uppercase font-roboto-condensed text-xl border-gold rounded-lg px-4 py-2 hover:text-dark-gold hover:border-dark-gold transition">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* <p className="text-xl mb-4 text-center">
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
      </form> */}
    </div>
  );
};

export default Login;
