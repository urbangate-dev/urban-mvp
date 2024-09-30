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
  const [state, setState] = useState("");
  const [investor, setInvestor] = useState("");
  const [validated, setValidated] = useState(true);

  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const investorTypes = [
    {
      value: "net-worth-over-1-million",
      text: "Net worth over $1M",
      fullText:
        "Any natural person whose individual net worth, or joint net worth with that person’s spouse or spousal equivalent, at the time of his purchase exceeds $1,000,000.",
    },
    {
      value: "income-over-200k",
      text: "Income over $200K",
      fullText:
        "Any natural person who had an individual income in excess of $200,000 in each of the two most recent years or joint income with that person’s spouse or spousal equivalent in excess of $300,000 in each of those years and has a reasonable expectation of reaching the same income levels in the current year.",
    },
    {
      value: "holds-licenses",
      text: "Holds certain licenses",
      fullText:
        "Any natural person who holds one of the following licenses in good standing: General Securities Representative license (Series 7), the Private Securities Offerings Representative license (Series 82), or the Investment Adviser Representative license (Series 65).",
    },
    {
      value: "bank-or-institution",
      text: "Bank or institution",
      fullText:
        'Any bank as defined in section 3(a)(2) of the Securities Act of 1933 (the "Act"), or any savings and loan association or other institution as defined in section 3(a)(5)(A) of the Act whether acting in its individual or fiduciary capacity; any broker or dealer registered pursuant to section 15 of the Securities Exchange Act of 1934; any insurance company as defined in section 2(a)(13) of the Act; any investment company registered under the Investment Company Act of 1940 or a business development company as defined in section 2(a)(48) of that Act; any Small Business Investment Company licensed by the U.S. Small Business Administration under section 301(c) or (d) of the Small Business Investment Act of 1958; any plan established and maintained by a state, its political subdivisions, or any agency or instrumentality of a state or its political subdivisions, for the benefit of its employees, if such plan has total assets in excess of $5,000,000; any employee benefit plan within the meaning of the Employee Retirement Income Security Act of 1974 if the investment decision is made by a plan fiduciary, as defined in section 3(21) of such act, which is either a bank, savings and loan association, insurance company, or registered investment adviser, or if the employee benefit plan has total assets in excess of $5,000,000 or, if a self-directed plan, with investment decisions made solely by persons that are accredited investors.',
    },
    {
      value: "registered-investment-adviser",
      text: "Registered investment adviser",
      fullText:
        "An investment adviser registered pursuant to section 203 of the Investment Advisers Act of 1940 or registered pursuant to the laws of a state; or an investment adviser relying on the exemption from registering with the Commission under section 203(l) or (m) of the Investment Advisers Act of 1940.",
    },
    {
      value: "private-business-development-company",
      text: "Private business development company",
      fullText:
        "Any private business development company as defined in section 202(a)(22) of the Investment Advisers Act of 1940.",
    },
    {
      value: "rural-business-investment-company",
      text: "Rural business investment company",
      fullText:
        "A Rural Business Investment Company as defined in section 384A of the Consolidated Farm and Rural Development Act.",
    },
    {
      value: "organization-over-5-million",
      text: "Organization with over $5M assets",
      fullText:
        "Any organization described in section 501(c)(3) of the Internal Revenue Code, corporation, Massachusetts or similar business trust, partnership, or limited liability company, not formed for the specific purpose of acquiring loans, with total assets in excess of $5,000,000.",
    },
    {
      value: "director-executive-officer",
      text: "Director or executive officer",
      fullText:
        "Any director, executive officer, or general partner of the Borrower, or any director, executive officer, or general partner of a general partner of the Borrower.",
    },
    {
      value: "trust-over-5-million",
      text: "Trust with over $5M assets",
      fullText:
        "Any trust, with total assets in excess of $5,000,000, not formed for the specific purpose of acquiring loans, whose purchase is directed by a sophisticated person as described in Rule 506(b)(2)(ii).",
    },
    {
      value: "family-office",
      text: "Family office with over $5M assets",
      fullText:
        "A “family office,” as defined in rule 202(a)(11)(G)-1 under the Investment Advisers Act of 1940 (17 CFR 275.202(a)(11)(G)-1): (i) with assets under management in excess of $5,000,000, (ii) that is not formed for the specific purpose of acquiring the securities offered, and (iii) whose prospective investment is directed by a person who has such knowledge and experience in financial and business matters that such family office is capable of evaluating the merits and risks of the prospective investment; or a “family client,” as defined in rule 202(a)(11)(G)-1 under the Investment Advisers Act of 1940 (17 CFR 275.202(a)(11)(G)-1)), of a family office meeting the requirements in paragraph (b)(15) above and whose prospective investment in the issuer is directed by such family office.",
    },
    {
      value: "entity-over-5-million",
      text: "Entity with over $5M assets",
      fullText:
        "An entity, of a type not listed above, not formed for the specific purpose of acquiring the securities offered, owning investments in excess of $5,000,000.",
    },
    {
      value: "entity-all-accredited-investors",
      text: "Entity with all accredited investors",
      fullText:
        "Any entity in which all of the equity owners are accredited investors.",
    },
  ];

  const validateAddress = async () => {
    try {
      const response = await axios.get(`/api/wallet/${address}`);
      console.log(response.data);
      if (response.data === "Address not found") {
        setValidated(false);
      }
    } catch (error) {
      console.error("Could not retrieve address", error);
    }
  };

  useEffect(() => {
    if (!isConnected || (isConnected && user?.name != "" && user)) {
      router.push("/user/login");
    }
    // validateAddress();
  }, [isConnected]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/user", {
        name,
        email,
        address,
        state,
        investor,
        approved: false,
      });
      router.push("/");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="p-20">
      {/* <div className="flex justify-center">
        {validated ? (
          ""
        ) : (
          <p className="text-gold text-lg text-center border border-gold inline-block self-center rounded-2xl px-8 py-4">
            Your wallet address has not been verified by UrbanGate yet. Please
            disconnect your wallet and sign up!
          </p>
        )}
      </div> */}

      <div className="border border-grey-border rounded-t-3xl mx-40 px-20 py-10">
        <p
          className={`text-5xl mb-2 mt-4 font-roboto-condensed hover:text-white transition font-light uppercase text-center text-white`}
          style={{ fontVariant: "all-small-caps" }}
        >
          Finish Creating Your Account
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="rounded-b-3xl border-grey-border border p-10 mx-40"
      >
        <div className="grid grid-cols-3 gap-4">
          <label className="flex flex-col text-xl col-span-7">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First and Last Name"
              className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold"
            />
          </label>
          <label className="flex flex-col text-xl col-span-7">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold"
            />
          </label>
          <label className="flex flex-col text-xl col-span-7">
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold"
            >
              <option value="" disabled>
                Select State of Residency
              </option>
              {states.map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-xl col-span-7">
            <select
              id="accredited-investor"
              value={investor}
              onChange={(e) => setInvestor(e.target.value)}
              className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold"
            >
              <option value="" disabled>
                Select Accredited Investor Status
              </option>
              {investorTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
            <p className="text-gold font-light text-sm mt-1">
              See full details for accredited investor types below
            </p>
          </label>
        </div>
        <div className="flex mt-8 justify-center">
          <button
            className={`text-gold text-xl px-4 py-2 border border-gold rounded-xl uppercase hover:text-dark-gold hover:border-dark-gold disabled:text-grey-text disabled:border-grey-border disabled:hover:text-grey-text disabled:hover:border-grey-border transition font-roboto-condensed`}
            type="submit"
            disabled={!validated}
          >
            Create Account
          </button>
        </div>
        <div className="mt-8">
          {investorTypes.map((investorType) => {
            return (
              <p key={investorType.value} className="text-grey-text mt-2">
                <span className="font-bold">{investorType.text}</span>:{" "}
                {investorType.fullText}
              </p>
            );
          })}
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;
