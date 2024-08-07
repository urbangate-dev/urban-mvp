import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

interface DocusignWebhookRequest {
  envelopeId: string;
  status: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { body } = req;

    // Ensure the body is typed correctly
    const { envelopeId, status }: DocusignWebhookRequest = body;

    console.log(envelopeId, status);

    // Verify the request (you may want to add HMAC verification here)

    // try {
    //   if (status === 'completed') {
    //     // Update the PostgreSQL database using Prisma
    //     const updatedLoan = await prisma.loan.update({
    //       where: { envelopeId },
    //       data: { status: 'funded' },
    //     });

    //     res.status(200).json({ message: 'Database updated successfully', updatedLoan });
    //   } else {
    //     res.status(200).json({ message: 'No update needed' });
    //   }
    // } catch (error) {
    //   console.error('Error updating database:', error);
    //   res.status(500).json({ message: 'Internal Server Error', error });
    // }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
