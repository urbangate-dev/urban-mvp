import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loan, Property } from "@/utils/props";
import Link from "next/link";
import PropertyCardAdmin from "@/components/property-card-admin";
import LoanCardAdmin from "@/components/loan-card-admin";
import LoanCard from "@/components/loan-card";

// add area for pending loans waiting for approval
// once signed and approved by admin, send confirmation email and start contract (bring to page, ask user to click to fund loan)

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    getProperties();
    getLoans();
  }, []);

  const getProperties = async () => {
    try {
      const response = await axios.get("/api/property");
      setProperties(response.data.properties);
    } catch (error) {
      console.error("Error fetching properties: ", error);
    }
  };

  const deleteProperty = async (propertyId: string) => {
    try {
      const response = await axios.delete(`/api/property/${propertyId}`);
      setProperties(
        properties.filter((property) => property.id !== propertyId)
      );
    } catch (error) {
      console.error("Error deleting property: ", error);
    }
  };

  const getLoans = async () => {
    try {
      const response = await axios.get("/api/loan");
      setLoans(response.data.loans);
    } catch (error) {
      console.error("Error fetching loans: ", error);
    }
  };

  return (
    <div>
      <p className="text-4xl text-center mt-10">Admin Dashboard</p>
      <div className="p-10 flex w-full">
        <div className="w-[50%] px-10">
          <Link
            className="px-4 py-2 border rounded-md"
            href="/admin/create-property"
          >
            Add Property
          </Link>
          <p className="mt-10 text-2xl mb-4">Existing properties</p>
          <div className="flex flex-col gap-2">
            {properties
              .filter((property) => !property.draft)
              .map((property) => (
                <PropertyCardAdmin
                  property={property}
                  deleteProperty={deleteProperty}
                  draft={property.draft}
                />
              ))}
          </div>
          <p className="mt-10 text-2xl mb-4">Drafts</p>
          <div className="flex flex-col gap-2">
            {properties
              .filter((property) => property.draft)
              .map((property) => (
                <PropertyCardAdmin
                  property={property}
                  deleteProperty={deleteProperty}
                  draft={property.draft}
                />
              ))}
          </div>
        </div>
        <div className="w-[50%] px-10">
          <p className="mt-10 text-2xl mb-4">Pending Loans</p>
          <div>
            {loans
              .filter((loan) => loan.pending)
              .map((loan) => (
                <LoanCardAdmin key={loan.id} loan={loan} />
              ))}
          </div>

          <p className="mt-10 text-2xl mb-4">Approved Loans</p>
          <div>
            {loans
              .filter((loan) => !loan.pending)
              .map((loan) => (
                <LoanCardAdmin key={loan.id} loan={loan} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
