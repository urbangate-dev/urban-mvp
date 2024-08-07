import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, address, state, investor } = req.body;
    console.log(name, email, address, state, investor);
    try {
      const newUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
          walletAddress: address,
          role: "INVESTOR",
          state: state,
          investorType: investor,
        },
      });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: "Error creating user" });
    }
  } else if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany();
      res.status(201).json(users);
    } catch (error) {
      res.status(500).json({ error: "Error creating user" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
