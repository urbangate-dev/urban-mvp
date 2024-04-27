import { ChildPageProps } from "@/utils/props";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { PropertyWithoutId as Property } from "@/utils/props";

const EditProperty: React.FC<ChildPageProps> = ({
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

  const { id } = router.query;

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/property/${id}`, {
        ...formData,
        draft: false,
      });
      console.log("Property created:", response.data.property);
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error creating property: ", error);
    }
  };

  const saveDraft = async () => {
    try {
      const response = await axios.put(`/api/property/${id}`, {
        ...formData,
        draft: true,
      });
      console.log("Draft saved:", response.data.property);
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error saving draft: ", error);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    if (id)
      try {
        console.log(`/api/property/${id}`);
        const response = await axios.get(`/api/property/${id}`);
        setFormData(response.data.property);
      } catch (error) {
        console.error("Error fetching property: ", error);
      }
  };

  return (
    <div className="p-10">
      <Link href="/admin/dashboard">Back to Dashboard</Link>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          City:
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          State:
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Zip:
          <input
            type="text"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Deal Description:
          <textarea
            name="dealDescription"
            value={formData.dealDescription}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Deal Description:
          <textarea
            name="propertyDescription"
            value={formData.propertyDescription}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Property Type:
          <input
            type="text"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Bathroom:
          <input
            type="number"
            name="bathroom"
            value={formData.bathroom}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Bedroom:
          <input
            type="number"
            name="bedroom"
            value={formData.bedroom}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Sqft:
          <input
            type="number"
            name="sqft"
            value={formData.sqft}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Loan As-Is Value:
          <input
            type="number"
            name="loanAsIsValue"
            value={formData.loanAsIsValue}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Loan ARV Value:
          <input
            type="number"
            name="loanARVValue"
            value={formData.loanARVValue}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Loan To Cost Value:
          <input
            type="number"
            name="loanToCostValue"
            value={formData.loanToCostValue}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Loan Amount:
          <input
            type="number"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Yield Percent:
          <input
            type="number"
            name="yieldPercent"
            value={formData.yieldPercent}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Maturity Date:
          <input
            type="date"
            name="maturityDate"
            value={formData.maturityDate}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Term length in months:
          <input
            type="number"
            name="term"
            value={formData.term}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Borrower:
          <input
            type="text"
            name="borrower"
            value={formData.borrower}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Rehab Budget:
          <input
            type="number"
            name="rehabBudget"
            value={formData.rehabBudget}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Exit Strategy:
          <input
            type="text"
            name="exitStrategy"
            value={formData.exitStrategy}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Borrower Experience (in years):
          <input
            type="text"
            name="borrowerExperience"
            value={formData.borrowerExperience}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Borrower Number of Deals:
          <input
            type="number"
            name="borrowerNumberOfDeals"
            value={formData.borrowerNumberOfDeals}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Borrower Description:
          <textarea
            name="borrowerDescription"
            value={formData.borrowerDescription}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Investor Presentation Link:
          <input
            type="text"
            name="investorPresentationLink"
            value={formData.investorPresentationLink}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <label>
          Borrower:
          <input
            type="text"
            name="borrower"
            value={formData.borrower}
            onChange={handleChange}
            className="ml-2 border rounded-sm px-2 py-1"
          />
        </label>
        <button type="button" onClick={saveDraft}>
          Save as Draft
        </button>
        <button type="submit">{formData.draft ? "Submit" : "Update"}</button>
      </form>
    </div>
  );
};

export default EditProperty;
