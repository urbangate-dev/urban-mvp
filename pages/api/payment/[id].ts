import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (req.method === "GET") {
    try {
      const payments = await prisma.payment.findMany({
        where: {
          loanId: Number(id),
        },
      });

      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ error: "Error fetching payments" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
