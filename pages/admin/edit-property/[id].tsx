import { ChildPageProps } from "@/utils/props";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Property {
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

const EditProperty: React.FC<ChildPageProps> = ({
  isConnected,
  address,
  user,
  router,
}) => {
  const [formData, setFormData] = useState<Property>({
    address: "",
    city: "",
    state: "",
    propertyType: "",
    bathroom: 0,
    bedroom: 0,
    sqft: 0,
    asIsPropertyValue: 0,
    ARVValue: 0,
    totalCost: 0,
    borrower: "",
  });

  const { id } = router.query;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "bedroom" ||
      name === "sqft" ||
      name === "bathroom" ||
      name === "asIsPropertyValue" ||
      name === "ARVValue" ||
      name === "totalCost"
        ? parseInt(value, 10)
        : value;
    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/property/${id}`, formData);
      console.log("Property created:", response.data.property);
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error creating property: ", error);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    if (id)
      try {
        console.log(`/api/property/${id}`);
        const response = await axios.get(`/api/property/${id}`);
        setFormData(response.data.property);
      } catch (error) {
        console.error("Error fetching property: ", error);
      }
  };

  return (
    <div>
      <Link href="/admin/dashboard">Back to Dashboard</Link>
      <form onSubmit={handleSubmit} className="flex flex-col p-10 gap-2">
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </label>
        <label>
          City:
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </label>
        <label>
          State:
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </label>
        <label>
          Property Type:
          <input
            type="text"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
          />
        </label>
        <label>
          Bathroom:
          <input
            type="number"
            name="bathroom"
            value={formData.bathroom}
            onChange={handleChange}
          />
        </label>
        <label>
          Bedroom:
          <input
            type="number"
            name="bedroom"
            value={formData.bedroom}
            onChange={handleChange}
          />
        </label>
        <label>
          Sqft:
          <input
            type="number"
            name="sqft"
            value={formData.sqft}
            onChange={handleChange}
          />
        </label>
        <label>
          As-Is Property Value:
          <input
            type="number"
            name="asIsPropertyValue"
            value={formData.asIsPropertyValue}
            onChange={handleChange}
          />
        </label>
        <label>
          ARV Value:
          <input
            type="number"
            name="ARVValue"
            value={formData.ARVValue}
            onChange={handleChange}
          />
        </label>
        <label>
          Total Cost:
          <input
            type="number"
            name="totalCost"
            value={formData.totalCost}
            onChange={handleChange}
          />
        </label>
        <label>
          Borrower:
          <input
            type="text"
            name="borrower"
            value={formData.borrower}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditProperty;
