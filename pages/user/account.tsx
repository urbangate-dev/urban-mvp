import { ChildPageProps } from "@/utils/props";
import axios from "axios";
import Link from "next/link";
import { Loan } from "@/utils/props";
import { useEffect, useState } from "react";
import LoanCard from "@/components/loan-card";
import localFont from "@next/font/local";

const robotoCondensed = localFont({
  src: [
    {
      path: "../../public/fonts/RobotoCondensed-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-roboto-condensed",
});

const robotoMono = localFont({
  src: [
    {
      path: "../../public/fonts/RobotoMono-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-roboto-mono",
});

const Account: React.FC<ChildPageProps> = ({
  isConnected,
  address,
  user,
  router,
  data,
}) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [hasPending, setHasPending] = useState(false);
  const [hasApproved, setHasApproved] = useState(false);

  const fetchLoans = async () => {
    if (user.id !== "")
      try {
        const response = await axios.get(`/api/loan/${user.id}`);
        setLoans(response.data);
        response.data.forEach((loan: Loan) => {
          if (loan.pending) setHasPending(true);
          if (!loan.pending && !loan.funding) setHasApproved(true);
        });
      } catch (error) {
        console.error("Error fetching loans: ", error);
      }
  };

  const updateLoan = (updatedLoan: Loan) => {
    setLoans((prevLoans) =>
      prevLoans.map((loan) => (loan.id === updatedLoan.id ? updatedLoan : loan))
    );
  };

  useEffect(() => {
    fetchLoans();
  }, [user]);

  return (
    <div className="px-20 min-h-screen">
      <div>
        {/* <p className="font-bold text-5xl pt-20">Welcome, {user.name}!</p> */}
        {/* {hasPending ? (
            <p className="text-xl font-light mb-4 mt-8">
              After completing the DocuSign, please be on the lookout for an
              approval email when UrbanGate approves your loan.
            </p>
          ) : (
            ""
          )} */}
        {/* {hasApproved ? (
            <p className="text-xl font-light mb-4 mt-8">
              One of your loans has been approved! Please click "Fund Loan" to
              begin your investment.
            </p>
          ) : (
            ""
          )} */}
        <div className="border border-grey-border py-6 mt-16 rounded-t-3xl">
          <p
            className={`text-4xl mb-4 mt-8 ${robotoCondensed.variable} font-roboto-condensed text-white font-light uppercase text-center`}
          >
            Your Account Summary
          </p>
        </div>

        <div className="text-white grid grid-cols-4">
          <div className="border-l border-r border-b border-grey-border flex flex-col items-center p-8 flex-grow">
            <p
              className="uppercase text-2xl font-light"
              style={{ fontVariant: "all-small-caps" }}
            >
              Account Balance
            </p>
            <p
              className={`text-gold ${robotoCondensed.variable} font-roboto-condensed text-6xl tracking-wide`}
              style={{ fontVariant: "all-small-caps" }}
            >
              $100,000
            </p>
          </div>
          <div className="border-l border-r border-b border-grey-border flex flex-col items-center p-8 flex-grow">
            <p
              className="uppercase text-2xl font-light"
              style={{ fontVariant: "all-small-caps" }}
            >
              Net Profits
            </p>
            <p
              className={`text-gold ${robotoCondensed.variable} font-roboto-condensed text-6xl tracking-wide`}
              style={{ fontVariant: "all-small-caps" }}
            >
              $100,000
            </p>
          </div>
          <div className="border-l border-r border-b border-grey-border flex flex-col items-center p-8 flex-grow">
            <p
              className="uppercase text-2xl font-light"
              style={{ fontVariant: "all-small-caps" }}
            >
              Annualized Returns
            </p>
            <p
              className={`text-gold ${robotoCondensed.variable} font-roboto-condensed text-6xl tracking-wide`}
              style={{ fontVariant: "all-small-caps" }}
            >
              $100,000
            </p>
          </div>
          <div className="border-l border-r border-b border-grey-border flex flex-col items-center p-8 flex-grow">
            <p
              className="uppercase text-2xl font-light"
              style={{ fontVariant: "all-small-caps" }}
            >
              Loans
            </p>
            <p
              className={`text-gold ${robotoCondensed.variable} font-roboto-condensed text-6xl tracking-wide`}
              style={{ fontVariant: "all-small-caps" }}
            >
              1
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-16">
          {loans.length !== 0 ? (
            loans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                user={user}
                updateLoan={updateLoan}
              />
            ))
          ) : (
            <p
              className={`text-2xl text-white ${robotoMono.variable} font-roboto-mono`}
            >
              You currently have no loans. Start investing{" "}
              <Link className="text-gold" href="/">
                here!
              </Link>
            </p>
          )}
        </div>
        <div className="border border-grey-border py-6 mt-16 rounded-t-3xl">
          <p
            className={`text-4xl mb-4 mt-8 ${robotoCondensed.variable} font-roboto-condensed text-white font-light uppercase text-center`}
          >
            Your Previous Investments
          </p>
        </div>
      </div>
    </div>
  );
};

export default Account;
