import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { balance, paymentDate, loanId } = req.body;

      // Create the loan in the database
      const newLoan = await prisma.payment.create({
        data: {
          balance,
          paymentDate,
          loanId,
        },
      });

      res.status(201).json(newLoan);
    } catch (error) {
      res.status(500).json({ error: "Error creating payment" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
