import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;

      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
        include: { loans: true },
      });

      if (!user) {
        console.error("User not found");
        return [];
      }

      console.log(user.loans);

      res.status(201).json(user.loans);
    } catch (error) {
      res.status(500).json({ error: "Error creating loan" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
