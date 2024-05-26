import { ChildPageProps } from "@/utils/props";
import axios from "axios";
import Link from "next/link";
import { Loan } from "@/utils/props";
import { useEffect, useState } from "react";
import LoanCard from "@/components/loan-card";

const Account: React.FC<ChildPageProps> = ({
  isConnected,
  address,
  user,
  router,
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
    if (!isConnected) router.push("/");
    else fetchLoans();
  }, [user]);

  return (
    <div className="px-20 min-h-screen bg-gray-50">
      {isConnected && user?.name != "" ? (
        <div>
          <p className="font-bold text-5xl pt-20">Welcome, {user.name}!</p>
          {hasPending ? (
            <p className="text-xl font-light mb-4 mt-8">
              After completing the DocuSign, please be on the lookout for an
              approval email when UrbanGate approves your loan.
            </p>
          ) : (
            ""
          )}
          {hasApproved ? (
            <p className="text-xl font-light mb-4 mt-8">
              One of your loans has been approved! Please click "Fund Loan" to
              begin your investment.
            </p>
          ) : (
            ""
          )}
          <p className="text-3xl mb-4 mt-8">Your Loans</p>

          <div className="flex flex-col gap-4">
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
              <p className="text-2xl italic font-light">
                You currently have no loans.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p>Not logged in.</p>
        </div>
      )}
    </div>
  );
};

export default Account;
