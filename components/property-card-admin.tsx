import Link from "next/link";
import { Property } from "@/utils/props";
import Image from "next/image";
import PropertyImage from "../public/testproperty.jpeg";
import { formatCurrency } from "@/utils/functions";

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
  return (
    <div className="p-5 rounded-3xl bg-white shadow-lg flex gap-6">
      <div>
        <Image src={PropertyImage} alt="property" className="" width={160} />
      </div>
      <div>
        <div className="flex gap-3">
          <p className="font-semibold text-xl">{property.address}</p>
          <div className="border-r"></div>
          <p className="font-semibold text-xl">
            {formatCurrency(property.loanAmount)}
          </p>
        </div>
        <div className="flex gap-4 mt-2">
          <p className="text-lg">
            Loan to ARV:{" "}
            <span className="font-light">{property.loanARVValue}%</span>
          </p>
          <p className="text-lg">
            Loan Term:{" "}
            <span className="font-light">{property.term} months</span>
          </p>
        </div>
        <div className="flex gap-4 mt-3">
          {draft ? (
            ""
          ) : (
            <Link
              className="font-light text-xl hover:text-gray-500 transition"
              href={`/property/${property.id}`}
            >
              View
            </Link>
          )}
          <Link
            className="font-light text-xl hover:text-gray-500 transition"
            href={`/admin/edit-property/${property.id}`}
          >
            Edit
          </Link>
          <p
            className="text-red-500 font-light text-xl cursor-pointer hover:text-red-400 transition"
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
