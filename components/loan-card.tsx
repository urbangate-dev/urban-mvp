import Link from "next/link";
import Image from "next/image";
import PropertyImage from "../public/testproperty.jpeg";
import { Loan, PaymentCreateProps, User } from "@/utils/props";
import { Property as Prop } from "@/utils/props";
import axios from "axios";
import { useEffect, useState } from "react";
import {config} from '../utils/config'
import {
  formatCurrency,
  formatDate,
  getDaySuffix,
  getPreviousDateByMonths,
  parseDate,
} from "../utils/functions";
import { waitForTransactionReceipt } from '@wagmi/core'

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
    remainingAmount: 0,
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


  const [amount, setAmount] = useState('');
  const { writeContractAsync: writeApprove } = useWriteContract();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { writeContractAsync } = useWriteContract();


  const fundLoan = async () => {
    try {
      if(property.remainingAmount < Number(amount)){
        alert("amount too high" + property.remainingAmount)
      }
      else{
      const hashApprove = await writeApprove({
        abi: erc20abi,
        address: process.env.NEXT_PUBLIC_ERC20_ADDRESS as `0x${string}`,
        functionName: "approve",
        args: [
          process.env.NEXT_PUBLIC_LENDINGPLATFORM_ADDRESS as `0x${string}`,
          BigInt(Number(amount) * 1000000),
        ],
      });
      const transactionReceipt = await waitForTransactionReceipt(config, {
        hash: hashApprove,
      })
      console.log(transactionReceipt);
      if(transactionReceipt.status == "success"){
        const hashFund = await writeContractAsync({
            abi,
            address: process.env.NEXT_PUBLIC_LENDINGPLATFORM_ADDRESS as `0x${string}`,
            functionName: "fundLoan",
            args: [BigInt(property.propertyIndex), BigInt(Number(amount) * 1000000)],
          });
          const transactionReceiptFund = await waitForTransactionReceipt(config, {
            hash: hashFund,
          })
          console.log(transactionReceipt);
          if(transactionReceiptFund.status == "success"){
            console.log(hashFund + "- Funding Success");
            try {
              const payment: PaymentCreateProps = {
                balance: -amount,
                paymentDate: defaultDate,
                loanId: loan.id,
                status: "Funded",
                tx: "",
              };
              const responseProperty = await axios.put(`/api/property/${property.id}` , {
                ...property,
                remainingAmount: property.remainingAmount - Number(amount)
              })
              const responsePayment = await axios.post("/api/payment", payment);
              const responseLoan = await axios.put(`/api/loan/${loan.id}`, {
                ...loan,
                funding: true,
                loanAmount: Number(amount),
              });
              updateLoan(responseLoan.data.loan);
              console.log("Transaction successful");
            } catch (error) {
              console.error("Updating loan failed:", error);
            }
          }else{
            console.log(hashFund + "- Funding Reverted");
          }
      }
      else{
        console.log(hashApprove + "- Aproval Reverted")
      }
    }
    } catch (error) {
      console.error(error);
      alert("Error initiating fund loan. Check console for details.");
    }
    
    setIsModalOpen(false);
    
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
          {loan.funding ? (
            <div className="flex gap-2">
              <p className="text-grey-text">Loan</p>
              <p className="text-grey-text">•</p>
              <p>{formatCurrency(loan.loanAmount)}</p>
            </div>
          ):
          (
            <div className="flex gap-2">
            <p className="text-grey-text">Remaining Amount</p>
            <p className="text-grey-text">•</p>
            <p>{formatCurrency(property.remainingAmount)}</p>
            </div>
          )}

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
          ) :property.remainingAmount == 0 ? (
            <p
              className={`text-lg font-extralight border border-gold rounded-full py-2 px-4 transition ${robotoMono.variable} font-roboto-mono uppercase text-gold hover:text-gray-200 hover:border-gray-200 cursor-pointer`}
            >
              Loan Expired
            </p>
          ) : (
            <p
              onClick={() => setIsModalOpen(true)}
              className={`text-lg font-extralight border border-gold rounded-full py-2 px-4 transition ${robotoMono.variable} font-roboto-mono uppercase text-gold hover:text-gray-200 hover:border-gray-200 cursor-pointer`}
            >
              Fund Now
            </p>
          )}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
              <div className="bg-black border border-gold p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-light mb-6 text-gold uppercase" style={{ fontVariant: "all-small-caps" }}>Fund Loan</h2>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
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
                    onClick={fundLoan}
                    className={`px-6 py-2 bg-gold border border-gold rounded-full transition ${robotoMono.variable} font-roboto-mono uppercase text-black hover:bg-dark-gold hover:border-dark-gold`}
                  >
                    Fund Loan
                  </button>
                </div>
              </div>
            </div>
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
