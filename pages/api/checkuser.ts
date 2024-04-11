import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { walletAddress } = req.query;
    try {
      const users = await prisma.user.findMany({
        where: {
          walletAddress: String(walletAddress),
        },
      });
      const exists = users.length > 0;
      res.status(200).json({ exists }); // Send response indicating whether user exists
    } catch (error) {
      console.error("Error checking user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
