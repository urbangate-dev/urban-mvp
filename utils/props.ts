import { NextRouter } from "next/router";

export type User = {
  name: string;
  email: string;
  role: string;
  id: string;
};

export interface ChildPageProps {
  isConnected: boolean;
  address: string;
  user: User;
  router: NextRouter;
}

export interface LoanCreateProps {
  loanAmount: number;
  loanToARV: number;
  loanToAsIs: number;
  loanToCost: number;
  term: number;
  returnValue: number;
  propertyId: string;
  userId: string;
}

export interface Loan {
  id: string;
  loanAmount: number;
  loanToARV: number;
  loanToAsIs: number;
  loanToCost: number;
  term: number;
  returnValue: number;
  propertyId: string;
  property: Property;
  userId: string;
  user: User;
}

export interface Property {
  id: string;
  address: string;
  dealDescription: string;
  propertyDescription: string;
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
  term: number;
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
  propertyDescription: string;
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
  term: number;
  borrower: string;
  rehabBudget: number;
  exitStrategy: string;
  borrowerExperience: string;
  borrowerNumberOfDeals: number;
  borrowerDescription: string;
  investorPresentationLink: string;
  draft: boolean;
}
