import React from "react";
import Link from "next/link";
import { Property } from "@/utils/props";
import Image from "next/image";
import PropertyImage from "../public/testproperty.jpeg";
import { formatCurrency, formatDate, parseDate } from "@/utils/functions";
import localFont from "@next/font/local";

const robotoMono = localFont({
  src: [
    {
      path: "../public/fonts/RobotoMono-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-roboto-mono",
});

interface PropertyCardAdminProps {
  property: Property;
  deleteProperty: (id: string) => void;
  draft: boolean;
}

export default function PropertyCardAdmin({
  property,
  deleteProperty,
  draft,
}: PropertyCardAdminProps) {
  const parsedMaturityDate = parseDate(property.maturityDate);
  return (
    <div className="p-5 border border-grey-border shadow-lg text-white flex gap-6">
      {/* <div className="flex">
        <Image
          src={property.thumbnail}
          alt="property"
          className=""
          width={120}
          height={120}
        />
      </div> */}
      <div className="relative" style={{ width: "200px", height: "100" }}>
        <Image
          src={property.thumbnail}
          alt="property"
          layout="fill" // Fill the container
          objectFit="cover" // Cover the container while maintaining aspect ratio
          className="opacity-80 " // Apply rounded corners to the top
        />
      </div>
      <div>
        <div className="flex gap-3">
          <p className="uppercase font-light text-2xl">{property.address}</p>
        </div>
        <div
          className={`flex gap-x-4 mt-2 ${robotoMono.variable} font-roboto-mono text-xl flex-wrap gap-y-1`}
        >
          <div className="flex gap-2">
            <p className="text-grey-text">Loan</p>
            <p className="text-grey-text">•</p>
            <p>{formatCurrency(property.loanAmount)}</p>
          </div>
          <div className="flex gap-2">
            <p className="text-grey-text">Annual Return</p>
            <p className="text-grey-text">•</p>
            <p>10%</p>
          </div>
          <div className="flex gap-2">
            <p className="text-grey-text">Maturity Date</p>
            <p className="text-grey-text">•</p>
            <p>{formatDate(parsedMaturityDate)}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-3">
          {draft ? (
            ""
          ) : (
            <Link
              className={`text-lg font-extralight border border-gold rounded-full py-2 px-4 transition ${robotoMono.variable} font-roboto-mono uppercase text-gold hover:text-dark-gold hover:border-dark-gold cursor-pointer`}
              href={`/property/${property.id}`}
            >
              View Property
            </Link>
          )}
          <Link
            className={`text-lg font-extralight border border-gold rounded-full py-2 px-4 transition ${robotoMono.variable} font-roboto-mono uppercase text-gold hover:text-dark-gold hover:border-dark-gold cursor-pointer`}
            href={`/admin/edit-property/${property.id}`}
          >
            Edit
          </Link>
          <p
            className={`text-lg font-extralight border border-red-600 rounded-full py-2 px-4 transition ${robotoMono.variable} font-roboto-mono uppercase text-red-600 hover:text-red-400 hover:border-red-400 cursor-pointer`}
            onClick={() => deleteProperty(property.id)}
          >
            Delete
          </p>
        </div>

        <div className="flex gap-4"></div>
      </div>
    </div>
  );
}
