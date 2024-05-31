import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChildPageProps, Loan, Payment, Property } from "@/utils/props";
import Link from "next/link";
import PropertyCardAdmin from "@/components/property-card-admin";
import LoanCardAdmin from "@/components/loan-card-admin";
import { FaHouseChimney } from "react-icons/fa6";
import { PiBankBold } from "react-icons/pi";
import { FaPiggyBank } from "react-icons/fa6";
import { formatCurrency } from "@/utils/functions";
import { MdDeleteOutline } from "react-icons/md";
import { KYC } from "../../components/setkyc";

const Dashboard: React.FC<ChildPageProps> = ({
  isConnected,
  address,
  user,
  router,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [view, setView] = useState<string>("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentPayments, setCurrentPayments] = useState<Payment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    getProperties();
    getLoans();
    getPayments();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentPayments(payments.slice(startIndex, endIndex));
  }, [payments, currentPage]);

  const getProperties = async () => {
    try {
      const response = await axios.get("/api/property");
      setProperties(response.data.properties);
    } catch (error) {
      console.error("Error fetching properties: ", error);
    }
  };

  const deleteProperty = async (propertyId: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const response = await axios.delete(`/api/property/${propertyId}`);
        setProperties(
          properties.filter((property) => property.id !== propertyId)
        );
      } catch (error) {
        console.error("Error deleting property: ", error);
      }
    }
  };

  const getLoans = async () => {
    try {
      const response = await axios.get("/api/loan");
      setLoans(response.data.loans);
    } catch (error) {
      console.error("Error fetching loans: ", error);
    }
  };

  const getPayments = async () => {
    try {
      const response = await axios.get("/api/payment");
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments: ", error);
    }
  };

  const addPayment = (newPayment: Payment) => {
    setPayments((prevPayments) => [...prevPayments, newPayment]);
  };

  const deletePayment = async (paymentId: string) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await axios.delete(`/api/payment/${paymentId}`);
        setPayments(payments.filter((payment) => payment.id !== paymentId));
        setCurrentPayments(
          currentPayments.filter((payment) => payment.id !== paymentId)
        );
      } catch (error) {
        console.error("Error deleting payment: ", error);
      }
    }
  };

  const totalPages = Math.ceil(payments.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="grid grid-cols-5 h-screen">
      <div className="bg-white px-8 text-xl shadow-lg z-10">
        <div className="sticky top-[8rem] flex flex-col gap-2">
          <div
            onClick={() => setView("Property")}
            className={`flex items-center gap-4 p-4 rounded-xl  hover:text-gray-500 transition cursor-pointer ${
              view === "Property" || view === ""
                ? "bg-gold text-white hover:text-white"
                : ""
            }`}
          >
            <FaHouseChimney className="text-2xl" />
            <p className="">Properties</p>
          </div>
          <div
            onClick={() => setView("Loan")}
            className={`flex items-center gap-4 p-4 rounded-xl  hover:text-gray-500 transition cursor-pointer ${
              view === "Loan" ? "text-white bg-gold hover:text-white" : ""
            }`}
          >
            <PiBankBold className="text-2xl" />
            <p className="">Loans</p>
          </div>
          <div
            onClick={() => setView("Payment")}
            className={`flex items-center gap-4 p-4 rounded-xl hover:text-gray-500 transition cursor-pointer ${
              view === "Payment" ? "bg-gold text-white hover:text-white" : ""
            }`}
          >
            <FaPiggyBank className="text-2xl" />
            <p className="">Payments</p>
          </div>
        </div>
      </div>
      <div className="col-span-4 bg-gray-50 p-20">
        <div className="">
          <p className="font-bold text-5xl">Welcome, {user.name}!</p>

          {view === "Loan" ? (
            <div className="pb-40">
              <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                  <p className="font-medium text-3xl mt-8">Loans In Funding</p>
                  <div className="mt-4 flex flex-col gap-4">
                    {loans
                      .filter(
                        (loan) => !loan.pending && loan.funding && !loan.paid
                      )
                      .map((loan) => (
                        <LoanCardAdmin
                          key={loan.id}
                          loan={loan}
                          loans={loans}
                          setLoans={setLoans}
                          addPayment={addPayment}
                        />
                      ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-3xl mt-8">Pending Loans</p>
                  <div className="mt-4 flex flex-col gap-4">
                    {loans
                      .filter((loan) => loan.pending)
                      .map((loan) => (
                        <LoanCardAdmin
                          key={loan.id}
                          loan={loan}
                          loans={loans}
                          setLoans={setLoans}
                          addPayment={addPayment}
                        />
                      ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12 w-full">
                <div>
                  <p className="font-medium text-3xl mt-8">Approved Loans</p>
                  <div className="mt-4 flex flex-col gap-4">
                    {loans
                      .filter((loan) => !loan.pending && !loan.funding)
                      .map((loan) => (
                        <LoanCardAdmin
                          key={loan.id}
                          loan={loan}
                          loans={loans}
                          setLoans={setLoans}
                          addPayment={addPayment}
                        />
                      ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-3xl mt-8">Paid Loans</p>
                  <div className="mt-4 flex flex-col gap-4">
                    {loans
                      .filter((loan) => loan.paid)
                      .map((loan) => (
                        <LoanCardAdmin
                          key={loan.id}
                          loan={loan}
                          loans={loans}
                          setLoans={setLoans}
                          addPayment={addPayment}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ) : view === "Payment" ? (
            <div>
              <table className="bg-white border mt-8 text-lg py-4 w-full">
                <tr className="border-t border-b font-semibold">
                  <td className="py-4 pl-4 pr-10">Transaction Id</td>
                  <td className="py-4 pl-8 pr-10">Transaction Date</td>
                  <td className="py-4 pl-8 pr-10">Amount</td>
                  <td className="py-4 pl-8 pr-10">Status</td>
                  <td className="py-4 pl-8 pr-10"></td>
                </tr>
                {currentPayments
                  ? currentPayments.map((payment) => (
                      <tr>
                        <td className="py-4 pl-4 pr-20">{payment.id}</td>
                        <td className="py-4 pl-8 pr-20">
                          {payment.paymentDate}
                        </td>
                        <td className="py-4 pl-8 pr-20">
                          {formatCurrency(payment.balance)}
                        </td>
                        <td className="py-4 pl-8 pr-6">{payment.status}</td>
                        <td className="py-4 pl-8 pr-6 text-red-500 text-xl">
                          <p
                            onClick={() => deletePayment(payment.id)}
                            className="cursor-pointer"
                          >
                            <MdDeleteOutline />
                          </p>
                        </td>
                      </tr>
                    ))
                  : ""}
              </table>
              <div className="flex gap-4 mt-4 items-center justify-center">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-gold border-gold rounded-full border disabled:text-gray-300 disabled:border-gray-200"
                >
                  Previous
                </button>
                <p>
                  Page {currentPage} of {totalPages}
                </p>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-gold border-gold rounded-full border disabled:text-gray-300 disabled:border-gray-200"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-12">
              <Link
                href="/admin/create-property"
                className="text-xl text-gold font-light px-4 py-2 border border-gold absolute rounded-full right-20 cursor-pointer mt-6 hover:text-dark-gold hover:border-dark-gold transition"
              >
                Create Property
              </Link>
              <div>
                <p className="font-medium text-3xl mt-8">Active Properties</p>
                <div className="flex flex-col gap-4 mt-4">
                  {properties
                    .filter((property) => !property.draft)
                    .map((property) => (
                      <PropertyCardAdmin
                        property={property}
                        deleteProperty={deleteProperty}
                        draft={property.draft}
                      />
                    ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-3xl mt-8">Draft Properties</p>
                <div className="flex flex-col gap-4 mt-4">
                  {properties
                    .filter((property) => property.draft)
                    .map((property) => (
                      <PropertyCardAdmin
                        property={property}
                        deleteProperty={deleteProperty}
                        draft={property.draft}
                      />
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
