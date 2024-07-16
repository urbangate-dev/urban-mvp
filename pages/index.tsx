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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="grid grid-cols-3">
          {properties
            .filter((property) => !property.draft)
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
            .map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
        </div>
      </div>

      <div className="border border-grey-border mx-32 p-16 flex flex-col items-center gap-2 rounded-3xl mb-40">
        <p
          className={`text-4xl mb-2 font-roboto-condensed ${robotoCondensed.variable} uppercase font-light text-white`}
        >
          Have Questions About Anything Here?
        </p>
        <p className="text-grey-text">
          If you're unfamiliar with how to invest in loans, or have any other
          questions, please check out our FAQ below!
        </p>
        <Link
          href={"/"}
          className={`${robotoMono.variable} font-roboto-mono uppercase text-gold border-gold border px-6 py-3 rounded-xl hover:text-dark-gold hover:border-dark-gold transition mt-2`}
        >
          View Our FAQ
        </Link>
      </div>
    </div>
  );
};

export default Home;
