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

  const fetchLoans = async () => {
    if (user.id !== "")
      try {
        const response = await axios.get(`/api/loan/${user.id}`);
        setLoans(response.data);
      } catch (error) {
        console.error("Error fetching loans: ", error);
      }
  };

  useEffect(() => {
    if (!isConnected) router.push("/");
    else fetchLoans();
  }, [user]);

  return (
    <div className="px-20 min-h-screen bg-gray-50">
      {isConnected && user?.name != "" ? (
        <div>
          <p className="font-bold text-5xl pt-20">Welcome, {user.name}</p>
          <p className="text-3xl mb-4 mt-8">Your Loans</p>
          <p className="text-2xl font-light mb-6">
            Active loan requests and successfully funded loans will be shown
            below.
          </p>
          <div className="flex flex-col gap-4">
            {loans.map((loan) => (
              <LoanCard key={loan.id} loan={loan} user={user} />
            ))}
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
