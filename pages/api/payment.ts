import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { balance, paymentDate, loanId, status, tx } = req.body;

      const newPayment = await prisma.payment.create({
        data: {
          balance,
          paymentDate,
          loanId,
          status,
          tx,
        },
      });

      res.status(201).json(newPayment);
    } catch (error) {
      res.status(500).json({ error: "Error creating payment" });
    }
  } else if (req.method === "GET") {
    try {
      const payments = await prisma.payment.findMany({
        orderBy: {
          id: "desc",
        },
      });
      res.status(201).json(payments);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
