import Image from "next/image";
import React from "react";
import PropertyImage from "../public/testproperty.jpeg";
import Link from "next/link";
import { Property } from "@/utils/props";
import { formatCurrency } from "../utils/functions";
interface PropertyCardProps {
  property: Property;
}

//picture

//address

//1-2 sentences ahout property

//laon amount, term elngth (with maturity date), yield, loan as is value, loan arv, loan to cost

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="flex flex-col rounded-[50px] overflow-hidden border shadow-lg">
      <Link href={`/property/${property.id}`}>
        <Image src={PropertyImage} alt="property" className="" />
        <div className="p-4">
          <p className="text-2xl mb-1 font-bold">{property.address}</p>
          <div className="flex gap-2 mb-1">
            <p>
              <span className="font-medium">
                {formatCurrency(property.loanAmount)}
              </span>{" "}
              loan
            </p>

            <div className="border-l"></div>
            <p>
              <span className="font-medium">{property.loanARVValue}%</span> ARV
            </p>
            <div className="border-l"></div>
            <p>
              <span className="font-medium">{property.term}m</span> term
            </p>
          </div>
          <p className="font-light mb-3">{property.propertyDescription}</p>
        </div>
      </Link>
    </div>
  );
}
