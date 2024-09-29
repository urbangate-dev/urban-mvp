import React, { useEffect, useState } from "react";
import { ChildPageProps, Loan } from "@/utils/props";
import { Property as Prop } from "@/utils/props";
import { LoanCreateProps } from "@/utils/props";
import axios from "axios";
import Image from "next/image";
import PropertyImage from "../../public/noimage.png";
import Link from "next/link";
import { formatNumberWithCommas, stringToDate } from "../../utils/functions";
import {
  formatCurrency,
  formatDate,
  getDaySuffix,
  getPreviousDateByMonths,
  parseDate,
} from "@/utils/functions";
import localFont from "@next/font/local";

const robotoCondensed = localFont({
  src: [
    {
      path: "../../public/fonts/RobotoCondensed-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-roboto-condensed",
});

const robotoMono = localFont({
  src: [
    {
      path: "../../public/fonts/RobotoMono-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-roboto-mono",
});

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
    remainingAmount: 0,
    paid: false,
  });
  const [exists, setExists] = useState(false);
  const [monthRows, setMonthRows] = useState<number[]>([]);
  const [monthRowsMinusOne, setMonthRowsMinusOne] = useState<number[]>([]);
  const [hasLoan, setHasLoan] = useState<boolean>(false);
  const [loanID, setLoanID] = useState<string>("");
  const [powerFormUrl, setPowerFormUrl] = useState<string | null>(null);
  const [amountRemaining, setAmountRemaining] = useState<number>(0);
  useEffect(() => {
    if (loanID) {
      generatePowerFormUrl();
    }
  }, [loanID]);

  const generatePowerFormUrl = () => {
    const url =
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
          : user.investorType === "private-business-development-company"
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
      }=x&State=${user.state}&LoanID=${loanID}`;

    setPowerFormUrl(url);
  };

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

  const [docusignVisible, setDocusignVisible] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id, docusignVisible]);

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
          setAmountRemaining(response.data.property.remainingAmount);
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
        address: property.address,
      };
      const response = await axios.post("/api/loan", loan);
      console.log(response.data.id);
      setLoanID(response.data.id);
      setDocusignVisible(true);
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

  const finish = () => {
    window.alert(
      "It takes a couple of minutes for us to process your DocuSign. Please wait a couple of minutes before refreshing and investing!"
    );
    router.push("/user/account");
  };

  return (
    <div className="relative">
      <div
        className={`z-20 h-full w-full fixed bg-black opacity-50 top-0 ${
          docusignVisible ? "visible" : "invisible"
        }`}
      ></div>
      <div
        className={`fixed z-30 w-[70%] bg-background-black border border-grey-border rounded-lg top-[5vh] left-[15%] flex flex-col ${
          docusignVisible ? "visible h-[90vh]" : "invisible h-0"
        }`}
      >
        <p
          className={`text-white ${robotoCondensed.variable} font-roboto-condensed uppercase text-3xl text-center pt-4`}
        >
          Docusign
        </p>
        <p className="text-grey-text text-center text-lg mx-20">
          Please complete the Docusign below to begin investing! Once you
          finish, please wait a couple of minutes before funding in your account
          dashboard.
        </p>
        <div className="h-[80%] pt-2">
          {powerFormUrl && (
            <iframe
              src={powerFormUrl}
              className="w-[90%] mx-auto h-full"
            ></iframe>
          )}
        </div>
        <div className="flex my-4 gap-4 justify-center">
          <p
            className={`text-xl text-gold border-gold px-6 py-3 rounded-xl border cursor-pointer text-center ${robotoMono.variable} uppercase font-roboto-mono hover:text-dark-gold hover:border-dark-gold transition`}
            onClick={() => setDocusignVisible(false)}
          >
            Finish Later
          </p>
          <Link
            href={"/user/account"}
            className={`text-xl text-gold border-gold px-6 py-3 rounded-xl border cursor-pointer text-center ${robotoMono.variable} uppercase font-roboto-mono hover:text-dark-gold hover:border-dark-gold transition`}
            onClick={finish}
          >
            Go To Dashboard
          </Link>
        </div>
      </div>
      <div className="p-20">
        {exists ? (
          <div>
            <div className="grid grid-cols-4 gap-4 border border-grey-border p-4 rounded-t-3xl">
              <div className="col-span-2 row-span-2 rounded-tl-3xl relative overflow-hidden aspect-video h-full w-[99.5%]">
                <Image
                  src={property.thumbnail}
                  alt="property"
                  layout="fill"
                  objectFit="cover"
                  className="aspect-video opacity-80"
                />
              </div>

              <div className="relative aspect-video">
                {property.additional[0] ? (
                  <Image
                    src={property.additional[0]}
                    alt="property"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-80"
                  />
                ) : (
                  <Image
                    src={PropertyImage}
                    alt="property"
                    className="opacity-0"
                    width={1000}
                  />
                )}
              </div>

              <div className="relative rounded-tr-3xl overflow-hidden aspect-video">
                {property.additional[1] ? (
                  <Image
                    src={property.additional[1]}
                    alt="property"
                    objectFit="cover"
                    width={1000}
                    height={1000}
                    className="opacity-80"
                  />
                ) : (
                  <Image
                    src={PropertyImage}
                    alt="property"
                    className="opacity-0"
                    width={1000}
                  />
                )}
              </div>

              <div className="relative aspect-video">
                {property.additional[2] ? (
                  <Image
                    src={property.additional[2]}
                    alt="property"
                    objectFit="cover"
                    layout="fill"
                    className="opacity-80"
                  />
                ) : (
                  <Image
                    src={PropertyImage}
                    alt="property"
                    className="opacity-0"
                    width={1000}
                  />
                )}
              </div>

              <div className="relative overflow-hidden aspect-video">
                {property.additional[3] ? (
                  <Image
                    src={property.additional[3]}
                    alt="property"
                    objectFit="cover"
                    width={1000}
                    height={1000}
                    className="opacity-80"
                  />
                ) : (
                  <Image
                    src={PropertyImage}
                    alt="property"
                    className="opacity-0"
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
            <div className="grid grid-cols-4 text-white">
              <div className="col-span-3 border-l border-r border-b border-grey-border">
                <div className="border-b border-grey-border p-8">
                  <p
                    className={`text-6xl ${robotoCondensed.variable} font-roboto-condensed mb-4`}
                    style={{ fontVariant: "all-small-caps" }}
                  >
                    {formatCurrency(property.loanAmount)}
                  </p>
                  <p className="text-3xl font-light uppercase">
                    {property.address}, {property.city}, {property.state}{" "}
                    {property.zip}
                  </p>
                  <p className="text-xl">
                      <span className="text-grey-text">Available Balance: </span>
                      {formatCurrency(property.remainingAmount)}{" "}
                    </p>
                  <div
                    className={`mt-4 flex gap-4 ${robotoMono.variable} font-roboto-mono`}
                  >
                    <p className="text-xl">
                      {property.bedroom}{" "}
                      <span className="text-grey-text">Bed</span>
                    </p>

                    <p className="text-xl">
                      {property.bathroom}{" "}
                      <span className="text-grey-text">Bath</span>
                    </p>

                    <p className="text-xl">
                      {formatNumberWithCommas(property.sqft)}{" "}
                      <span className="text-grey-text">SQFT</span>
                    </p>

                  </div>
                </div>

                <div className="grid grid-cols-5 border-b border-grey-border">
                  <div className="flex flex-col border-r border-grey-border py-12 px-4">
                    <p
                      className="text-2xl uppercase font-light"
                      style={{ fontVariant: "all-small-caps" }}
                    >
                      Loan To ARV
                    </p>
                    <p
                      className={`text-2xl mt-2 font-light text-gold ${robotoMono.variable} font-roboto-mono`}
                    >
                      {property.loanARVValue}%
                    </p>
                  </div>
                  <div className="flex flex-col border-r border-grey-border py-12 px-4">
                    <p
                      className="text-2xl uppercase font-light"
                      style={{ fontVariant: "all-small-caps" }}
                    >
                      Loan To As-Is
                    </p>
                    <p
                      className={`text-2xl mt-2 font-light text-gold ${robotoMono.variable} font-roboto-mono`}
                    >
                      {property.loanAsIsValue}%
                    </p>
                  </div>
                  <div className="flex flex-col border-r border-grey-border py-12 px-4">
                    <p
                      className="text-2xl uppercase font-light"
                      style={{ fontVariant: "all-small-caps" }}
                    >
                      Loan To Cost
                    </p>
                    <p
                      className={`text-2xl mt-2 font-light text-gold ${robotoMono.variable} font-roboto-mono`}
                    >
                      {property.loanToCostValue}%
                    </p>
                  </div>
                  <div className="flex flex-col border-r border-grey-border py-12 px-4">
                    <p
                      className="text-2xl uppercase font-light"
                      style={{ fontVariant: "all-small-caps" }}
                    >
                      Loan Term
                    </p>
                    <p
                      className={`text-2xl mt-2 font-light text-gold ${robotoMono.variable} font-roboto-mono`}
                    >
                      {property.term} Months
                    </p>
                  </div>
                  <div className="flex flex-col py-12 px-4">
                    <p
                      className="text-2xl uppercase font-light"
                      style={{ fontVariant: "all-small-caps" }}
                    >
                      Maturity Date
                    </p>
                    <p
                      className={`text-lg mt-2 font-light text-gold ${robotoMono.variable} font-roboto-mono`}
                    >
                      {formatDate(stringToDate(property.maturityDate))}
                    </p>
                  </div>
                </div>
                <div className="p-8 border-b border-grey-border">
                  <p
                    className={`font-bold text-3xl ${robotoCondensed.variable} font-roboto-condensed uppercase`}
                  >
                    About the Deal
                  </p>
                  <p className="text-xl font-light mt-4 mb-4 text-grey-text">
                    {property.dealDescription}
                  </p>

                  <iframe
                    width="480"
                    height="270"
                    className={
                      property.investorPresentationLink.indexOf("loom") < 0
                        ? "invisible h-0"
                        : "visible"
                    }
                    src={
                      `${property.investorPresentationLink.replace(
                        "share",
                        "embed"
                      )}` + "?hideEmbedTopBar=true"
                    }
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-8">
                  <p
                    className={`font-bold text-3xl ${robotoCondensed.variable} font-roboto-condensed uppercase`}
                  >
                    About the Borrower
                  </p>
                  <p className="text-xl font-light mt-4 text-grey-text">
                    {property.borrowerDescription}
                  </p>
                  <div className="flex gap-6 mt-4">
                    <p
                      className={`inline-block  text-xl text-gold uppercase font-light`}
                      style={{ fontVariant: "all-small-caps" }}
                    >
                      {property.borrowerNumberOfDeals} Deals with UrbanGate
                    </p>
                    <p
                      className={`inline-block  text-xl text-gold uppercase font-light`}
                      style={{ fontVariant: "all-small-caps" }}
                    >
                      {property.borrowerExperience} Years of Experience
                    </p>
                  </div>
                </div>
                <div className="p-8">
                  <p
                    className={`font-bold text-3xl ${robotoCondensed.variable} font-roboto-condensed uppercase`}
                  >
                    Investor Returns
                  </p>
                  <p className="text-xl font-light mt-4 mb-4 text-grey-text">
                    Capital contributed: {formatCurrency(property.loanAmount)}{" "}
                    at {property.yieldPercent}%
                  </p>
                  <table className="border mt-8 text-lg border-grey-border">
                    <tr>
                      <td className="border border-grey-border p-3 uppercase">
                        Month
                      </td>
                      {monthRows.map((_, index) => (
                        <th
                          key={index}
                          className="border border-grey-border p-3"
                        >
                          {index + 1}
                        </th>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-grey-border p-3 uppercase">
                        Monthly Interest Income
                      </td>
                      {monthRows.map((_, index) => (
                        <td
                          key={index}
                          className="border border-grey-border p-3"
                        >
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
                      <td className="border border-grey-border p-3 uppercase">
                        Extension Fee Income
                      </td>
                      {monthRowsMinusOne.map((_, index) => (
                        <td
                          key={index}
                          className="border border-grey-border p-2"
                        ></td>
                      ))}
                      <td className="border border-grey-border p-3">
                        {formatCurrency(
                          Math.round(property.loanAmount * 0.0025)
                        )}
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
                      <td className="border border-grey-border p-3 uppercase">
                        Total Income
                      </td>
                      {monthRowsMinusOne.map((_, index) => (
                        <td
                          key={index}
                          className="border border-grey-border p-3"
                        >
                          {formatCurrency(
                            Math.round(
                              (property.loanAmount / 12) *
                                (property.yieldPercent / 100) *
                                (index + 1)
                            )
                          )}
                        </td>
                      ))}
                      <td className="border border-grey-border p-3">
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
              <div className="border-r border-grey-border border-b">
                <div className=" mt-16 sticky top-[10rem]">
                  <div className="flex justify-center mt-4 flex-col items-center gap-2">
                    {(amountRemaining == 0) ? (
                      <p
                        className={`text-xl text-grey-text border-grey-text px-6 py-3 rounded-xl border text-center mx-auto ${robotoMono.variable} uppercase font-roboto-mono`}
                      >
                        Already Funded
                      </p>
                    ) : isConnected ? (
                      <p
                        className={`text-xl text-gold border-gold px-6 py-3 rounded-xl border cursor-pointer text-center mx-auto ${robotoMono.variable} uppercase font-roboto-mono hover:text-dark-gold hover:border-dark-gold transition`}
                        onClick={() => handleInvest(property)}
                      >
                        Invest Now
                      </p>
                    ) : (
                      <p className="text-xl border border-grey-border px-6 py-3 rounded-md text-center mx-auto text-grey-text uppercase font-roboto-mono">
                        Connect Wallet To Invest
                      </p>
                    )}
                    <p className="text-grey-text">
                      Contact UrbanGate for more details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Property does not exist.</p>
        )}
      </div>
    </div>
  );
};

export default Property;
