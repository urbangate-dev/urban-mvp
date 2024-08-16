import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { walletAddress } = req.body;
    try {
      const newAddress = await prisma.walletAddress.create({
        data: {
          address: walletAddress,
        },
      });
      res.status(201).json(newAddress);
    } catch (error) {
      res.status(500).json({ error: "Error approving address" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
