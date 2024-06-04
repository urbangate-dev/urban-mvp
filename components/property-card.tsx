import Image from "next/image";
import React from "react";
import PropertyImage from "../public/testproperty.jpeg";
import Link from "next/link";
import { Property } from "@/utils/props";
import { formatCurrency, formatDate, stringToDate } from "../utils/functions";
interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const maturityDateFormatted = formatDate(stringToDate(property.maturityDate));

  return (
    <div className="flex flex-col rounded-[50px] overflow-hidden border shadow-lg hover:shadow-xl transition">
      <Link className="h-full" href={`/property/${property.id}`}>
        <div className="relative" style={{ width: "100%", height: "250px" }}>
          <Image
            src={property.thumbnail}
            alt="property"
            layout="fill" // Fill the container
            objectFit="cover" // Cover the container while maintaining aspect ratio
            className="rounded-t-[50px]" // Apply rounded corners to the top
          />
        </div>
        <div className="p-4">
          <p className="text-2xl mb-1 font-bold">{property.address}</p>
          <div className="flex gap-2 text-sm">
            <p>
              <span className="font-medium">
                {formatCurrency(property.loanAmount)}
              </span>{" "}
              Loan
            </p>
            <div className="border-l"></div>
            <p>
              <span className="font-medium">{property.loanAsIsValue}%</span>{" "}
              Loan to As is Value
            </p>

            <div className="border-l"></div>
          </div>
          <div className="text-sm flex gap-2">
            <p>
              <span className="font-medium">{property.loanARVValue}%</span> Loan
              to ARV
            </p>
            <div className="border-l"></div>
            <p>
              <span className="font-medium">{property.yieldPercent}%</span>{" "}
              Annualized Return
            </p>
            <div className="border-l"></div>
          </div>
          <div className="text-sm mb-1 flex gap-2">
            <p>
              <span className="font-medium">{maturityDateFormatted}</span>
            </p>
          </div>
          <p className="font-light mb-3">{property.propertyDescription}</p>
        </div>
      </Link>
    </div>
  );
}
