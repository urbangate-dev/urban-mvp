import Link from "next/link";
import Image from "next/image";
import PropertyImage from "../public/testproperty.jpeg";
import { Loan, User } from "@/utils/props";
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

import { useWriteContract } from 'wagmi'
import { abi } from '../abi/loan'
import { abi as erc20abi} from '../abi/erc20'


interface LoanCardProps {
  loan: Loan;
  user: User;
}

export default function LoanCard({ loan, user }: LoanCardProps) {
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


  const { data: hash, writeContract, isPending, isSuccess, isError } = useWriteContract();
  const [index, setIndex] = useState("")

  const fundLoan = async () => {
  
  await writeContract({
      abi: erc20abi,
      address: '0x1bD42dd90F5256fb0E62CCdAfDa27c25Dc190c28',
      functionName: 'approve',
      args: ['0x163aD5b66D50F228ca4Ec7B60DB6A3828aCb6128', parseInt(loan.loanAmount)],
  });

  await writeContract({
      abi,
      address: '0x163aD5b66D50F228ca4Ec7B60DB6A3828aCb6128',
      functionName: 'fundLoan',
      args: [16],
    });

  };
  useEffect(() => {
    if (isSuccess) {
      console.log("Contract written successfully.", hash);
    }
  }, [isSuccess, hash]);
  return (
    <div className="p-5 rounded-3xl bg-white shadow-lg flex gap-6">
      <div>
        <Image src={PropertyImage} alt="property" className="" width={200} />
      </div>
      <div className="w-full">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <p className="font-semibold text-3xl">
              {property.address}, {property.city}, {property.state}{" "}
              {property.zip}
            </p>
            <div className="border-r"></div>
            <p className="font-semibold text-3xl">
              {formatCurrency(loan.loanAmount)}
            </p>
          </div>
          {loan.pending ? (
            <p className="text-orange-400 text-xl">Pending</p>
          ) : (
            <p className="text-green-500 text-xl">Approved</p>
          )}
        </div>

        <div className="flex gap-4 mt-2">
          <p className="text-xl">
            Loan to ARV: <span className="font-light">{loan.loanToARV}%</span>
          </p>
          <p className="text-xl">
            Loan to As-Is:{" "}
            <span className="font-light">{loan.loanToAsIs}%</span>
          </p>
          <p className="text-xl">
            Loan to Cost: <span className="font-light">{loan.loanToCost}%</span>
          </p>
          <p className="text-xl">
            Return Value:{" "}
            <span className="font-light">
              {formatCurrency(loan.loanAmount)}
            </span>
          </p>
        </div>

        <div className="flex gap-8 mt-3">
          <Link
            href={`/property/${loan.propertyId}`}
            className="text-2xl font-extralight hover:text-gray-500 transition"
          >
            View Property
          </Link>
          {loan.pending ? (
            <a
              href={
                process.env.NEXT_PUBLIC_POWERFORM_URL +
                `&Investor_UserName=${nameURL}&Investor_Email=${user.email}&Day1=${formattedDay}&Month1=${monthName}&Year1=${year}&Sum=${sum}&Yield=${yieldFormatted}&Date2=${dateBeforeMaturityFormatted}&Month2=${monthAfter}&MaturityDate=${formattedMaturityDate}&Term=${property.term}&Year2=${year2}&Address=${formattedAddressFull}`
              }
              className="text-2xl font-extralight hover:text-gray-500 transition"
              target="_blank"
            >
              Docusign Link
            </a>
          ) : (
            <p
              onClick={fundLoan}
              className="text-2xl font-medium cursor-pointer text-gold hover:text-dark-gold transition"
            >
              Fund Loan
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
