"use client";

import PropertyCard from "@/components/property-card";
import { NextRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ChildPageProps, Property } from "@/utils/props";
import axios from "axios";

const Home: React.FC<ChildPageProps> = ({
  isConnected,
  address,
  user,
  router,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    getProperties();
  }, []);

  const getProperties = async () => {
    try {
      const response = await axios.get("/api/property");
      setProperties(response.data.properties);
    } catch (error) {
      console.error("Error fetching properties: ", error);
    }
  };
  return (
    <div className="">
      <div className="flex flex-col items-center">
        <p className="font-semibold mt-40 bg-gradient-to-r from-gold to-dark-gold inline-block text-transparent bg-clip-text text-6xl text-center">
          Your Capital Partner.
        </p>
        <p className="text-center font-light mt-8 text-3xl w-[65%] leading-relaxed">
          We are a Real Estate Private Lender. We offer the opportunity to
          invest in first lien loan positions and provide capital to Borrowers
          in Tennessee.
        </p>
        <a
          href="#loan"
          className="text-center inline-block px-10 py-6 mt-8 mb-24 text-white bg-black text-3xl rounded-full cursor-pointer hover:bg-gray-900 transition"
        >
          Invest Now
        </a>
      </div>
      <div className="mt-24 bg-gray-50 pt-24 pb-40 px-32" id="loan">
        <p className="font-semibold text-4xl mb-8">Loan Opportunties For You</p>
        <div className="grid grid-cols-3 gap-8">
          {properties
            .filter((property) => !property.draft)
            .map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
