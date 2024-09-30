import { FormEvent, useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { ChildPageProps } from "@/utils/props";
import AuthButtonGoogle from "@/components/AuthButtonGoogle";
import { useSIWE } from "connectkit";
import CustomSIWEButton from "@/components/siweButton";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ActiveCampaignUrl =
  "https://urbangatecapital.activehosted.com/proc.php?id=1"; // Replace with your ActiveCampaign form action URL

const Login: React.FC<ChildPageProps> = ({
  isConnected,
  address,
  user,
  router,
  data,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const { data: siweData, isSignedIn } = useSIWE();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(ActiveCampaignUrl, {
        // Map your form fields according to ActiveCampaign's required parameters
        "Full Name": formData.name,
        Email: formData.email,
        Phone: formData.phone,
        Message: formData.message,
        // Include any additional fields required by your ActiveCampaign form
      });
      if (response.status === 200) {
        alert("Form submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  useEffect(() => {
    if (data?.user || (isConnected && isSignedIn)) {
      router.push("/");
    }
  }, [data, isConnected, isSignedIn, router]);

  return (
    <div className="p-20">
      <div className="grid grid-cols-2 rounded-3xl border border-grey-border">
        <div className="p-8 flex flex-col gap-4 items-center border-r border-grey-border">
          <p
            className="text-white text-4xl uppercase font-roboto-condensed"
            style={{ fontVariant: "all-small-caps" }}
          >
            Lending Investor Login (Beta)
          </p>
          <p className="text-grey-text text-center">
            Login with either your Google account or your crypto wallet. Please
            note: If you login with your Google Account, you can only view
            loans. To invest with crypto, you must use your wallet.
          </p>
          <AuthButtonGoogle />
          <p className="text-grey-text text-lg">OR</p>
          <CustomSIWEButton />
        </div>

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
    </div>
  );
};

export default Login;
