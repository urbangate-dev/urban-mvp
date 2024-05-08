import React, { useEffect, useState } from "react";
import { ChildPageProps } from "@/utils/props";
import { Property as Prop } from "@/utils/props";
import { LoanCreateProps } from "@/utils/props";
import axios from "axios";
import Image from "next/image";
import PropertyImage from "../../public/testproperty.jpeg";
import Link from "next/link";

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
  });
  const [exists, setExists] = useState(false);
  const [monthRows, setMonthRows] = useState<number[]>([]);
  const [monthRowsMinusOne, setMonthRowsMinusOne] = useState<number[]>([]);

  const nameURL = user.name.replace(/ /g, "%20");
  const addressURL = property.address.replace(/ /g, "%20");

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
      } catch (error) {
        console.error("Error fetching property: ", error);
      }
  };

  const handleInvest = async (property: Prop) => {
    try {
      console.log(property);
      const loan: LoanCreateProps = {
        loanAmount: property.loanAmount,
        loanToARV: property.loanARVValue,
        loanToAsIs: property.loanAsIsValue,
        loanToCost: property.loanToCostValue,
        term: property.term,
        returnValue: property.loanAmount,
        propertyId: property.id,
        userId: user.id,
      };
      const response = axios.post("/api/loan", loan);
    } catch (error) {
      console.error("Error investing in property: ", error);
    }
  };

  return (
    <div className="p-10">
      {exists ? (
        <div>
          <div className="text-center">
            <p className="text-2xl">{property.address}</p>
            <p className="text-xl">
              {property.city}, {property.state} {property.zip}
            </p>
            <p className="text-3xl mt-6">Loan Amount: ${property.loanAmount}</p>
            <p className="text-2xl mt-6">
              {property.bedroom} Beds | {property.bathroom} Bath |{" "}
              {property.sqft} SQFT
            </p>
          </div>
          <div className="w-[50%] mx-auto my-10">
            <Image src={PropertyImage} alt="property" className="" />
          </div>
          <div className="flex justify-between w-[40%] mx-auto">
            <div className="text-center">
              <p className="text-xl">L-as-is-Value</p>
              <p className="text-lg">{property.loanAsIsValue}%</p>
            </div>
            <div className="text-center">
              <p className="text-xl">L-ARV</p>
              <p className="text-lg">{property.loanARVValue}%</p>
            </div>
            <div className="text-center">
              <p className="text-xl">Loan Term</p>
              <p className="text-lg">{property.term} months</p>
            </div>
            <div className="text-center">
              <p className="text-xl">Loan to Cost</p>
              <p className="text-lg">{property.loanToCostValue}%</p>
            </div>
          </div>
          <div className="flex justify-between w-[85%] mx-auto mt-16 gap-20 mb-20">
            <div className="text-xl w-[75%]">
              <p className="mb-4">
                Deal Description: {property.dealDescription}
              </p>
              <p className="mb-4">
                Borrower Description: {property.borrowerDescription}
              </p>
              <Link
                href={property.investorPresentationLink}
                className="underline"
              >
                Presentation Link
              </Link>
            </div>
            <div className="text-xl flex flex-col gap-2 w-[25%]">
              <p>Rehab budget: ${property.rehabBudget}</p>
              <p>Exit Strategy: {property.exitStrategy}</p>
              <p>Borrower Experience: {property.borrowerExperience}</p>
              <p>Deals with UrbanGate: {property.borrowerNumberOfDeals}</p>
            </div>
          </div>
          <div className="mb-20">
            <p className="text-2xl text-center mb-4">Investor Return</p>
            <table className="border mx-auto">
              <tr>
                <th className="border p-2" rowSpan={2}>
                  Capital Contributed ({property.yieldPercent}% return)
                </th>
                <th className="border p-2" colSpan={property.term + 2}>
                  Investor Returns
                </th>
              </tr>
              <tr>
                <th className="border p-2">Month</th>
                {monthRows.map((_, index) => (
                  <th className="border p-2">{index + 1}</th>
                ))}
              </tr>
              <tr>
                <th className="border p-2" rowSpan={4}>
                  ${property.loanAmount}
                </th>
                <td className="border p-2">Monthly Interest Income</td>
                {monthRows.map((_, index) => (
                  <td className="border p-2">
                    $
                    {Math.round(
                      (property.loanAmount / 12) * (property.yieldPercent / 100)
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border p-2">Extension Fee Income</td>
                {monthRowsMinusOne.map((_, index) => (
                  <td className="border p-2"></td>
                ))}
                <td className="border p-2">
                  ${Math.round(property.loanAmount * 0.0025)}
                </td>
              </tr>
              <tr>
                <td className="border p-2">.25% Point Income</td>
                {monthRowsMinusOne.map((_, index) => (
                  <td className="border p-2"></td>
                ))}
                <td className="border p-2">
                  ${Math.round(property.loanAmount * 0.0025)}
                </td>
              </tr>
              <tr>
                <td className="border p-2 font-bold">Total Income</td>
                {monthRowsMinusOne.map((_, index) => (
                  <td className="border p-2 font-bold">
                    $
                    {Math.round(
                      (property.loanAmount / 12) *
                        (property.yieldPercent / 100) *
                        (index + 1)
                    )}
                  </td>
                ))}
                <td className="border p-2 font-bold">
                  $
                  {Math.round(
                    (property.loanAmount / 12) *
                      (property.yieldPercent / 100) *
                      (property.term + 1) +
                      0.005 * property.loanAmount
                  )}
                </td>
              </tr>
            </table>
          </div>
          <div className="flex justify-center">
            <Link
              href="/user/account"
              className="text-3xl border px-6 py-3 rounded-md text-center mx-auto"
              onClick={() => handleInvest(property)}
            >
              Invest In Property
            </Link>
            <Link
              href={`https://demo.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=37958bb5-5b6e-4c08-a06a-d40e800c666e&env=demo&acct=4bb4edce-bff6-49b6-9503-264c6555fee0&v=2&Investor_UserName=${nameURL}&Investor_Email=${user.email}&Address=${addressURL}&Investment=${property.loanAmount}`}
              target="_blank"
            >
              Docusign Test
            </Link>
          </div>
        </div>
      ) : (
        <p>Property does not exist.</p>
      )}
    </div>
  );
};

export default Property;
