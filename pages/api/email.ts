import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import prisma from "../../lib/prisma";
import nodemailer from "nodemailer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, email, address } = req.body;
  const transporter = nodemailer.createTransport({
    port: 587,
    host: "smtp.gmail.com",
    auth: {
      user: process.env.NEXT_PUBLIC_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    secure: false,
  });
  const mailData = {
    from: "urbangatedev@gmail.com",
    to: `${email}`,
    subject: `Account Approved for Wallet Address: ${address}`,
    text: "Your investment account with UrbanGate Capital has been approved!",
    html: `<div><p>Dear ${name},</p><p>Your account has been approved! Please go to the following link to start investing: https://urbangate.vercel.app</p><p>UrbanGate Capital</p></div>`,
  };
  try {
    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log("successful");
        console.log(info);
        res.status(200).json({ message: "nice" });
      }
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
}
