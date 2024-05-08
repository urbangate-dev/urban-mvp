import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, address } = req.body;
    try {
      const newUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
          walletAddress: address,
          role:
            address === "0x25fbc9a7fe83a8be6ba19775d8966c0db19a7411"
              ? "ADMIN"
              : "INVESTOR",
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
