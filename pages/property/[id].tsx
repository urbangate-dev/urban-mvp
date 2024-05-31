import React, { useEffect, useState } from "react";
import { ChildPageProps, Loan } from "@/utils/props";
import { Property as Prop } from "@/utils/props";
import { LoanCreateProps } from "@/utils/props";
import axios from "axios";
import Image from "next/image";
import PropertyImage from "../../public/noimage.png";
import Link from "next/link";
import { formatNumberWithCommas } from "../../utils/functions";
import {
  formatCurrency,
  formatDate,
  getDaySuffix,
  getPreviousDateByMonths,
  parseDate,
} from "@/utils/functions";

const Property: React.FC<ChildPageProps> = ({
  isConnected,
  address,
  user,
  router,
}) => {
  const { id } = router.query;
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
  const [exists, setExists] = useState(false);
  const [monthRows, setMonthRows] = useState<number[]>([]);
  const [monthRowsMinusOne, setMonthRowsMinusOne] = useState<number[]>([]);
  const [hasLoan, setHasLoan] = useState<boolean>(false);

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

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const generateArray = (n: number): number[] => {
    return Array(n)
      .fill(0)
      .map((_, index) => index + 1);
  };

  const fetchProperty = async () => {
    if (id)
      try {
        const response = await axios.get(`/api/property/${id}`);
        if (response.data.exists) {
          setExists(true);
          setProperty(response.data.property);
          setMonthRows(generateArray(response.data.property.term + 1));
          setMonthRowsMinusOne(generateArray(response.data.property.term));
        }
        checkLoan(response.data.property.id);
      } catch (error) {
        console.error("Error fetching property: ", error);
      }
  };

  const handleInvest = async (property: Prop) => {
    try {
      const loan: LoanCreateProps = {
        loanAmount: property.loanAmount,
        loanToARV: property.loanARVValue,
        loanToAsIs: property.loanAsIsValue,
        loanToCost: property.loanToCostValue,
        term: property.term,
        returnValue: property.loanAmount,
        propertyId: property.id,
        userId: user.id,
        walletAddress: address,
        pending: true,
        funding: false,
        paid: false,
      };
      const response = axios.post("/api/loan", loan);
      router.push("/user/account");
    } catch (error) {
      console.error("Error investing in property: ", error);
    }
  };

  const checkLoan = async (propId: string) => {
    try {
      const response = await axios.get("/api/loan");
      if (
        response.data.loans.filter((loan: Loan) => loan.propertyId === propId)
          .length > 0
      )
        setHasLoan(true);
    } catch (error) {
      console.error("Error checking loan: ", error);
    }
  };

  return (
    <div className="p-20">
      {exists ? (
        <div>
          <div className="grid grid-cols-4 gap-8">
            <div className="col-span-2 row-span-2 rounded-tl-3xl rounded-bl-3xl relative overflow-hidden">
              <Image
                src={property.thumbnail}
                alt="property"
                layout="fill"
                objectFit="cover"
              />
            </div>

            <div className="relative">
              {property.additional[0] ? (
                <Image
                  src={property.additional[0]}
                  alt="property"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <Image
                  src={PropertyImage}
                  alt="property"
                  className=""
                  width={1000}
                />
              )}
            </div>

            <div className="relative rounded-tr-3xl overflow-hidden">
              {property.additional[1] ? (
                <Image
                  src={property.additional[1]}
                  alt="property"
                  objectFit="cover"
                  width={1000}
                  height={1000}
                />
              ) : (
                <Image
                  src={PropertyImage}
                  alt="property"
                  className=""
                  width={1000}
                />
              )}
            </div>

            <div className="relative">
              {property.additional[2] ? (
                <Image
                  src={property.additional[2]}
                  alt="property"
                  objectFit="cover"
                  layout="fill"
                />
              ) : (
                <Image
                  src={PropertyImage}
                  alt="property"
                  className=""
                  width={1000}
                />
              )}
            </div>

            <div className="relative rounded-br-3xl overflow-hidden">
              {property.additional[3] ? (
                <Image
                  src={property.additional[3]}
                  alt="property"
                  objectFit="cover"
                  width={1000}
                  height={1000}
                />
              ) : (
                <Image
                  src={PropertyImage}
                  alt="property"
                  className=""
                  width={1000}
                />
              )}
            </div>

            {/* <Image
              src={PropertyImage}
              alt="property"
              className=""
              width={1000}
            />
            <Image
              src={PropertyImage}
              alt="property"
              className="rounded-br-3xl"
              width={1000}
            /> */}
          </div>
          <div className="grid grid-cols-4">
            <div className="col-span-3">
              <p className="font-bold text-5xl mt-16">
                {formatCurrency(property.loanAmount)}
              </p>
              <p className="text-3xl font-light mt-4">
                {property.address}, {property.city}, {property.state}{" "}
                {property.zip}
              </p>
              <div className="mt-4 flex gap-4">
                <p className="text-2xl">{property.bedroom} Bed</p>
                <div className="border-l border-gray-300"></div>
                <p className="text-2xl">{property.bathroom} Bath</p>
                <div className="border-l border-gray-300"></div>
                <p className="text-2xl">
                  {formatNumberWithCommas(property.sqft)} SQFT
                </p>
              </div>
              <div className="flex mt-16 gap-12">
                <div className="flex flex-col">
                  <p className="text-2xl font-medium">Loan To ARV</p>
                  <p className="text-2xl mt-2 font-light">
                    {property.loanARVValue}%
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-2xl font-medium">Loan To As-Is</p>
                  <p className="text-2xl mt-2 font-light">
                    {property.loanAsIsValue}%
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-2xl font-medium">Loan To Cost</p>
                  <p className="text-2xl mt-2 font-light">
                    {property.loanToCostValue}%
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-2xl font-medium">Loan Term</p>
                  <p className="text-2xl mt-2 font-light">
                    {property.term} months
                  </p>
                </div>
              </div>
              <div className="mt-24">
                <p className="font-bold text-4xl">About the Deal</p>
                <p className="text-xl font-light mt-4 mb-4">
                  {property.dealDescription}
                </p>
                <a
                  className="text-xl font-light"
                  href={`${property.investorPresentationLink}`}
                  target="_blank"
                >
                  Watch a presentation <span className="underline">here</span>.
                </a>
              </div>
              <div className="mt-12">
                <p className="font-bold text-4xl">About the Borrower</p>
                <p className="text-xl font-light mt-4">
                  {property.borrowerDescription}
                </p>
                <div className="flex gap-4 mt-4">
                  <p className="px-8 py-4 bg-gray-100 inline-block font-extralight text-xl">
                    {property.borrowerNumberOfDeals} Deals with UrbanGate
                  </p>
                  <p className="px-8 py-4 bg-gray-100 inline-block font-extralight text-xl">
                    {property.borrowerExperience} Years of Experience
                  </p>
                </div>
              </div>
              <div className="mt-12">
                <p className="font-bold text-4xl">Investor Returns</p>
                <p className="text-xl font-light mt-4 mb-4">
                  Capital contributed: {formatCurrency(property.loanAmount)} at{" "}
                  {property.yieldPercent}%
                </p>
                <table className="border mt-8 text-lg">
                  <tr>
                    <td className="border p-3 font-bold">Month</td>
                    {monthRows.map((_, index) => (
                      <th className="border p-3 font-bold">{index + 1}</th>
                    ))}
                  </tr>
                  <tr>
                    <td className="border p-3">Monthly Interest Income</td>
                    {monthRows.map((_, index) => (
                      <td className="border p-3">
                        {formatCurrency(
                          Math.round(
                            (property.loanAmount / 12) *
                              (property.yieldPercent / 100)
                          )
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border p-3">Extension Fee Income</td>
                    {monthRowsMinusOne.map((_, index) => (
                      <td className="border p-2"></td>
                    ))}
                    <td className="border p-3">
                      {formatCurrency(Math.round(property.loanAmount * 0.0025))}
                    </td>
                  </tr>
                  {/* <tr>
                    <td className="border p-2">.25% Point Income</td>
                    {monthRowsMinusOne.map((_, index) => (
                      <td className="border p-2"></td>
                    ))}
                    <td className="border p-2">
                      ${Math.round(property.loanAmount * 0.0025)}
                    </td>
                  </tr> */}
                  <tr>
                    <td className="border p-3 font-bold">Total Income</td>
                    {monthRowsMinusOne.map((_, index) => (
                      <td className="border p-3 font-bold">
                        {formatCurrency(
                          Math.round(
                            (property.loanAmount / 12) *
                              (property.yieldPercent / 100) *
                              (index + 1)
                          )
                        )}
                      </td>
                    ))}
                    <td className="border p-3 font-bold">
                      {formatCurrency(
                        Math.round(
                          (property.loanAmount / 12) *
                            (property.yieldPercent / 100) *
                            (property.term + 1) +
                            0.005 * property.loanAmount
                        )
                      )}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div className="ml-8">
              <div className="border rounded-3xl mt-16 sticky top-[10rem]">
                <div className="flex justify-center mt-4 flex-col items-center gap-2">
                  {hasLoan ? (
                    <p className="text-xl border px-6 py-3 rounded-md text-center mx-auto text-gray-400">
                      Already Funded
                    </p>
                  ) : isConnected ? (
                    <Link
                      href={
                        process.env.NEXT_PUBLIC_POWERFORM_URL +
                        `&Investor_UserName=${nameURL}&Investor_Email=${user.email}&Day1=${formattedDay}&Month1=${monthName}&Year1=${year}&Sum=${sum}&Yield=${yieldFormatted}&Date2=${dateBeforeMaturityFormatted}&Month2=${monthAfter}&MaturityDate=${formattedMaturityDate}&Term=${property.term}&Year2=${year2}&Address=${formattedAddressFull}`
                      }
                      target="_blank"
                      className="text-xl text-white bg-gold px-6 py-3 rounded-md text-center mx-auto"
                      onClick={() => handleInvest(property)}
                    >
                      Invest Now
                    </Link>
                  ) : (
                    <p className="text-xl border px-6 py-3 rounded-md text-center mx-auto text-gray-400">
                      Log In To Invest
                    </p>
                  )}
                  <a href="mailto:will@urbangatecapital.com">
                    <p className="text-xl text-gold border border-gold rounded-md px-6 py-3 mb-4">
                      Contact UrbanGate
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Property does not exist.</p>
      )}
    </div>
  );
};

export default Property;
