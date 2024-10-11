import Image from "next/image";
import React from "react";
import PropertyImage from "../public/testproperty.jpeg";
import Link from "next/link";
import { Property } from "@/utils/props";
import { formatCurrency, formatDate, stringToDate } from "../utils/functions";
import localFont from "@next/font/local";
interface PropertyCardProps {
  property: Property;
}

const robotoMono = localFont({
  src: [
    {
      path: "../public/fonts/RobotoMono-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-roboto-mono",
});

export default function PropertyCard({ property }: PropertyCardProps) {
  const maturityDateFormatted = formatDate(stringToDate(property.maturityDate));

  return (
    <div className="flex flex-col border border-grey-border shadow-lg hover:shadow-xl transition p-4 overflow-hidden">
      <Link href={`/property/${property.id}`}>
        <div className="relative" style={{ width: "100%", height: "250px" }}>
          <Image
            src={property.thumbnail}
            alt="property"
            layout="fill" // Fill the container
            objectFit="cover" // Cover the container while maintaining aspect ratio
            className="rounded-t-3xl opacity-80 hover:scale-105 transition overflow-hidden" // Apply rounded corners to the top
          />
        </div>
      </Link>
      <div className="flex flex-col justify-between">
        <div>
          <Link href={`/property/${property.id}`}>
            <p
              className="text-2xl mb-1 mt-2 uppercase font-light text-center"
              style={{ fontVariant: "all-small-caps" }}
            >
              {property.address}
            </p>
          </Link>
          <div>
            <div className="border border-gold h-2 rounded-full">
              <div
                className="bg-gold opacity-50 h-full"
                style={{
                  width: `${Math.round(
                    ((property.loanAmount - property.remainingAmount) /
                      property.loanAmount) *
                      100
                  )}%`,
                }}
              ></div>
            </div>
            <p
              className="text-right text-gold font-light my-2"
              style={{ fontVariant: "all-small-caps" }}
            >
              {formatCurrency(property.remainingAmount)} Remaining
            </p>
          </div>

          <div
            className={`flex gap-x-4  ${robotoMono.variable} font-roboto-mono flex-wrap gap-y-1`}
          >
            <div className="flex gap-2">
              <p className="text-grey-text">Loan</p>
              <p className="text-grey-text">•</p>
              <p>{formatCurrency(property.loanAmount)}</p>
            </div>

            <div className="flex gap-2">
              <p className="text-grey-text">L-ARV</p>
              <p className="text-grey-text">•</p>
              <p>{property.loanAsIsValue}%</p>
            </div>

            <div className="flex gap-2">
              <p className="text-grey-text">L-As Is</p>
              <p className="text-grey-text">•</p>
              <p>{property.loanAsIsValue}%</p>
            </div>

            <div className="flex gap-2">
              <p className="text-grey-text">Annual Return</p>
              <p className="text-grey-text">•</p>
              <p>{property.yieldPercent}%</p>
            </div>

            <div className="flex gap-2">
              <p className="text-grey-text">Maturity Date</p>
              <p className="text-grey-text">•</p>
              <p>{maturityDateFormatted}</p>
            </div>
          </div>
          <p className="font-light mb-3 mt-3 text-grey-text">
            {property.propertyDescription}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <Link
            className={`${robotoMono.variable} font-roboto-mono uppercase text-gold border-gold border px-4 py-2 rounded-full hover:text-dark-gold hover:border-dark-gold transition`}
            href={`/property/${property.id}`}
          >
            View Property
          </Link>
        </div>
      </div>
    </div>
  );
}
