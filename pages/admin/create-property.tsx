import { ChildPageProps } from "@/utils/props";
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { PropertyWithoutId as Property } from "@/utils/props";
import { useWriteContract, useAccount } from 'wagmi'
import { abi } from '../../abi/loan'

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
  });

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
        ? parseInt(value, 10)
        : value;
    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };
  const { data: hash, writeContract, isPending, isSuccess, isError } = useWriteContract();
  const [propertyId, setPropertyId] = useState<string | null>(null);

  useEffect(() => {
    if (isSuccess) {
      console.log("Contract written successfully.", hash);
      router.push('/admin/dashboard');
    }
  }, [isSuccess, hash, router]);

  useEffect(() => {
    const deleteProperty = async () => {
      if (isError && propertyId) {
        console.error("Error writing contract");

        try {
          await axios.delete(`/api/property/${propertyId}`);
          console.log("Property deletion successful due to contract write failure.");
        } catch (deleteError) {
          console.error("Error deleting property after contract write failure: ", deleteError);
        }
      }
    };

    deleteProperty();
  }, [isError, propertyId]);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { loanAmount, yieldPercent, maturityDate } = formData;
    const dueTime = Math.floor(new Date(maturityDate).getTime() / 1000);
  
    try {
      const response = await axios.post("/api/property", {
        ...formData,
        draft: false,
      });
      console.log("API response for property creation:", response.data);
  
      setPropertyId(response.data.property.id);
      console.log("Created property ID:", propertyId);
  
      try {
        await writeContract({
          abi,
          address: "0x163aD5b66D50F228ca4Ec7B60DB6A3828aCb6128",
          functionName: 'createLoanRequest',
          args: [loanAmount, yieldPercent, dueTime],
        });
        // await waitForTransactionReceipt(config, { hash: tx.hash });

      } catch (contractError) {
        console.error("Error writing contract: ", contractError);
  
        try {
          await axios.delete(`/api/property/${propertyId}`);
          console.log("Property deletion successful due to contract write failure.");
        } catch (deleteError) {
          console.error("Error deleting property after contract write failure: ", deleteError);
        }
      }
    } catch (error) {
      console.error("Error creating property: ", error);
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
        <p className="font-bold text-5xl mt-8">Create New Property</p>
        <Link
          href="/admin/dashboard"
          className=" text-gold px-4 py-2 border border-gold rounded-full self-end text-xl hover:text-dark-gold hover:border-dark-gold transition"
        >
          Back to Dashboard
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 mt-8 bg-gray-50 rounded-3xl p-10"
      >
        <div className="grid grid-cols-6 gap-4">
          <label className="flex flex-col text-lg col-span-3">
            Address:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-xl px-4 py-2"
            />
          </label>
          <label className="flex flex-col text-lg">
            City:
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
          <label className="flex flex-col text-lg">
            State:
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
          <label className="flex flex-col text-lg">
            Zip:
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
        </div>

        <label className="flex flex-col text-lg mt-2">
          Property Description (2-3 sentences):
          <textarea
            name="propertyDescription"
            value={formData.propertyDescription}
            onChange={handleChange}
            className="border border-gray-300  rounded-xl px-4 py-2"
          />
        </label>

        <div className="grid grid-cols-12 gap-4 mt-2">
          <label className="flex flex-col text-lg">
            Bathroom:
            <input
              type="number"
              name="bathroom"
              value={formData.bathroom}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
          <label className="flex flex-col text-lg">
            Bedroom:
            <input
              type="number"
              name="bedroom"
              value={formData.bedroom}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
          <label className="flex flex-col text-lg">
            Sqft:
            <input
              type="number"
              name="sqft"
              value={formData.sqft}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
        </div>

        <label className="flex flex-col text-lg mt-10">
          Deal Description:
          <textarea
            name="dealDescription"
            value={formData.dealDescription}
            onChange={handleChange}
            className="border border-gray-300  rounded-xl px-4 py-2"
          />
        </label>

        <div className="grid grid-cols-6 gap-4 mt-2">
          <label className="flex flex-col text-lg">
            Loan To As-Is (%):
            <input
              type="number"
              name="loanAsIsValue"
              value={formData.loanAsIsValue}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
          <label className="flex flex-col text-lg">
            Loan To ARV (%):
            <input
              type="number"
              name="loanARVValue"
              value={formData.loanARVValue}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
          <label className="flex flex-col text-lg">
            Loan To Cost (%):
            <input
              type="number"
              name="loanToCostValue"
              value={formData.loanToCostValue}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
          <label className="flex flex-col text-lg">
            Loan Amount ($):
            <input
              type="number"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
          <label className="flex flex-col text-lg">
            Yield Percent (%):
            <input
              type="number"
              name="yieldPercent"
              value={formData.yieldPercent}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
          <label className="flex flex-col text-lg">
            Maturity Date:
            <input
              type="date"
              name="maturityDate"
              value={formData.maturityDate}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
        </div>

        <div className="grid grid-cols-6 gap-4 mt-2">
          <label className="flex flex-col text-lg">
            Property Type:
            <input
              type="text"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
          <label className="flex flex-col text-lg">
            Term (months):
            <input
              type="number"
              name="term"
              value={formData.term}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
          <label className="flex flex-col text-lg">
            Rehab Budget:
            <input
              type="number"
              name="rehabBudget"
              value={formData.rehabBudget}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
          <label className="flex flex-col text-lg">
            Exit Strategy:
            <input
              type="text"
              name="exitStrategy"
              value={formData.exitStrategy}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
        </div>

        <label className="flex flex-col text-lg mt-10">
          Borrower Description:
          <textarea
            name="borrowerDescription"
            value={formData.borrowerDescription}
            onChange={handleChange}
            className="border border-gray-300  rounded-xl px-4 py-2"
          />
        </label>

        <div className="grid grid-cols-6 gap-4 mt-2">
          <label className="flex flex-col text-lg">
            Borrower:
            <input
              type="text"
              name="borrower"
              value={formData.borrower}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
          <label className="flex flex-col text-lg col-span-2">
            Borrower Experience (in years):
            <input
              type="text"
              name="borrowerExperience"
              value={formData.borrowerExperience}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
          <label className="flex flex-col text-lg">
            Borrower Deals:
            <input
              type="number"
              name="borrowerNumberOfDeals"
              value={formData.borrowerNumberOfDeals}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
          <label className="flex flex-col text-lg col-span-2">
            Presentation Link (include https://):
            <input
              type="text"
              name="investorPresentationLink"
              value={formData.investorPresentationLink}
              onChange={handleChange}
              className="border border-gray-300  rounded-xl px-4 py-2"
            />
          </label>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={saveDraft}
            className="text-gold text-xl px-4 py-2 border border-gold rounded-full hover:text-dark-gold hover:border-dark-gold transition"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-gold text-xl rounded-full hover:bg-dark-gold transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProperty;
