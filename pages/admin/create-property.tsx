import { ChildPageProps } from "@/utils/props";
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { PropertyWithoutId as Property } from "@/utils/props";
import { UploadButton } from "../../utils/uploadthing";
import { truncateFileName } from "../../utils/functions";
import { useWriteContract, useAccount, useReadContract } from "wagmi";
import { abi } from "../../abi/loan";
import { FaArrowLeft } from "react-icons/fa";
import localFont from "@next/font/local";
import { waitForTransactionReceipt,readContract } from '@wagmi/core';
import {config} from '../../utils/config'
const robotoCondensed = localFont({
  src: [
    {
      path: "../../public/fonts/RobotoCondensed-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-roboto-condensed",
});

const CreateProperty: React.FC<ChildPageProps> = ({
  isConnected,
  address,
  user,
  router,
}) => {
  const defaultDate = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState<Property>({
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
  const [thumbnail, setThumbnail] = useState<string>("");
  const [additional, setAdditional] = useState<string[]>([]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "bedroom" ||
      name === "sqft" ||
      name === "bathroom" ||
      name === "loanAsIsValue" ||
      name === "loanAmount" ||
      name === "yieldPercent" ||
      name === "loanARVValue" ||
      name === "loanToCostValue" ||
      name === "term"
        ? Number.isNaN(parseInt(value, 10))
          ? 0
          : parseInt(value, 10)
        : value;
    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };

  const {writeContractAsync: writeFundLoan} = useWriteContract();
  const [propertyId, setPropertyId] = useState<string | null>(null);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { loanAmount, yieldPercent, maturityDate } = formData;
    const dueTime = Math.floor(new Date(maturityDate).getTime() / 1000);

    const currentTime = Math.floor(Date.now() / 1000);
    const secondsUntilMaturity = dueTime - currentTime;
    alert(secondsUntilMaturity+ " " + yieldPercent + " " + loanAmount);
    try {
        const hash = await writeFundLoan({
          abi,  
          address: process.env.NEXT_PUBLIC_LENDINGPLATFORM_ADDRESS as unknown as `0x${string}`,
          functionName: "createLoanRequest",
          args: [BigInt(loanAmount * 1000000), BigInt(yieldPercent*1000), BigInt(secondsUntilMaturity)],
        });
        console.log("hash-"+hash);
        const transactionReceipt = await waitForTransactionReceipt(config, {
          hash: hash,
        })
        console.log(transactionReceipt);
        if(transactionReceipt.status == "success"){
          const propertyIndex = await readContract(config, {
            abi: abi,
            address: process.env.NEXT_PUBLIC_LENDINGPLATFORM_ADDRESS as unknown as `0x${string}`,
            functionName: "loanCounter",
          });
          console.log(Number(propertyIndex));
          const response = await axios.post("/api/property", {
            ...formData,
            draft: false,
            propertyIndex: String(Number(propertyIndex)-1),
          });
          console.log("API response for property creation:", response.data);
          console.log(response.data.property);
          setPropertyId(response.data.property.id);
          console.log("Created property ID:", propertyId);
          router.push("/admin/dashboard");
        }

      } catch (error) {
        
      console.error("Error creating property: ", error);
      router.push("/admin/dashboard");

    }
  };

  const saveDraft = async () => {
    try {
      const response = await axios.post("/api/property", {
        ...formData,
        draft: true,
      });
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error saving draft: ", error);
    }
  };

  return (
    <div className="p-20">
      <div className="flex justify-between items-center">
        <Link
          href="/admin/dashboard"
          className=" text-gold text-xl hover:text-dark-gold hover:border-dark-gold transition uppercase flex gap-2 items-center"
          style={{ fontVariant: "all-small-caps" }}
        >
          <FaArrowLeft /> Back to Dashboard
        </Link>
      </div>

      <div className="border border-grey-border py-6 mt-4 rounded-t-3xl">
        <p
          className={`text-5xl mb-4 mt-4 ${robotoCondensed.variable} font-roboto-condensed hover:text-white transition font-light uppercase text-center text-white`}
          style={{ fontVariant: "all-small-caps" }}
        >
          Create New Property
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col text-white rounded-3xl"
      >
        <div className="border-b border-grey-border p-8 border-l border-r">
          <div className="grid grid-cols-11 gap-4">
            <label className="flex flex-col text-xl col-span-7">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street Address"
                required
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold"
              />
            </label>
            <label className="flex flex-col col-span-2">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
              />
            </label>
            <label className="flex flex-col text-lg col-span-2">
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
              />
            </label>
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4">
            <label className="flex flex-col col-span-3">
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="Zip Code"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
              />
            </label>
            <label className="flex flex-col text-lg col-span-2">
              <input
                type="number"
                name="bedroom"
                value={formData.bedroom === 0 ? "" : formData.bedroom}
                onChange={handleChange}
                placeholder="Bedrooms"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
              />
            </label>
            <label className="flex flex-col text-lg col-span-2">
              <input
                type="number"
                name="bathroom"
                value={formData.bathroom === 0 ? "" : formData.bathroom}
                onChange={handleChange}
                placeholder="Bathrooms"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
              />
            </label>
            <label className="flex flex-col text-lg col-span-2">
              <input
                type="number"
                name="sqft"
                value={formData.sqft === 0 ? "" : formData.sqft}
                placeholder="SQFT"
                onChange={handleChange}
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
              />
            </label>
          </div>

          <label className="flex flex-col text-lg mt-4">
            <textarea
              name="propertyDescription"
              value={formData.propertyDescription}
              onChange={handleChange}
              placeholder="Property Description"
              className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl h-40"
            />
          </label>
        </div>

        <div className="border-b border-l border-r border-grey-border p-8">
          <div className="grid grid-cols-8 gap-4 mt-2">
            <label className="flex flex-col text-lg col-span-2">
              <input
                type="number"
                name="loanAmount"
                value={formData.loanAmount === 0 ? "" : formData.loanAmount}
                onChange={handleChange}
                placeholder="Loan Amouunt ($)"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
              />
            </label>
            <label className="flex flex-col text-lg">
              <input
                type="number"
                name="loanAsIsValue"
                value={
                  formData.loanAsIsValue === 0 ? "" : formData.loanAsIsValue
                }
                onChange={handleChange}
                placeholder="L-As Is (%)"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
              />
            </label>
            <label className="flex flex-col text-lg">
              <input
                type="number"
                name="loanARVValue"
                value={formData.loanARVValue === 0 ? "" : formData.loanARVValue}
                placeholder="L-ARV (%)"
                onChange={handleChange}
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
              />
            </label>
            <label className="flex flex-col text-lg">
              <input
                type="number"
                name="loanToCostValue"
                value={
                  formData.loanToCostValue === 0 ? "" : formData.loanToCostValue
                }
                onChange={handleChange}
                placeholder="L-Cost (%)"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
              />
            </label>

            <label className="flex flex-col text-lg">
              <input
                type="number"
                name="yieldPercent"
                value={formData.yieldPercent === 0 ? "" : formData.yieldPercent}
                onChange={handleChange}
                placeholder="Yield (%)"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
              />
            </label>
            <label className="flex flex-col text-lg col-span-2">
              <input
                type="text"
                name="maturityDate"
                value={
                  formData.maturityDate === defaultDate
                    ? ""
                    : formData.maturityDate
                }
                onChange={handleChange}
                placeholder="Maturity Date"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
              />
            </label>
          </div>

          <div className="grid grid-cols-5 gap-4 mt-4">
            <label className="flex flex-col text-lg">
              <input
                type="text"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                placeholder="Property Type"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
              />
            </label>
            <label className="flex flex-col text-lg">
              <input
                type="number"
                name="term"
                value={formData.term === 0 ? "" : formData.term}
                onChange={handleChange}
                placeholder="Term (Months)"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
              />
            </label>
          </div>

          <label className="flex flex-col text-lg mt-4">
            <textarea
              name="dealDescription"
              value={formData.dealDescription}
              onChange={handleChange}
              placeholder="Deal Description"
              className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl h-40"
            />
          </label>
          <div className="mt-10 flex gap-8 justify-center">
            <div>
              <p className="text-lg text-center mb-2 text-grey-text">
                Upload Thumbail
              </p>
              <UploadButton
                className={`ut-button:bg-transparent ut-button:border ut-button:border-gold ${robotoCondensed.variable} ut-button:font-roboto-condensed ut-button:uppercase ut-button:text-gold ut-button:rounded-lg ut-button:px-4 ut-button:py-2 ut-button:hover:text-dark-gold ut-button:hover:border-dark-gold`}
                endpoint="thumbnail"
                onClientUploadComplete={(res) => {
                  setFormData({
                    ...formData,
                    thumbnail: res[0].url,
                  });
                  setThumbnail(res[0].name);
                }}
                onUploadError={(error: Error) => {
                  // Do something with the error.
                  alert(`ERROR! ${error.message}`);
                }}
              />
              {thumbnail === "" ? (
                ""
              ) : (
                <p className="text-center mt-2 font-light text-sm">
                  Uploaded: {truncateFileName(thumbnail)}
                </p>
              )}
            </div>
            <div>
              <p className="text-lg text-center mb-2 text-grey-text">
                Upload Additional
              </p>
              <UploadButton
                className={`ut-button:bg-transparent ut-button:border ut-button:border-gold ${robotoCondensed.variable} ut-button:font-roboto-condensed ut-button:uppercase ut-button:text-gold ut-button:rounded-lg ut-button:px-4 ut-button:py-2 ut-button:hover:text-dark-gold ut-button:hover:border-dark-gold`}
                endpoint="additional"
                onClientUploadComplete={(res) => {
                  console.log(res);
                  const images = formData.additional;
                  res.forEach((image) => {
                    images.push(image.url);
                    additional.push(image.name);
                  });
                  setFormData({
                    ...formData,
                    additional: images,
                  });
                }}
                onUploadError={(error: Error) => {
                  // Do something with the error.
                  alert(`ERROR! ${error.message}`);
                }}
              />
              {additional.length === 0 ? (
                ""
              ) : (
                <div className="text-sm font-light mt-2 text-center">
                  <p>Uploaded:</p>
                  {additional.map((name, index) => (
                    <p key={index}>{truncateFileName(name)}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 border-b border-l border-r border-grey-border">
          <div className="grid grid-cols-7 gap-4">
            <label className="flex flex-col text-lg">
              <input
                type="text"
                name="borrower"
                value={formData.borrower}
                onChange={handleChange}
                placeholder="Borrower Name"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
              />
            </label>
            <label className="flex flex-col text-lg col-span-2">
              <input
                type="text"
                name="borrowerExperience"
                value={formData.borrowerExperience}
                onChange={handleChange}
                placeholder="Borrower Experience (Years)"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
              />
            </label>
            <label className="flex flex-col text-lg col-span-2">
              <input
                type="number"
                name="borrowerNumberOfDeals"
                value={
                  formData.borrowerNumberOfDeals === 0
                    ? ""
                    : formData.borrowerNumberOfDeals
                }
                placeholder="Borrower Number of Deals"
                onChange={handleChange}
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
              />
            </label>
            <label className="flex flex-col text-lg col-span-2">
              <input
                type="text"
                name="investorPresentationLink"
                value={formData.investorPresentationLink}
                onChange={handleChange}
                placeholder="Presentation Link (include https://)"
                className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
              />
            </label>
          </div>

          <label className="flex flex-col text-lg mt-4">
            <textarea
              name="borrowerDescription"
              value={formData.borrowerDescription}
              onChange={handleChange}
              placeholder="Borrower Description"
              className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl h-40"
            />
          </label>
        </div>

        <div className="flex justify-center gap-4 border-b border-l border-r border-grey-border py-8">
          <button
            type="button"
            onClick={saveDraft}
            className={`text-gold text-xl px-4 py-2 border border-gold rounded-xl uppercase hover:text-dark-gold hover:border-dark-gold transition ${robotoCondensed.variable} font-roboto-condensed`}
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className={`text-gold text-xl px-4 py-2 border border-gold rounded-xl uppercase hover:text-dark-gold hover:border-dark-gold transition ${robotoCondensed.variable} font-roboto-condensed`}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProperty;
