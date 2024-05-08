import Link from "next/link";
import { Property } from "@/utils/props";

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
    <div className="py-4 border px-6 flex justify-between">
      <p>{property.address}</p>
      <div className="flex gap-4">
        <Link href={`/admin/edit-property/${property.id}`}>
          {draft ? "Edit Draft" : "Edit Property"}
        </Link>
        <p
          className="text-red-500 cursor-pointer"
          onClick={() => deleteProperty(property.id)}
        >
          {draft ? "Delete Draft" : "Delete Property"}
        </p>
      </div>
    </div>
  );
}
