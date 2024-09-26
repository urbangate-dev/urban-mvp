import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Property, PaymentCreateProps, Loan } from "@/utils/props";
import { formatCurrency, formatDate, parseDate } from "@/utils/functions";
import { waitForTransactionReceipt, readContract } from '@wagmi/core'
import { useWriteContract } from "wagmi";
import { abi } from "../abi/loan";
import { abi as erc20abi } from "../abi/erc20";
import axios from "axios";
import { Payment } from "@prisma/client";
import { config } from '../utils/config'
import localFont from "@next/font/local";
import LoadingModal from './loadingModal';
const robotoMono = localFont({
  src: [
    {
      path: "../public/fonts/RobotoMono-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-roboto-mono",
});

type User = {
  name: string;
  email: string;
};

interface PropertyLoanCardAdminProps {
  property: Property;
  deleteProperty: (id: string) => void;
  addPayment: (payment: Payment) => void;
  loans: Loan[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  properties: Property[];
}

export default function PropertyLoanCardAdmin({
  property,
  deleteProperty,
  addPayment,
  loans,
  setProperties,
  properties,
}: PropertyLoanCardAdminProps) {
  const parsedMaturityDate = parseDate(property.maturityDate);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [bufferDays, setBufferDays] = useState(0);
  const defaultDate = new Date().toISOString().split("T")[0];
  const [propertyLoans, setPropertyLoans] = useState<Loan[]>([]);
  const [users, setUsers] = useState<{[key: string]: User}>({});
  const [amountsDue, setAmountsDue] = useState(0);
  const [isTransacting, setIsTreansacting] = useState<boolean>(false);
  const { writeContractAsync: writeApprove } = useWriteContract();
  const { writeContractAsync: writeInterest } = useWriteContract();
  const { writeContractAsync: writeApproveFull } = useWriteContract();
  const { writeContractAsync: writeFullLoan } = useWriteContract();

  useEffect(() => {
    const filteredLoans = loans.filter(loan => loan.propertyId === property.id);
    setPropertyLoans(filteredLoans);
    
    filteredLoans.forEach(loan => {
      fetchUser(loan.walletAddress);
    });
  }, [loans, property.id]);

  const fetchUser = async (walletAddress: string) => {
    try {
      const response = await axios.get(`/api/user/${walletAddress}`);
      setUsers(prevUsers => ({
        ...prevUsers,
        [walletAddress]: response.data.user
      }));
    } catch (error) {
      console.error("Error fetching user: ", error);
    }
  };

  const fetchPayment = async () => {
    try {
      const amountDue = await readContract(config, {
        abi,
        address: process.env.NEXT_PUBLIC_LENDINGPLATFORM_ADDRESS as `0x${string}`,
        functionName: "payOffLoanAmount",
        args: [BigInt(property.propertyIndex), BigInt(bufferDays)]
      }) as number;
      setAmountsDue(amountDue);
      console.log(amountDue)
    } catch (error) {
      console.error("Error fetching payment amount: ", error);
    }
  }

  const createPayment = async () => {
    setIsInterestModalOpen(false);
    setIsTreansacting(true);
    try {
      const hashApprove = await writeApprove({
        abi: erc20abi,
        address: process.env.NEXT_PUBLIC_ERC20_ADDRESS as `0x${string}`,
        functionName: "approve",
        args: [
          process.env.NEXT_PUBLIC_LENDINGPLATFORM_ADDRESS as `0x${string}`,
          BigInt(Math.ceil(Number((property.loanAmount-property.remainingAmount)*property.yieldPercent * 10000/12))),
        ],
      });
      const transactionReceipt = await waitForTransactionReceipt(config, {
        hash: hashApprove,
      })
      console.log(transactionReceipt);
      if(transactionReceipt.status == "success"){
        const hashFund = await writeInterest({
            abi,
            address: process.env.NEXT_PUBLIC_LENDINGPLATFORM_ADDRESS as `0x${string}`,
            functionName: "payInterest",
            args: [BigInt(property.propertyIndex)],
          });
          const transactionReceiptFund = await waitForTransactionReceipt(config, {
            hash: hashFund,
          })
          console.log(transactionReceiptFund);
          if(transactionReceiptFund.status == "success"){
            try {
              const relatedLoans = loans.filter(loan => loan.propertyId === property.id);

              for (const relatedLoan of relatedLoans) {
                console.log(relatedLoan.id);
                console.log("Processing loan:", relatedLoan.id);

                const payment: PaymentCreateProps = {
                  balance: relatedLoan.loanAmount/12 * (property.yieldPercent / 100),
                  paymentDate: defaultDate,
                  loanId: relatedLoan.id,  // Use the current loan's ID
                  status: "Paid",
                  tx: hashFund,
                };

                console.log("Creating payment:", payment);

                const response = await axios.post("/api/payment", payment);
                addPayment(response.data);
                console.log("Payment added for loan:", relatedLoan.id);
              }
            } catch (error) {
              console.error("Error creating payment: ", error);
              alert("Error creating payment record. Please contact support.");
            }
          }else{
            console.log(hashFund + "- Interest payment reverted");
            alert("Interest payment failed. Please try again.");
          }
      }
      else{
        console.log(hashApprove + "- Approval reverted")
        alert("Approval for interest payment failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error initiating interest payment. Please try again.");
    }
    setIsTreansacting(false);
  };

  const payLoanInFull = async () => {
    setIsTreansacting(true);
    try {
      setIsPaymentModalOpen(false);
  
      const amountDue = await readContract(config, {
        abi,
        address: process.env.NEXT_PUBLIC_LENDINGPLATFORM_ADDRESS as `0x${string}`,
        functionName: "payOffLoanAmount",
        args: [BigInt(property.propertyIndex), BigInt(bufferDays)]
      }) as number;
      setAmountsDue(amountDue);
  
      if (window.confirm(`Are you sure you want to pay this loan in full? (${Number(amountDue) / 1_000_000})`)) {
        const approveFullHash = await writeApproveFull({
          abi: erc20abi,
          address: process.env.NEXT_PUBLIC_ERC20_ADDRESS as `0x${string}`,
          functionName: "approve",
          args: [
            process.env.NEXT_PUBLIC_LENDINGPLATFORM_ADDRESS as `0x${string}`,
            amountDue,
          ],
        });
  
        const transactionReceipt = await waitForTransactionReceipt(config, {
          hash: approveFullHash,
        });
  
        if (transactionReceipt.status === "success") {
          const hashFullFund = await writeFullLoan({
            abi,
            address: process.env.NEXT_PUBLIC_LENDINGPLATFORM_ADDRESS as `0x${string}`,
            functionName: "payoffLoan",
            args: [BigInt(property.propertyIndex), BigInt(bufferDays)],
          });
  
          const transactionReceiptFund = await waitForTransactionReceipt(config, {
            hash: hashFullFund,
          });
          console.log(transactionReceiptFund);
          if (transactionReceiptFund.status === "success") {
            try {
              const updateData = { paid: true };
              
              const propertyResponse = await axios.put(`/api/property/${property.id}`, updateData);
              console.log("Property update response:", propertyResponse.data);
  
              setProperties(prevProperties =>
                prevProperties.map(p => p.id === property.id ? { ...p, paid: true } : p)
              );
  
              for (const loan of propertyLoans) {
                const loanResponse = await axios.put(`/api/loan/${loan.id}`, updateData);
                console.log(`Loan ${loan.id} update response:`, loanResponse.data);
                const payment: PaymentCreateProps = {
                  balance: loan.loanAmount*Number(amountDue)/1000000/(property.loanAmount-property.remainingAmount),
                  paymentDate: defaultDate,
                  loanId: loan.id,  // Use the current loan's ID
                  status: "Paid",
                  tx: hashFullFund,
                };
                console.log(payment);
                const response = await axios.post("/api/payment", payment);
                addPayment(response.data);
              }
              setPropertyLoans(prevLoans =>
                prevLoans.map(loan => ({ ...loan, paid: true }))
              );
            } catch (error) {
              console.error("Error updating property or loan status: ", error);
              alert("Loan payment was successful, but there was an error updating the database. Please contact support.");
            }
          } else {
            console.log(hashFullFund + "- Loan payment reverted");
            alert("Loan payment failed. Please try again.");
          }
        } else {
          console.log(approveFullHash + "- Approval reverted");
          alert("Approval for loan payment failed. Please try again.");
        }
      } else {
        alert("Loan payment cancelled by user");
      }
    } catch (error) {
      console.error("Error in payLoanInFull:", error);
      alert(`An error occurred while processing the payment: ${error}`);
    }
    setIsTreansacting(false);
  };

  return (
    <div className="p-5 border border-grey-border shadow-lg text-white flex gap-6">
      <div className="relative" style={{ width: "200px", height: "100px" }}>
        <Image
          src={property.thumbnail}
          alt="property"
          layout="fill"
          objectFit="cover"
          className="opacity-80"
        />
      </div>
      <div>
        <div className="flex gap-3">
          <p className="uppercase font-light text-2xl">{property.address}</p>
        </div>
        <div className={`flex gap-x-4 mt-2 ${robotoMono.variable} font-roboto-mono text-xl flex-wrap gap-y-1`}>
          <div className="flex gap-2">
            <p className="text-grey-text">Loan</p>
            <p className="text-grey-text">•</p>
            <p>{formatCurrency(property.loanAmount - property.remainingAmount)}</p>
          </div>
          <div className="flex gap-2">
            <p className="text-grey-text">Annual Return</p>
            <p className="text-grey-text">•</p>
            <p>{property.yieldPercent}%</p>
          </div>
          <div className="flex gap-2">
            <p className="text-grey-text">Maturity Date</p>
            <p className="text-grey-text">•</p>
            <p>{formatDate(parsedMaturityDate)}</p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-3">
          {!property.paid && (
            <button
              className={`text-lg font-extralight border border-gold rounded-full py-2 px-4 transition ${robotoMono.variable} font-roboto-mono uppercase text-gold hover:text-dark-gold hover:border-dark-gold cursor-pointer`}
              onClick={() => setIsInterestModalOpen(true)}
            >
              Pay Interest
            </button>
          )}
          { !property.paid && (
            <button
              className={`text-lg font-extralight border border-gold rounded-full py-2 px-4 transition ${robotoMono.variable} font-roboto-mono uppercase text-gold hover:text-dark-gold hover:border-dark-gold cursor-pointer`}
              onClick={() => setIsModalOpen(true)}
            >
              Pay Loan
            </button>
          )}
          <Link
            className={`text-lg font-extralight border border-gold rounded-full py-2 px-4 transition ${robotoMono.variable} font-roboto-mono uppercase text-gold hover:text-dark-gold hover:border-dark-gold cursor-pointer`}
            href={`/property/${property.id}`}
          >
            View
          </Link>
          <button
            onClick={() => deleteProperty(property.id)}
            className={`text-lg font-extralight border border-red-600 rounded-full py-2 px-4 transition ${robotoMono.variable} font-roboto-mono uppercase text-red-600 hover:text-red-400 hover:border-red-400 cursor-pointer`}
          >
            Delete
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-black border border-gold p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-light mb-6 text-gold uppercase" style={{ fontVariant: "all-small-caps" }}>
              Number of Buffer Days (max is 15)
            </h2>
            <input
              type="number"
              value={bufferDays}
              onChange={(e) => setBufferDays(Number(e.target.value))}
              placeholder="Enter buffer days"
              min="0"
              max="15"
              className="w-full px-4 py-3 mb-6 text-white bg-grey-input border border-grey-border rounded-md placeholder-grey-text focus:outline-none focus:border-dark-gold"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className={`px-6 py-2 border border-gold rounded-full transition ${robotoMono.variable} font-roboto-mono uppercase text-gold hover:text-dark-gold hover:border-dark-gold`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  fetchPayment();
                  setIsPaymentModalOpen(true);
                  setIsModalOpen(false);
                }}
                className={`px-6 py-2 bg-gold border border-gold rounded-full transition ${robotoMono.variable} font-roboto-mono uppercase text-black hover:bg-dark-gold hover:border-dark-gold`}
              >
                Pay Off Loan
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isInterestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-black border border-gold p-8 rounded-lg shadow-lg max-w-3xl w-full">
            <h2 className="text-3xl font-light mb-8 text-gold uppercase text-center" style={{ fontVariant: "all-small-caps" }}>
              Interest Payment Details
            </h2>
            <div className="max-h-[60vh] overflow-y-auto mb-8 pr-4">
              {propertyLoans.map((loan, index) => (
                <div key={index} className="mb-6 p-6 border border-gold rounded-lg bg-black-900 bg-opacity-50 hover:bg-opacity-70 transition-all duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-grey-text text-sm mb-1">Interest To Be Paid</p>
                      <p className="text-2xl font-light text-white">{formatCurrency(loan.loanAmount * property.yieldPercent/1200)}</p>
                    </div>
                    <div>
                      <p className="text-grey-text text-sm mb-1">Annual Return</p>
                      <p className="text-2xl font-light text-white">{property.yieldPercent}%</p>
                    </div>
                    <div>
                      <p className="text-grey-text text-sm mb-1">Investor</p>
                      <p className="text-2xl font-light text-white">{users[loan.walletAddress]?.name || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            <h2 className="text-3xl font-light mb-8 text-gold uppercase text-center" style={{ fontVariant: "all-small-caps" }}>
              Total Interest to be Paid: {formatCurrency((property.loanAmount-property.remainingAmount) * property.yieldPercent/1200)}
            </h2>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsInterestModalOpen(false)}
                className={`px-8 py-3 border-2 border-gold rounded-full transition ${robotoMono.variable} font-roboto-mono uppercase text-gold hover:text-dark-gold hover:border-dark-gold text-lg`}
              >
                Cancel
              </button>
              <button
                onClick={createPayment}
                className={`px-8 py-3 bg-gold border-2 border-gold rounded-full transition ${robotoMono.variable} font-roboto-mono uppercase text-black hover:bg-dark-gold hover:border-dark-gold text-lg`}
              >
                Pay Interest
              </button>
            </div>
          </div>
        </div>
      )}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-black border border-gold p-8 rounded-lg shadow-lg max-w-3xl w-full">
            <h2 className="text-3xl font-light mb-8 text-gold uppercase text-center" style={{ fontVariant: "all-small-caps" }}>
              Payment Details
            </h2>
            <div className="max-h-[60vh] overflow-y-auto mb-8 pr-4">
              {propertyLoans.map((loan, index) => (
                <div key={index} className="mb-6 p-6 border border-gold rounded-lg bg-black-900 bg-opacity-50 hover:bg-opacity-70 transition-all duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-grey-text text-sm mb-1">Amount To Be Paid</p>
                      <p className="text-2xl font-light text-white">{formatCurrency(loan.loanAmount*Number(amountsDue)/(property.loanAmount-property.remainingAmount)/1000000)}</p>
                    </div>
                    <div>
                      <p className="text-grey-text text-sm mb-1">Investor</p>
                      <p className="text-2xl font-light text-white">{users[loan.walletAddress]?.name || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            <h2 className="text-3xl font-light mb-8 text-gold uppercase text-center" style={{ fontVariant: "all-small-caps" }}>
              Total Amount to be Paid: {formatCurrency((Number(amountsDue)/1000000))}
            </h2>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className={`px-8 py-3 border-2 border-gold rounded-full transition ${robotoMono.variable} font-roboto-mono uppercase text-gold hover:text-dark-gold hover:border-dark-gold text-lg`}
              >
                Cancel
              </button>
              <button
                onClick={payLoanInFull}
                className={`px-8 py-3 bg-gold border-2 border-gold rounded-full transition ${robotoMono.variable} font-roboto-mono uppercase text-black hover:bg-dark-gold hover:border-dark-gold text-lg`}
              >
                Pay off Loan
              </button>
            </div>
          </div>
        </div>
      )}
      <LoadingModal isLoading={isTransacting} />
    </div>
  );
}