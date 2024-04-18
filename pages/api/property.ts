import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import prisma from "../../lib/prisma";

// GET /api/property - Get all properties
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const properties = await prisma.property.findMany();
      res.status(200).json({ properties });
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "POST") {
    const {
      address,
      city,
      state,
      propertyType,
      bathroom,
      bedroom,
      sqft,
      asIsPropertyValue,
      ARVValue,
      totalCost,
      borrower,
    } = req.body;

    const parsedBathroom = parseInt(bathroom, 10);
    const parsedBedroom = parseInt(bedroom, 10);
    const parsedSqft = parseInt(sqft, 10);
    const parsedAsIsPropertyValue = parseFloat(asIsPropertyValue);
    const parsedARVValue = parseFloat(ARVValue);
    const parsedTotalCost = parseFloat(totalCost);

    try {
      const createdProperty = await prisma.property.create({
        data: {
          address,
          city,
          state,
          propertyType,
          bathroom: parsedBathroom,
          bedroom: parsedBedroom,
          sqft: parsedSqft,
          asIsPropertyValue: parsedAsIsPropertyValue,
          ARVValue: parsedARVValue,
          totalCost: parsedTotalCost,
          borrower,
        },
      });
      console.log("Property created:", createdProperty);
      res.status(201).json({ property: createdProperty });
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
