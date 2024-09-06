import { FormEvent, useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { ChildPageProps } from "@/utils/props";
import AuthButtonGoogle from "@/components/AuthButtonGoogle";
import { useSIWE, SIWESession } from "connectkit";
import CustomSIWEButton from "@/components/siweButton"
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

  const { data: siweData, isSignedIn, signOut, signIn } = useSIWE();

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
    if (data?.user || isConnected && isSignedIn) {
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

// import { FormEvent, useState, useEffect, ChangeEvent } from "react";
// import axios from "axios";
// import { ChildPageProps, User } from "@/utils/props";

// const Settings: React.FC<ChildPageProps> = ({
//   isConnected,
//   address,
//   user,
//   router,
// }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [state, setState] = useState("");
//   const [investor, setInvestor] = useState("");
//   const [userData, setUserData] = useState<User>({
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     id: user.id,
//     state: user.state,
//     investorType: user.investorType,
//     approved: user.approved,
//   });

//   const states = [
//     "Alabama",
//     "Alaska",
//     "Arizona",
//     "Arkansas",
//     "California",
//     "Colorado",
//     "Connecticut",
//     "Delaware",
//     "Florida",
//     "Georgia",
//     "Hawaii",
//     "Idaho",
//     "Illinois",
//     "Indiana",
//     "Iowa",
//     "Kansas",
//     "Kentucky",
//     "Louisiana",
//     "Maine",
//     "Maryland",
//     "Massachusetts",
//     "Michigan",
//     "Minnesota",
//     "Mississippi",
//     "Missouri",
//     "Montana",
//     "Nebraska",
//     "Nevada",
//     "New Hampshire",
//     "New Jersey",
//     "New Mexico",
//     "New York",
//     "North Carolina",
//     "North Dakota",
//     "Ohio",
//     "Oklahoma",
//     "Oregon",
//     "Pennsylvania",
//     "Rhode Island",
//     "South Carolina",
//     "South Dakota",
//     "Tennessee",
//     "Texas",
//     "Utah",
//     "Vermont",
//     "Virginia",
//     "Washington",
//     "West Virginia",
//     "Wisconsin",
//     "Wyoming",
//   ];

//   const investorTypes = [
//     {
//       value: "net-worth-over-1-million",
//       text: "Net worth over $1M",
//       fullText:
//         "Any natural person whose individual net worth, or joint net worth with that person’s spouse or spousal equivalent, at the time of his purchase exceeds $1,000,000.",
//     },
//     {
//       value: "income-over-200k",
//       text: "Income over $200K",
//       fullText:
//         "Any natural person who had an individual income in excess of $200,000 in each of the two most recent years or joint income with that person’s spouse or spousal equivalent in excess of $300,000 in each of those years and has a reasonable expectation of reaching the same income levels in the current year.",
//     },
//     {
//       value: "holds-licenses",
//       text: "Holds certain licenses",
//       fullText:
//         "Any natural person who holds one of the following licenses in good standing: General Securities Representative license (Series 7), the Private Securities Offerings Representative license (Series 82), or the Investment Adviser Representative license (Series 65).",
//     },
//     {
//       value: "bank-or-institution",
//       text: "Bank or institution",
//       fullText:
//         'Any bank as defined in section 3(a)(2) of the Securities Act of 1933 (the "Act"), or any savings and loan association or other institution as defined in section 3(a)(5)(A) of the Act whether acting in its individual or fiduciary capacity; any broker or dealer registered pursuant to section 15 of the Securities Exchange Act of 1934; any insurance company as defined in section 2(a)(13) of the Act; any investment company registered under the Investment Company Act of 1940 or a business development company as defined in section 2(a)(48) of that Act; any Small Business Investment Company licensed by the U.S. Small Business Administration under section 301(c) or (d) of the Small Business Investment Act of 1958; any plan established and maintained by a state, its political subdivisions, or any agency or instrumentality of a state or its political subdivisions, for the benefit of its employees, if such plan has total assets in excess of $5,000,000; any employee benefit plan within the meaning of the Employee Retirement Income Security Act of 1974 if the investment decision is made by a plan fiduciary, as defined in section 3(21) of such act, which is either a bank, savings and loan association, insurance company, or registered investment adviser, or if the employee benefit plan has total assets in excess of $5,000,000 or, if a self-directed plan, with investment decisions made solely by persons that are accredited investors.',
//     },
//     {
//       value: "registered-investment-adviser",
//       text: "Registered investment adviser",
//       fullText:
//         "An investment adviser registered pursuant to section 203 of the Investment Advisers Act of 1940 or registered pursuant to the laws of a state; or an investment adviser relying on the exemption from registering with the Commission under section 203(l) or (m) of the Investment Advisers Act of 1940.",
//     },
//     {
//       value: "private-business-development-company",
//       text: "Private business development company",
//       fullText:
//         "Any private business development company as defined in section 202(a)(22) of the Investment Advisers Act of 1940.",
//     },
//     {
//       value: "rural-business-investment-company",
//       text: "Rural business investment company",
//       fullText:
//         "A Rural Business Investment Company as defined in section 384A of the Consolidated Farm and Rural Development Act.",
//     },
//     {
//       value: "organization-over-5-million",
//       text: "Organization with over $5M assets",
//       fullText:
//         "Any organization described in section 501(c)(3) of the Internal Revenue Code, corporation, Massachusetts or similar business trust, partnership, or limited liability company, not formed for the specific purpose of acquiring loans, with total assets in excess of $5,000,000.",
//     },
//     {
//       value: "director-executive-officer",
//       text: "Director or executive officer",
//       fullText:
//         "Any director, executive officer, or general partner of the Borrower, or any director, executive officer, or general partner of a general partner of the Borrower.",
//     },
//     {
//       value: "trust-over-5-million",
//       text: "Trust with over $5M assets",
//       fullText:
//         "Any trust, with total assets in excess of $5,000,000, not formed for the specific purpose of acquiring loans, whose purchase is directed by a sophisticated person as described in Rule 506(b)(2)(ii).",
//     },
//     {
//       value: "family-office",
//       text: "Family office with over $5M assets",
//       fullText:
//         "A “family office,” as defined in rule 202(a)(11)(G)-1 under the Investment Advisers Act of 1940 (17 CFR 275.202(a)(11)(G)-1): (i) with assets under management in excess of $5,000,000, (ii) that is not formed for the specific purpose of acquiring the securities offered, and (iii) whose prospective investment is directed by a person who has such knowledge and experience in financial and business matters that such family office is capable of evaluating the merits and risks of the prospective investment; or a “family client,” as defined in rule 202(a)(11)(G)-1 under the Investment Advisers Act of 1940 (17 CFR 275.202(a)(11)(G)-1)), of a family office meeting the requirements in paragraph (b)(15) above and whose prospective investment in the issuer is directed by such family office.",
//     },
//     {
//       value: "entity-over-5-million",
//       text: "Entity with over $5M assets",
//       fullText:
//         "An entity, of a type not listed above, not formed for the specific purpose of acquiring the securities offered, owning investments in excess of $5,000,000.",
//     },
//     {
//       value: "entity-all-accredited-investors",
//       text: "Entity with all accredited investors",
//       fullText:
//         "Any entity in which all of the equity owners are accredited investors.",
//     },
//   ];

//   useEffect(() => {
//     setUserData(user);
//   }, [user]);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await axios.put(`/api/user/${address}`, {
//         name: userData.name,
//         email: userData.email,
//         state: userData.state,
//         investorType: userData.investorType,
//       });
//       window.alert("Account updated successfully!");
//     } catch (error) {
//       console.error("Error creating user:", error);
//       window.alert("Error updating account!" + error);
//     }
//   };

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     e.preventDefault();
//     const { name, value } = e.target;
//     setUserData({
//       ...userData,
//       [name]: value,
//     });
//   };

//   return (
//     <div className="p-20">
//       <div className="border border-grey-border rounded-t-3xl mx-40 px-20 py-10">
//         <p
//           className={`text-5xl mb-2 mt-4 font-roboto-condensed hover:text-white transition font-light uppercase text-center text-white`}
//           style={{ fontVariant: "all-small-caps" }}
//         >
//           Your Settings
//         </p>
//       </div>
//       <form
//         onSubmit={handleSubmit}
//         className="rounded-b-3xl border-grey-border border p-10 mx-40"
//       >
//         <div className="grid grid-cols-3 gap-4">
//           <label className="flex flex-col text-xl col-span-7">
//             <p className="text-grey-text font-light mb-1">Name</p>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={userData.name}
//               onChange={handleChange}
//               className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold"
//             />
//           </label>
//           <label className="flex flex-col text-xl col-span-7">
//             <p className="text-grey-text font-light mb-1">Email</p>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={userData.email}
//               onChange={handleChange}
//               className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold"
//             />
//           </label>
//           <label className="flex flex-col text-xl col-span-7">
//             <p className="text-grey-text font-light mb-1">State of Residency</p>
//             <select
//               id="state"
//               name="state"
//               value={userData.state}
//               onChange={handleChange}
//               className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold"
//             >
//               <option value="" disabled>
//                 Select State of Residency
//               </option>
//               {states.map((stateName) => (
//                 <option key={stateName} value={stateName}>
//                   {stateName}
//                 </option>
//               ))}
//             </select>
//           </label>
//           <label className="flex flex-col text-xl col-span-7">
//             <p className="text-grey-text font-light mb-1">Investor Type</p>
//             <select
//               id="investorType"
//               name="investorType"
//               value={userData.investorType}
//               onChange={handleChange}
//               className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold"
//             >
//               <option value="" disabled>
//                 Select Accredited Investor Status
//               </option>
//               {investorTypes.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.text}
//                 </option>
//               ))}
//             </select>
//             <p className="text-gold font-light text-sm mt-1">
//               See full details for accredited investor types below
//             </p>
//           </label>
//         </div>
//         <div className="flex mt-8 justify-center">
//           <button
//             className={`text-gold text-xl px-4 py-2 border border-gold rounded-xl uppercase hover:text-dark-gold hover:border-dark-gold disabled:text-grey-text disabled:border-grey-border disabled:hover:text-grey-text disabled:hover:border-grey-border transition font-roboto-condensed`}
//             type="submit"
//           >
//             Update Account
//           </button>
//         </div>
//         <div className="mt-8">
//           {investorTypes.map((investorType) => {
//             return (
//               <p key={investorType.value} className="text-grey-text mt-2">
//                 <span className="font-bold">{investorType.text}</span>:{" "}
//                 {investorType.fullText}
//               </p>
//             );
//           })}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Settings;
