import React from "react";
import Link from "next/link";
import { Loan, PaymentCreateProps, Property as Prop } from "@/utils/props";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import PropertyImage from "../public/testproperty.jpeg";
import { formatCurrency, formatDate, parseDate } from "@/utils/functions";
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
    </div>
  );
}
