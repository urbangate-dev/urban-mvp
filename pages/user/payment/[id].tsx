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
  const { id } = router.query;
  const [loan, setLoan] = useState<Loan>({
    id: "",
    loanAmount: 0,
    loanToARV: 0,
    loanToAsIs: 0,
    loanToCost: 0,
    term: 0,
    returnValue: 0,
    propertyId: "",
    userId: "",
    walletAddress: "",
    pending: false,
    funding: false,
  });
  const [property, setProperty] = useState<string>("");

  const fetchLoan = async () => {
    try {
      const response = await axios.get("/api/loan");
      const loans: Loan[] = response.data.loans;
      console.log("response: ", loans);
      console.log("id", id);

      const foundLoan = loans.find((loan) => loan.id == id);
      console.log(foundLoan);
      if (foundLoan) {
        setLoan(foundLoan);
        fetchProperty(foundLoan.propertyId);
      } else {
        console.error("Loan not found");
      }
    } catch (error) {
      console.error("Error fetching loan: ", error);
    }
  };

  const fetchProperty = async (propId: string) => {
    try {
      const response = await axios.get(`/api/property/${propId}`);
      setProperty(response.data.property.address);
    } catch (error) {
      console.error("Error fetching property: ", error);
    }
  };

  useEffect(() => {
    fetchLoan();
  }, [id]);

  return (
    <div className="px-20 min-h-screen bg-gray-50">
      <p>Payment history page for loan {property}</p>
    </div>
  );
};

export default Account;
