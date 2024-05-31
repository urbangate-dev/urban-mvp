import React from "react";

import Link from "next/link";
import {
  Loan,
  Payment,
  PaymentCreateProps,
  Property as Prop,
} from "@/utils/props";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import PropertyImage from "../public/testproperty.jpeg";
import { formatCurrency } from "@/utils/functions";

import { useWriteContract } from 'wagmi'
import { abi } from '../abi/loan'
import { abi as erc20abi} from '../abi/erc20'

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
  });
  const [visible, setVisible] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
  });

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

  const approveLoan = async () => {
    try {
      await axios.put(`/api/loan/${loan.id}`, {
        ...loan,
        pending: false,
      });
      setLoans(
        loans.map((l) => (l.id === loan.id ? { ...l, pending: false } : l))
      );
      const props = {
        name: user.name,
        email: user.email,
        address: property.address,
      };
      await axios.post("/api/email", props);
    } catch (error) {
      console.error("Error approving loan: ", error);
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
  const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

  const {writeContractAsync} = useWriteContract({
    mutation: {
    onSuccess: async (data) => {
      try {
        const payment: PaymentCreateProps = {
          balance: (property.loanAmount / 12) * (property.yieldPercent / 100),
          paymentDate: defaultDate,
          loanId: loan.id,
          status: "Due",
        };
        const response = await axios.post("/api/payment", payment);
        addPayment(response.data);
      } catch (error) {
        console.error("Error creating payment: ", error);
      }
    },
    onError: (error) => {
      console.error('FundLoan transaction failed:', error);
    },
  },});
  const { writeContractAsync: writeApprove } = useWriteContract({
    mutation: {
      onSuccess: async (data) => {
        try {
          await delay(6000);
          await writeContractAsync({
            abi,
            address: '0xEEA1072eC78fA23BE2A9F9058d68CF969F97A23E',
            functionName: 'payInterest',
            args: [parseInt(property.propertyIndex)],
          });
          console.log('FundLoan transaction successful');
        } catch (error) {
          console.error('FundLoan transaction failed:', error);
        }
      },
      onError: (error) => {
        console.error('Approve transaction failed:', error);
      },
    },
  });

  const createPayment = async () => {
    try {
      const roundedValue = Math.round((property.loanAmount / 12) * (property.yieldPercent / 100));

      await writeApprove({
          abi: erc20abi,
          address: '0x1bD42dd90F5256fb0E62CCdAfDa27c25Dc190c28',
          functionName: 'approve',
          args: ['0xEEA1072eC78fA23BE2A9F9058d68CF969F97A23E', roundedValue],
      });
    } catch (error) {
      console.error(error);
    }
  };
  // const createPayment = async () => {
  //   try {
  //     const payment: PaymentCreateProps = {
  //       balance: (property.loanAmount / 12) * (property.yieldPercent / 100),
  //       paymentDate: defaultDate,
  //       loanId: loan.id,
  //       status: "Due",
  //     };
  //     const response = await axios.post("/api/payment", payment);
  //     addPayment(response.data);

  //     /*
  //       Ruohan write code here for contract payment
  //     */
  //   } catch (error) {
  //     console.error("Error creating payment: ", error);
  //   }
  // };

  // const payLoanInFull = async () => {
  //     try {
  //       await axios.put(`/api/loan/${loan.id}`, {
  //         ...loan,
  //         paid: true,
  //       });
  //       setLoans(
  //         loans.map((l) => (l.id === loan.id ? { ...l, paid: true } : l))
  //       );

  //       /* continue logic here */
  //     } catch (error) {
  //       console.error("Error paying loan in full: ", loan);
  //     }
  //   }
  // };
    const {writeContractAsync: writeFullPay} = useWriteContract({
      mutation: {
      onSuccess: async (data) => {
        try {
          await axios.put(`/api/loan/${loan.id}`, {
            ...loan,
            paid: true,
          });
          setLoans(
            loans.map((l) => (l.id === loan.id ? { ...l, paid: true } : l))
          );
        } catch (error) {
          console.error("Error paying loan in full: ", loan);
        }
      },
      onError: (error) => {
        console.error('FundLoan transaction failed:', error);
      },
    },});
    const { writeContractAsync: writeApprovePay } = useWriteContract({
      mutation: {
        onSuccess: async (data) => {
          try {
            await delay(6000);
            await writeFullPay({
              abi,
              address: '0xEEA1072eC78fA23BE2A9F9058d68CF969F97A23E',
              functionName: 'payoffLoan',
              args: [parseInt(property.propertyIndex)],
            });
            console.log('FundLoan transaction successful');
          } catch (error) {
            console.error('FundLoan transaction failed:', error);
          }
        },
        onError: (error) => {
          console.error('Approve transaction failed:', error);
        },
      },
    });

    const payLoanInFull = async () => {
      if (window.confirm("Are you sure you want to pay this loan in full?")) {

      try {
        const amount = Math.round(property.loanAmount*2.0075)
        await writeApprovePay({
            abi: erc20abi,
            address: '0x1bD42dd90F5256fb0E62CCdAfDa27c25Dc190c28',
            functionName: 'approve',
            args: ['0xEEA1072eC78fA23BE2A9F9058d68CF969F97A23E', amount],
        });
      } catch (error) {
        console.error(error);
      }
    };
  }
  useEffect(() => {
    fetchProperty();
    fetchUser();
  }, []);

  return (
    <div className="p-5 rounded-3xl bg-white shadow-lg">
      <div className="flex gap-6">
        {/* <div>
          <Image src={PropertyImage} alt="property" className="" width={120} />
        </div> */}
        <div>
          <div className="flex gap-3">
            <p className="font-semibold text-lg">{property.address}</p>
            <div className="border-r"></div>
            <p className="font-semibold text-lg">
              {formatCurrency(loan.loanAmount)}
            </p>
          </div>
          <div className="flex gap-4">
            <p className="text-md">
              Investor: <span className="font-light">{user.name}</span>
            </p>
            <p className="text-md">
              ARV: <span className="font-light">{loan.loanToARV}%</span>
            </p>
            <p className="text-md">
              Term: <span className="font-light">{loan.term} Months</span>
            </p>
          </div>
          <div className="flex gap-3 mt-1">
            {loan.pending ? (
              <p
                className="text-green-500 cursor-pointer font-light text-lg hover:text-green-400 transition"
                onClick={approveLoan}
              >
                Approve
              </p>
            ) : loan.funding && !loan.paid ? (
              <p
                className="text-gold cursor-pointer font-light text-lg hover:text-dark-gold transition"
                onClick={createPayment}
              >
                Pay Interest
              </p>
            ) : (
              ""
            )}
            {loan.funding && !loan.paid ? (
              <p
                className="text-gold cursor-pointer font-light text-lg hover:text-dark-gold transition"
                onClick={payLoanInFull}
              >
                Pay Loan
              </p>
            ) : (
              ""
            )}
            <Link
              className="font-light text-lg hover:text-gray-500 transition"
              href={`/property/${loan.propertyId}`}
            >
              View
            </Link>

            <p
              className="cursor-pointer font-light text-lg hover:text-gray-500 transition"
              onClick={() => setVisible(!visible)}
            >
              Details
            </p>
            <p
              onClick={deleteLoan}
              className="cursor-pointer text-red-500 font-light text-xl hover:text-red-400 transition"
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
    </div>
  );
}
