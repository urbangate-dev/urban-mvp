import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const address = await prisma.walletAddress.findMany({
        where: {
          address: String(id),
        },
      });

      if (address.length !== 0) {
        res.status(200).json(address[0].address);
      } else {
        res.status(200).json("Address not found");
      }
    } catch (error) {
      console.error("Error fetching wallet address:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
