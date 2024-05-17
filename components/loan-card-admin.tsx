import Link from "next/link";
import { Loan } from "@/utils/props";
import axios from "axios";
import { useEffect, useState } from "react";

interface LoanCardProps {
  loan: Loan;
}

export default function LoanCardAdmin({ loan }: LoanCardProps) {
  const [property, setProperty] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`/api/property/${loan.propertyId}`);
      setProperty(response.data.property.address);
    } catch (error) {
      console.error("Error fetching property: ", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/user/${loan.walletAddress}`);
      console.log("user: ", response.data);
      setName(response.data.user.name);
    } catch (error) {
      console.error("Error fetching user: ", error);
    }
  };

  const approveLoan = async () => {
    try {
      const response = await axios.put(`/api/loan/${loan.id}`, {
        ...loan,
        pending: false,
      });
    } catch (error) {
      console.error("Error approving loan: ", error);
    }
  };

  const deleteLoan = async () => {
    try {
      const response = await axios.delete(`/api/loan/${loan.id}`);
    } catch (error) {
      console.error("Error deleting loan: ", error);
    }
  };

  useEffect(() => {
    fetchProperty();
    fetchUser();
  }, []);

  return (
    <div className="px-6 py-4 border">
      <div className="flex justify-between">
        <div className="flex gap-8">
          <p>
            Loan for {property} by {name}
          </p>
          <p>Amount: ${loan.loanAmount}</p>
        </div>

        <div className="flex gap-8">
          <p className="cursor-pointer" onClick={() => setVisible(!visible)}>
            {visible ? "Hide" : "View"} Loan Details
          </p>
          <Link href={`/property/${loan.propertyId}`}>View Property</Link>
          {loan.pending ? (
            <p className="text-green-500 cursor-pointer" onClick={approveLoan}>
              Approve Loan
            </p>
          ) : (
            ""
          )}
          <p onClick={deleteLoan} className="cursor-pointer text-red-500">
            Delete Loan
          </p>
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
