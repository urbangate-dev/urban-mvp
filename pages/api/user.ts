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
      res.status(200).json({ user: users[0] });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }

  if (req.method === "POST") {
    const { name, email, address } = req.body;
    console.log("chungus");
    try {
      const newUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
          walletAddress: address,
          role: "INVESTOR",
        },
      });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: "Error creating user" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
