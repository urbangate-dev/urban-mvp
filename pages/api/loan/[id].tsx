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
      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
        include: { loans: true },
      });

      if (!user) {
        console.error("User not found");
        return [];
      }

      // console.log(user.loans);

      res.status(201).json(user.loans);
    } catch (error) {
      res.status(500).json({ error: "Error fetching loan" });
    }
  } else if (req.method === "PUT") {
    try {
      const updatedLoan = await prisma.loan.update({
        where: {
          id: Number(id),
        },
        data: {
          ...req.body,
        },
      });

      res.status(200).json({ loan: updatedLoan });
    } catch (error) {}
  } else if (req.method === "DELETE") {
    try {
      await prisma.loan.delete({
        where: {
          id: Number(id),
        },
      });
      res.status(200).json({ message: "Loan deleted successfully" });
    } catch (error) {
      console.error("Error deleting loan:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
