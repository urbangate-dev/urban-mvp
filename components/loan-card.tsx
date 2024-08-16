import Link from "next/link";
import Image from "next/image";
import PropertyImage from "../public/testproperty.jpeg";
import { Loan, PaymentCreateProps, User } from "@/utils/props";
import { Property as Prop } from "@/utils/props";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  formatCurrency,
  formatDate,
  getDaySuffix,
  getPreviousDateByMonths,
  parseDate,
} from "../utils/functions";

import { useWriteContract } from "wagmi";
import { abi } from "../abi/loan";
import { abi as erc20abi } from "../abi/erc20";
import localFont from "@next/font/local";

const robotoMono = localFont({
  src: [
    {
      path: "../public/fonts/RobotoMono-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-roboto-mono",
});

interface LoanCardProps {
  loan: Loan;
  user: User;
  updateLoan: (loan: Loan) => void;
}

export default function LoanCard({ loan, user, updateLoan }: LoanCardProps) {
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

  const nameURL = user.name.replace(/ /g, "%20");
  const today = new Date();
  const monthNumber = Number(today.getMonth());
  const day = String(today.getDate());
  const year = today.getFullYear();
  const year2 = year.toString().slice(-2);
  const formattedDay = getDaySuffix(day);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[monthNumber];
  const sum = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(property.loanAmount);
  const yieldFormatted = property.yieldPercent + "%";
  const dateBeforeMaturity = getPreviousDateByMonths(
    property.maturityDate,
    property.term
  );
  const dateBeforeMaturityFormatted = formatDate(dateBeforeMaturity).replace(
    / /g,
    "%20"
  );
  const monthAfter = monthNames[monthNumber + 1];
  const parsedMaturityDate = parseDate(property.maturityDate);
  const formattedMaturityDate = formatDate(parsedMaturityDate).replace(
    / /g,
    "%20"
  );
  const addressFull =
    property.address +
    ", " +
    property.city +
    ", " +
    property.state +
    " " +
    property.zip;
  const formattedAddressFull = addressFull.replace(/ /g, "%20");

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`/api/property/${loan.propertyId}`);
      setProperty(response.data.property);
    } catch (error) {
      console.error("Error fetching property: ", error);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, []);

  const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSuccess: async (data) => {
        try {
          const response = await axios.put(`/api/loan/${loan.id}`, {
            ...loan,
            funding: true,
          });
          updateLoan(response.data.loan);
          console.log("Transaction successful");
        } catch (error) {
          console.error("Updating loan failed:", error);
        }
      },
      onError: (error) => {
        console.error("FundLoan transaction failed:", error);
      },
    },
  });
  const { writeContractAsync: writeApprove } = useWriteContract({
    mutation: {
      onSuccess: async (data) => {
        try {
          await delay(6000);
          await writeContractAsync({
            abi,
            address: "0xEEA1072eC78fA23BE2A9F9058d68CF969F97A23E",
            functionName: "fundLoan",
            args: [parseInt(property.propertyIndex)],
          });
          console.log("FundLoan transaction successful");
        } catch (error) {
          console.error("FundLoan transaction failed:", error);
        }
      },
      onError: (error) => {
        console.error("Approve transaction failed:", error);
      },
    },
  });

  const fundLoan = async () => {
    try {
      await writeApprove({
        abi: erc20abi,
        address: "0x1bD42dd90F5256fb0E62CCdAfDa27c25Dc190c28",
        functionName: "approve",
        args: [
          "0xEEA1072eC78fA23BE2A9F9058d68CF969F97A23E",
          property.loanAmount,
        ],
      });
      const payment: PaymentCreateProps = {
        balance: -property.loanAmount,
        paymentDate: defaultDate,
        loanId: loan.id,
        status: "Funded",
        tx: "",
      };
      const response = await axios.post("/api/payment", payment);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-5 text-white border border-grey-border gap-6 flex">
      {/* <div className="relative overflow-hidden col-span-1 max-w-20 aspect-video">
        <Image
          src={property.thumbnail}
          alt="property"
          className="opacity-80 h-full w-full aspect-video"
          width={200}
          height={200}
          objectFit="cover"
        />
      </div> */}
      <div className="relative" style={{ width: "200px", height: "100" }}>
        <Image
          src={property.thumbnail}
          alt="property"
          layout="fill" // Fill the container
          objectFit="cover" // Cover the container while maintaining aspect ratio
          className="opacity-80 " // Apply rounded corners to the top
        />
      </div>
      <div className="w-full col-span-5">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <p className="uppercase font-light text-2xl">
              {property.address}, {property.city}, {property.state}{" "}
              {property.zip}
            </p>
          </div>
          {loan.pending ? (
            <p
              className="text-gold text-2xl font-light"
              style={{ fontVariant: "all-small-caps" }}
            >
              Pending
            </p>
          ) : loan.funding ? (
            <p className="text-gold text-xl font-roboto-mono">Funded</p>
          ) : loan.paid ? (
            <p className="text-green-500 text-xl font-roboto-mono">Paid Off</p>
          ) : (
            <p className="text-green-500 text-xl font-roboto-mono">
              Ready To Fund
            </p>
          )}
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
            <p>10%</p>
          </div>
          <div className="flex gap-2">
            <p className="text-grey-text">Maturity Date</p>
            <p className="text-grey-text">•</p>
            <p>{formatDate(parsedMaturityDate)}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-3">
          <Link
            href={`/property/${loan.propertyId}`}
            className={`text-lg font-extralight border border-gold rounded-full py-2 px-4 transition ${robotoMono.variable} font-roboto-mono uppercase text-gold hover:text-dark-gold hover:border-dark-gold cursor-pointer`}
          >
            View Property
          </Link>
          {loan.pending ? (
            <a
              href={
                process.env.NEXT_PUBLIC_POWERFORM_URL +
                `&Investor_UserName=${nameURL}&Investor_Email=${
                  user.email
                }&Day1=${formattedDay}&Month1=${monthName}&Year1=${year}&Sum=${sum}&Yield=${yieldFormatted}&Date2=${dateBeforeMaturityFormatted}&Month2=${monthAfter}&MaturityDate=${formattedMaturityDate}&Term=${
                  property.term
                }&Year2=${year2}&Address=${formattedAddressFull}&${
                  user.investorType === "net-worth-over-1-million"
                    ? "investor1"
                    : user.investorType === "income-over-200k"
                    ? "investor2"
                    : user.investorType === "holds-licenses"
                    ? "investor3"
                    : user.investorType === "bank-or-institution"
                    ? "investor4"
                    : user.investorType === "registered-investment-adviser"
                    ? "investor5"
                    : user.investorType ===
                      "private-business-development-company"
                    ? "investor6"
                    : user.investorType === "rural-business-investment-company"
                    ? "investor7"
                    : user.investorType === "organization-over-5-million"
                    ? "investor8"
                    : user.investorType === "director-executive-officer"
                    ? "investor9"
                    : user.investorType === "trust-over-5-million"
                    ? "investor10"
                    : user.investorType === "family-office"
                    ? "investor11"
                    : user.investorType === "entity-over-5-million"
                    ? "investor12"
                    : user.investorType === "entity-all-accredited-investors"
                    ? "investor13"
                    : ""
                }=x&State=${user.state}&LoanID=${loan.id}`
              }
              className={`text-lg font-extralight border border-gold rounded-full py-2 px-4 transition ${robotoMono.variable} font-roboto-mono uppercase text-gold hover:text-dark-gold hover:border-dark-gold cursor-pointer`}
              target="_blank"
            >
              Docusign Link
            </a>
          ) : loan.funding ? (
            <Link
              href={`/user/payment/${loan.id}`}
              className={`text-lg font-extralight border border-gold rounded-full py-2 px-4 transition ${robotoMono.variable} font-roboto-mono uppercase text-gold hover:text-dark-gold hover:border-dark-gold cursor-pointer`}
            >
              Payment History
            </Link>
          ) : (
            <p
              onClick={fundLoan}
              className={`text-lg font-extralight border border-white rounded-full py-2 px-4 transition ${robotoMono.variable} font-roboto-mono uppercase text-white hover:text-gray-200 hover:border-gray-200 cursor-pointer`}
            >
              Fund Now
            </p>
          )}
          {/* {loan.pending ? (
            <p className="text-2xl font-extralight text-red-500 cursor-pointer">
              Remove Loan
            </p>
          ) : (
            ""
          )} */}
        </div>
      </div>
    </div>
  );
}
