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
  city: string;
  state: string;
  propertyType: string;
  bathroom: number;
  bedroom: number;
  sqft: number;
  asIsPropertyValue: number;
  ARVValue: number;
  totalCost: number;
  borrower: string;
}
