import Image from "next/image";
import React from "react";
import PropertyImage from "../public/testproperty.jpeg";
import Link from "next/link";
import { Property } from "@/utils/props";
interface PropertyCardProps {
  property: Property;
}

//picture

//address

//1-2 sentences ahout property

//laon amount, term elngth (with maturity date), yield, loan as is value, loan arv, loan to cost

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="flex flex-col w-[25%] rounded-2xl overflow-hidden border">
      <Link href={`/property/${property.id}`}>
        <Image src={PropertyImage} alt="property" className="" />
        <div className="p-5">
          <p className="text-2xl mb-2">{property.address}</p>
          <p>{property.propertyDescription}</p>
        </div>
        <div className="border-b mx-5"></div>
        <div className="p-5 flex justify-between">
          <div className="flex flex-col">
            <p className="text-xl">Loan</p>
            <p>${property.loanAmount}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xl">ARV</p>
            <p>{property.loanARVValue}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xl">Term</p>
            <p>{property.term}m</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
