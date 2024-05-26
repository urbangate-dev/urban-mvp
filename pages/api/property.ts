import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import prisma from "../../lib/prisma";

// GET /api/property - Get all properties
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const properties = await prisma.property.findMany();
      res.status(200).json({ properties });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "POST") {
    const {
      address,
      dealDescription,
      propertyDescription,
      city,
      state,
      zip,
      propertyType,
      bathroom,
      bedroom,
      sqft,
      loanAsIsValue,
      loanARVValue,
      loanToCostValue,
      loanAmount,
      yieldPercent,
      maturityDate,
      term,
      borrower,
      rehabBudget,
      exitStrategy,
      borrowerExperience,
      borrowerNumberOfDeals,
      borrowerDescription,
      investorPresentationLink,
      draft,
      thumbnail,
      additional,
    } = req.body;

    const parsedBathroom = parseInt(bathroom, 10);
    const parsedBedroom = parseInt(bedroom, 10);
    const parsedSqft = parseInt(sqft, 10);
    const parsedBorrowerNumberOfDeals = parseInt(borrowerNumberOfDeals, 10);
    const parsedLoanAsIsValue = parseFloat(loanAsIsValue);
    const parsedLoanARVValue = parseFloat(loanARVValue);
    const parsedLoanToCostValue = parseFloat(loanToCostValue);
    const parsedLoanAmount = parseFloat(loanAmount);
    const parsedYieldPercent = parseFloat(yieldPercent);
    const parsedRehabBudget = parseFloat(rehabBudget);
    const parsedTerm = parseInt(term, 10);

    try {
      const createdProperty = await prisma.property.create({
        data: {
          address,
          dealDescription,
          propertyDescription,
          city,
          state,
          zip,
          propertyType,
          bathroom: parsedBathroom,
          bedroom: parsedBedroom,
          sqft: parsedSqft,
          loanAsIsValue: parsedLoanAsIsValue,
          loanARVValue: parsedLoanARVValue,
          loanToCostValue: parsedLoanToCostValue,
          loanAmount: parsedLoanAmount,
          yieldPercent: parsedYieldPercent,
          maturityDate,
          term: parsedTerm,
          borrower,
          rehabBudget: parsedRehabBudget,
          exitStrategy,
          borrowerExperience,
          borrowerNumberOfDeals: parsedBorrowerNumberOfDeals,
          borrowerDescription,
          investorPresentationLink,
          draft,
          thumbnail,
          additional,
        },
      });
      // console.log("Property created:", createdProperty);
      res.status(201).json({ property: createdProperty });
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
