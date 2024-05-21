import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChildPageProps, Loan, Property } from "@/utils/props";
import Link from "next/link";
import PropertyCardAdmin from "@/components/property-card-admin";
import LoanCardAdmin from "@/components/loan-card-admin";
import LoanCard from "@/components/loan-card";

// add area for pending loans waiting for approval
// once signed and approved by admin, send confirmation email and start contract (bring to page, ask user to click to fund loan)

const Dashboard: React.FC<ChildPageProps> = ({
  isConnected,
  address,
  user,
  router,
}) => {
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
      <div className="bg-gray-50 p-20">
        <p className="font-bold text-5xl">Welcome, {user.name}!</p>

        <div className="grid grid-cols-2 gap-12">
          <Link
            href="/admin/create-property"
            className="text-xl text-gold font-light px-4 py-2 border border-gold absolute rounded-full right-20 cursor-pointer mt-6 hover:text-dark-gold hover:border-dark-gold transition"
          >
            Create New Property
          </Link>
          <div>
            <p className="font-medium text-3xl mt-8">Active Properties</p>
            <div className="flex flex-col gap-4 mt-4">
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
          </div>
          <div>
            <p className="font-medium text-3xl mt-8">Draft Properties</p>
            <div className="flex flex-col gap-4 mt-4">
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
        </div>
      </div>

      <div className="px-20 pt-20 pb-40">
        <div className="grid grid-cols-2 gap-12">
          <div>
            <p className="font-medium text-3xl mt-8">Approved Loans</p>
            <div className="mt-4 flex flex-col gap-4">
              {loans
                .filter((loan) => !loan.pending)
                .map((loan) => (
                  <LoanCardAdmin
                    key={loan.id}
                    loan={loan}
                    loans={loans}
                    setLoans={setLoans}
                  />
                ))}
            </div>
          </div>
          <div>
            <p className="font-medium text-3xl mt-8">Pending Loans</p>
            <div className="mt-4 flex flex-col gap-4">
              {loans
                .filter((loan) => loan.pending)
                .map((loan) => (
                  <LoanCardAdmin
                    key={loan.id}
                    loan={loan}
                    loans={loans}
                    setLoans={setLoans}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
