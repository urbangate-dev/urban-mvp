import React from "react";

import Link from "next/link";
import { Loan, PaymentCreateProps, Property as Prop } from "@/utils/props";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import PropertyImage from "../public/testproperty.jpeg";
import { formatCurrency, formatDate, parseDate } from "@/utils/functions";
import { waitForTransactionReceipt, readContract } from "@wagmi/core";
import { useWriteContract } from "wagmi";
import { abi } from "../abi/loan";
import { abi as erc20abi } from "../abi/erc20";
import localFont from "@next/font/local";
import { Payment } from "@prisma/client";
import { config } from "../utils/config";
import { buffer } from "stream/consumers";

const robotoMono = localFont({
  src: [
    {
      path: "../public/fonts/RobotoMono-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-roboto-mono",
});

type User = {
  name: string;
  email: string;
};

interface LoanCardAdminProps {
  loan: Loan;
  loans: Loan[];
  setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
  addPayment: (payment: Payment) => void;
}

export default function LoanCardAdmin({
  loan,
  loans,
  setLoans,
  addPayment,
}: LoanCardAdminProps) {
  const defaultDate = new Date().toISOString().split("T")[0];
  const [property, setProperty] = useState<Prop>({
    id: "",
    address: "",
    dealDescription: "",
    propertyDescription: "",
    city: "",
    state: "",
    zip: "",
    propertyType: "",
    bathroom: 0,
    bedroom: 0,
    sqft: 0,
    loanAsIsValue: 0,
    loanARVValue: 0,
    loanToCostValue: 0,
    loanAmount: 0,
    yieldPercent: 0,
    maturityDate: defaultDate,
    term: 0,
    borrower: "",
    rehabBudget: 0,
    exitStrategy: "",
    borrowerExperience: "",
    borrowerNumberOfDeals: 0,
    borrowerDescription: "",
    investorPresentationLink: "",
    draft: true,
    thumbnail: "",
    additional: [],
    propertyIndex: "",
    remainingAmount: 0,
    paid: false,
  });
  const [visible, setVisible] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const parsedMaturityDate = parseDate(property.maturityDate);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`/api/property/${loan.propertyId}`);
      setProperty(response.data.property);
    } catch (error) {
      console.error("Error fetching property: ", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/user/${loan.walletAddress}`);
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user: ", error);
    }
  };

  const deleteLoan = async () => {
    if (window.confirm("Are you sure you want to delete this loan?")) {
      try {
        await axios.delete(`/api/loan/${loan.id}`);
        setLoans(loans.filter((loanInState) => loanInState.id !== loan.id));
      } catch (error) {
        console.error("Error deleting loan: ", error);
      }
    }
  };

  const { writeContractAsync: writeApprove } = useWriteContract();
  const { writeContractAsync: writeInterest } = useWriteContract();
  const createPayment = async () => {
    try {
      const hashApprove = await writeApprove({
        abi: erc20abi,
        address: process.env.NEXT_PUBLIC_ERC20_ADDRESS as `0x${string}`,
        functionName: "approve",
        args: [
          process.env.NEXT_PUBLIC_LENDINGPLATFORM_ADDRESS as `0x${string}`,
          BigInt(
            Math.ceil(
              Number(
                (property.loanAmount * property.yieldPercent * 1000000) / 12
              )
            )
          ),
        ],
      });
      const transactionReceipt = await waitForTransactionReceipt(config, {
        hash: hashApprove,
      });
      console.log(transactionReceipt);
      if (transactionReceipt.status == "success") {
        const hashFund = await writeInterest({
          abi,
          address: process.env
            .NEXT_PUBLIC_LENDINGPLATFORM_ADDRESS as `0x${string}`,
          functionName: "payInterest",
          args: [BigInt(property.propertyIndex)],
        });
        const transactionReceiptFund = await waitForTransactionReceipt(config, {
          hash: hashFund,
        });
        console.log(transactionReceipt);
        if (transactionReceiptFund.status == "success") {
          try {
            const payment: PaymentCreateProps = {
              balance:
                (property.loanAmount / 12) * (property.yieldPercent / 100),
              paymentDate: defaultDate,
              loanId: loan.id,
              status: "Paid",
              tx: hashFund,
            };
            const response = await axios.post("/api/payment", payment);
            addPayment(response.data);
          } catch (error) {
            console.error("Error creating payment: ", error);
          }
        } else {
          console.log(hashFund + "- Interest Reverted");
        }
      } else {
        console.log(hashApprove + "- Aproval Reverted");
      }
    } catch (error) {
      console.error(error);
      alert("Error initiating fund loan. Check console for details.");
    }
  };

  const { writeContractAsync: writeApproveFull } = useWriteContract();
  const { writeContractAsync: writeFullLoan } = useWriteContract();
  const [bufferDays, setBufferDays] = useState<number>(0);

  const payLoanInFull = async () => {
    setIsModalOpen(false);
    try {
      const amountDue = (await readContract(config, {
        abi,
        address: process.env
          .NEXT_PUBLIC_LENDINGPLATFORM_ADDRESS as `0x${string}`,
        functionName: "payOffLoanAmount",
        args: [BigInt(property.propertyIndex), BigInt(bufferDays)],
      })) as bigint;

      if (
        window.confirm(
          `Are you sure you want to pay this loan in full? (${
            Number(amountDue) / 1_000_000
          })`
        )
      ) {
        const approveFullHash = await writeApproveFull({
          abi: erc20abi,
          address: process.env.NEXT_PUBLIC_ERC20_ADDRESS as `0x${string}`,
          functionName: "approve",
          args: [
            process.env.NEXT_PUBLIC_LENDINGPLATFORM_ADDRESS as `0x${string}`,
            amountDue,
          ],
        });

        const transactionReceipt = await waitForTransactionReceipt(config, {
          hash: approveFullHash,
        });

        console.log(transactionReceipt);

        if (transactionReceipt.status === "success") {
          const hashFullFund = await writeFullLoan({
            abi,
            address: process.env
              .NEXT_PUBLIC_LENDINGPLATFORM_ADDRESS as `0x${string}`,
            functionName: "payoffLoan",
            args: [BigInt(property.propertyIndex), BigInt(bufferDays)],
          });

          const transactionReceiptFund = await waitForTransactionReceipt(
            config,
            {
              hash: hashFullFund,
            }
          );

          console.log(transactionReceiptFund);

          if (transactionReceiptFund.status === "success") {
            try {
              await axios.put(`/api/loan/${loan.id}`, {
                ...loan,
                paid: true,
              });
              setLoans(
                loans.map((l) => (l.id === loan.id ? { ...l, paid: true } : l))
              );
            } catch (error) {
              console.error("Error paying loan in full: ", error);
            }
          } else {
            console.log(hashFullFund + "- Interest Reverted");
          }
        } else {
          console.log(approveFullHash + "- Approval Reverted");
        }
      }
    } catch (error) {
      console.log("error - " + error);
    }
  };

  useEffect(() => {
    fetchProperty();
    fetchUser();
  }, []);

  return (
    <div className="p-5 border border-grey-border shadow-lg text-white">
      <div className="flex gap-6">
        {/* <div>
          <Image src={PropertyImage} alt="property" className="" width={120} />
        </div> */}
        <div>
          <div className="flex gap-3">
            <p className="uppercase font-light text-2xl">{property.address}</p>
          </div>
          <div
            className={`flex gap-x-4 mt-2 ${robotoMono.variable} font-roboto-mono text-xl flex-wrap gap-y-1`}
          >
            <div className="flex gap-2">
              <p className="text-grey-text">Loan</p>
              <p className="text-grey-text">•</p>
              <p>{formatCurrency(loan.loanAmount)}</p>
            </div>
            <div className="flex gap-2">
              <p className="text-grey-text">Annual Return</p>
              <p className="text-grey-text">•</p>
              <p>{property.yieldPercent}%</p>
            </div>
            <div className="flex gap-2">
              <p className="text-grey-text">Maturity Date</p>
              <p className="text-grey-text">•</p>
              <p>{formatDate(parsedMaturityDate)}</p>
            </div>
            <div className="flex gap-2">
              <p className="text-grey-text">Investor</p>
              <p className="text-grey-text">•</p>
              <p>{user?.name}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-3">
            {loan.pending ? (
              ""
            ) : // <p
            //   className={`text-lg font-extralight border border-green-500 rounded-full py-2 px-4 transition ${robotoMono.variable} font-roboto-mono uppercase text-green-500 hover:text-green-400 hover:border-green-400 cursor-pointer`}
            //   onClick={approveLoan}
            // >
            //   Approve
            // </p>
            loan.funding && !loan.paid ? (
              <p
                className={`text-lg font-extralight border border-gold rounded-full py-2 px-4 transition ${robotoMono.variable} font-roboto-mono uppercase text-gold hover:text-dark-gold hover:border-dark-gold cursor-pointer`}
                onClick={createPayment}
              >
                Pay Interest
              </p>
            ) : (
              ""
            )}
            {loan.funding && !loan.paid ? (
              <p
                className={`text-lg font-extralight border border-gold rounded-full py-2 px-4 transition ${robotoMono.variable} font-roboto-mono uppercase text-gold hover:text-dark-gold hover:border-dark-gold cursor-pointer`}
                onClick={() => setIsModalOpen(true)}
              >
                Pay Loan
              </p>
            ) : (
              ""
            )}
            <Link
              className={`text-lg font-extralight border border-gold rounded-full py-2 px-4 transition ${robotoMono.variable} font-roboto-mono uppercase text-gold hover:text-dark-gold hover:border-dark-gold cursor-pointer`}
              href={`/property/${loan.propertyId}`}
            >
              View
            </Link>

            <p
              onClick={deleteLoan}
              className={`text-lg font-extralight border border-red-600 rounded-full py-2 px-4 transition ${robotoMono.variable} font-roboto-mono uppercase text-red-600 hover:text-red-400 hover:border-red-400 cursor-pointer`}
            >
              Delete
            </p>
          </div>
        </div>
      </div>

      {visible ? (
        <div className="mt-2">
          <div className="flex gap-6">
            <p className="text-md">
              Loan to ARV: <span className="font-light">{loan.loanToARV}%</span>
            </p>
            <p className="text-md">
              Loan to As-Is:{" "}
              <span className="font-light">{loan.loanToAsIs}%</span>
            </p>
            <p className="text-md">
              Loan to Cost:{" "}
              <span className="font-light">{loan.loanToCost}%</span>
            </p>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-black border border-gold p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2
              className="text-2xl font-light mb-6 text-gold uppercase"
              style={{ fontVariant: "all-small-caps" }}
            >
              Number of Buffer Days (max is 15)
            </h2>
            <input
              type="number"
              value={bufferDays}
              onChange={(e) => setBufferDays(Number(e.target.value))}
              placeholder="Enter buffer days"
              min="0"
              max="15"
              className="w-full px-4 py-3 mb-6 text-white bg-grey-input border border-grey-border rounded-md placeholder-grey-text focus:outline-none focus:border-dark-gold"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className={`px-6 py-2 border border-gold rounded-full transition ${robotoMono.variable} font-roboto-mono uppercase text-gold hover:text-dark-gold hover:border-dark-gold`}
              >
                Cancel
              </button>
              <button
                onClick={payLoanInFull}
                className={`px-6 py-2 bg-gold border border-gold rounded-full transition ${robotoMono.variable} font-roboto-mono uppercase text-black hover:bg-dark-gold hover:border-dark-gold`}
              >
                Pay Off Loan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
