"use client";

import PropertyCard from "@/components/property-card";
import { NextRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ChildPageProps, Property } from "@/utils/props";
import axios from "axios";

const Home: React.FC<ChildPageProps> = ({
  isConnected,
  address,
  user,
  router,
}) => {
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
  return (
    <div className="p-10">
      <div className="flex justify-center gap-10">
        {properties
          .filter((property) => !property.draft)
          .map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
      </div>
    </div>
  );
};

export default Home;
