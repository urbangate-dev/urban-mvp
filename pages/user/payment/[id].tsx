import { ChildPageProps, Payment } from "@/utils/props";
import axios from "axios";
import Link from "next/link";
import { Loan } from "@/utils/props";
import { useEffect, useState } from "react";
import LoanCard from "@/components/loan-card";
import { formatCurrency } from "../../../utils/functions";
import PaymentCard from "@/components/payment-card";

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
  const [payments, setPayments] = useState<Payment[]>([]);

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
        fetchPayments(foundLoan.id);
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

  const fetchPayments = async (loanId: string) => {
    try {
      const response = await axios.get(`/api/payment/${loanId}`);
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments: ", error);
    }
  };

  const calculateTotalBalance = (payments: Payment[]): number => {
    return payments.reduce((total, payment) => total + payment.balance, 0);
  };

  const totalBalance = calculateTotalBalance(payments);

  useEffect(() => {
    if (id) fetchLoan();
  }, [id]);

  return (
    <div className="px-20 min-h-screen bg-gray-50">
      <p className="font-semibold text-4xl pt-20">
        Payment History for {property}
      </p>
      <div className="flex gap-4 mt-4">
        <p className="text-2xl font-light">
          Balance:{" "}
          <span className="font-normal">{formatCurrency(loan.loanAmount)}</span>
        </p>
        <div className="border-r"></div>
        <p className="text-2xl font-light">
          Net Earned:{" "}
          <span className="font-normal">{formatCurrency(totalBalance)}</span>
        </p>
      </div>
      <div className="flex flex-col gap-3 mt-8">
        {payments
          ? payments.map((payment) => <PaymentCard payment={payment} />)
          : ""}
      </div>
    </div>
  );
};

export default Account;
