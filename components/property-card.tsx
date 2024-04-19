import Image from "next/image";
import React from "react";
import PropertyImage from "../public/testproperty.jpeg";
import Link from "next/link";

interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  propertyType: string;
  bathroom: number;
  bedroom: number;
  sqft: number;
  asIsPropertyValue: number;
  ARVValue: number;
  totalCost: number;
  borrower: string;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="flex flex-col w-[25%] rounded-2xl overflow-hidden border">
      <Link href={`/property/${property.id}`}>
        <Image src={PropertyImage} alt="property" className="" />
        <div className="p-5">
          <p className="text-2xl mb-2">{property.address}</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam
            unde ratione numquam nostrum rem earum magni ipsa vero esse. Esse,
            explicabo sint! Hic illum, commodi recusandae eius voluptatum modi
            tempora laboriosam magnam consectetur cumque voluptatem animi dolore
            maiores ipsam natus?
          </p>
        </div>
        <div className="border-b mx-5"></div>
        <div className="p-5">
          <p>Price: {property.totalCost}</p>
        </div>
      </Link>
    </div>
  );
}
