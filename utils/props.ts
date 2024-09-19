import { Session } from "next-auth";
import { NextRouter } from "next/router";

export type User = {
  name: string;
  email: string;
  role: string;
  id: string;
  state: string;
  investorType: string;
  approved: boolean;
};

export interface ChildPageProps {
  isConnected: boolean;
  address: string;
  user: User;
  router: NextRouter;
  data: Session | null;
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
  walletAddress: string;
  pending: boolean;
  funding: boolean;
  paid: boolean;
  address: string;
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
  userId: string;
  walletAddress: string;
  pending: boolean;
  funding: boolean;
  paid: boolean;
  address: string;
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
  thumbnail: string;
  additional: string[];
  propertyIndex: string;
  remainingAmount: number;
  paid: boolean;
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
  thumbnail: string;
  additional: string[];
  propertyIndex: string;
  remainingAmount: number;
  paid: boolean;
}

export interface PaymentCreateProps {
  balance: number;
  paymentDate: string;
  loanId: string;
  status: string;
  tx: string;
}

export interface Payment {
  id: string;
  balance: number;
  paymentDate: string;
  loanId: string;
  status: string;
  tx: string;
}
