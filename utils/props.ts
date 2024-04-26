import { NextRouter } from "next/router";

type User = {
  name: string;
  email: string;
};

export interface ChildPageProps {
  isConnected: boolean;
  address: string;
  user: User;
  router: NextRouter;
}

export interface Property {
  id: string;
  address: string;
  dealDescription: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  bathroom: number;
  bedroom: number;
  sqft: number;
  loanAsIsValue: number;
  loanARVValue: number;
  loanToCostValue: number;
  loanAmount: number;
  yieldPercent: number;
  maturityDate: string;
  borrower: string;
  rehabBudget: number;
  exitStrategy: string;
  borrowerExperience: string;
  borrowerNumberOfDeals: number;
  borrowerDescription: string;
  investorPresentationLink: string;
  draft: boolean;
}

export interface PropertyWithoutId {
  address: string;
  dealDescription: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  bathroom: number;
  bedroom: number;
  sqft: number;
  loanAsIsValue: number;
  loanARVValue: number;
  loanToCostValue: number;
  loanAmount: number;
  yieldPercent: number;
  maturityDate: string;
  borrower: string;
  rehabBudget: number;
  exitStrategy: string;
  borrowerExperience: string;
  borrowerNumberOfDeals: number;
  borrowerDescription: string;
  investorPresentationLink: string;
  draft: boolean;
}
