import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import prisma from "../../../lib/prisma";

// GET /api/property/:id - Get property by ID
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (id && id !== "") {
    if (req.method === "GET") {
      try {
        console.log(id);
        const property = await prisma.property.findUnique({
          where: {
            id: Number(id),
          },
        });
        if (!property) {
          return res.status(200).json({ exists: false, property: {} });
        }
        res.status(200).json({ exists: true, property });
      } catch (error) {
        console.error("Error fetching property:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else if (req.method === "PUT") {
      // PUT /api/property/:id - Update property by ID
      try {
        const { id } = req.query;
        const updatedProperty = await prisma.property.update({
          where: {
            id: Number(id),
          },
          data: {
            ...req.body,
          },
        });
        res.status(200).json({ property: updatedProperty });
      } catch (error) {
        console.error("Error updating property:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else if (req.method === "DELETE") {
      // DELETE /api/property/:id - Delete property by ID
      try {
        await prisma.property.delete({
          where: {
            id: Number(id),
          },
        });
        res.status(200).json({ message: "Property deleted successfully" });
      } catch (error) {
        console.error("Error deleting property:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } else res.json({ message: "Loading..." });
}
