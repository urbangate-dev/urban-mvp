import Image from "next/image";
import React from "react";
import PropertyImage from "../public/testproperty.jpeg";
import Link from "next/link";
import { Property } from "@/utils/props";
import { formatCurrency } from "../utils/functions";
interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
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
          <div className="flex gap-2 mb-1">
            <p>
              <span className="font-medium">
                {formatCurrency(property.loanAmount)}
              </span>{" "}
              Loan
            </p>

            <div className="border-l"></div>
            <p>
              <span className="font-medium">{property.loanARVValue}%</span> ARV
            </p>
            <div className="border-l"></div>
            <p>
              <span className="font-medium">{property.term} Month</span> Term
            </p>
          </div>
          <p className="font-light mb-3">{property.propertyDescription}</p>
        </div>
      </Link>
    </div>
  );
}
