import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { ChildPageProps, Loan, Property } from "@/utils/props";
import Link from "next/link";
import PropertyCardAdmin from "@/components/property-card-admin";
import LoanCardAdmin from "@/components/loan-card-admin";
import { FaHouseChimney } from "react-icons/fa6";
import { PiBankBold } from "react-icons/pi";
import { FaPiggyBank } from "react-icons/fa6";
import { formatCurrency } from "@/utils/functions";
import { MdDeleteOutline } from "react-icons/md";
import localFont from "@next/font/local";
import { Payment, User } from "@prisma/client";

const robotoCondensed = localFont({
  src: [
    {
      path: "../../public/fonts/RobotoCondensed-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-roboto-condensed",
});

const robotoMono = localFont({
  src: [
    {
      path: "../../public/fonts/RobotoMono-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-roboto-mono",
});

const Dashboard: React.FC<ChildPageProps> = ({
  isConnected,
  address,
  user,
  router,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [view, setView] = useState<string>("Loan");
  const [users, setUsers] = useState<User[]>([]);
  const [secondaryView, setSecondaryView] =
    useState<string>("Unapproved Loans");
  const [tertiaryView, setTertiaryView] = useState<string>("Active Properties");
  const [quaternaryView, setQuaternaryView] = useState<string>("Users");
  const [addressToValidate, setAddressToValidate] = useState<string>("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentPayments, setCurrentPayments] = useState<Payment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    getProperties();
    getLoans();
    getPayments();
    getUsers();
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
        setPayments(
          payments.filter((payment) => payment.id !== parseInt(paymentId))
        );
        setCurrentPayments(
          currentPayments.filter(
            (payment) => payment.id !== parseInt(paymentId)
          )
        );
      } catch (error) {
        console.error("Error deleting payment: ", error);
      }
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get("/api/user");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  // const addAddress = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post("/api/wallet", {
  //       walletAddress: addressToValidate,
  //     });
  //     window.alert("Address successfully verified!");
  //     setAddressToValidate("");
  //   } catch (error) {
  //     console.error("Error creating address: ", error);
  //   }
  // };

  const approveUser = async (walletAddress: string) => {
    try {
      const response = await axios.put(`/api/user/${walletAddress}`, {
        approved: true,
      });
      window.alert("User approved!");

      //send email to user saying they are approved
    } catch (error) {
      console.error("Error creating address: ", error);
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
    <div className="p-20">
      <div className="grid grid-cols-4">
        <div
          className="border border-grey-border py-6 mt-4 rounded-tl-3xl"
          onClick={() => setView("Loan")}
        >
          <p
            className={`text-4xl mb-4 mt-4 ${
              robotoCondensed.variable
            } font-roboto-condensed hover:text-white transition font-light uppercase text-center cursor-pointer ${
              view === "Loan" ? "text-white" : "text-grey-text"
            }`}
            style={{ fontVariant: "all-small-caps" }}
          >
            Loans
          </p>
        </div>
        <div
          className="border border-grey-border py-6 mt-4"
          onClick={() => setView("Property")}
        >
          <p
            className={`text-4xl mb-4 mt-4 ${
              robotoCondensed.variable
            } font-roboto-condensed hover:text-white transition font-light uppercase text-center cursor-pointer ${
              view === "Property" ? "text-white" : "text-grey-text"
            }`}
            style={{ fontVariant: "all-small-caps" }}
          >
            Properties
          </p>
        </div>
        <div
          className="border border-grey-border py-6 mt-4 rounded-tr-3xl"
          onClick={() => setView("Payment")}
        >
          <p
            className={`text-4xl mb-4 mt-4 ${
              robotoCondensed.variable
            } font-roboto-condensed hover:text-white transition font-light uppercase text-center cursor-pointer ${
              view === "Payment" ? "text-white" : "text-grey-text"
            }`}
            style={{ fontVariant: "all-small-caps" }}
          >
            Transactions
          </p>
        </div>
        <div
          className="border border-grey-border py-6 mt-4 rounded-tr-3xl"
          onClick={() => setView("User")}
        >
          <p
            className={`text-4xl mb-4 mt-4 ${
              robotoCondensed.variable
            } font-roboto-condensed hover:text-white transition font-light uppercase text-center cursor-pointer ${
              view === "User" ? "text-white" : "text-grey-text"
            }`}
            style={{ fontVariant: "all-small-caps" }}
          >
            Users
          </p>
        </div>
      </div>
      {/* <div className="bg-white px-8 text-xl shadow-lg z-10">
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
      </div> */}

      <div className="">
        {view === "Loan" ? (
          <div className="pb-40">
            <div className="flex justify-center gap-4 border-b border-l border-r border-grey-border py-6">
              <p
                className={`text-lg font-extralight border  rounded-2xl py-3 px-6 transition ${
                  robotoMono.variable
                } font-roboto-mono uppercase hover:text-dark-gold hover:border-dark-gold cursor-pointer ${
                  secondaryView === "Loans in Funding"
                    ? "border-gold text-gold"
                    : "border-grey-text text-grey-text"
                }`}
                onClick={() => setSecondaryView("Loans in Funding")}
              >
                Loans in Funding
              </p>
              <p
                className={`text-lg font-extralight border  rounded-2xl py-3 px-6 transition ${
                  robotoMono.variable
                } font-roboto-mono uppercase hover:text-dark-gold hover:border-dark-gold cursor-pointer ${
                  secondaryView === "Unapproved Loans"
                    ? "border-gold text-gold"
                    : "border-grey-text text-grey-text"
                }`}
                onClick={() => setSecondaryView("Unapproved Loans")}
              >
                Unsigned Loans
              </p>
              <p
                className={`text-lg font-extralight border  rounded-2xl py-3 px-6 transition ${
                  robotoMono.variable
                } font-roboto-mono uppercase hover:text-dark-gold hover:border-dark-gold cursor-pointer ${
                  secondaryView === "Unfunded Loans"
                    ? "border-gold text-gold"
                    : "border-grey-text text-grey-text"
                }`}
                onClick={() => setSecondaryView("Unfunded Loans")}
              >
                Unfunded Loans
              </p>
              <p
                className={`text-lg font-extralight border  rounded-2xl py-3 px-6 transition ${
                  robotoMono.variable
                } font-roboto-mono uppercase hover:text-dark-gold hover:border-dark-gold cursor-pointer ${
                  secondaryView === "Paid Loans"
                    ? "border-gold text-gold"
                    : "border-grey-text text-grey-text"
                }`}
                onClick={() => setSecondaryView("Paid Loans")}
              >
                Paid Loans
              </p>
            </div>
            <div className="mb-12 mt-16">
              {secondaryView === "Loans in Funding" ? (
                <div>
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
              ) : (
                ""
              )}

              {secondaryView === "Unapproved Loans" ? (
                <div>
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
              ) : (
                ""
              )}
            </div>

            {secondaryView === "Unfunded Loans" ? (
              <div>
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
            ) : (
              ""
            )}

            {secondaryView === "Paid Loans" ? (
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
            ) : (
              ""
            )}
          </div>
        ) : view === "Payment" ? (
          <div>
            <table className="border border-grey-border text-white mt-8 text-xl py-4 w-full">
              <tr className="border-b border-grey-border uppercase">
                <td className="py-4 pl-4 pr-10">Id</td>

                <td className="py-4 pl-8 pr-10">Amount</td>
                <td className="py-4 pl-8 pr-10">Date</td>

                <td className="py-4 pl-8 pr-10">Status</td>
                <td className="py-4 pl-8 pr-10"></td>
              </tr>
              {currentPayments
                ? currentPayments.map((payment, index) => (
                    <tr
                      className={`${robotoMono.variable} font-roboto-mono uppercase border-b border-grey-border`}
                      key={index}
                    >
                      <td className="py-4 pl-4 pr-20">
                        <a
                          href={`https://base-sepolia.blockscout.com/tx/${payment.tx}`}
                          className="text-blue-500 hover:underline"
                        >
                          {payment.id}
                        </a>
                      </td>

                      <td className="py-4 pl-8 pr-20">
                        {formatCurrency(payment.balance)}
                      </td>
                      <td className="py-4 pl-8 pr-20">{payment.paymentDate}</td>
                      <td className="py-4 pl-8 pr-6">{payment.status}</td>
                      <td className="py-4 pl-8 pr-6 text-red-500 text-xl">
                        <p
                          onClick={() => deletePayment(payment.id + "")}
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
                className="px-4 py-2 text-gold border-gold rounded-full border disabled:text-grey-text disabled:border-grey-text"
              >
                Previous
              </button>
              <p className="text-white uppercase">
                Page {currentPage} of {totalPages}
              </p>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-gold border-gold rounded-full border disabled:text-grey-text disabled:border-grey-text"
              >
                Next
              </button>
            </div>
          </div>
        ) : view === "Property" ? (
          <div className="">
            <div className="flex justify-center gap-4 border-b border-l border-r border-grey-border py-6">
              <p
                className={`text-lg font-extralight border  rounded-2xl py-3 px-6 transition ${
                  robotoMono.variable
                } font-roboto-mono uppercase hover:text-dark-gold hover:border-dark-gold cursor-pointer ${
                  tertiaryView === "Active Properties"
                    ? "border-gold text-gold"
                    : "border-grey-text text-grey-text"
                }`}
                onClick={() => setTertiaryView("Active Properties")}
              >
                Active Properties
              </p>
              <p
                className={`text-lg font-extralight border  rounded-2xl py-3 px-6 transition ${
                  robotoMono.variable
                } font-roboto-mono uppercase hover:text-dark-gold hover:border-dark-gold cursor-pointer ${
                  tertiaryView === "Draft Properties"
                    ? "border-gold text-gold"
                    : "border-grey-text text-grey-text"
                }`}
                onClick={() => setTertiaryView("Draft Properties")}
              >
                Draft Properties
              </p>
              <p
                className={`text-lg font-extralight border  rounded-2xl py-3 px-6 transition ${
                  robotoMono.variable
                } font-roboto-mono uppercase hover:text-dark-gold hover:border-dark-gold cursor-pointer ${
                  tertiaryView === "Funded Properties"
                    ? "border-gold text-gold"
                    : "border-grey-text text-grey-text"
                }`}
                onClick={() => setTertiaryView("Funded Properties")}
              >
                Funded Properties
              </p>
              <Link
                href="/admin/create-property"
                className={`text-lg text-white font-light px-6 py-3 border border-white rounded-2xl cursor-pointer hover:text-gray-200 hover:border-gray-200 transition ${robotoMono.variable} font-roboto-mono uppercase`}
              >
                Create Property
              </Link>
            </div>
            <div className="mt-20">
              {tertiaryView === "Active Properties" ? (
                <div>
                  {properties
                    .filter((property) => !property.draft)
                    .map((property, index) => (
                      <PropertyCardAdmin
                        property={property}
                        deleteProperty={deleteProperty}
                        draft={property.draft}
                        key={index}
                      />
                    ))}
                </div>
              ) : (
                ""
              )}

              {tertiaryView === "Draft Properties" ? (
                <div>
                  <p className="font-medium text-3xl mt-8">Draft Properties</p>
                  <div className="flex flex-col gap-4 mt-4">
                    {properties
                      .filter((property) => property.draft)
                      .map((property, index) => (
                        <PropertyCardAdmin
                          property={property}
                          deleteProperty={deleteProperty}
                          draft={property.draft}
                          key={index}
                        />
                      ))}
                  </div>
                </div>
              ) : (
                ""
              )}

              {/* add funded properties here after making database change (likely add a status and replace draft boolean) */}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-center gap-4 border-b border-l border-r border-grey-border py-6">
              <p
                className={`text-lg font-extralight border  rounded-2xl py-3 px-6 transition ${robotoMono.variable} font-roboto-mono uppercase hover:text-dark-gold hover:border-dark-gold cursor-pointer border-gold text-gold`}
                onClick={() => setQuaternaryView("Users")}
              >
                Users
              </p>
              <p
                className={`text-lg font-extralight border  rounded-2xl py-3 px-6 transition ${robotoMono.variable} font-roboto-mono uppercase hover:text-dark-gold hover:border-dark-gold cursor-pointer border-gold text-gold`}
                onClick={() => setQuaternaryView("Add address")}
              >
                Add Address
              </p>
            </div>

            {quaternaryView === "Users" ? (
              <table className="border border-grey-border text-white mt-8 text-xl py-4 w-full">
                <tr className="border-b border-grey-border uppercase">
                  <td className="py-4 pl-4 pr-10">Name</td>
                  <td className="py-4 pl-8 pr-10">Email</td>
                  <td className="py-4 pl-8 pr-10">Wallet Address</td>
                </tr>
                {users
                  ? users.map((user, index) => (
                      <tr
                        className={`${robotoMono.variable} font-roboto-mono uppercase border-b border-grey-border`}
                        key={index}
                      >
                        <td className="py-4 pl-4 pr-20">{user.name}</td>

                        <td className="py-4 pl-8 pr-20">{user.email}</td>
                        <td className="py-4 pl-8 pr-20">
                          {user.walletAddress === ""
                            ? "Google Account"
                            : user.walletAddress}
                        </td>
                        <td></td>
                      </tr>
                    ))
                  : ""}
              </table>
            ) : (
              <div>
                <table className="border border-grey-border text-white mt-8 text-xl py-4 w-full">
                  <tr className="border-b border-grey-border uppercase">
                    <td className="py-4 pl-4 pr-10">Name</td>
                    <td className="py-4 pl-8 pr-10">Email</td>
                    <td className="py-4 pl-8 pr-10">Wallet Address</td>
                    <td className="py-4 pl-8 pr-10"></td>
                  </tr>
                  {users
                    ? users
                        .filter((user) => !user.approved)
                        .map((user, index) => (
                          <tr
                            className={`${robotoMono.variable} font-roboto-mono uppercase border-b border-grey-border`}
                            key={index}
                          >
                            <td className="py-4 pl-4 pr-20">{user.name}</td>

                            <td className="py-4 pl-8 pr-20">{user.email}</td>
                            <td className="py-4 pl-8 pr-20">
                              {user.walletAddress === ""
                                ? "Google Account"
                                : user.walletAddress}
                            </td>
                            <td className="pr-4">
                              <p
                                className="cursor-pointer rounded-2xl px-4 py-2 border border-gold text-gold hover:text-dark-gold hover:border-dark-gold"
                                onClick={() => approveUser(user.walletAddress)}
                              >
                                Approve
                              </p>
                            </td>
                          </tr>
                        ))
                    : ""}
                </table>
                {/* <form onSubmit={addAddress} className="mt-8 flex gap-4 w-full">
                  <label className="flex flex-col text-lg w-full">
                    <input
                      type="text"
                      name="address"
                      value={addressToValidate}
                      onChange={(e) => setAddressToValidate(e.target.value)}
                      placeholder="Address To Validate"
                      className="border border-grey-border bg-grey-input text-grey-text rounded-md p-5 font-light placeholder:text-grey-text outline-dark-gold text-xl"
                    />
                  </label>
                  <button
                    type="submit"
                    className={`text-gold text-xl px-4 py-2 border border-gold rounded-xl uppercase hover:text-dark-gold hover:border-dark-gold transition ${robotoCondensed.variable} font-roboto-condensed`}
                  >
                    Verify Address
                  </button>
                </form> */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
