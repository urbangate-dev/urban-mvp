import React, { useEffect, useState } from "react";
import axios from "axios";
import { Property } from "@/utils/props";
import Link from "next/link";
import PropertyCardAdmin from "@/components/property-card-admin";

export default function Dashboard() {
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

  const deleteProperty = async (propertyId: string) => {
    try {
      const response = await axios.delete(`/api/property/${propertyId}`);
      setProperties(
        properties.filter((property) => property.id !== propertyId)
      );
    } catch (error) {
      console.error("Error deleting property: ", error);
    }
  };

  return (
    <div className="p-10">
      <p className="text-4xl text-center">Admin Dashboard</p>
      <Link href="/admin/create-property">Add Property</Link>
      <p className="mt-10 text-2xl mb-4">Existing properties</p>
      <div className="flex flex-col gap-2">
        {properties
          .filter((property) => !property.draft)
          .map((property) => (
            <PropertyCardAdmin
              property={property}
              deleteProperty={deleteProperty}
              draft={property.draft}
            />
          ))}
      </div>
      <p className="mt-10 text-2xl mb-4">Drafts</p>
      <div className="flex flex-col gap-2">
        {properties
          .filter((property) => property.draft)
          .map((property) => (
            <PropertyCardAdmin
              property={property}
              deleteProperty={deleteProperty}
              draft={property.draft}
            />
          ))}
      </div>
    </div>
  );
}
