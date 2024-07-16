import { ChildPageProps, Payment } from "@/utils/props";
import axios from "axios";
import Link from "next/link";
import { Loan } from "@/utils/props";
import { useEffect, useState } from "react";
import LoanCard from "@/components/loan-card";
import { formatCurrency } from "../../../utils/functions";
import PaymentCard from "@/components/payment-card";
import localFont from "@next/font/local";

const robotoCondensed = localFont({
  src: [
    {
      path: "../../../public/fonts/RobotoCondensed-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-roboto-condensed",
});

const robotoMono = localFont({
  src: [
    {
      path: "../../../public/fonts/RobotoMono-Regular.ttf",
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
    paid: false,
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
        if (foundLoan.userId == user.id) {
          setLoan(foundLoan);
          fetchProperty(foundLoan.propertyId);
          fetchPayments(foundLoan.id);
        }
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
    return payments
      .filter((payment) => payment.balance >= 0)
      .reduce((total, payment) => total + payment.balance, 0);
  };

  const totalBalance = calculateTotalBalance(payments);

  useEffect(() => {
    if (id) fetchLoan();
  }, [id]);

  return (
    <div className="px-20 pb-20 min-h-screen text-white">
      {loan.userId === "" ? (
        <p>Unauthorized</p>
      ) : (
        <div>
          <div className=" mt-16 py-8">
            <p
              className={`text-4xl ${robotoCondensed.variable} font-roboto-condensed text-white font-light uppercase text-center`}
            >
              Payment History for
            </p>
            <p
              className="text-gold text-center text-4xl"
              style={{ fontVariant: "all-small-caps" }}
            >
              {property}
            </p>
          </div>
          <div className="flex items-start gap-8">
            <div className="flex flex-col">
              <div className="border border-grey-border px-20 py-10 flex flex-col items-center">
                <p className="text-2xl uppercase font-light">Balance</p>
                <p className="text-gold text-4xl">
                  {formatCurrency(loan.loanAmount)}
                </p>
              </div>

              <div className="border-l border-r border-b border-grey-border px-20 py-10 flex flex-col items-center">
                <p className="text-2xl uppercase font-light">Net Profits</p>
                <p className="text-gold text-4xl">
                  {" "}
                  {formatCurrency(totalBalance)}
                </p>
              </div>

              <div className="border-l border-r border-b border-grey-border px-20 py-10 flex flex-col items-center">
                <p className="text-2xl uppercase font-light">
                  Duration Remaining
                </p>
                <p className="text-gold text-4xl uppercase">5 Months</p>
              </div>
            </div>
            <table className="border border-grey-border text-xl uppercase font-light py-4">
              <tr className="border-t border-b border-grey-border ">
                <td className="py-4 pl-4 pr-20">Id</td>
                <td className="py-4 pl-8 pr-20">Date</td>
                <td className="py-4 pl-8 pr-20">Amount</td>
                <td className="py-4 pl-8 pr-20">Status</td>
              </tr>
              {payments
                ? payments.map((payment) => (
                    <tr>
                      <td className="py-4 pl-4 pr-20">{payment.id}</td>
                      <td className="py-4 pl-8 pr-20">{payment.paymentDate}</td>
                      <td className="py-4 pl-8 pr-20">
                        {formatCurrency(payment.balance)}
                      </td>
                      <td className="py-4 pl-8 pr-20">{payment.status}</td>
                    </tr>
                  ))
                : ""}
            </table>
            {/* <div className="flex flex-col gap-3 mt-8">
        {payments
          ? payments.map((payment) => <PaymentCard payment={payment} />)
          : ""}
      </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
