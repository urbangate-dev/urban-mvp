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
    console.log(loans);
  }, [user]);

  return (
    <div className="p-10">
      {isConnected && user?.name != "" ? (
        <div>
          <p className="text-3xl mb-4">Your Loans</p>
          {loans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
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
