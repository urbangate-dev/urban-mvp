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
  } else if (req.method === "DELETE") {
    try {
      await prisma.payment.delete({
        where: {
          id: Number(id),
        },
      });
      res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting payment" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
