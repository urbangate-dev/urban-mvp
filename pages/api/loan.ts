import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const {
        loanAmount,
        loanToARV,
        loanToAsIs,
        loanToCost,
        term,
        returnValue,
        propertyId,
        userId,
      } = req.body;

      // Create the loan in the database
      const newLoan = await prisma.loan.create({
        data: {
          loanAmount,
          loanToARV,
          loanToAsIs,
          loanToCost,
          term,
          returnValue,
          propertyId,
          userId,
        },
      });

      res.status(201).json(newLoan);
    } catch (error) {
      res.status(500).json({ error: "Error creating loan" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
