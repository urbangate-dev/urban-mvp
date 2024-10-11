"use client";

import PropertyCard from "@/components/property-card";
import { NextRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ChildPageProps, Property } from "@/utils/props";
import axios from "axios";
import localFont from "@next/font/local";
import Link from "next/link";

const robotoMono = localFont({
  src: [
    {
      path: "../public/fonts/RobotoMono-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-roboto-mono",
});

const robotoCondensed = localFont({
  src: [
    {
      path: "../public/fonts/RobotoCondensed-SemiBold.ttf",
      weight: "500",
    },
    {
      path: "../public/fonts/RobotoCondensed-Regular.ttf",
      weight: "300",
    },
  ],
  variable: "--font-roboto-condensed",
});

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
      console.log(response.data.properties);
    } catch (error) {
      console.error("Error fetching properties: ", error);
    }
  };
  return (
    <div className="">
      <div className=" text-white pt-24 pb-40 px-32" id="loan">
        <div className="border border-grey-border p-16 rounded-t-3xl">
          <p
            className={`font-semibold text-4xl mb-2 font-roboto-condensed ${robotoCondensed.variable} uppercase font-semibold`}
          >
            Loans Available For Investment
          </p>
          <p className=" text-grey-text">
            Begin investing in our current loans!
          </p>
        </div>

        <div className="grid grid-cols-3">
          {properties
            .filter((property) => !property.draft)
            .filter((property) => property.remainingAmount > 0)
            .filter((property) => !property.paid)
            .map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
        </div>
      </div>
      <div className=" text-white pb-40 px-32" id="loan">
        <div className="border border-grey-border p-16 rounded-t-3xl">
          <p
            className={`font-semibold text-4xl mb-2 font-roboto-condensed ${robotoCondensed.variable} uppercase font-semibold`}
          >
            Loans In Current Portfolio
          </p>
          <p className=" text-grey-text">
            Check out some of our previously funded loans below!
          </p>
        </div>

        <div className="grid grid-cols-3">
          {properties
            .filter((property) => !property.draft)
            .filter((property) => property.remainingAmount === 0 || property.paid)
            .map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
