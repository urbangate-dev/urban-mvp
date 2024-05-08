import Link from "next/link";
import { Loan } from "@/utils/props";
import axios from "axios";
import { useEffect, useState } from "react";

interface LoanCardProps {
  loan: Loan;
}

export default function LoanCard({ loan }: LoanCardProps) {
  const [property, setProperty] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`/api/property/${loan.propertyId}`);
      setProperty(response.data.property.address);
    } catch (error) {
      console.error("Error fetching property: ", error);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, []);

  return (
    <div className="px-6 py-4 border">
      <div className="flex justify-between">
        <div className="flex gap-8">
          <p>Loan for {property}</p>
          <p>Amount: ${loan.loanAmount}</p>
        </div>

        <div className="flex gap-8">
          <p className="cursor-pointer" onClick={() => setVisible(!visible)}>
            {visible ? "Hide" : "View"} Loan Details
          </p>
          <Link href={`/property/${loan.propertyId}`}>View Property</Link>
        </div>
      </div>
      {visible ? (
        <div className="mt-2 flex gap-8">
          <p>Loan To ARV: {loan.loanToARV}%</p>
          <p>Loan To As-Is: {loan.loanToAsIs}%</p>
          <p>Loan To Cost: {loan.loanToCost}%</p>
          <p>Term Length: {loan.term} months</p>
          <p>Return Value: ${loan.returnValue}</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
