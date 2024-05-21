import Link from "next/link";
import { Loan } from "@/utils/props";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import PropertyImage from "../public/testproperty.jpeg";
import { formatCurrency } from "@/utils/functions";

interface LoanCardAdminProps {
  loan: Loan;
  loans: Loan[];
  setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
}

export default function LoanCardAdmin({
  loan,
  loans,
  setLoans,
}: LoanCardAdminProps) {
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
      setName(response.data.user.name);
    } catch (error) {
      console.error("Error fetching user: ", error);
    }
  };

  const approveLoan = async () => {
    try {
      await axios.put(`/api/loan/${loan.id}`, {
        ...loan,
        pending: false,
      });
      setLoans(
        loans.map((l) => (l.id === loan.id ? { ...l, pending: false } : l))
      );
    } catch (error) {
      console.error("Error approving loan: ", error);
    }
  };

  const deleteLoan = async () => {
    try {
      await axios.delete(`/api/loan/${loan.id}`);
      setLoans(loans.filter((loanInState) => loanInState.id !== loan.id));
    } catch (error) {
      console.error("Error deleting loan: ", error);
    }
  };

  useEffect(() => {
    fetchProperty();
    fetchUser();
  }, []);

  return (
    <div className="p-5 rounded-3xl bg-white shadow-lg">
      <div className="flex gap-6">
        <div>
          <Image src={PropertyImage} alt="property" className="" width={160} />
        </div>
        <div>
          <div className="flex gap-3">
            <p className="font-semibold text-xl">{property}</p>
            <div className="border-r"></div>
            <p className="font-semibold text-xl">
              {formatCurrency(loan.loanAmount)}
            </p>
          </div>
          <div className="flex gap-4 mt-2">
            <p className="text-lg">
              Investor: <span className="font-light">{name}</span>
            </p>
            <p className="text-lg">
              ARV: <span className="font-light">{loan.loanToARV}%</span>
            </p>
          </div>
          <div className="flex gap-4 mt-3">
            {loan.pending ? (
              <p
                className="text-green-500 cursor-pointer font-light text-xl hover:text-green-400 transition"
                onClick={approveLoan}
              >
                Approve
              </p>
            ) : (
              ""
            )}
            <Link
              className="font-light text-xl hover:text-gray-500 transition"
              href={`/property/${loan.propertyId}`}
            >
              View
            </Link>

            <p
              className="cursor-pointer font-light text-xl hover:text-gray-500 transition"
              onClick={() => setVisible(!visible)}
            >
              Details
            </p>
            <p
              onClick={deleteLoan}
              className="cursor-pointer text-red-500 font-light text-xl hover:text-red-400 transition"
            >
              Delete
            </p>
          </div>
        </div>
      </div>
      {visible ? (
        <div className="mt-4">
          <div className="flex gap-6">
            <p className="text-lg">
              Loan to ARV: <span className="font-light">{loan.loanToARV}%</span>
            </p>
            <p className="text-lg">
              Loan to As-Is:{" "}
              <span className="font-light">{loan.loanToAsIs}%</span>
            </p>
            <p className="text-lg">
              Loan to Cost:{" "}
              <span className="font-light">{loan.loanToCost}%</span>
            </p>
          </div>
          <div className="mt-1 gap-6 flex">
            <p className="text-lg">
              Term: <span className="font-light">{loan.term} months</span>
            </p>
            <p className="text-lg">
              Return Value:{" "}
              <span className="font-light">
                {formatCurrency(loan.loanAmount)}
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
