import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
